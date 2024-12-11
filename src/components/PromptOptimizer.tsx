import { useState } from "react";
import { Wand2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { testPrompt } from "../services/settingsService";
import { loadSettings } from "../services/settingsService";
import OptimizationDialog from "./OptimizationDialog";

interface PromptOptimizerProps {
  domain: string;
  overview: string;
  content: string;
  onUpdate: (newOverview: string, newContent: string) => void;
}

const PromptOptimizer = ({ domain, overview, content, onUpdate }: PromptOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleOptimizeClick = () => {
    const settings = loadSettings();
    if (!settings?.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your API key in settings first.",
        variant: "destructive",
      });
      return;
    }

    if (!settings.defaultModel) {
      toast({
        title: "Model Required",
        description: "Please select a default model in settings first.",
        variant: "destructive",
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleOptimize = async (prompt: string, onChunk: (chunk: string) => void) => {
    setIsOptimizing(true);
    const settings = loadSettings();
    
    try {
      await testPrompt(
        settings!.apiKey,
        settings!.defaultModel,
        prompt,
        onChunk
      );
    } finally {
      setIsOptimizing(false);
    }
  };

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

  return (
    <>
      <button
        onClick={handleOptimizeClick}
        disabled={isOptimizing}
        className="console-button flex items-center gap-2 px-3 py-1"
        title="AI-powered prompt optimization that:
• Enhances clarity and specificity
• Improves mathematical framework
• Strengthens logical structure
• Maintains original intent"
      >
        <Wand2 className={`w-4 h-4 ${isOptimizing ? 'animate-pulse' : ''}`} />
        <span>{isOptimizing ? "Optimizing..." : "Optimize"}</span>
      </button>

      <OptimizationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        domain={domain}
        originalOverview={overview}
        originalContent={content}
        optimizationPrompt={optimizationPrompt}
        onOptimize={handleOptimize}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default PromptOptimizer;
