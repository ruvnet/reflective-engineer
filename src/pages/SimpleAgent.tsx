import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { loadSettings, createOpenRouterClient } from "@/services/settingsService";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import MainNav from "@/components/MainNav";
import { MessageSquare, Settings2, Send, Terminal } from "lucide-react";
import AgentLibrary from "@/components/AgentLibrary";
import { useTemplate } from "@/services/templateService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface AgentConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export default function SimpleAgent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verboseOutput, setVerboseOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { data: template } = useTemplate(selectedTemplateId);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });

  const runAgent = async () => {
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

    try {
      setLoading(true);
      setVerboseOutput([]);
      setOutput("");
      
      setVerboseOutput(prev => [...prev, "Initializing LangChain agent..."]);
      
      const openRouter = createOpenRouterClient(settings.apiKey);
      setVerboseOutput(prev => [...prev, "OpenRouter client initialized"]);

      const model = new ChatOpenAI({
        modelName: settings.defaultModel,
        temperature: agentConfig.temperature,
        maxTokens: agentConfig.maxTokens,
        topP: agentConfig.topP,
        frequencyPenalty: agentConfig.frequencyPenalty,
        presencePenalty: agentConfig.presencePenalty,
        streaming: true,
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              setOutput(prev => prev + token);
            },
          },
        ],
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "Simple LangChain Agent",
          },
        },
        openAIApiKey: settings.apiKey,
      });
      setVerboseOutput(prev => [...prev, `Model initialized: ${settings.defaultModel}`]);
      
      const fullPrompt = template 
        ? `${template.content}\n\nUser Input: ${input}`
        : input;

      setVerboseOutput(prev => [...prev, "Sending request to model..."]);
      
      await model.invoke([
        new HumanMessage(fullPrompt)
      ]);

      setVerboseOutput(prev => [...prev, "Response complete"]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setOutput(`Error: ${errorMessage}`);
      setVerboseOutput(prev => [...prev, `Error: ${errorMessage}`]);
    } finally {
      setLoading(false);
    }
  };

  const ConfigSlider = ({ 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    label 
  }: { 
    value: number, 
    onChange: (value: number[]) => void, 
    min: number, 
    max: number, 
    step: number, 
    label: string 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-console-cyan">{label}</Label>
        <span className="text-sm text-console-text">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={onChange}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <MainNav title="Simple Agent" />
      
      <main className="flex-1 p-4 container mx-auto max-w-6xl">
        <section className="glass-panel p-6 animate-matrix-fade rounded-lg border border-console-cyan/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-console-cyan" />
              <h1 className="text-2xl font-code text-console-cyan">LangChain Agent</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConfig(!showConfig)}
              className="text-console-cyan hover:text-console-cyan/80"
            >
              <Settings2 className="w-5 h-5" />
            </Button>
          </div>

          <Tabs defaultValue="agent" className="space-y-6">
            <TabsList className="grid grid-cols-2 gap-4 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="agent" 
                className="glass-panel data-[state=active]:border-console-cyan px-4 py-2 rounded-md"
              >
                Agent Interface
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="glass-panel data-[state=active]:border-console-cyan px-4 py-2 rounded-md"
              >
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agent">
              <Card className="glass-panel p-6 border border-console-cyan/20">
                <div className="space-y-6">
                  {showConfig && (
                    <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-console-cyan/20">
                      <h3 className="text-lg font-medium text-console-cyan mb-4">Agent Configuration</h3>
                      <ConfigSlider
                        label="Temperature"
                        value={agentConfig.temperature}
                        onChange={([value]) => setAgentConfig(prev => ({ ...prev, temperature: value }))}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                      <ConfigSlider
                        label="Max Tokens"
                        value={agentConfig.maxTokens}
                        onChange={([value]) => setAgentConfig(prev => ({ ...prev, maxTokens: value }))}
                        min={100}
                        max={4000}
                        step={100}
                      />
                      <ConfigSlider
                        label="Top P"
                        value={agentConfig.topP}
                        onChange={([value]) => setAgentConfig(prev => ({ ...prev, topP: value }))}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <ConfigSlider
                        label="Frequency Penalty"
                        value={agentConfig.frequencyPenalty}
                        onChange={([value]) => setAgentConfig(prev => ({ ...prev, frequencyPenalty: value }))}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                      <ConfigSlider
                        label="Presence Penalty"
                        value={agentConfig.presencePenalty}
                        onChange={([value]) => setAgentConfig(prev => ({ ...prev, presencePenalty: value }))}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  )}

                  {template && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-console-cyan">
                        Selected Template
                      </Label>
                      <div className="bg-black/30 p-4 rounded-md border border-console-cyan/20">
                        <h4 className="text-console-cyan mb-2">{template.title}</h4>
                        <pre className="whitespace-pre-wrap text-console-text text-sm">{template.content}</pre>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-console-cyan">
                      Enter your query
                    </Label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="What would you like to know?"
                      className="min-h-[100px] console-input bg-black/30 border-console-cyan/20"
                    />
                  </div>

                  <Button 
                    onClick={runAgent}
                    disabled={loading || !input}
                    className="w-full console-button bg-console-cyan/20 hover:bg-console-cyan/30 text-console-cyan border border-console-cyan/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Terminal className="animate-pulse" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Run Agent
                      </span>
                    )}
                  </Button>

                  {verboseOutput.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-console-cyan">
                        Verbose Output
                      </Label>
                      <pre className="bg-black/30 p-4 rounded-md border border-console-cyan/20 text-console-text font-mono text-sm whitespace-pre-wrap">
                        {verboseOutput.map((line, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-console-cyan">[{i + 1}]</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  )}

                  {output && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-console-cyan">
                        Response
                      </Label>
                      <div className="p-4 bg-black/30 rounded-md border border-console-cyan/20 whitespace-pre-wrap text-console-text">
                        {output}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <AgentLibrary loadTemplate={(templateId) => {
                setSelectedTemplateId(templateId);
                toast({
                  title: "Template Selected",
                  description: "Template loaded successfully.",
                });
              }} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
