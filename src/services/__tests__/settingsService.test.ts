import { 
  loadSettings, 
  saveSettings, 
  clearSettings,
  fetchAvailableModels,
  testApiKey,
  createOpenRouterClient
} from '../settingsService';
import OpenAI from 'openai';

jest.mock('openai');

describe('Settings Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Settings Management', () => {
    const testSettings = {
      apiKey: 'test-key',
      defaultModel: 'test-model',
      enabledModels: ['model1', 'model2']
    };

    it('should save and load settings with encryption', () => {
      saveSettings(testSettings);
      const loaded = loadSettings();
      
      expect(loaded?.defaultModel).toBe(testSettings.defaultModel);
      expect(loaded?.enabledModels).toEqual(testSettings.enabledModels);
      // API key should be decrypted correctly
      expect(loaded?.apiKey).toBe(testSettings.apiKey);
    });

    it('should handle default API key from environment', () => {
      process.env.VITE_OPENROUTER_KEY = 'default-key';
      const settings = loadSettings();
      expect(settings?.apiKey).toBe('default-key');
    });

    it('should clear settings correctly', () => {
      saveSettings(testSettings);
      const cleared = clearSettings();
      expect(localStorage.getItem('symbolic-scribe-settings')).toBeNull();
      expect(cleared?.apiKey).toBe(process.env.VITE_OPENROUTER_KEY || '');
    });
  });

  describe('OpenRouter API Integration', () => {
    it('should fetch available models', async () => {
      const mockModels = {
        data: [{
          id: 'model1',
          name: 'Test Model',
          description: 'Test Description',
          context_length: 4096,
          pricing: {
            prompt: '0.001',
            completion: '0.002'
          }
        }]
      };

      (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.models.list
        .mockResolvedValue(mockModels);

      const models = await fetchAvailableModels('test-key');
      
      expect(models).toHaveLength(1);
      expect(models[0]).toMatchObject({
        id: 'model1',
        name: 'Test Model',
        description: 'Test Description'
      });
    });

    it('should validate API key', async () => {
      (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.models.list
        .mockResolvedValue({ data: [] });

      const isValid = await testApiKey('test-key');
      expect(isValid).toBe(true);
    });

    it('should handle invalid API key', async () => {
      (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.models.list
        .mockRejectedValue(new Error('Invalid API key'));

      const isValid = await testApiKey('invalid-key');
      expect(isValid).toBe(false);
    });
  });
});
