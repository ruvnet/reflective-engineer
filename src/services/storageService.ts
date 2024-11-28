export const SAVED_PROMPTS_KEY = 'symbolic-scribe-saved-prompts';

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

export const getSavedPrompts = (): SavedPrompt[] => {
  const saved = localStorage.getItem(SAVED_PROMPTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const savePrompt = (prompt: Omit<SavedPrompt, 'id' | 'timestamp'>) => {
  const prompts = getSavedPrompts();
  const newPrompt: SavedPrompt = {
    ...prompt,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  prompts.push(newPrompt);
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(prompts));
  return newPrompt;
};
