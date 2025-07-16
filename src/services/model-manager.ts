import { AIModel, AttackPayload } from '../types'

// Default AI models for quick setup (updated with correct provider names)
export const defaultModels: AIModel[] = [
  {
    id: 'openai-gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    enabled: false
  },
  {
    id: 'openai-gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    enabled: false
  },
  {
    id: 'anthropic-claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    enabled: false
  },
  {
    id: 'anthropic-claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    enabled: false
  },
  {
    id: 'google-gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-pro',
    enabled: false
  },
  {
    id: 'xai-grok-beta',
    name: 'Grok Beta',
    provider: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-beta',
    enabled: false
  },
  {
    id: 'xai-grok-3-mini',
    name: 'Grok 3 Mini',
    provider: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3-mini',
    enabled: false
  },
  {
    id: 'ollama-llama2',
    name: 'Llama 2',
    provider: 'ollama',
    endpoint: 'http://127.0.0.1:11434',
    model: 'llama2',
    enabled: false
  }
]

// Load models from localStorage
export const loadModels = async (): Promise<AIModel[]> => {
  try {
    const stored = localStorage.getItem('ai-models')
    if (stored) {
      const models = JSON.parse(stored)
      // Remove any duplicates by ID (in case they exist)
      const uniqueModels = models.filter((model: AIModel, index: number, array: AIModel[]) => 
        array.findIndex((m: AIModel) => m.id === model.id) === index
      )
      return uniqueModels
    }
    // Return empty array if none exist
    return []
  } catch (error) {
    console.error('Failed to load models:', error)
    return []
  }
}

// Save models to localStorage (excluding apiKey)
export const saveModels = async (models: AIModel[]): Promise<void> => {
  // Remove apiKey from each model before saving
  const sanitized = models.map(({ apiKey, ...rest }) => rest)
  localStorage.setItem('ai-models', JSON.stringify(sanitized))
}

// --- API Key Store ---
const API_KEY_STORAGE_KEY = 'ai-api-keys';

function normalizeProviderId(provider: string): string {
  const p = (provider || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (p.startsWith('openai')) return 'openai';
  if (p.startsWith('anthropic')) return 'anthropic';
  if (p.startsWith('google')) return 'google';
  if (p === 'xaigrok' || p === 'grokxai' || p === 'grok') return 'xai';
  if (p === 'xai') return 'xai';
  if (p === 'ollama') return 'ollama';
  return p;
}

export const getAPIKeyForModel = (provider: string, model: string): string | undefined => {
  try {
    const raw = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!raw) return undefined;
    const keys = JSON.parse(raw);
    const canonical = normalizeProviderId(provider);
    return keys[`${canonical}::${model}`] || keys[canonical] || undefined;
  } catch {
    return undefined;
  }
};

export const setAPIKeyForModel = (provider: string, model: string, apiKey: string) => {
  try {
    const raw = localStorage.getItem(API_KEY_STORAGE_KEY);
    const keys = raw ? JSON.parse(raw) : {};
    const canonical = normalizeProviderId(provider);
    keys[`${canonical}::${model}`] = apiKey;
    keys[canonical] = apiKey; // fallback for provider-level
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(keys));
  } catch {}
};

// Patch addModel and updateModel to store apiKey
export const addModel = async (model: AIModel): Promise<void> => {
  const models = await loadModels();
  const { apiKey, ...rest } = model;
  
  // Normalize provider name for consistency
  const normalizedModel = { ...rest, provider: normalizeProviderId(rest.provider) };
  
  // Check if a model with this ID already exists
  const existingIndex = models.findIndex(m => m.id === normalizedModel.id);
  
  if (existingIndex !== -1) {
    // Update existing model instead of adding duplicate
    if (apiKey) setAPIKeyForModel(normalizedModel.provider, normalizedModel.model, apiKey);
    models[existingIndex] = { ...models[existingIndex], ...normalizedModel };
  } else {
    // Add new model
    if (apiKey) setAPIKeyForModel(normalizedModel.provider, normalizedModel.model, apiKey);
    models.push(normalizedModel);
  }
  
  await saveModels(models);
};

export const updateModel = async (id: string, updates: Partial<AIModel>): Promise<void> => {
  const models = await loadModels();
  const idx = models.findIndex(m => m.id === id);
  if (idx !== -1) {
    const { apiKey, ...rest } = updates;
    
    // Normalize provider name if it's being updated
    const normalizedUpdates = rest.provider ? { ...rest, provider: normalizeProviderId(rest.provider) } : rest;
    
    if (apiKey) setAPIKeyForModel(normalizedUpdates.provider || models[idx].provider, normalizedUpdates.model || models[idx].model, apiKey);
    models[idx] = { ...models[idx], ...normalizedUpdates };
    await saveModels(models);
  }
};

// Delete a model
export const deleteModel = async (id: string): Promise<void> => {
  const models = await loadModels()
  const filtered = models.filter(m => m.id !== id)
  await saveModels(filtered)
}

// Get model by ID
export const getModel = async (id: string): Promise<AIModel | null> => {
  const models = await loadModels()
  return models.find(m => m.id === id) || null
}

// Get enabled models
export const getEnabledModels = async (): Promise<AIModel[]> => {
  const models = await loadModels()
  return models.filter(m => m.enabled)
}

// Test model connection
export const testModelConnection = async (model: AIModel): Promise<{ success: boolean; error?: string }> => {
  if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.testModelConnection) {
    return await window.electronAPI.testModelConnection(model);
  }
  // Fallback for non-Electron environments (optional)
  return { success: false, error: 'testModelConnection is only available in Electron.' };
}

// Set a model as the default for payload creation/mutation
export const setDefaultPayloadModel = async (id: string): Promise<void> => {
  const models = await loadModels();
  const updated = models.map(m => ({ ...m, defaultForPayloads: m.id === id }));
  await saveModels(updated);
};

// Get the default model for payload creation/mutation
export const getDefaultPayloadModel = async (): Promise<AIModel | null> => {
  const models = await loadModels();
  const defaultModel = models.find(m => m.defaultForPayloads);
  
  if (!defaultModel) {
    return null;
  }
  
  // Normalize the provider name to ensure consistency
  const normalizedProvider = normalizeProviderId(defaultModel.provider);
  
  // Add the API key to the model
  const apiKey = getAPIKeyForModel(defaultModel.provider, defaultModel.model);
  return {
    ...defaultModel,
    provider: normalizedProvider,
    apiKey
  };
};

// Clean up duplicate models (utility function)
export const cleanupDuplicateModels = async (): Promise<void> => {
  const models = await loadModels();
  const uniqueModels = models.filter((model: AIModel, index: number, array: AIModel[]) => 
    array.findIndex((m: AIModel) => m.id === model.id) === index
  );
  
  // Only save if we actually removed duplicates
  if (uniqueModels.length !== models.length) {
    await saveModels(uniqueModels);
    console.log(`Cleaned up ${models.length - uniqueModels.length} duplicate models`);
  }
}; 