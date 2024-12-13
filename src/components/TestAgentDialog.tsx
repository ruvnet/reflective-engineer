import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "@/services/agentService";

interface TestAgentDialogProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export function TestAgentDialog({ agent, isOpen, onClose }: TestAgentDialogProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const result = await agent.executor?.call(
        { input },
        {
          callbacks: [{
            handleLLMNewToken(token: string) {
              setResponse(prev => prev + token);
            },
          }],
        }
      );
      
      if (!result) {
        throw new Error("No response from agent");
      }
      
    } catch (error) {
      setResponse("Error: Failed to execute agent test");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <label className="text-sm font-medium mb-2 block">Response</label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
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
