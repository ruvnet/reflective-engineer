import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Agent } from "@/services/agentService";

interface AgentResponseDialogProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentResponseDialog({ agent, isOpen, onClose }: AgentResponseDialogProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLPreElement>(null);

  const handleExecute = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const result = await agent.executor?.call({ input });
      setResponse(result?.output || "No response");
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Failed to execute agent"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Agent: {agent.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1">
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Model Settings</label>
                <div className="grid gap-4 p-4 border rounded-md">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm">Model Selection</label>
                      {isLoadingModels ? (
                        <Badge variant="outline">Loading...</Badge>
                      ) : (
                        <Badge variant="outline">
                          {currentModel?.name || "Select a model"}
                        </Badge>
                      )}
                    </div>
                    <select
                      className="w-full p-2 rounded-md border bg-background"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={isLoadingModels || agent.status === "running"}
                    >
                      {isLoadingModels ? (
                        <option>Loading models...</option>
                      ) : (
                        models.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))
                      )}
                    </select>
                    {currentModel && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Context: {currentModel.context_length.toLocaleString()} tokens</p>
                        <p>Pricing: ${currentModel.pricing.prompt}/1K prompt, ${currentModel.pricing.completion}/1K completion</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Temperature: {temperature}</label>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={([value]) => setTemperature(value)}
                      disabled={agent.status === "running"}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Max Tokens: {maxTokens}</label>
                    <Slider
                      min={256}
                      max={currentModel?.context_length || 4096}
                      step={256}
                      value={[maxTokens]}
                      onValueChange={([value]) => setMaxTokens(value)}
                      disabled={agent.status === "running"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">System Prompt</label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="System prompt..."
                  className="min-h-[100px]"
                  disabled={agent.status === "running"}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Input</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input..."
                className="min-h-[100px]"
                disabled={agent.status !== "running"}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Response</label>
              <Badge variant={isLoading ? "secondary" : "outline"}>
                {isLoading ? "Processing..." : "Ready"}
              </Badge>
            </div>
            <ScrollArea className="h-[200px] border rounded-md p-4" ref={responseRef}>
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
              onClick={handleExecute}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? "Processing..." : "Execute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
