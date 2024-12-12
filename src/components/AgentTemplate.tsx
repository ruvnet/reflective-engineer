import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createLangGraphService } from "../services/langGraphService";
import { loadSettings } from "../services/settingsService";
import { useToast } from "@/hooks/use-toast";

interface AgentTemplateProps {
  name: string;
  description: string;
  systemPrompt: string;
  onClose: () => void;
}

export default function AgentTemplate({ name, description, systemPrompt, onClose }: AgentTemplateProps) {
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

      // Combine system prompt with user input
      const fullPrompt = `${systemPrompt}\n\nUser Input: ${userInput}`;
      
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
    </div>
  );
}
