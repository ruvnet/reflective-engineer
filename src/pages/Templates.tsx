import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, BookTemplate, Trash2 } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MainNav from "../components/MainNav";
import { SavedPrompt, getSavedPrompts, deletePrompt, SAVED_PROMPTS_KEY } from "../services/storageService";

interface Template {
  title: string;
  content: string;
  filename: string;
}

type GlobModule = {
  [key: string]: () => Promise<string>
}

type Section = {
  name: string;
  categories: string[];
};

const SECTIONS: Section[] = [
  {
    name: "Mathematical Frameworks",
    categories: ["Mathematical Logic", "Set Theory", "Category Theory", "Abstract Algebra", 
                "Topology", "Complex Analysis", "Symbolic Systems", "System Analysis", "Number Theory"]
  },
  {
    name: "Basic Prompting",
    categories: ["Zero-Shot", "Few-Shot", "Chain of Thought", "Role Playing", 
                "Step by Step", "Direct Instruction", "Task Decomposition"]
  },
  {
    name: "Advanced Prompting",
    categories: ["Tree of Thoughts", "ReAct", "Self-Consistency", "Chain of Verification",
                "Meta-Prompting", "Recursive Prompting", "Socratic Method"]
  },
  {
    name: "Cutting Edge",
    categories: ["Constitutional AI", "Automatic Reasoning", "Multi-Agent", "Recursive Refinement",
                "Adversarial Prompting", "Emergent Abilities", "Self-Reflection"]
  },
  {
    name: "Specialized",
    categories: ["Retrieval Augmented", "Context Distillation", "Prompt Chaining",
                "Knowledge Graphs", "Semantic Control", "Temporal Reasoning", "Causal Inference"]
  },
  {
    name: "Safety",
    categories: ["Red Teaming", "Prompt Injection", "Jailbreak Prevention",
                "Output Sanitization", "Bias Detection"]
  },
  {
    name: "Optimization",
    categories: ["Token Optimization", "Context Window", "Prompt Compression",
                "Response Shaping", "Temperature Control"]
  }
];

export default function Templates() {
  const [builtInTemplates, setBuiltInTemplates] = useState<Template[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedPrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 9;

  const loadSavedTemplates = () => {
    setSavedTemplates(getSavedPrompts());
  };

  // Filter templates based on search
  const filteredTemplates = builtInTemplates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  useEffect(() => {
    const importTemplates = async () => {
      const templateModules = import.meta.glob<string>('../templates/*.md', { 
        query: '?raw',
        import: 'default'
      }) as GlobModule;
      
      const loadedTemplates: Template[] = [];

      for (const path in templateModules) {
        const content = await templateModules[path]();
        const filename = path.split('/').pop()?.replace('.md', '') || '';
        const title = filename
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        loadedTemplates.push({
          title,
          content,
          filename
        });
      }

      setBuiltInTemplates(loadedTemplates);
      loadSavedTemplates();
    };

    importTemplates();
  }, []);

  // Listen for both storage event and custom event
  useEffect(() => {
    const handleStorageChange = () => {
      loadSavedTemplates();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storageChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storageChanged', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Template Library" />
      
      <main className="flex-1 p-4">
        <section className="glass-panel p-6 animate-matrix-fade">
          <div className="flex items-center gap-2 mb-6">
            <BookTemplate className="w-6 h-6 text-console-cyan" />
            <h1 className="text-2xl font-code text-console-cyan">Available Templates</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-10 console-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Built-in Templates by Section */}
          {SECTIONS.map((section) => {
            const sectionTemplates = currentTemplates.filter(template => 
              section.categories.includes(template.title)
            );

            if (sectionTemplates.length === 0) return null;

            return (
              <div key={section.name} className="mb-8">
                <h2 className="text-xl font-code text-console-cyan mb-4">{section.name}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sectionTemplates.map((template) => (
                <Card key={template.filename} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                  <CardHeader>
                    <CardTitle className="text-console-cyan">{template.title}</CardTitle>
                    <CardDescription className="text-console-green">
                      Mathematical Framework Template
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                      <pre className="text-sm font-code text-console-text">{template.content}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* No Results Message */}
          {filteredTemplates.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No templates found matching your search.
            </div>
          )}

          {/* Saved Templates */}
          {savedTemplates.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-code text-console-cyan mb-4">Saved Templates</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedTemplates.map((template) => (
                  <Card key={template.id} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-console-cyan">{template.title}</CardTitle>
                          <CardDescription className="text-console-green">
                            Saved Template - {new Date(template.timestamp).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm('Are you sure you want to delete this template?')) {
                              deletePrompt(template.id);
                            }
                          }}
                          className="console-button p-2 hover:bg-red-900/20"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                        <pre className="text-sm font-code text-console-text">
                          {template.prompt.overview}
                          {'\n\n'}
                          {template.prompt.content}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
