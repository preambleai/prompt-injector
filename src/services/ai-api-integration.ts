// Simple AI API Integration Service - Ollama Focused
// Handles Ollama integration with fallback mechanisms

export interface AIRequest {
  provider: string
  model: string
  prompt: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
  stream?: boolean
  metadata?: Record<string, any>
}

export interface AIResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  provider: string
  finishReason: string
}

export interface AIError {
  message: string
  code?: string
  status?: number
  rateLimitInfo?: {
    resetTime: number
    remaining: number
  }
}

export interface AIModel {
  id: string
  name: string
  provider: string
  contextLength: number
  capabilities: string[]
}

// AI API Integration Service
class AIIntegrationService {
  private baseUrl = 'http://localhost:11434'

  async testOllamaConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.ok
    } catch (error) {
      console.error('Ollama connection test failed:', error)
      return false
    }
  }

  async getAvailableModels(provider: string, apiKey?: string): Promise<AIModel[]> {
    if (provider === 'ollama') {
      try {
        const response = await fetch(`${this.baseUrl}/api/tags`)
        if (response.ok) {
          const data = await response.json()
          return data.models?.map((model: any) => ({
            id: model.name,
            name: model.name,
            provider: 'ollama',
            contextLength: model.size || 4096,
            capabilities: ['text-generation']
          })) || []
        }
      } catch (error) {
        console.error('Error fetching Ollama models:', error)
      }
    }
    if (provider === 'openai' && apiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        })
        if (response.ok) {
          const data = await response.json()
          // Filter for chat/completions models
          return data.data.filter((m: any) => m.id.startsWith('gpt') || m.id.startsWith('o')).map((model: any) => ({
            id: model.id,
            name: model.id,
            provider: 'openai',
            contextLength: 128000, // Approximate, can be improved
            capabilities: ['text-generation']
          }))
        }
      } catch (error) {
        console.error('Error fetching OpenAI models:', error)
      }
    }
    if (provider === 'anthropic' && apiKey) {
      // Anthropic does not have a public model listing endpoint as of 2024, so use a static list
      return [
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', contextLength: 200000, capabilities: ['text-generation'] },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic', contextLength: 200000, capabilities: ['text-generation'] },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', contextLength: 200000, capabilities: ['text-generation'] },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', contextLength: 200000, capabilities: ['text-generation'] },
        { id: 'claude-4-sonnet-20250522', name: 'Claude 4 Sonnet', provider: 'anthropic', contextLength: 200000, capabilities: ['text-generation'] },
        { id: 'claude-4-opus-20250522', name: 'Claude 4 Opus', provider: 'anthropic', contextLength: 200000, capabilities: ['text-generation'] }
      ]
    }
    if (provider === 'google') {
      // Google Gemini: Use the ListModels endpoint and filter for supported models
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
          { method: 'GET' }
        );
        if (!response.ok) throw new Error('Failed to fetch Gemini models');
        const data = await response.json();
        // Filter for latest Gemini models (chat/completion capable)
        const supported = [
          'gemini-1.5-pro',
          'gemini-1.5-flash',
          'gemini-pro-vision',
          'gemini-2.0',
          'gemini-2.0-pro',
          'gemini-2.0-flash',
          'gemini-2.5-flash',
          'gemini-2.5-pro',
        ];
        return (data.models || [])
          .filter((m: any) => supported.some(s => m.name.includes(s)))
          .map((m: any) => ({
            id: m.name.replace('models/', ''),
            name: m.displayName || m.name.replace('models/', ''),
            provider: 'google',
            contextLength: m.inputTokenLimit || 8192,
            capabilities: m.supportedGenerationMethods || [],
          }));
      } catch (e) {
        throw new Error('Failed to fetch Gemini models. Please check your API key and try again.');
      }
    }
    if (provider === 'grok' && apiKey) {
      // Grok (xAI) - use static list for now, as public API is limited
      return [
        { id: 'grok-3-beta', name: 'Grok 3 Beta', provider: 'grok', contextLength: 131072, capabilities: ['text-generation'] },
        { id: 'grok-3-mini-beta', name: 'Grok 3 Mini Beta', provider: 'grok', contextLength: 131072, capabilities: ['text-generation'] },
        { id: 'grok-4', name: 'Grok 4', provider: 'grok', contextLength: 256000, capabilities: ['text-generation'] }
      ]
    }
    return []
  }

  async makeRequest(request: AIRequest): Promise<AIResponse> {
    if (request.provider === 'ollama') {
      try {
        // Use /api/chat endpoint and messages array format
        const messages = [];
        if (request.systemPrompt) {
          messages.push({ role: 'system', content: request.systemPrompt });
        }
        messages.push({ role: 'user', content: request.prompt });

        const response = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: request.model,
            messages,
            stream: false,
            options: {
              temperature: request.temperature || 0.7,
              num_predict: request.maxTokens || 100
            }
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return {
          content: data.message?.content || data.response || '',
          usage: {
            promptTokens: data.prompt_eval_count || 0,
            completionTokens: data.eval_count || 0,
            totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
          },
          model: request.model,
          provider: request.provider,
          finishReason: data.done ? 'stop' : 'length'
        }
      } catch (error) {
        throw new Error(`Ollama request failed: ${error}`)
      }
    }
    
    throw new Error(`Unsupported provider: ${request.provider}`)
  }
}

export const aiAPIIntegration = new AIIntegrationService()