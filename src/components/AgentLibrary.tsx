import { useState } from 'react';
import { BookTemplate } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

// Define agent categories and their templates
export const AGENT_TEMPLATES = {
  "Conversational Agents": {
    "zero-shot-agent": "Zero-Shot Agent",
    "react-agent": "ReAct Agent",
    "plan-and-execute": "Plan-and-Execute",
    "openai-functions": "OpenAI Functions",
    "structured-chat": "Structured Chat",
    "xml-agent": "XML Agent"
  },
  "Tool-Using Agents": {
    "sequential-chain": "Sequential Chain",
    "router-chain": "Router Chain",
    "api-chain": "API Chain",
    "sql-chain": "SQL Chain",
    "vector-store": "Vector Store",
    "retrieval-qa": "Retrieval QA"
  },
  "Multi-Agent Systems": {
    "supervisor-agent": "Supervisor Agent",
    "autonomous-agents": "Autonomous Agents",
    "agent-executor": "Agent Executor",
    "team-chat": "Team Chat",
    "agent-network": "Agent Network",
    "hierarchical-agents": "Hierarchical Agents"
  },
  "Memory Systems": {
    "buffer-memory": "Buffer Memory",
    "summary-memory": "Summary Memory",
    "conversation-memory": "Conversation Memory",
    "vector-memory": "Vector Memory",
    "entity-memory": "Entity Memory",
    "time-weighted-memory": "Time-Weighted Memory"
  }
} as const;

interface AgentLibraryProps {
  onSelectTemplate: (templateId: string) => void;
}

export const AgentLibrary = ({ onSelectTemplate }: AgentLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-console-cyan font-code mb-4">Agent Library</h3>
      <Accordion type="multiple" className="space-y-2">
        {Object.entries(AGENT_TEMPLATES).map(([category, templates]) => (
          <AccordionItem key={category} value={category} className="border-none">
            <AccordionTrigger 
              className="text-console-cyan hover:no-underline py-2 px-3 rounded-md hover:bg-gray-800/50 text-left"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 ml-2">
                {Object.entries(templates).map(([id, name]) => (
                  <li key={id}>
                    <button 
                      className="w-full text-left console-button flex items-center gap-2 py-1 px-2"
                      onClick={() => onSelectTemplate(id)}
                    >
                      <BookTemplate className="w-4 h-4" />
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
