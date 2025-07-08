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

  async getAvailableModels(provider: string): Promise<AIModel[]> {
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