import { useState, useEffect } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useTemplate } from "../services/templateService";
import { useToast } from "../components/ui/use-toast";
import { loadSettings, fetchAvailableModels, testPrompt, OpenRouterModel } from "../services/settingsService";
import { Link } from "react-router-dom";
import MainNav from "../components/MainNav";
import PreviewDialog from "../components/PreviewDialog";
import GenerateDialog from "../components/GenerateDialog";
import Sidebar from "../components/Sidebar";
import { CATEGORIES, OUTPUT_TYPES, DOMAINS } from "../components/constants/domains";

const useLocalStorage = (key: string, initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const checkValue = () => {
      const settings = loadSettings();
      setValue(Boolean(settings?.apiKey));
    };

    checkValue();

    const handleStorageChange = () => {
      checkValue();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('settingsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsChanged', handleStorageChange);
    };
  }, [key]);

  return value;
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTemplate, setCurrentTemplate] = useState("systematic-suppression");
  const [selectedDomainCategory, setSelectedDomainCategory] = useState("Prompt Engineering");
  const [selectedDomain, setSelectedDomain] = useState("Chain of Thought");
  const [customDomain, setCustomDomain] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<OpenRouterModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [overview, setOverview] = useState("");
  const [content, setContent] = useState("");
  const [selectedOutputType, setSelectedOutputType] = useState<keyof typeof OUTPUT_TYPES>("Analysis");
  
  const hasApiKey = useLocalStorage('symbolic-scribe-settings', false);
  const { toast } = useToast();
  const { data: template, isLoading } = useTemplate(currentTemplate);

  const loadTemplate = (category: keyof typeof CATEGORIES) => {
    const templateId = CATEGORIES[category];
    setCurrentTemplate(templateId);
    toast({
      title: "Template Loaded",
      description: `Loading ${category} template...`,
      duration: 3000
    });
  };

  useEffect(() => {
    if (template) {
      setSelectedDomain(template.domain);
      setOverview(template.overview || "");
      setContent(template.content || "");
    }
  }, [template]);

  const handleDomainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDomainCategory(e.target.value);
    setSelectedDomain("");
    setIsCustomDomain(false);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomDomain(true);
      setSelectedDomain("");
    } else {
      setIsCustomDomain(false);
      setSelectedDomain(value);
      setCustomDomain("");
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
  };

  const getCurrentDomain = () => {
    if (isCustomDomain) {
      return customDomain;
    }
    return selectedDomain;
  };

  useEffect(() => {
    if (isPreviewOpen && hasApiKey) {
      const loadModels = async () => {
        setIsLoadingModels(true);
        try {
          const settings = loadSettings();
          if (settings?.apiKey) {
            const models = await fetchAvailableModels(settings.apiKey);
            setAvailableModels(models);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load available models",
            duration: 3000
          });
        } finally {
          setIsLoadingModels(false);
        }
      };
      loadModels();
    }
  }, [isPreviewOpen, hasApiKey]);

  const handlePreviewClick = () => {
    setIsPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  const handleTestPrompt = async (modelId: string, prompt: string, onChunk: (chunk: string) => void): Promise<void> => {
    const settings = loadSettings();
    if (!settings?.apiKey) {
      throw new Error("No API key configured");
    }
    try {
      await testPrompt(settings.apiKey, modelId, prompt, onChunk);
    } catch (error) {
      console.error('Error testing prompt:', error);
      throw error;
    }
  };

  const generatePrompt = () => {
    if (!template) return "";
    
    const domain = isCustomDomain ? customDomain : selectedDomain;
    const promptParts = [
      `Domain: ${domain}`,
      `Category: ${Object.keys(CATEGORIES).find(key => CATEGORIES[key as keyof typeof CATEGORIES] === currentTemplate)}`,
      `Output Type: ${selectedOutputType} (${OUTPUT_TYPES[selectedOutputType]})`,
      `Overview: ${overview}`,
      `Content:\n${content}`
    ];
    
    return promptParts.join('\n\n');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Reflective Engineer" />

      {!hasApiKey && (
        <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-yellow-200 flex-1">
              No API key configured. Some features may be limited.
            </p>
            <Link 
              to="/settings" 
              className="console-button bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200"
            >
              Configure API Key
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          loadTemplate={loadTemplate}
        />

        <section className="flex-1 glass-panel p-6 animate-matrix-fade">
          {isLoading ? (
            <div className="text-console-cyan">Loading template...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-console-cyan mb-2">Prompt Overview</label>
                <p className="text-sm text-gray-400 mb-2">Define your prompt engineering goals and desired model behavior</p>
                <textarea 
                  className="console-input w-full h-24"
                  placeholder="Describe the purpose or goal of your prompt..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-console-cyan mb-2">Domain Category</label>
                  <p className="text-sm text-gray-400 mb-2">Choose the primary domain for your prompt engineering task</p>
                  <select 
                    className="console-input w-full"
                    value={selectedDomainCategory}
                    onChange={handleDomainCategoryChange}
                  >
                    <option value="">Select domain category...</option>
                    {Object.keys(DOMAINS).map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {selectedDomainCategory && (
                  <div>
                    <label className="block text-console-cyan mb-2">Domain Selection</label>
                    <p className="text-sm text-gray-400 mb-2">Select a specific prompt engineering focus or define a custom domain</p>
                    <select 
                      className="console-input w-full"
                      value={isCustomDomain ? "custom" : selectedDomain}
                      onChange={handleDomainChange}
                    >
                      <option value="">Select domain...</option>
                      {DOMAINS[selectedDomainCategory as keyof typeof DOMAINS].map((domain) => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                      <option value="custom">Custom Domain...</option>
                    </select>
                  </div>
                )}

                {isCustomDomain && (
                  <div>
                    <label className="block text-console-cyan mb-2">Custom Domain</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="console-input flex-1"
                        placeholder="Enter custom domain..."
                        value={customDomain}
                        onChange={handleCustomDomainChange}
                      />
                      <button 
                        className="console-button"
                        onClick={() => setIsCustomDomain(false)}
                        title="Cancel custom domain"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-console-cyan mb-2">Mathematical Framework</label>
                <p className="text-sm text-gray-400 mb-2">Define your prompt structure using mathematical frameworks</p>
                <textarea 
                  className="console-input w-full h-32 font-mono"
                  placeholder="Define your mathematical framework here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-console-cyan mb-2">Output Type</label>
                <p className="text-sm text-gray-400 mb-2">Specify how you want the prompt to be processed</p>
                <select 
                  className="console-input w-full"
                  value={selectedOutputType}
                  onChange={(e) => setSelectedOutputType(e.target.value as keyof typeof OUTPUT_TYPES)}
                >
                  {Object.entries(OUTPUT_TYPES).map(([type, description]) => (
                    <option key={type} value={type}>{type} - {description}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  className="console-button flex-1"
                  onClick={handlePreviewClick}
                  disabled={!hasApiKey || !getCurrentDomain()}
                >
                  Preview
                </button>
                <button 
                  className="console-button flex-1"
                  onClick={() => setIsGenerateOpen(true)}
                  disabled={!hasApiKey || !getCurrentDomain()}
                >
                  Generate
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        models={availableModels}
        prompt={generatePrompt()}
        onTest={handleTestPrompt}
      />

      <GenerateDialog
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        prompt={{
          domain: getCurrentDomain(),
          category: Object.keys(CATEGORIES).find(key => CATEGORIES[key as keyof typeof CATEGORIES] === currentTemplate) || '',
          outputType: selectedOutputType,
          outputDescription: OUTPUT_TYPES[selectedOutputType],
          overview: overview,
          content: content
        }}
      />
    </div>
  );
};

export default Index;
