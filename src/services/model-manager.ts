import { AIModel, AttackPayload } from '../types'

// Default AI models for quick setup
export const defaultModels: AIModel[] = [
  {
    id: 'openai-gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    enabled: false
  },
  {
    id: 'openai-gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    enabled: false
  },
  {
    id: 'anthropic-claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    enabled: false
  },
  {
    id: 'anthropic-claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    enabled: false
  },
  {
    id: 'google-gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-pro',
    enabled: false
  },
  {
    id: 'xai-grok-3',
    name: 'Grok 3',
    provider: 'xAI',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3',
    enabled: false
  },
  {
    id: 'xai-grok-3-mini',
    name: 'Grok 3 Mini',
    provider: 'xAI',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3-mini',
    enabled: false
  },
  {
    id: 'xai-grok-3-reasoning',
    name: 'Grok 3 Reasoning',
    provider: 'xAI',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3-reasoning',
    enabled: false
  },
  {
    id: 'xai-grok-3-mini-reasoning',
    name: 'Grok 3 Mini Reasoning',
    provider: 'xAI',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3-mini-reasoning',
    enabled: false
  }
]

// Load models from localStorage
export const loadModels = async (): Promise<AIModel[]> => {
  try {
    const stored = localStorage.getItem('ai-models')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Return default models if none exist
    return [
      {
        id: 'gpt-4-default',
        name: 'GPT-4',
        provider: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4',
        enabled: true
      },
      {
        id: 'claude-3-default',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-sonnet-20240229',
        enabled: true
      }
    ]
  } catch (error) {
    console.error('Failed to load models:', error)
    return []
  }
}

// Save models to localStorage
export const saveModels = (models: AIModel[]): void => {
  try {
    localStorage.setItem('ai-models', JSON.stringify(models))
  } catch (error) {
    console.error('Failed to save models:', error)
  }
}

// Add a new model
export const addModel = async (model: Omit<AIModel, 'id'>): Promise<AIModel> => {
  const newModel: AIModel = {
    ...model,
    id: `${model.provider.toLowerCase()}-${model.model}-${Date.now()}`
  }
  
  const models = await loadModels()
  models.push(newModel)
  saveModels(models)
  
  return newModel
}

// Update an existing model
export const updateModel = async (id: string, updates: Partial<AIModel>): Promise<AIModel | null> => {
  const models = await loadModels()
  const index = models.findIndex(m => m.id === id)
  
  if (index === -1) return null
  
  models[index] = { ...models[index], ...updates }
  saveModels(models)
  
  return models[index]
}

// Delete a model
export const deleteModel = async (id: string): Promise<boolean> => {
  const models = await loadModels()
  const filtered = models.filter(m => m.id !== id)
  
  if (filtered.length === models.length) return false
  
  saveModels(filtered)
  return true
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
  if (!model.apiKey) {
    return { success: false, error: 'API key is required' }
  }

  try {
    // Create a simple test payload
    const testPayload = "Hello, this is a connection test. Please respond with 'Connection successful' if you can see this message."
    
    // Use the attack engine to test the connection
    const { executeTest } = await import('./attack-engine')
    
    const testAttack: AttackPayload = {
      id: 'connection-test',
      name: 'Connection Test',
      description: 'Test connection to AI model',
      category: 'TEST',
      payload: testPayload,
      severity: 'LOW',
      tags: ['test'],
      source: 'internal'
    }
    
    const result = await executeTest(model, testAttack)
    
    if (result.success) {
      return { success: true }
    } else {
      return { success: false, error: result.error || 'Test failed' }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
} 