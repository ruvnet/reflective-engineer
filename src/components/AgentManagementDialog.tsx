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
  const [showSettings, setShowSettings] = useState(false);
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
    setResponse(""); // Clear previous response
    
    try {
      // Update the agent's configuration before execution
      agent.config.systemPrompt = systemPrompt;
      agent.config.model = {
        ...agent.config.model,
        name: selectedModel,
        temperature,
        maxTokens
      };

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
          model: selectedModel,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: input
            }
          ],
          temperature,
          max_tokens: maxTokens,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from OpenRouter");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response reader available");
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode and parse the chunk
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(5);
            if (content.trim() === '[DONE]') {
              continue;
            }
            try {
              const data = JSON.parse(content);
              if (data.choices?.[0]?.delta?.content) {
                setResponse(prev => {
                  const newResponse = prev + data.choices[0].delta.content;
                  // Use requestAnimationFrame to ensure DOM update before scrolling
                  requestAnimationFrame(() => {
                    if (responseRef.current?.scrollTo) {
                      responseRef.current.scrollTo({ 
                        top: responseRef.current.scrollHeight,
                        behavior: 'smooth'
                      });
                    }
                  });
                  return newResponse;
                });
              }
            } catch (error) {
              console.warn('Failed to parse streaming response chunk:', content);
            }
          }
        }
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Failed to execute agent"}`);
    } finally {
      setIsExecuting(false);
    }
  };

  if (showSettings) {
    return (
      <Dialog open={showSettings} onOpenChange={() => setShowSettings(false)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Agent Settings: {agent.name}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Model Selection</label>
              <select
                className="w-full p-2 rounded-md border bg-background"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoadingModels}
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
              <label className="text-sm font-medium mb-2 block">Temperature: {temperature}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Max Tokens: {maxTokens}</label>
              <input
                type="range"
                min="256"
                max={currentModel?.context_length || 4096}
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">System Prompt</label>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="System prompt..."
                className="min-h-[100px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Update agent config
                agent.config.systemPrompt = systemPrompt;
                agent.config.model = {
                  ...agent.config.model,
                  name: selectedModel,
                  temperature,
                  maxTokens
                };
                setShowSettings(false);
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
                Settings
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
            <label className="text-sm font-medium mb-2 block">System Prompt</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="System prompt..."
              className="min-h-[100px] font-mono text-sm"
            />
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
