import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { createLangGraphService } from "../services/langGraphService";
import { loadSettings } from "../services/settingsService";
import { useToast } from "@/hooks/use-toast";

interface AgentTemplateProps {
  name: string;
  description: string;
  systemPrompt: string;
  onClose: () => void;
}

interface AgentConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export default function AgentTemplate({ name, description, systemPrompt, onClose }: AgentTemplateProps) {
  console.log("Rendering AgentTemplate with:", { name, description });

  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  const { toast } = useToast();

  const handleConfigChange = (key: keyof AgentConfig, value: number) => {
    console.log("Config change:", key, value);
    setAgentConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const settings = loadSettings();
    if (!settings?.apiKey) {
      toast({
        title: "Error",
        description: "Please configure your API key in settings",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a new LangGraph service instance
      const langGraph = createLangGraphService(settings.apiKey, settings.defaultModel || "openai/gpt-3.5-turbo");

      // Combine system prompt with user input and configuration
      const fullPrompt = `
Configuration:
${JSON.stringify(agentConfig, null, 2)}

System Prompt:
${systemPrompt}

User Input:
${userInput}`;
      
      // Process the prompt
      const result = await langGraph.processPrompt(fullPrompt);
      
      setOutput(result);
    } catch (error) {
      console.error("Error running agent:", error);
      toast({
        title: "Error",
        description: "Failed to run agent. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Current state:", { isTestModalOpen, agentConfig });

  return (
    <div className="glass-panel p-6 animate-matrix-fade">
      <Card className="bg-gray-900/50 border-console-cyan">
        <CardHeader>
          <CardTitle className="text-console-cyan">{name}</CardTitle>
          <CardDescription className="text-console-green">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-console-cyan mb-2">System Prompt</label>
            <div className="bg-gray-800/50 p-4 rounded-md border border-console-cyan/20">
              <pre className="text-sm font-mono text-console-text whitespace-pre-wrap">
                {systemPrompt}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-console-cyan">Temperature</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[agentConfig.temperature]}
                  onValueChange={([value]) => handleConfigChange('temperature', value)}
                  max={1}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-console-text w-12 text-right">{agentConfig.temperature}</span>
              </div>
            </div>

            <div>
              <Label className="text-console-cyan">Max Tokens</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[agentConfig.maxTokens]}
                  onValueChange={([value]) => handleConfigChange('maxTokens', value)}
                  max={4000}
                  step={100}
                  className="flex-1"
                />
                <span className="text-console-text w-12 text-right">{agentConfig.maxTokens}</span>
              </div>
            </div>

            <div>
              <Label className="text-console-cyan">Top P</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[agentConfig.topP]}
                  onValueChange={([value]) => handleConfigChange('topP', value)}
                  max={1}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-console-text w-12 text-right">{agentConfig.topP}</span>
              </div>
            </div>

            <div>
              <Label className="text-console-cyan">Frequency Penalty</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[agentConfig.frequencyPenalty]}
                  onValueChange={([value]) => handleConfigChange('frequencyPenalty', value)}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-console-text w-12 text-right">{agentConfig.frequencyPenalty}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-console-cyan mb-2">User Input</label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your input for the agent..."
              className="console-input h-24"
            />
          </div>

          <div className="flex gap-4">
            <Button
              className="console-button flex-1"
              onClick={() => {
                console.log("Opening test modal");
                setIsTestModalOpen(true);
              }}
              disabled={isLoading || !userInput.trim()}
            >
              Test Agent
            </Button>
            <Button
              className="console-button flex-1"
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim()}
            >
              {isLoading ? "Running..." : "Run Agent"}
            </Button>
            <Button
              className="console-button flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>
          </div>

          {output && (
            <div>
              <label className="block text-console-cyan mb-2">Agent Output</label>
              <div className="bg-gray-800/50 p-4 rounded-md border border-console-cyan/20">
                <pre className="text-sm font-mono text-console-text whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="glass-panel border-console-cyan">
          <DialogHeader>
            <DialogTitle className="text-console-cyan">Test {name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-console-cyan">Agent Configuration</Label>
              <div className="bg-gray-800/50 p-4 rounded-md border border-console-cyan/20">
                <pre className="text-sm font-mono text-console-text">
                  {JSON.stringify(agentConfig, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <Label className="text-console-cyan">System Prompt</Label>
              <div className="bg-gray-800/50 p-4 rounded-md border border-console-cyan/20">
                <pre className="text-sm font-mono text-console-text whitespace-pre-wrap">
                  {systemPrompt}
                </pre>
              </div>
            </div>
            <div>
              <Label className="text-console-cyan">User Input</Label>
              <div className="bg-gray-800/50 p-4 rounded-md border border-console-cyan/20">
                <pre className="text-sm font-mono text-console-text">
                  {userInput}
                </pre>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                className="console-button"
                onClick={() => setIsTestModalOpen(false)}
              >
                Close
              </Button>
              <Button
                className="console-button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Testing..." : "Run Test"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
