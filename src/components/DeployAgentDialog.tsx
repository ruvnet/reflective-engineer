import { useState, useEffect } from "react";
import { fetchAvailableModels, OpenRouterModel, loadSettings } from "@/services/settingsService";
import { CATEGORIES, OUTPUT_TYPES, DOMAINS } from "../components/constants/domains";
import { AGENT_CATEGORIES, AGENT_DESCRIPTIONS } from "../components/constants/categories";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Rocket, Brain, Wrench, Database, Settings, Bot, Network, HelpCircle, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeployAgentDialogProps {
  onDeploy: (agent: { name: string; description: string; config: any }) => void;
  trigger?: React.ReactNode;
  onClose?: () => void;
}



const MEMORY_OPTIONS = [
  { 
    value: "buffer", 
    label: "Buffer Memory", 
    description: "Stores recent interactions in a simple buffer. Best for short conversations." 
  },
  { 
    value: "vector", 
    label: "Vector Memory", 
    description: "Uses embeddings for semantic search. Ideal for large knowledge bases." 
  },
  { 
    value: "conversation", 
    label: "Conversation Memory", 
    description: "Maintains full chat history. Perfect for contextual conversations." 
  },
  { 
    value: "summary", 
    label: "Summary Memory", 
    description: "Maintains compressed history. Good for long-running sessions." 
  }
];

const TOOL_CATEGORIES = {
  search: {
    name: "Search & Retrieval",
    description: "Tools for finding and accessing information",
    tools: [
      { value: "web-browser", label: "Web Browser", description: "Browse and scrape web pages" },
      { value: "search", label: "Search Engine", description: "Search the internet" },
      { value: "wikipedia", label: "Wikipedia", description: "Query Wikipedia articles" }
    ]
  },
  math: {
    name: "Mathematics",
    description: "Tools for mathematical operations",
    tools: [
      { value: "calculator", label: "Calculator", description: "Basic mathematical operations" },
      { value: "wolfram", label: "Wolfram Alpha", description: "Advanced mathematical computations" }
    ]
  },
  apis: {
    name: "External APIs",
    description: "Tools for external service integration",
    tools: [
      { value: "weather-api", label: "Weather API", description: "Get weather information" },
      { value: "news-api", label: "News API", description: "Fetch news articles" }
    ]
  },
  utilities: {
    name: "Utilities",
    description: "General purpose tools",
    tools: [
      { value: "file-io-tool", label: "File I/O", description: "Read and write files" },
      { value: "code-exec", label: "Code Executor", description: "Execute code snippets" }
    ]
  },
  analysis: {
    name: "Analysis Tools",
    description: "Tools for analyzing and processing data",
    tools: [
      { value: "bias-detector", label: "Bias Detection Tool", description: "Detect potential biases in text" },
      { value: "sentiment-analyzer", label: "Sentiment Analysis", description: "Analyze text sentiment" }
    ]
  }
};

const CHAIN_TYPES = [
  { 
    value: "llm", 
    label: "LLM Chain", 
    description: "Simple prompt-completion chain. Best for straightforward tasks." 
  },
  { 
    value: "sequential", 
    label: "Sequential Chain", 
    description: "Multiple chains in sequence. Good for multi-step processing." 
  },
  { 
    value: "router", 
    label: "Router Chain", 
    description: "Dynamically routes to different chains. Ideal for complex workflows." 
  }
];

interface FormErrors {
  name?: string;
  description?: string;
  domainCategory?: string;
  domain?: string;
  tools?: string;
  systemPrompt?: string;
  model?: string;
}

export function DeployAgentDialog({ onDeploy, trigger, onClose }: DeployAgentDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [formData, setFormData] = useState(() => {
    const settings = loadSettings();
    return {
      name: "",
      description: "",
      domainCategory: "",
      domain: "",
      agentCategory: "",
      agentType: "",
      model: settings?.defaultModel || "",
      temperature: 0.7,
      maxTokens: 2048,
      memory: "buffer",
      tools: ["calculator", "search"],  // Pre-select some default tools
      chainType: "llm",
      systemPrompt: "You are a helpful AI assistant that uses available tools to solve problems step by step.",
      streaming: true,
      verbose: false
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const loadModels = async () => {
      const settings = loadSettings();
      if (!settings?.apiKey) {
        toast({
          title: "Error",
          description: "API key not configured. Please check your settings.",
          variant: "destructive"
        });
        return;
      }

      setIsLoadingModels(true);
      try {
        const availableModels = await fetchAvailableModels(settings.apiKey);
        setModels(availableModels);
        // Set first model as default if none selected
        if (!formData.model && availableModels.length > 0) {
          setFormData(prev => ({...prev, model: availableModels[0].id}));
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        toast({
          title: "Error",
          description: "Failed to load available models. Please check your API key.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingModels(false); // Fixed: was setting isOptimizing instead of isLoadingModels
      }
    };

    loadModels();
  }, []); // Empty dependency array to run only on mount

  const validateForm = (): boolean => {
    console.log("Validating form...");
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.tools.length === 0) {
      newErrors.tools = "Select at least one tool";
    }

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = "System prompt is required";
    }

    if (!formData.model) {
      newErrors.model = "Model selection is required";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("Validating form...");
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    console.log("Form data:", formData);
    setIsOpen(false);
    
    const config = {
      type: formData.agentType,
      model: {
        name: formData.model,
        temperature: formData.temperature,
        maxTokens: formData.maxTokens
      },
      memory: formData.memory,
      tools: formData.tools,
      chainType: formData.chainType,
      systemPrompt: formData.systemPrompt,
      streaming: formData.streaming,
      verbose: formData.verbose
    };

    console.log("Deploying agent with config:", config);

    try {
      await onDeploy({
        name: formData.name,
        description: formData.description,
        config
      });

      // Only reset form after successful deployment
      setFormData({
        name: "",
        description: "",
        domainCategory: "",
        domain: "",
        agentCategory: "",
        agentType: "react",
        model: "",
        temperature: 0.7,
        maxTokens: 2048,
        memory: "buffer",
        tools: ["calculator", "search"],
        chainType: "llm",
        systemPrompt: "You are a helpful AI assistant that uses available tools to solve problems step by step.",
        streaming: true,
        verbose: false
      });

      // Close the dialog after successful deployment
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      // Don't reset form or close dialog on failure
    }
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Dialog 
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open && onClose) {
          onClose();
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Deploy Agent
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Deploy New Agent</DialogTitle>
          <p id="dialog-description" className="text-sm text-muted-foreground">
            Configure and deploy a new AI agent with custom capabilities
          </p>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="name">Name</label>
              <InfoTooltip content="A unique name for your agent" />
            </div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Agent"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="description">Description</label>
              <InfoTooltip content="A brief description of your agent's purpose" />
            </div>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Agent description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <Accordion type="multiple" className="w-full" defaultValue={["system"]}>
            <AccordionItem value="templates">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  Prompt Templates
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <label>Template Category</label>
                      <InfoTooltip content="Select a template category to use" />
                    </div>
                    <Select
                      value={formData.agentCategory}
                      onValueChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          agentCategory: value,
                          agentType: "", // Reset template when category changes
                          domain: prev.domain, // Preserve domain
                          domainCategory: prev.domainCategory // Preserve domain category
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          ...Object.keys(AGENT_CATEGORIES["Agent Library"]).map(category => ({
                            key: `agent-${category}`,
                            value: category,
                            type: "Agent Library"
                          })),
                          ...Object.keys(AGENT_CATEGORIES["Prompt Library"]).map(category => ({
                            key: `prompt-${category}`,
                            value: category,
                            type: "Prompt Library"
                          }))
                        ].map(({ key, value, type }) => (
                          <SelectItem key={key} value={value}>
                            <div className="flex flex-col text-left">
                              <span>{value}</span>
                              <span className="text-xs text-muted-foreground">
                                {type === "Agent Library" ? AGENT_DESCRIPTIONS[value] : `${type} - ${value}`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.agentCategory && (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <label>Template</label>
                        <InfoTooltip content="Select a specific template to use" />
                      </div>
                      <Select
                        value={formData.agentType}
                        onValueChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            agentType: value
                          }));
                          // Load the template content when selected
                          fetch(`/templates/${value}.md`)
                            .then(res => res.text())
                            .then(content => {
                              const parsed = content.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
                              if (parsed) {
                                const [_, frontmatter, body] = parsed;
                                setFormData(prev => ({
                                  ...prev,
                                  systemPrompt: prev.domain ? 
                                    `You are an AI assistant specialized in ${prev.domain}. You will help users by providing detailed, step-by-step solutions using available tools.\n\n${body.trim()}` :
                                    body.trim()
                                }));
                              }
                            })
                            .catch(console.error);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.agentCategory && AGENT_CATEGORIES[formData.agentCategory === "Conversational Agents" || formData.agentCategory === "Tool-Using Agents" || formData.agentCategory === "Multi-Agent Systems" || formData.agentCategory === "Memory Systems" ? "Agent Library" : "Prompt Library"][formData.agentCategory]?.map((template) => (
                            <SelectItem key={template} value={template}>
                              {template}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="multiple" className="w-full" defaultValue={["system"]}>
            <AccordionItem value="domain">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Domain Configuration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div>
                    <div className="flex items-center">
                      <label className="text-sm font-medium">Domain Category (Optional)</label>
                      <InfoTooltip content="Select the primary category for your agent's domain" />
                    </div>
                    <Select
                      value={formData.domainCategory}
                      onValueChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          domainCategory: value,
                          domain: "" // Reset domain when category changes
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a domain category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(DOMAINS).map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.domainCategory && (
                      <p className="text-sm text-red-500 mt-1">{errors.domainCategory}</p>
                    )}
                  </div>

                  {formData.domainCategory && (
                    <div>
                      <div className="flex items-center">
                        <label className="text-sm font-medium">Domain (Optional)</label>
                        <InfoTooltip content="Select the specific domain for your agent" />
                      </div>
                      <Select
                        value={formData.domain}
                        onValueChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            domain: value,
                            systemPrompt: prev.systemPrompt ? 
                              (value ? 
                                `You are an AI assistant specialized in ${value}. You will help users by providing detailed, step-by-step solutions using available tools.\n\n${prev.systemPrompt}` :
                                prev.systemPrompt) :
                              (value ? 
                                `You are an AI assistant specialized in ${value}. You will help users by providing detailed, step-by-step solutions using available tools.` :
                                `You are a helpful AI assistant that uses available tools to solve problems step by step.`)
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS[formData.domainCategory as keyof typeof DOMAINS].map((domain) => (
                            <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.domain && (
                        <p className="text-sm text-red-500 mt-1">{errors.domain}</p>
                      )}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="model">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Brain className="mr-2 h-4 w-4" />
                  Model Configuration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <label>Model</label>
                      <InfoTooltip content="The language model to use for this agent" />
                    </div>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => {
                        if (value !== "loading") {
                          setFormData({ ...formData, model: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingModels ? (
                          <SelectItem value="loading">Loading models...</SelectItem>
                        ) : (
                          models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex flex-col text-left">
                                <span>{model.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  Context: {model.context_length.toLocaleString()} tokens
                                  <br />
                                  Pricing: ${model.pricing.prompt}/1K prompt, ${model.pricing.completion}/1K completion
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <label>Temperature ({formData.temperature})</label>
                      <InfoTooltip content="Controls randomness in responses. Lower values are more focused, higher values more creative." />
                    </div>
                    <Slider
                      value={[formData.temperature]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <label>Max Tokens</label>
                      <InfoTooltip content="Maximum length of the response" />
                    </div>
                    <Input
                      type="number"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="chain">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Network className="mr-2 h-4 w-4" />
                  Chain Configuration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <label>Chain Type</label>
                      <InfoTooltip content="The type of processing chain to use" />
                    </div>
                    <Select
                      value={formData.chainType}
                      onValueChange={(value) => setFormData({ ...formData, chainType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHAIN_TYPES.map((chain) => (
                          <SelectItem key={chain.value} value={chain.value}>
                            <div className="flex flex-col text-left">
                              <span>{chain.label}</span>
                              <span className="text-xs text-muted-foreground">{chain.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="streaming"
                      checked={formData.streaming}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, streaming: checked as boolean })
                      }
                    />
                    <div className="flex items-center">
                      <label htmlFor="streaming">Enable streaming</label>
                      <InfoTooltip content="Stream responses token by token" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verbose"
                      checked={formData.verbose}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, verbose: checked as boolean })
                      }
                    />
                    <div className="flex items-center">
                      <label htmlFor="verbose">Verbose mode</label>
                      <InfoTooltip content="Show detailed processing information" />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="memory">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Memory System
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <label>Memory Type</label>
                      <InfoTooltip content="How the agent stores and recalls information" />
                    </div>
                    <Select
                      value={formData.memory}
                      onValueChange={(value) => setFormData({ ...formData, memory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tools">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Wrench className="mr-2 h-4 w-4" />
                  Available Tools
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-6 p-2">
                  {errors.tools && (
                    <p className="text-sm text-red-500">{errors.tools}</p>
                  )}
                  {Object.entries(TOOL_CATEGORIES).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="space-y-2">
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        <InfoTooltip content={category.description} />
                      </div>
                      <div className="grid gap-2 pl-2">
                        {category.tools.map((tool) => (
                          <div key={`${categoryKey}-${tool.value}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${categoryKey}-${tool.value}`}
                              checked={formData.tools.includes(tool.value)}
                              onCheckedChange={(checked) => {
                                const tools = checked
                                  ? [...formData.tools, tool.value]
                                  : formData.tools.filter(t => t !== tool.value);
                                setFormData({ ...formData, tools });
                              }}
                            />
                            <div className="flex items-center">
                              <label htmlFor={`${categoryKey}-${tool.value}`}>{tool.label}</label>
                              <InfoTooltip content={tool.description} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="system" defaultValue="system">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  System Prompt
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label>System Prompt</label>
                      <InfoTooltip content="Instructions that define the agent's behavior and capabilities" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!formData.model) {
                          toast({
                            title: "Error",
                            description: "Please select a model first",
                            variant: "destructive"
                          });
                          return;
                        }

                        const settings = loadSettings();
                        if (!settings?.apiKey) {
                          toast({
                            title: "Error",
                            description: "API key not configured",
                            variant: "destructive"
                          });
                          return;
                        }

                        setIsOptimizing(true);
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
                              model: formData.model,
                              messages: [
                                {
                                  role: "system",
                                  content: "You are an expert at optimizing prompts for clarity, effectiveness, and efficiency. Consider the following aspects in your optimization:\n\n1. Model Configuration:\n   - Temperature settings (0-1 scale)\n   - Max token allocation\n   - Response length management\n   - Model-specific capabilities\n2. Chain Configuration: Processing flow and execution patterns\n3. Memory System: Context retention and information management\n4. Available Tools: Integration and usage patterns\n\nAnalyze the given prompt and provide only the optimized version, without any explanatory text or preamble."
                                },
                                {
                                  role: "user",
                                  content: `Please optimize this system prompt:\n\n${formData.systemPrompt}`
                                }
                              ],
                              temperature: formData.temperature,
                              max_tokens: formData.maxTokens,
                              stream: formData.streaming
                            })
                          });

                          if (!response.ok) {
                            throw new Error("Failed to optimize prompt");
                          }

                          // Clear the existing prompt first
                          setFormData(prev => ({
                            ...prev,
                            systemPrompt: ""
                          }));

                          // Stream in the optimized prompt
                          const reader = response.body?.getReader();
                          if (!reader) throw new Error("No response reader available");

                          let optimizedPrompt = "";
                          
                          while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            
                            const chunk = new TextDecoder().decode(value);
                            const lines = chunk.split('\n').filter(line => line.trim());
                            
                            for (const line of lines) {
                              if (line.startsWith('data: ')) {
                                const content = line.slice(5);
                                if (content.trim() === '[DONE]') continue;
                                
                                try {
                                  const data = JSON.parse(content);
                                  if (data.choices?.[0]?.delta?.content) {
                                    optimizedPrompt += data.choices[0].delta.content;
                                    setFormData(prev => ({
                                      ...prev,
                                      systemPrompt: optimizedPrompt
                                    }));
                                  }
                                } catch (error) {
                                  console.warn('Failed to parse streaming response chunk:', content);
                                }
                              }
                            }
                          }
                          setIsOptimizing(false);
                          toast({
                            title: "Success",
                            description: "System prompt optimized",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to optimize prompt",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      {isOptimizing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Optimize
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={formData.systemPrompt}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        systemPrompt: newValue
                      }));
                    }}
                    placeholder="Enter system prompt..."
                    rows={8}
                    className={`font-mono text-sm ${errors.systemPrompt ? "border-red-500" : ""}`}
                  />
                  {errors.systemPrompt && (
                    <p className="text-sm text-red-500">{errors.systemPrompt}</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }} 
            className="mt-4"
            type="button"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Deploy Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
