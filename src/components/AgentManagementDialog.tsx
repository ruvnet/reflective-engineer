import { useState, useRef, useEffect, useMemo } from "react";
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
import { fetchAvailableModels, OpenRouterModel, loadSettings } from "@/services/settingsService";
import { Play, Square, Settings } from "lucide-react";

interface AgentManagementDialogProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onStartStop: (agent: Agent) => Promise<void>;
}

export function AgentManagementDialog({ 
  agent, 
  isOpen, 
  onClose,
  onStartStop 
}: AgentManagementDialogProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const responseRef = useRef<HTMLPreElement>(null);
  const [systemPrompt, setSystemPrompt] = useState(agent.config.systemPrompt);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState(agent.config.model.name);
  const [temperature, setTemperature] = useState(agent.config.model.temperature);
  const [maxTokens, setMaxTokens] = useState(agent.config.model.maxTokens);

  // Update values when agent changes
  useEffect(() => {
    setSystemPrompt(agent.config.systemPrompt);
    setSelectedModel(agent.config.model.name);
    setTemperature(agent.config.model.temperature);
    setMaxTokens(agent.config.model.maxTokens);
  }, [agent.config]);

  // Load available models when dialog opens
  useEffect(() => {
    const loadModels = async () => {
      const settings = loadSettings();
      if (!settings?.apiKey) return;

      setIsLoadingModels(true);
      try {
        const availableModels = await fetchAvailableModels(settings.apiKey);
        setModels(availableModels);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  // Get current model details
  const currentModel = useMemo(() => {
    return models.find(m => m.id === selectedModel);
  }, [models, selectedModel]);

  const handleExecute = async () => {
    if (!input.trim() || !agent.executor) return;
    
    setIsExecuting(true);
    try {
      // Update the agent's configuration before execution
      agent.config.systemPrompt = systemPrompt;
      agent.config.model = {
        ...agent.config.model,
        name: selectedModel,
        temperature,
        maxTokens
      };
      const result = await agent.executor.call({ 
        input: input // Only pass the input
      });
      setResponse(result?.output || "No response");
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Failed to execute agent"}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Agent: {agent.name}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStartStop(agent)}
              >
                {agent.status === "stopped" ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                {agent.status === "stopped" ? "Start" : "Stop"}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Badge variant={agent.status === "running" ? "success" : "secondary"}>
                {agent.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <Badge variant="outline">{agent.config.model.name}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <p className="text-sm text-muted-foreground">{agent.description}</p>
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Response</label>
              <Badge variant={isExecuting ? "secondary" : "outline"}>
                {isExecuting ? "Processing..." : "Ready"}
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
              disabled={!input.trim() || agent.status !== "running" || isExecuting}
            >
              {isExecuting ? "Processing..." : "Execute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
