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
          <div>
            <label className="text-sm font-medium mb-2 block">Input</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input..."
              className="min-h-[100px]"
            />
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