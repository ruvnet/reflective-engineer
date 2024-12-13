import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/services/agentService";
import { loadSettings } from "@/services/settingsService";
import { useToast } from "@/components/ui/use-toast";

interface TestAgentDialogProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export function TestAgentDialog({ agent, isOpen, onClose }: TestAgentDialogProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const responseRef = useRef<HTMLPreElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = useCallback(async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to test the agent",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResponse("");

    const cleanup = async () => {
      try {
        // Stop and clean up the test agent
        await agentService.stopAgent(agent.id);
        // You might want to add a method to remove the agent completely
      } catch (error) {
        console.error('Failed to cleanup test agent:', error);
      }
    };
    
    try {
      const settings = loadSettings();
      if (!settings?.apiKey) {
        throw new Error("API key not configured");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Reflective Engineer",
        },
        body: JSON.stringify({
          model: agent.config.model.name,
          messages: [
            {
              role: "system",
              content: agent.config.systemPrompt
            },
            {
              role: "user",
              content: input
            }
          ],
          temperature: agent.config.model.temperature,
          max_tokens: agent.config.model.maxTokens,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from OpenRouter");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response reader available");

      setResponse("");
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode and parse the chunk
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(5));
            if (data.choices?.[0]?.delta?.content) {
              setResponse(prev => prev + data.choices[0].delta.content);
              // Scroll to bottom
              if (responseRef.current) {
                responseRef.current.scrollTop = responseRef.current.scrollHeight;
              }
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to execute agent test";
      setResponse(`Error: ${errorMessage}`);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [agent, input, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Agent: {agent.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <label className="text-sm font-medium mb-2 block">Input</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your test input..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Response</label>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Model: {agent.config.model.name}
                </Badge>
                <Badge variant="outline">
                  Temp: {agent.config.model.temperature}
                </Badge>
                <Badge variant="outline">
                  Max Tokens: {agent.config.model.maxTokens}
                </Badge>
              </div>
            </div>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <pre 
                ref={responseRef}
                className="whitespace-pre-wrap font-mono text-sm"
              >
                {response || "Response will appear here..."}
              </pre>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={handleTest}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "Testing..." : "Test Agent"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
