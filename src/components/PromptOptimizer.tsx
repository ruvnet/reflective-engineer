import { useState } from "react";
import { Info } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { testPrompt } from "../services/settingsService";
import { loadSettings } from "../services/settingsService";

interface PromptOptimizerProps {
  domain: string;
  overview: string;
  content: string;
  onUpdate: (newOverview: string, newContent: string) => void;
}

const PromptOptimizer = ({ domain, overview, content, onUpdate }: PromptOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const optimizePrompt = async () => {
    const settings = loadSettings();
    if (!settings?.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your API key in settings first.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    let optimizedResponse = "";

    try {
      const optimizationPrompt = `As an AI prompt engineering expert, analyze and optimize the following prompt for ${domain}:

Overview:
${overview}

Content:
${content}

Please provide an optimized version of both the overview and content that:
1. Enhances clarity and specificity
2. Improves the mathematical framework
3. Strengthens the logical structure
4. Maintains the original intent

Return the response in the following format:
---OVERVIEW---
[Optimized overview]
---CONTENT---
[Optimized content]`;

      await testPrompt(
        settings.apiKey,
        "gpt-4o", // Using the recommended model for best results
        optimizationPrompt,
        (chunk) => {
          optimizedResponse += chunk;
        }
      );

      const overviewMatch = optimizedResponse.match(/---OVERVIEW---([\s\S]*?)(?:---CONTENT---|$)/);
      const contentMatch = optimizedResponse.match(/---CONTENT---([\s\S]*?)$/);

      const newOverview = overviewMatch ? overviewMatch[1].trim() : overview;
      const newContent = contentMatch ? contentMatch[1].trim() : content;

      onUpdate(newOverview, newContent);

      toast({
        title: "Prompt Optimized",
        description: "The prompt has been enhanced based on your selections.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "An error occurred during optimization",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <button
      onClick={optimizePrompt}
      disabled={isOptimizing}
      className="console-button p-2 ml-2"
      title="Optimize prompt using AI"
    >
      <Info className="w-4 h-4" />
    </button>
  );
};

export default PromptOptimizer;