import { ChevronDown, ChevronRight, BookTemplate } from "lucide-react";
import { CATEGORIES } from "./constants/domains";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loadTemplate: (category: keyof typeof CATEGORIES) => void;
}

// Define agent categories
const AGENT_SECTIONS = {
  "Conversational Agents": [
    "Zero-Shot Agent", "ReAct Agent", "Plan-and-Execute", "OpenAI Functions",
    "Structured Chat", "XML Agent"
  ],
  "Tool-Using Agents": [
    "Sequential Chain", "Router Chain", "API Chain",
    "SQL Chain", "Vector Store", "Retrieval QA"
  ],
  "Multi-Agent Systems": [
    "Supervisor Agent", "Autonomous Agents", "Agent Executor",
    "Team Chat", "Agent Network", "Hierarchical Agents"
  ],
  "Memory Systems": [
    "Buffer Memory", "Summary Memory", "Conversation Memory",
    "Vector Memory", "Entity Memory", "Time-Weighted Memory"
  ]
} as const;

// Group categories by their section
const SECTIONS = {
  "Mathematical Frameworks": [
    "Mathematical Logic", "Set Theory", "Category Theory", "Abstract Algebra",
    "Topology", "Complex Analysis", "Symbolic Systems", "System Analysis", "Number Theory"
  ],
  "Basic Prompting": [
    "Zero-Shot", "Few-Shot", "Chain of Thought", "Role Playing",
    "Step by Step", "Direct Instruction", "Task Decomposition"
  ],
  "Advanced Prompting": [
    "Tree of Thoughts", "ReAct", "Self-Consistency", "Chain of Verification",
    "Meta-Prompting", "Recursive Prompting", "Socratic Method"
  ],
  "Cutting Edge": [
    "Constitutional AI", "Automatic Reasoning", "Multi-Agent", "Recursive Refinement",
    "Adversarial Prompting", "Emergent Abilities", "Self-Reflection"
  ],
  "Specialized": [
    "Retrieval Augmented", "Context Distillation", "Prompt Chaining",
    "Knowledge Graphs", "Semantic Control", "Temporal Reasoning", "Causal Inference"
  ],
  "Safety": [
    "Red Teaming", "Prompt Injection", "Jailbreak Prevention",
    "Output Sanitization", "Bias Detection"
  ],
  "Optimization": [
    "Token Optimization", "Context Window", "Prompt Compression",
    "Response Shaping", "Temperature Control"
  ]
} as const;

const Sidebar = ({ sidebarOpen, setSidebarOpen, loadTemplate }: SidebarProps): JSX.Element => {
  const handleTemplateClick = (category: keyof typeof CATEGORIES) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadTemplate(category);
  };

  return (
    <div className={`glass-panel p-4 md:w-64 animate-matrix-fade ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
      <div className="flex items-center justify-between mb-6">
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden console-button p-1"
        >
          {sidebarOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-console-cyan font-code mb-4">Prompt Library</h3>
        <Accordion type="multiple" className="space-y-2">
        {Object.entries(SECTIONS).map(([section, categories]) => (
          <AccordionItem key={section} value={section} className="border-none">
            <AccordionTrigger className="text-console-cyan hover:no-underline py-2 px-3 rounded-md hover:bg-gray-800/50 text-left">
              {section}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 ml-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button 
                      className="w-full text-left console-button flex items-center gap-2 py-1 px-2"
                      onClick={() => handleTemplateClick(category as keyof typeof CATEGORIES)}
                    >
                      <BookTemplate className="w-4 h-4" />
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8">
        <h3 className="text-console-cyan font-code mb-4">Agent Library</h3>
        <Accordion type="multiple" className="space-y-2">
          {Object.entries(AGENT_SECTIONS).map(([section, categories]) => (
            <AccordionItem key={section} value={section} className="border-none">
              <AccordionTrigger className="text-console-cyan hover:no-underline py-2 px-3 rounded-md hover:bg-gray-800/50 text-left">
                {section}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 ml-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button 
                        className="w-full text-left console-button flex items-center gap-2 py-1 px-2"
                        onClick={() => handleTemplateClick(category as keyof typeof CATEGORIES)}
                      >
                        <BookTemplate className="w-4 h-4" />
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
