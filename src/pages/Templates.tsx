import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useEditModal } from "../contexts/EditModalContext";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Search, BookTemplate, Trash2, Edit2 } from "lucide-react";
import { TemplateEditorModal } from "../components/TemplateEditorModal";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import MainNav from "../components/MainNav";
import { SavedTemplate, getSavedTemplates, deleteTemplate, saveTemplate } from "../services/storageService";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [builtInTemplates, setBuiltInTemplates] = useState<Template[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState<string>("Mathematical Frameworks");
  const [editingTemplate, setEditingTemplate] = useState<SavedTemplate | null>(null);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const { toast } = useToast();
  const templatesPerPage = 9;

  const loadTemplate = (section: string) => {
    setSearchQuery(section);
    setActiveSection(section);
    setCurrentPage(1);
  };

  const loadSavedTemplates = () => {
    setSavedTemplates(getSavedTemplates());
  };

  // Filter templates based on search and active section
  const filteredTemplates = builtInTemplates.filter(template => {
    const matchesSearch = searchQuery ? (
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true;

    // Find the active section object
    const activeSectionObj = SECTIONS.find(section => section.name === activeSection);
    const matchesSection = activeSectionObj?.categories.includes(template.title) || false;

    return matchesSearch && matchesSection;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  useEffect(() => {
    const importTemplates = async () => {
      setSearchQuery(activeSection);
      const templateModules = import.meta.glob<string>('/public/templates/*.md', { 
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
  }, [activeSection]);

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
      
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <aside className={`glass-panel p-4 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
          <div className="flex flex-col gap-4">
            {SECTIONS.map((section) => (
              <button
                key={section.name}
                onClick={() => loadTemplate(section.name)}
                className={`w-full text-left px-2 py-1 rounded hover:bg-console-cyan/10 text-sm 
                  ${activeSection === section.name 
                    ? 'bg-console-cyan/10 text-console-cyan' 
                    : 'text-console-text'
                  } transition-colors`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex-1 glass-panel p-6 animate-matrix-fade">
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

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentTemplates.map((template) => (
              <Card key={template.filename} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-console-cyan">{template.title}</CardTitle>
                  <CardDescription className="text-console-green">
                    {activeSection} Template
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </Button>
                  </PaginationItem>
                  
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <Button
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className="pagination-button"
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </Button>
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
                {savedTemplates.filter(template => 
                  template.category === activeSection
                ).map((template) => (
                  <Card key={template.id} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow bg-gray-900/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-console-cyan">{template.name}</CardTitle>
                          <CardDescription className="text-console-green">
                            {template.category} - {new Date(template.timestamp).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-0.5">
                          <button
                            onClick={() => {
                              setEditingTemplate(template);
                              setIsTemplateEditorOpen(true);
                            }}
                            className="console-button p-1.5 hover:bg-console-cyan/20"
                            title="Edit template"
                          >
                            <Edit2 className="w-4 h-4 text-console-cyan" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this template?')) {
                                deleteTemplate(template.id);
                                loadSavedTemplates();
                              }
                            }}
                            className="console-button p-1.5 hover:bg-red-900/20"
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4 bg-gray-900/50">
                        <pre className="text-sm font-code text-console-text">
                          {template.description}
                          {'\n\n'}
                          {template.content}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>

        <TemplateEditorModal
          isOpen={isTemplateEditorOpen}
          onClose={() => {
            setIsTemplateEditorOpen(false);
            setEditingTemplate(null);
          }}
          initialData={editingTemplate}
          onSave={(template) => {
            try {
              saveTemplate({
                name: template.name,
                description: template.description,
                category: template.category || activeSection,
                content: template.content,
                variables: template.variables?.map(v => ({
                  name: v.name || '',
                  type: v.type || 'string',
                  description: v.description || '',
                  defaultValue: v.defaultValue
                })) || []
              });
              setIsTemplateEditorOpen(false);
              setEditingTemplate(null);
              loadSavedTemplates();
              toast({
                title: "Success",
                description: "Template saved successfully"
              });
            } catch (error) {
              console.error('Failed to save template:', error);
              toast({
                title: "Error",
                description: "Failed to save template",
                variant: "destructive"
              });
            }
          }}
        />
      </main>
    </div>
  );
}
