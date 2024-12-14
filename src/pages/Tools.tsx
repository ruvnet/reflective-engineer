import { useState, useEffect } from "react";
import MainNav from "../components/MainNav";
import { toolRegistry } from "../tools";
import { Tool, ToolCategory } from "../tools/types";
import { toolService } from "../services/toolService";

const Tools = () => {
  const [activeTab, setActiveTab] = useState<ToolCategory>("prompt");
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const toolsForCategory = Array.from(toolRegistry.values())
      .filter(tool => tool.category === activeTab);
    setTools(toolsForCategory);
  }, [activeTab]);
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
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="glass-panel p-6">
                  <h2 className="text-xl text-console-cyan mb-4">Tool Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-console-green">Prompt Tools</h3>
                      <p className="text-console-text">Tools for generating, analyzing and optimizing prompts</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-console-green">Analysis Tools</h3>
                      <p className="text-console-text">Tools for analyzing model outputs and behavior</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-console-green">Utilities</h3>
                      <p className="text-console-text">General purpose tools and utilities</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h2 className="text-xl text-console-cyan mb-4">Getting Started</h2>
                  <ol className="list-decimal list-inside space-y-2 text-console-text">
                    <li>Select a tool category from the tabs above</li>
                    <li>Choose a specific tool from the available options</li>
                    <li>Configure the tool parameters as needed</li>
                    <li>Execute the tool and view results</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === "prompt" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Chain Builder</h3>
                  <p className="text-console-text mb-4">Create complex prompt chains and workflows</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Template Editor</h3>
                  <p className="text-console-text mb-4">Edit and manage prompt templates</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Output Analyzer</h3>
                  <p className="text-console-text mb-4">Analyze and evaluate model outputs</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Performance Metrics</h3>
                  <p className="text-console-text mb-4">Track and visualize model performance</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Bias Detector</h3>
                  <p className="text-console-text mb-4">Identify potential biases in model responses</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
              </div>
            )}

            {activeTab === "utilities" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Token Counter</h3>
                  <p className="text-console-text mb-4">Count tokens in prompts and responses</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Format Converter</h3>
                  <p className="text-console-text mb-4">Convert between different data formats</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
                <div className="glass-panel p-6 border border-console-cyan/20">
                  <h3 className="text-xl text-console-cyan mb-2">Batch Processor</h3>
                  <p className="text-console-text mb-4">Process multiple inputs in batch</p>
                  <button className="console-button w-full">Open Tool</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Tools;
