import { useState } from "react";
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
import { Plus, Rocket, Brain, Wrench, Database, Settings, Bot, Network, HelpCircle } from "lucide-react";

interface DeployAgentDialogProps {
  onDeploy: (agent: { name: string; description: string; config: any }) => void;
  trigger?: React.ReactNode;
  onClose?: () => void;
}

const AGENT_TYPES = {
  react: {
    name: "ReAct",
    description: "Combines reasoning and acting in an iterative process. Best for complex tasks requiring multiple steps.",
    options: ["prefix", "suffix"]
  },
  openai: {
    name: "OpenAI Functions",
    description: "Uses OpenAI's function calling capabilities. Ideal for structured outputs and API interactions.",
    options: ["functions", "systemMessage"]
  },
  structured: {
    name: "Structured",
    description: "Maintains specific output formats. Perfect for consistent, formatted responses.",
    options: ["outputSchema", "format"]
  },
  plan: {
    name: "Plan and Execute",
    description: "Creates and follows a plan of actions. Great for complex tasks requiring strategic thinking.",
    options: ["planningPrompt", "executionPrompt"]
  }
};

const MODEL_OPTIONS = [
  { 
    value: "gpt-4", 
    label: "GPT-4",
    description: "Most capable model, best for complex reasoning"
  },
  { 
    value: "gpt-3.5-turbo", 
    label: "GPT-3.5 Turbo",
    description: "Fast and cost-effective for simpler tasks"
  },
  { 
    value: "anthropic/claude-2", 
    label: "Claude 2",
    description: "Strong analytical and coding capabilities"
  }
];

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
      { value: "weather", label: "Weather API", description: "Get weather information" },
      { value: "news", label: "News API", description: "Fetch news articles" }
    ]
  },
  utilities: {
    name: "Utilities",
    description: "General purpose tools",
    tools: [
      { value: "file-io", label: "File I/O", description: "Read and write files" },
      { value: "code-executor", label: "Code Executor", description: "Execute code snippets" }
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
  tools?: string;
  systemPrompt?: string;
  model?: string;
}

export function DeployAgentDialog({ onDeploy, trigger, onClose }: DeployAgentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agentType: "react",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2048,
    memory: "buffer",
    tools: ["calculator", "search"],  // Pre-select some default tools
    chainType: "llm",
    systemPrompt: "You are a helpful AI assistant that uses available tools to solve problems step by step.",
    streaming: true,
    verbose: false
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

    await onDeploy({
      name: formData.name,
      description: formData.description,
      config
    });

    // Reset form data
    setFormData({
      name: "",
      description: "",
      agentType: "react",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      memory: "buffer",
      tools: ["calculator", "search"],
      chainType: "llm",
      systemPrompt: "You are a helpful AI assistant that uses available tools to solve problems step by step.",
      streaming: true,
      verbose: false
    });

    // Close the dialog after deployment
    if (onClose) {
      onClose();
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
      open={trigger ? undefined : true}
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }
      }}
    >
      <DialogTrigger asChild>
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

          <Tabs defaultValue="react" onValueChange={(value) => setFormData({ ...formData, agentType: value })}>
            <TabsList className="grid grid-cols-4">
              {Object.entries(AGENT_TYPES).map(([key, type]) => (
                <TabsTrigger key={key} value={key}>{type.name}</TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(AGENT_TYPES).map(([key, type]) => (
              <TabsContent key={key} value={key}>
                <Alert>
                  <AlertDescription>
                    {type.description}
                  </AlertDescription>
                </Alert>
              </TabsContent>
            ))}
          </Tabs>

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
                      onValueChange={(value) => setFormData({ ...formData, model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MODEL_OPTIONS.map((option) => (
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
                            <div className="flex flex-col">
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
                  {Object.entries(TOOL_CATEGORIES).map(([key, category]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        <InfoTooltip content={category.description} />
                      </div>
                      <div className="grid gap-2 pl-2">
                        {category.tools.map((tool) => (
                          <div key={tool.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={tool.value}
                              checked={formData.tools.includes(tool.value)}
                              onCheckedChange={(checked) => {
                                const tools = checked
                                  ? [...formData.tools, tool.value]
                                  : formData.tools.filter(t => t !== tool.value);
                                setFormData({ ...formData, tools });
                              }}
                            />
                            <div className="flex items-center">
                              <label htmlFor={tool.value}>{tool.label}</label>
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

            <AccordionItem value="system">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  System Prompt
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 p-2">
                  <div className="flex items-center">
                    <label>System Prompt</label>
                    <InfoTooltip content="Instructions that define the agent's behavior and capabilities" />
                  </div>
                  <Textarea
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    placeholder="Enter system prompt..."
                    rows={4}
                    className={errors.systemPrompt ? "border-red-500" : ""}
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
