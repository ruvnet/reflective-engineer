import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { loadSettings, testPrompt } from "@/services/settingsService";
import MainNav from "@/components/MainNav";
import { MessageSquare } from "lucide-react";
import AgentLibrary from "@/components/AgentLibrary";
import { useTemplate } from "@/services/templateService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SimpleAgent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verboseOutput, setVerboseOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const { toast } = useToast();
  const { data: template } = useTemplate(selectedTemplateId);

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
      
      // Log initialization
      setVerboseOutput(prev => [...prev, "Initializing agent..."]);

      // Combine template with user input if template is selected
      const fullPrompt = template 
        ? `${template.content}\n\nUser Input: ${input}`
        : input;

      setVerboseOutput(prev => [...prev, "Sending request to model..."]);

      await testPrompt(
        settings.apiKey,
        settings.defaultModel,
        fullPrompt,
        (chunk) => {
          setOutput(prev => prev + chunk);
        }
      );

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

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Simple Agent" />
      
      <main className="flex-1 p-4">
        <section className="glass-panel p-6 animate-matrix-fade">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-console-cyan" />
            <h1 className="text-2xl font-code text-console-cyan">LangChain Agent</h1>
          </div>

          <Tabs defaultValue="agent" className="space-y-6">
            <TabsList className="grid grid-cols-2 gap-4 bg-transparent h-auto p-0">
              <TabsTrigger value="agent" className="glass-panel data-[state=active]:border-console-cyan">
                Agent Interface
              </TabsTrigger>
              <TabsTrigger value="templates" className="glass-panel data-[state=active]:border-console-cyan">
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agent">
              <Card className="glass-panel p-6">
                <div className="space-y-4">
                  {template && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-console-cyan">
                        Selected Template: {template.title}
                      </label>
                      <div className="bg-black/30 p-4 rounded-md text-console-text">
                        <pre className="whitespace-pre-wrap">{template.content}</pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2 text-console-cyan">
                      Enter your query:
                    </label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="What would you like to know?"
                      className="min-h-[100px] console-input"
                    />
                  </div>

                  <Button 
                    onClick={runAgent}
                    disabled={loading || !input}
                    className="w-full console-button"
                  >
                    {loading ? "Running..." : "Run Agent"}
                  </Button>

                  {verboseOutput.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-console-cyan">
                        Verbose Output:
                      </label>
                      <pre className="bg-black/30 p-4 rounded-md text-console-text font-mono text-sm whitespace-pre-wrap">
                        {verboseOutput.map((line, i) => `[${i + 1}] ${line}\n`)}
                      </pre>
                    </div>
                  )}

                  {output && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-console-cyan">
                        Response:
                      </label>
                      <div className="p-4 bg-black/30 rounded-md whitespace-pre-wrap text-console-text">
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
