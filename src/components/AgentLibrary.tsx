import { useState } from "react";
import { BookTemplate } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useTemplate } from "../services/templateService";
import AgentTemplate from "./AgentTemplate";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface AgentLibraryProps {
  loadTemplate: (category: string) => void;
}

// Define agent categories with descriptions
export const AGENT_SECTIONS = {
  "Conversational Agents": {
    description: "Agents specialized in natural dialogue and interaction",
    agents: [
      { id: "zero-shot-agent", name: "Zero-Shot Agent", description: "Direct task execution without examples" },
      { id: "react-agent", name: "ReAct Agent", description: "Reasoning and acting in an iterative process" },
      { id: "plan-and-execute", name: "Plan-and-Execute", description: "Strategic planning before execution" },
      { id: "openai-functions", name: "OpenAI Functions", description: "Function-calling capabilities" },
      { id: "structured-chat", name: "Structured Chat", description: "Format-preserving conversations" },
      { id: "xml-agent", name: "XML Agent", description: "XML-based interaction patterns" }
    ]
  },
  "Tool-Using Agents": {
    description: "Agents that leverage external tools and APIs",
    agents: [
      { id: "sequential-chain", name: "Sequential Chain", description: "Step-by-step processing" },
      { id: "router-chain", name: "Router Chain", description: "Dynamic workflow routing" },
      { id: "api-chain", name: "API Chain", description: "External API integration" },
      { id: "sql-chain", name: "SQL Chain", description: "Database interaction" },
      { id: "vector-store", name: "Vector Store", description: "Efficient data retrieval" },
      { id: "retrieval-qa", name: "Retrieval QA", description: "Knowledge-based responses" }
    ]
  },
  "Multi-Agent Systems": {
    description: "Collaborative agent networks and hierarchies",
    agents: [
      { id: "supervisor-agent", name: "Supervisor Agent", description: "Oversight and coordination" },
      { id: "autonomous-agents", name: "Autonomous Agents", description: "Independent decision-making" },
      { id: "agent-executor", name: "Agent Executor", description: "Task execution management" },
      { id: "team-chat", name: "Team Chat", description: "Multi-agent collaboration" },
      { id: "agent-network", name: "Agent Network", description: "Interconnected agent systems" },
      { id: "hierarchical-agents", name: "Hierarchical Agents", description: "Layered agent structures" }
    ]
  },
  "Memory Systems": {
    description: "Different types of agent memory implementations",
    agents: [
      { id: "buffer-memory", name: "Buffer Memory", description: "Recent interaction storage" },
      { id: "summary-memory", name: "Summary Memory", description: "Condensed information retention" },
      { id: "conversation-memory", name: "Conversation Memory", description: "Dialogue history tracking" },
      { id: "vector-memory", name: "Vector Memory", description: "Semantic memory storage" },
      { id: "entity-memory", name: "Entity Memory", description: "Named entity tracking" },
      { id: "time-weighted-memory", name: "Time-Weighted Memory", description: "Temporal memory management" }
    ]
  }
} as const;

// Export templates mapping for other components
export const AGENT_TEMPLATES = Object.entries(AGENT_SECTIONS).reduce((acc, [category, { agents }]) => {
  acc[category] = agents.reduce((agentAcc, agent) => {
    agentAcc[agent.id] = agent.name;
    return agentAcc;
  }, {} as Record<string, string>);
  return acc;
}, {} as Record<string, Record<string, string>>);

export default function AgentLibrary({ loadTemplate }: AgentLibraryProps) {
  const [selectedAgent, setSelectedAgent] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Use the template service to load the template content
  const { data: template, isLoading } = useTemplate(
    selectedAgent ? selectedAgent.id : ''
  );

  const toggleSection = (section: string) => {
    setExpandedSections(current =>
      current.includes(section)
        ? current.filter(s => s !== section)
        : [...current, section]
    );
  };

  return (
    <div className="space-y-8">
      {selectedAgent && template ? (
        <AgentTemplate
          name={selectedAgent.name}
          description={selectedAgent.description}
          systemPrompt={template.content}
          onClose={() => setSelectedAgent(null)}
        />
      ) : (
        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="space-y-4"
        >
          {Object.entries(AGENT_SECTIONS).map(([section, { description, agents }]) => (
            <AccordionItem key={section} value={section} className="glass-panel p-4">
              <AccordionTrigger className="text-console-cyan hover:no-underline">
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-code">{section}</h2>
                  <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {agents.map((agent) => (
                    <Card 
                      key={agent.id}
                      className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50 cursor-pointer"
                      onClick={() => {
                        setSelectedAgent(agent);
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <BookTemplate className="w-5 h-5 text-console-cyan" />
                          <CardTitle className="text-console-cyan text-lg">{agent.name}</CardTitle>
                        </div>
                        <CardDescription className="text-console-green">
                          {agent.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <button 
                          className="console-button w-full mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadTemplate(agent.id);
                          }}
                        >
                          Configure Agent
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
