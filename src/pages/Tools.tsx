import { useState, useEffect } from "react";
import MainNav from "../components/MainNav";
import { toolRegistry } from "../tools";
import { useEditModal } from "../contexts/EditModalContext";
import { Tool, ToolCategory } from "../tools/types";
import { toolService } from "../services/toolService";
import { SavedTool, SavedTemplate, SavedPrompt, getSavedTools, getSavedTemplates, saveTemplate, deleteTemplate, getSavedPrompts, deletePrompt, savePrompt } from "../services/storageService";
import { useToast } from "@/components/ui/use-toast";
import { ToolBuilderModal } from "../components/ToolBuilderModal";
import { TemplateEditorModal } from "../components/TemplateEditorModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Edit2 } from "lucide-react";

const Tools = () => {
  const [activeTab, setActiveTab] = useState<ToolCategory | "saved">("prompt");
  const [activeSection, setActiveSection] = useState("Mathematical Frameworks");
  const [tools, setTools] = useState<Tool[]>([]);
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const {
    editingTool,
    setEditingTool,
    editingTemplate,
    setEditingTemplate,
    editingPrompt,
    setEditingPrompt,
    isToolBuilderOpen,
    setIsToolBuilderOpen,
    isTemplateEditorOpen,
    setIsTemplateEditorOpen,
    isGenerateOpen,
    setIsGenerateOpen,
    resetState
  } = useEditModal();
  const { toast } = useToast();

  useEffect(() => {
    const toolsForCategory = Array.from(toolRegistry.values())
      .filter(tool => tool.category === activeTab);
    setTools(toolsForCategory);
    
    // Load saved tools and templates
    setSavedTools(getSavedTools());
    setSavedTemplates(getSavedTemplates());

    const handleStorageChange = () => {
      setSavedTools(getSavedTools());
      setSavedTemplates(getSavedTemplates());
    };

    window.addEventListener('storageChanged', handleStorageChange);
    return () => window.removeEventListener('storageChanged', handleStorageChange);
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
                  onClick={() => setActiveTab("tools")}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                    activeTab === "tools"
                      ? "border-console-cyan text-console-cyan"
                      : "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300"
                  }`}
                >
                  Tools
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-panel p-6 border border-console-cyan/20">
                <h3 className="text-xl text-console-cyan mb-2">Chain Builder</h3>
                <p className="text-console-text mb-4">Create complex prompt chains and workflows</p>
                <button 
                  className="console-button w-full"
                  onClick={() => setIsToolBuilderOpen(true)}
                >
                  Create New Tool
                </button>
              </div>
              <div className="glass-panel p-6 border border-console-cyan/20">
                <h3 className="text-xl text-console-cyan mb-2">Template Editor</h3>
                <p className="text-console-text mb-4">Edit and manage prompt templates</p>
                <button 
                  className="console-button w-full"
                  onClick={() => setIsTemplateEditorOpen(true)}
                >
                  Open Editor
                </button>
              </div>

              <ToolBuilderModal
                isOpen={isToolBuilderOpen}
                onClose={() => resetState()}
                onSave={(tool) => {
                  toolService.addTool(tool);
                  setIsToolBuilderOpen(false);
                  setEditingTool(null);
                  setSavedTools(getSavedTools());
                  toast({
                    title: "Success",
                    description: "Tool saved successfully"
                  });
                }}
                initialData={editingTool || undefined}
              />

              <TemplateEditorModal
                isOpen={isTemplateEditorOpen}
                onClose={() => resetState()}
                initialData={editingTemplate || undefined}
                onSave={(template) => {
                  try {
                    console.log('Saving template:', template); // Add debug log
                    const templateData = {
                      name: template.name,
                      description: template.description,
                      category: activeSection || "Mathematical Frameworks",
                      domain: template.domain,
                      content: template.content,
                      variables: template.variables || []
                    };
                    saveTemplate(templateData);
                    setIsTemplateEditorOpen(false);
                    toast({
                      title: "Success",
                      description: "Template saved successfully"
                    });
                  } catch (error) {
                    console.error('Failed to save template:', error);
                    toast({
                      title: "Error",
                      description: "Failed to save template",
                      variant: "destructive"
                    });
                  }
                }}
              />
            </div>

            {activeTab === "analysis" && (
              <div className="space-y-8">
                {/* Analysis Tools Section */}
                <div>
                  <h2 className="text-xl font-code text-console-cyan mb-4">Saved Analysis Tools</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedTools
                      .filter(tool => tool.category === "analysis")
                      .map((tool) => (
                        <Card key={tool.id} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-console-cyan">{tool.name}</CardTitle>
                                <CardDescription className="text-console-green">
                                  {tool.category} - {new Date(tool.timestamp).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <div className="flex gap-0.5">
                                <button
                                  onClick={() => {
                                    setEditingTool(tool);
                                    setIsToolBuilderOpen(true);
                                  }}
                                  className="console-button p-1.5 hover:bg-console-cyan/20"
                                  title="Edit tool"
                                >
                                  <Edit2 className="w-4 h-4 text-console-cyan" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this tool?')) {
                                      deleteTool(tool.id);
                                      setSavedTools(getSavedTools());
                                    }
                                  }}
                                  className="console-button p-1.5 hover:bg-red-900/20"
                                  title="Delete tool"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                              <pre className="text-sm font-code text-console-text">
                                {tool.description}
                                {'\n\n'}
                                {tool.prompt}
                              </pre>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </div>

                {/* Analysis Tool Creation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 border border-console-cyan/20">
                    <h3 className="text-xl text-console-cyan mb-2">Output Analyzer</h3>
                    <p className="text-console-text mb-4">Create tools to analyze and evaluate model outputs</p>
                    <button 
                      className="console-button w-full"
                      onClick={() => {
                        setEditingTool(null);
                        setIsToolBuilderOpen(true);
                      }}
                    >
                      Create Analyzer
                    </button>
                  </div>
                  <div className="glass-panel p-6 border border-console-cyan/20">
                    <h3 className="text-xl text-console-cyan mb-2">Performance Metrics</h3>
                    <p className="text-console-text mb-4">Build tools for tracking and visualizing model performance</p>
                    <button 
                      className="console-button w-full"
                      onClick={() => {
                        setEditingTool(null);
                        setIsToolBuilderOpen(true);
                      }}
                    >
                      Create Metrics Tool
                    </button>
                  </div>
                  <div className="glass-panel p-6 border border-console-cyan/20">
                    <h3 className="text-xl text-console-cyan mb-2">Bias Detector</h3>
                    <p className="text-console-text mb-4">Develop tools to identify potential biases in model responses</p>
                    <button 
                      className="console-button w-full"
                      onClick={() => {
                        setEditingTool(null);
                        setIsToolBuilderOpen(true);
                      }}
                    >
                      Create Detector
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tools" && (
              <div className="space-y-8">
                {/* Creation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 border border-console-cyan/20">
                    <h3 className="text-xl text-console-cyan mb-2">Output Analyzer</h3>
                    <p className="text-console-text mb-4">Create tools to analyze and evaluate model outputs</p>
                    <button 
                      className="console-button w-full"
                      onClick={() => {
                        setEditingTool(null);
                        setIsToolBuilderOpen(true);
                      }}
                    >
                      Create Analyzer
                    </button>
                  </div>
                  <div className="glass-panel p-6 border border-console-cyan/20">
                    <h3 className="text-xl text-console-cyan mb-2">Performance Metrics</h3>
                    <p className="text-console-text mb-4">Build tools for tracking and visualizing model performance</p>
                    <button 
                      className="console-button w-full"
                      onClick={() => {
                        setEditingTool(null);
                        setIsToolBuilderOpen(true);
                      }}
                    >
                      Create Metrics Tool
                    </button>
                  </div>
                  <div className="glass-panel p-6 border border-console-cyan/20">
                    <h3 className="text-xl text-console-cyan mb-2">Bias Detector</h3>
                    <p className="text-console-text mb-4">Develop tools to identify potential biases in model responses</p>
                    <button 
                      className="console-button w-full"
                      onClick={() => {
                        setEditingTool(null);
                        setIsToolBuilderOpen(true);
                      }}
                    >
                      Create Detector
                    </button>
                  </div>
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

                {/* Saved Tools Section */}
                <div>
                  <h2 className="text-xl font-code text-console-cyan mb-4">Saved Tools</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedTools.map((tool) => (
                      <Card key={tool.id} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-console-cyan">{tool.name}</CardTitle>
                              <CardDescription className="text-console-green">
                                {tool.category} - {new Date(tool.timestamp).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex gap-0.5">
                              <button
                                onClick={() => {
                                  setEditingTool(tool);
                                  setIsToolBuilderOpen(true);
                                }}
                                className="console-button p-1.5 hover:bg-console-cyan/20"
                                title="Edit tool"
                              >
                                <Edit2 className="w-4 h-4 text-console-cyan" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this tool?')) {
                                    deleteTool(tool.id);
                                    setSavedTools(getSavedTools());
                                  }
                                }}
                                className="console-button p-1.5 hover:bg-red-900/20"
                                title="Delete tool"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                            <pre className="text-sm font-code text-console-text">
                              {tool.description}
                              {'\n\n'}
                              {tool.prompt}
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Templates Section */}
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedTemplates.map((template) => (
                      <Card key={template.id} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-console-cyan">{template.name}</CardTitle>
                              <CardDescription className="text-console-green">
                                {template.category} - {new Date(template.timestamp).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this template?')) {
                                  deleteTemplate(template.id);
                                  setSavedTemplates(getSavedTemplates());
                                }
                              }}
                              className="console-button p-2 hover:bg-red-900/20"
                              title="Delete template"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingTemplate(template);
                                setIsTemplateEditorOpen(true);
                              }}
                              className="console-button p-2 hover:bg-console-cyan/20"
                              title="Edit template"
                            >
                              <Edit2 className="w-4 h-4 text-console-cyan" />
                            </button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                            <pre className="text-sm font-code text-console-text">
                              {template.description}
                              {'\n\n'}
                              {template.content}
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Prompts Section */}
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {getSavedPrompts().map((prompt) => (
                      <Card key={prompt.id} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-console-cyan">{prompt.title}</CardTitle>
                              <CardDescription className="text-console-green">
                                {prompt.prompt.domain} - {new Date(prompt.timestamp).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingPrompt(prompt);
                                  setIsGenerateOpen(true);
                                }}
                                className="console-button p-2 hover:bg-console-cyan/20"
                                title="Edit prompt"
                              >
                                <Edit2 className="w-4 h-4 text-console-cyan" />
                              </button>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingPrompt(prompt);
                                    setIsGenerateOpen(true);
                                  }}
                                  className="console-button p-2 hover:bg-console-cyan/20"
                                  title="Edit prompt"
                                >
                                  <Edit2 className="w-4 h-4 text-console-cyan" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this prompt?')) {
                                      deletePrompt(prompt.id);
                                      setSavedTemplates(prev => [...prev]); // Force refresh
                                    }
                                  }}
                                  className="console-button p-2 hover:bg-red-900/20"
                                  title="Delete prompt"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                            <pre className="text-sm font-code text-console-text">
                              {prompt.prompt.overview}
                              {'\n\n'}
                              {prompt.prompt.content}
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
