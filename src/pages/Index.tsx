import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, BookTemplate } from "lucide-react";
import { useTemplate } from "../services/templateService";
import { useToast } from "../components/ui/use-toast";
import MainNav from "../components/MainNav";

const CATEGORIES = {
  "Mathematical Logic": "mathematical-logic",
  "Abstract Algebra": "abstract-algebra",
  "Set Theory": "set-theory",
  "Symbolic Systems": "symbolic-systems",
  "Real-World Simulations": "systematic-suppression",
  "Complex Analysis": "complex-analysis",
  "Number Theory": "number-theory",
  "Category Theory": "category-theory",
  "Topology": "topology"
} as const;

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTemplate, setCurrentTemplate] = useState("systematic-suppression");
  const [selectedDomain, setSelectedDomain] = useState("");
  const { toast } = useToast();
  
  const { data: template, isLoading } = useTemplate(currentTemplate);

  const loadTemplate = (category: keyof typeof CATEGORIES) => {
    const templateId = CATEGORIES[category];
    setCurrentTemplate(templateId);
    toast({
      title: "Template Loaded",
      description: `Loading ${category} template...`,
      duration: 3000 // Auto dismiss after 3 seconds
    });
  };

  // Initialize domain when template loads
  useEffect(() => {
    if (template?.domain) {
      setSelectedDomain(template.domain);
    }
  }, [template?.domain]);

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDomain(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Symbolic Reasoning Prompt Generator" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        {/* Sidebar */}
        <aside className={`glass-panel p-4 md:w-64 animate-matrix-fade ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-console-cyan font-code">Categories</h2>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden console-button p-1"
            >
              {sidebarOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
          <ul className="space-y-2">
            {Object.keys(CATEGORIES).map((category) => (
              <li key={category}>
                <button 
                  className="w-full text-left console-button flex items-center gap-2"
                  onClick={() => loadTemplate(category as keyof typeof CATEGORIES)}
                >
                  <BookTemplate className="w-4 h-4" />
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Workspace */}
        <section className="flex-1 glass-panel p-6 animate-matrix-fade">
          {isLoading ? (
            <div className="text-console-cyan">Loading template...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-console-cyan mb-2">Prompt Overview</label>
                <textarea 
                  className="console-input w-full h-24"
                  placeholder="Describe the purpose or goal of the prompt..."
                  value={template?.overview || ""}
                  onChange={(e) => {/* Handle changes */}}
                />
              </div>

              <div>
                <label className="block text-console-cyan mb-2">Domain Selection</label>
                <select 
                  className="console-input w-full"
                  value={selectedDomain}
                  onChange={handleDomainChange}
                >
                  <option value="">Select domain...</option>
                  <option value="infosec">Information Security</option>
                  <option value="ethics">Ethics</option>
                  <option value="ai">AI Systems</option>
                  <option value="society">Societal Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-console-cyan mb-2">Set Definitions</label>
                <textarea 
                  className="console-input w-full h-32 font-mono"
                  placeholder="Define your sets and subsets here..."
                  value={template?.content || ""}
                  onChange={(e) => {/* Handle changes */}}
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="console-button flex-1">
                  Preview
                </button>
                <button className="console-button flex-1">
                  Generate
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
