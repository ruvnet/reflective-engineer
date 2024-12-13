import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Plus, Play, Square, Trash2, Zap } from "lucide-react";
import MainNav from "../components/MainNav";
import { DeployAgentDialog } from "../components/DeployAgentDialog";
import { TestAgentDialog } from "../components/TestAgentDialog";
import { AgentManagementDialog } from "../components/AgentManagementDialog";
import { useToast } from "@/components/ui/use-toast";
import { agentService, Agent } from "@/services/agentService";
import { useTemplate } from "@/services/templateService";
import { loadSettings } from "@/services/settingsService";

export default function Agents() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testingAgent, setTestingAgent] = useState<Agent | null>(null);
  const [managedAgent, setManagedAgent] = useState<Agent | null>(null);
  const { data: template } = useTemplate("system-dynamics");

  useEffect(() => {
    setAgents(agentService.getAgents());
  }, []);

  const handleDeploy = async (agent: Omit<Agent, 'id' | 'status'>) => {
    try {
      const newAgent = await agentService.deployAgent({
        ...agent,
        config: {
          ...agent.config,
          systemPrompt: agent.config.systemPrompt || "",
          tools: agent.config.tools || [],
          memory: agent.config.memory || "buffer",
          chainType: agent.config.chainType || "llm",
          streaming: agent.config.streaming !== undefined ? agent.config.streaming : true,
          verbose: agent.config.verbose || false
        }
      });
      setAgents(agentService.getAgents());
      setTestingAgent(null); // Clear testing agent
      setManagedAgent(newAgent); // This will now have all the config
      toast({
        title: "Success",
        description: "Agent deployed successfully"
      });
    } catch (error) {
      console.error("Deploy error:", error);
      toast({
        title: "Error",
        description: "Failed to deploy agent",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (agent: Agent) => {
    try {
      agentService.deleteAgent(agent.id);
      setAgents(agentService.getAgents());
      toast({
        title: "Success",
        description: "Agent deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive"
      });
    }
  };

  const handleStartStop = async (agent: Agent) => {
    try {
      if (agent.status === "stopped") {
        await agentService.startAgent(agent.id);
      } else {
        await agentService.stopAgent(agent.id);
      }
      setAgents(agentService.getAgents());
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${agent.status === "stopped" ? "start" : "stop"} agent`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav title="Agent Builder" />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const settings = loadSettings();
                  if (!settings?.defaultModel) {
                    throw new Error("No default model configured");
                  }

                  // Create a test agent using template
                  const testAgent = await agentService.deployAgent({
                    name: "Test Agent",
                    description: template?.overview || "Temporary agent for testing",
                    config: {
                      type: "react",
                      model: {
                        name: settings.defaultModel,
                        temperature: 0.7,
                        maxTokens: 2048
                      },
                      memory: "buffer",
                      tools: [],
                      chainType: "llm",
                      systemPrompt: template?.content || "You are a helpful AI assistant.",
                      streaming: false,
                      verbose: true
                    }
                  });
                  
                  // Start the agent
                  await agentService.startAgent(testAgent.id);
                  
                  // Update agents list and open test dialog
                  setAgents(agentService.getAgents());
                  setTestingAgent(testAgent);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to create test agent",
                    variant: "destructive"
                  });
                }
              }}
            >
              <Zap className="mr-2 h-4 w-4" />
              Test Agent
            </Button>
            <DeployAgentDialog 
              onDeploy={handleDeploy}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Agent
                </Button>
              }
            />
          </div>
        </div>

        {agents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No agents deployed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by deploying your first agent
              </p>
              <DeployAgentDialog 
                onDeploy={handleDeploy}
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Deploy Agent
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{agent.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(agent)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTestingAgent(agent)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setManagedAgent(agent);
                        }}
                      >
                        {agent.status === "stopped" ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      agent.status === "running" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {managedAgent && (
        <AgentManagementDialog
          agent={managedAgent}
          isOpen={true}
          onClose={() => setManagedAgent(null)}
          onStartStop={handleStartStop}
        />
      )}

      {testingAgent && (
        <TestAgentDialog
          agent={testingAgent}
          isOpen={true}
          onClose={() => setTestingAgent(null)}
        />
      )}
    </div>
  );
}
