import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Database, Loader2 } from "lucide-react";
import { fetchAvailableModels, OpenRouterModel } from "@/services/settingsService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Agent } from "@/services/agentService";
import { useToast } from "@/components/ui/use-toast";
import { loadSettings } from "@/services/settingsService";

interface TestAgentDialogProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export function TestAgentDialog({ agent, isOpen, onClose }: TestAgentDialogProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const responseRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Initialize all settings from agent config
  const [temperature, setTemperature] = useState(agent.config.model.temperature);
  const [maxTokens, setMaxTokens] = useState(agent.config.model.maxTokens);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [selectedModel, setSelectedModel] = useState(agent.config.model.name);
  const [systemPrompt, setSystemPrompt] = useState(agent.config.systemPrompt);
  const [streaming, setStreaming] = useState(agent.config.streaming ?? true);
  const [verbose, setVerbose] = useState(agent.config.verbose ?? false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Error",
          description: "Failed to load available models",
          variant: "destructive"
        });
      } finally {
        setIsLoadingModels(false);
      }
    };

    if (isOpen) {
      loadModels();
    }
  }, [isOpen, toast]);

  // Get current model details 
  const currentModel = useMemo(() => {
    return models.find(m => m.id === selectedModel);
  }, [models, selectedModel]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setIsLoading(false);
    }
  }, []);

  const handleTest = useCallback(async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to test the agent",
        variant: "destructive"
      });
      return;
    }
    
    if (isStreaming) {
      stopStream();
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setResponse("");

    const settings = loadSettings();
    if (!settings?.apiKey) {
      throw new Error("API key not configured");
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    try {
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
          temperature: temperature,
          max_tokens: maxTokens,
          stream: streaming
        }),
        signal: abortControllerRef.current.signal
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
      if (error instanceof Error && error.name === 'AbortError') {
        setResponse(prev => prev + "\n[Stream stopped by user]");
      } else {
        const errorMessage = error instanceof Error ? error.message : "Failed to execute agent test";
        setResponse(`Error: ${errorMessage}`);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        console.error(error);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [agent, input, toast, temperature, maxTokens, stopStream, isStreaming]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Agent: {agent.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1">
          <div className="space-y-4">
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
                placeholder="Enter your test input..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Database className="w-4 h-4 mr-2" />
                    <label className="text-sm font-medium">Model Selection</label>
                  </div>
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
                  <label className="text-sm font-medium mb-2 block">Model Settings</label>
                  <div className="grid gap-4 p-4 border rounded-md">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm">Temperature: {temperature}</label>
                        {isLoadingModels ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Badge variant="outline">
                            {currentModel?.name || "Loading..."}
                          </Badge>
                        )}
                      </div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[temperature]}
                        onValueChange={([value]) => setTemperature(value)}
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Response</label>
                <Badge 
                  variant={isStreaming ? "destructive" : "outline"}
                >
                  {isStreaming ? "Streaming..." : "Ready"}
                </Badge>
              </div>
              <ScrollArea 
                className="h-[200px] border rounded-md p-4"
                ref={responseRef}
              >
                <pre 
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
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    stopStream();
                    setResponse("");
                    setTemperature(agent.config.model.temperature);
                    setMaxTokens(agent.config.model.maxTokens);
                  }}
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleTest}
                  disabled={!input.trim()}
                  variant={isStreaming ? "destructive" : "default"}
                >
                  {isStreaming ? "Stop Stream" : isLoading ? "Testing..." : "Test Agent"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
