import CryptoJS from 'crypto-js';
import OpenAI from 'openai';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'symbolic-scribe-key';
const DEFAULT_API_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const SETTINGS_KEY = 'symbolic-scribe-settings';

export interface Settings {
  apiKey: string;
  defaultModel: string;
  enabledModels: string[];
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

// Initialize OpenAI client with OpenRouter base URL
const createOpenRouterClient = (apiKey: string) => {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Symbolic Scribe'
    }
  });
};

// Encrypt the API key before storing
const encryptApiKey = (apiKey: string): string => {
  return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
};

// Decrypt the stored API key
const decryptApiKey = (encryptedApiKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedApiKey, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Save settings to local storage
export const saveSettings = (settings: Settings): void => {
  const encryptedSettings = {
    ...settings,
    apiKey: encryptApiKey(settings.apiKey)
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(encryptedSettings));
};

// Load settings from local storage
export const loadSettings = (): Settings | null => {
  const settingsJson = localStorage.getItem(SETTINGS_KEY);
  if (!settingsJson && DEFAULT_API_KEY) {
    // If no settings but we have a default API key, create initial settings
    const initialSettings: Settings = {
      apiKey: DEFAULT_API_KEY,
      defaultModel: '',
      enabledModels: []
    };
    saveSettings(initialSettings);
    return initialSettings;
  }
  if (!settingsJson) return null;

  const settings = JSON.parse(settingsJson);
  return {
    ...settings,
    apiKey: settings.apiKey ? decryptApiKey(settings.apiKey) : ''
  };
};

// Fetch available models from OpenRouter
export const fetchAvailableModels = async (apiKey: string): Promise<OpenRouterModel[]> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin || 'http://localhost:8080',
        'X-Title': 'Symbolic Scribe',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(errorData.error?.message || `Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return data.data.map((model: any) => ({
      id: model.id,
      name: model.name || model.id.split('/').pop() || model.id,
      description: model.description || 'No description available',
      context_length: model.context_length || 4096,
      pricing: {
        prompt: model.pricing?.prompt || '0',
        completion: model.pricing?.completion || '0'
      }
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

// Test API key validity
export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin || 'http://localhost:8080',
        'X-Title': 'Symbolic Scribe',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      return false;
    }
    
    const data = await response.json();
    return Boolean(data.data && Array.isArray(data.data));
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
};
