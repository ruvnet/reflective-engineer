import { useState, useRef, useEffect } from "react";
import { X, Loader2, ArrowLeft, Save, Download } from "lucide-react";

interface OptimizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  originalOverview: string;
  originalContent: string;
  optimizationPrompt: string;
  onOptimize: (prompt: string, onChunk: (chunk: string) => void, signal?: AbortSignal) => Promise<void>;
  onUpdate: (newOverview: string, newContent: string) => void;
}

type ViewTab = 'original' | 'optimization' | 'result';

const OptimizationDialog = ({
  isOpen,
  onClose,
  domain,
  originalOverview,
  originalContent,
  optimizationPrompt,
  onOptimize,
  onUpdate
}: OptimizationDialogProps) => {
  const [activeTab, setActiveTab] = useState<ViewTab>('original');
  const [response, setResponse] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const responseEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  if (!isOpen) return null;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError("");
    setResponse("");
    setStartTime(new Date());
    setActiveTab('optimization');

    // Create new AbortController for this optimization
    const controller = new AbortController();
    setAbortController(controller);

    let fullResponse = '';
    try {
      await onOptimize(optimizationPrompt, (chunk) => {
        fullResponse += chunk;
        setResponse(fullResponse);
      }, controller.signal);

      // After optimization is complete, parse the response
      const overviewMatch = fullResponse.match(/---OVERVIEW---([\s\S]*?)(?:---CONTENT---|$)/);
      const contentMatch = fullResponse.match(/---CONTENT---([\s\S]*?)$/);

      if (overviewMatch && contentMatch) {
        const newOverview = overviewMatch[1].trim();
        const newContent = contentMatch[1].trim();
        onUpdate(newOverview, newContent);
      }
    } catch (err) {
      if (err instanceof Error) {
        // Don't show error message if it was intentionally aborted
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsOptimizing(false);
      setAbortController(null);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-panel w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {activeTab !== 'original' && (
              <button 
                onClick={() => setActiveTab('original')}
                className="console-button p-1"
                title="Back to original"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl text-console-cyan font-code">
              Prompt Optimization for {domain}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="console-button p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-code ${
              activeTab === 'original' 
                ? 'text-console-cyan border-b-2 border-console-cyan' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('original')}
          >
            Original
          </button>
          <button
            className={`px-4 py-2 font-code ${
              activeTab === 'optimization' 
                ? 'text-console-cyan border-b-2 border-console-cyan' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('optimization')}
          >
            Optimization
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'original' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-console-cyan mb-2">Original Overview</label>
                <div className="console-input w-full p-3 whitespace-pre-wrap">
                  {originalOverview}
                </div>
              </div>
              <div>
                <label className="block text-console-cyan mb-2">Original Content</label>
                <div className="console-input w-full p-3 whitespace-pre-wrap">
                  {originalContent}
                </div>
              </div>
            </div>
          ) : (
            <div className="console-input w-full min-h-[400px] p-3 font-mono text-sm">
              <div className="text-gray-400">
                {startTime && `[${formatTimestamp(startTime)}] `}$ Optimizing prompt...
              </div>
              {error ? (
                <div className="text-red-400 mt-2">{error}</div>
              ) : (
                <>
                  <div className="whitespace-pre-wrap mt-2">
                    <span className="text-gray-400">
                      {response ? `[${formatTimestamp(new Date())}] ` : ''}
                    </span>
                    <span className="text-gray-300">{response}</span>
                    {isOptimizing && (
                      <span className="inline-block w-2 h-4 ml-1 bg-console-cyan animate-pulse" />
                    )}
                  </div>
                </>
              )}
              <div ref={responseEndRef} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 flex justify-end gap-3">
          {activeTab === 'original' ? (
            <>
              <button 
                className="console-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="console-button"
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Optimizing...
                  </>
                ) : (
                  'Start Optimization'
                )}
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              {isOptimizing ? (
                <button 
                  className="console-button bg-red-900/30 hover:bg-red-900/50"
                  onClick={() => abortController?.abort()}
                >
                  Stop Generation
                </button>
              ) : (
                <button 
                  className="console-button"
                  onClick={onClose}
                >
                  Close Without Saving
                </button>
              )}
              <button
                className="console-button flex items-center gap-2"
                onClick={() => {
                  const overviewMatch = response.match(/---OVERVIEW---([\s\S]*?)(?:---CONTENT---|$)/);
                  const contentMatch = response.match(/---CONTENT---([\s\S]*?)$/);
                  
                  if (overviewMatch && contentMatch) {
                    const newOverview = overviewMatch[1].trim();
                    const newContent = contentMatch[1].trim();
                    onUpdate(newOverview, newContent);
                    onClose();
                  }
                }}
                disabled={!response || isOptimizing}
              >
                <Save className="w-4 h-4" />
                Update & Save
              </button>
              <button
                className="console-button flex items-center gap-2"
                onClick={() => {
                  const content = response;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `optimized-prompt-${domain.toLowerCase().replace(/\s+/g, '-')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                disabled={!response || isOptimizing}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizationDialog;
