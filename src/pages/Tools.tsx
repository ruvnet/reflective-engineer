import MainNav from "../components/MainNav";
import { useState } from "react";
import { Wand2, Brain, Calculator, Wrench } from "lucide-react";

type Tab = "overview" | "prompt" | "analysis" | "utilities";

interface ToolCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const Tools = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const toolCards: Record<Tab, ToolCard[]> = {
    overview: [
      {
        title: "Getting Started",
        description: "Learn how to use the various tools available in the platform",
        icon: <Wand2 className="w-6 h-6 text-console-cyan" />
      }
    ],
    prompt: [
      {
        title: "Prompt Generator",
        description: "Generate structured prompts using templates",
        icon: <Brain className="w-6 h-6 text-console-cyan" />,
        comingSoon: true
      },
      {
        title: "Prompt Optimizer",
        description: "Optimize your prompts for better results",
        icon: <Brain className="w-6 h-6 text-console-cyan" />,
        comingSoon: true
      }
    ],
    analysis: [
      {
        title: "Performance Analyzer",
        description: "Analyze prompt performance and results",
        icon: <Calculator className="w-6 h-6 text-console-cyan" />,
        comingSoon: true
      }
    ],
    utilities: [
      {
        title: "Token Counter",
        description: "Count tokens in your prompts",
        icon: <Wrench className="w-6 h-6 text-console-cyan" />,
        comingSoon: true
      }
    ]
  };
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Tools" />
      
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <section className="flex-1 glass-panel p-6 animate-matrix-fade">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-code text-console-cyan">Tools</h1>
            
            <div className="border-b border-console-cyan/20">
              <nav className="-mb-px flex space-x-8" aria-label="Tools">
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    activeTab === "overview" 
                      ? "border-console-cyan text-console-cyan"
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab("prompt")}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    activeTab === "prompt"
                      ? "border-console-cyan text-console-cyan"
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                  }`}
                >
                  Prompt Tools
                </button>
                <button 
                  onClick={() => setActiveTab("analysis")}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    activeTab === "analysis"
                      ? "border-console-cyan text-console-cyan"
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                  }`}
                >
                  Analysis Tools
                </button>
                <button 
                  onClick={() => setActiveTab("utilities")}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    activeTab === "utilities"
                      ? "border-console-cyan text-console-cyan"
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                  }`}
                >
                  Utilities
                </button>
              </nav>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCards[activeTab].map((tool, index) => (
              <div 
                key={index}
                className="glass-panel p-6 border border-console-cyan/20 hover:border-console-cyan/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  {tool.icon}
                  <h2 className="text-xl text-console-cyan">{tool.title}</h2>
                </div>
                <p className="text-console-text mb-4">{tool.description}</p>
                {tool.comingSoon && (
                  <span className="inline-block px-2 py-1 rounded bg-console-cyan/10 text-console-cyan text-sm">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Tools;
