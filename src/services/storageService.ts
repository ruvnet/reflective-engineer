export const SAVED_PROMPTS_KEY = 'symbolic-scribe-saved-prompts';
export const SAVED_TOOLS_KEY = 'symbolic-scribe-saved-tools';
export const SAVED_TEMPLATES_KEY = 'symbolic-scribe-saved-templates';

// Generic storage functions
export const getStoredItems = <T>(key: string): T[] => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

export interface SavedPrompt {
  id: string;
  title: string;
  timestamp: number;
  format: 'markdown' | 'json' | 'toml';
  prompt: {
    domain: string;
    category: string;
    outputType: string;
    outputDescription: string;
    overview: string;
    content: string;
  };
}

export interface SavedTool {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  category: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    description: string;
  }>;
  prompt: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  category: string;
  domain?: string;
  content: string;
  variables: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    description: string;
    defaultValue?: string;
  }>;
}

const saveItem = <T extends { id?: string }>(
  key: string,
  item: Omit<T, 'id' | 'timestamp'>,
  eventName: string = 'storageChanged'
): T => {
  const items = getStoredItems<T>(key);
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  } as T;
  items.push(newItem);
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event(eventName));
  return newItem;
};

const deleteItem = (key: string, id: string): void => {
  const items = getStoredItems(key);
  const filteredItems = items.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(filteredItems));
  window.dispatchEvent(new Event('storageChanged'));
};

// Prompt-specific functions
export const getSavedPrompts = (): SavedPrompt[] => getStoredItems<SavedPrompt>(SAVED_PROMPTS_KEY);
export const savePrompt = (prompt: Omit<SavedPrompt, 'id' | 'timestamp'>) => 
  saveItem<SavedPrompt>(SAVED_PROMPTS_KEY, prompt);
export const deletePrompt = (id: string) => deleteItem(SAVED_PROMPTS_KEY, id);

// Tool-specific functions
export const getSavedTools = (): SavedTool[] => getStoredItems(SAVED_TOOLS_KEY);
export const saveTool = (tool: Omit<SavedTool, 'id' | 'timestamp'>) => 
  saveItem<SavedTool>(SAVED_TOOLS_KEY, tool);
export const deleteTool = (id: string) => deleteItem(SAVED_TOOLS_KEY, id);

// Template-specific functions
export const getSavedTemplates = (): SavedTemplate[] => getStoredItems(SAVED_TEMPLATES_KEY);
export const saveTemplate = (template: Omit<SavedTemplate, 'id' | 'timestamp'>) => 
  saveItem<SavedTemplate>(SAVED_TEMPLATES_KEY, template);
export const deleteTemplate = (id: string) => deleteItem(SAVED_TEMPLATES_KEY, id);
