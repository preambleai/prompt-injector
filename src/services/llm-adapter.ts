/**
 * Universal LLM Adapter Service
 * Provides unified interface for all major AI providers
 */

import { AIRequest, AIResponse } from '../types';

export interface LLMProvider {
  id: string;
  name: string;
  requiresApiKey: boolean;
  supportsStreaming: boolean;
  defaultModels: string[];
  baseUrl?: string;
}

export interface LLMRequestOptions {
  maxRetries?: number;
  timeout?: number;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
}

// Separate interface for LLM model discovery (different from AIModel in types)
export interface LLMModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  capabilities: string[];
}

export interface LLMProviderHandler {
  getAvailableModels(apiKey?: string): Promise<LLMModelInfo[]>;
  makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse>;
  validateApiKey(apiKey: string): Promise<boolean>;
  getDefaultModel(): string;
}

// Provider configurations
export const PROVIDERS: Record<string, LLMProvider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    requiresApiKey: true,
    supportsStreaming: true,
    defaultModels: ['o3', 'o3-mini', 'gpt-4.5-preview', 'gpt-4.1', 'gpt-4o', 'gpt-4o-mini', 'o4-mini'],
    baseUrl: 'https://api.openai.com/v1'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    requiresApiKey: true,
    supportsStreaming: true,
    defaultModels: ['claude-3.7-sonnet-20250219', 'claude-4-sonnet', 'claude-4-opus', 'claude-3.5-sonnet-20241022', 'claude-3.5-haiku-20241022'],
    baseUrl: 'https://api.anthropic.com/v1'
  },
  google: {
    id: 'google',
    name: 'Google Gemini',
    requiresApiKey: true,
    supportsStreaming: true,
    defaultModels: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
  },
  xai: {
    id: 'xai',
    name: 'xAI Grok',
    requiresApiKey: true,
    supportsStreaming: true,
    defaultModels: ['grok-3-beta', 'grok-3-mini-beta', 'grok-3', 'grok-2', 'grok-beta'],
    baseUrl: 'https://api.x.ai/v1'
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    requiresApiKey: false,
    supportsStreaming: true,
    defaultModels: ['llama2', 'mistral', 'codellama'],
    baseUrl: 'http://127.0.0.1:11434'
  }
};

// OpenAI Provider Handler
class OpenAIHandler implements LLMProviderHandler {
  async getAvailableModels(apiKey?: string): Promise<LLMModelInfo[]> {
    if (!apiKey) {
      const provider = PROVIDERS['openai'];
      if (!provider) {
        throw new Error('OpenAI provider not found');
      }
      return provider.defaultModels.map(model => ({
        id: model,
        name: model,
        provider: 'openai',
        contextLength: this.getContextLength(model),
        capabilities: ['text-generation']
      }));
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.data
        .filter((model: any) => model.id.includes('gpt') || model.id.includes('o1'))
        .map((model: any) => ({
          id: model.id,
          name: model.id,
          provider: 'openai',
          contextLength: this.getContextLength(model.id),
          capabilities: ['text-generation']
        }));
    } catch (error) {
      console.error('OpenAI model fetch error:', error);
      return this.getAvailableModels(); // Return defaults on error
    }
  }

  async makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse> {
    const apiKey = request.metadata?.['apiKey'];
    if (!apiKey) {
      throw { message: 'OpenAI API key is required', code: 'missing_api_key', status: 401 };
    }

    const messages = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    messages.push({ role: 'user', content: request.prompt });

    const requestBody = {
      model: request.model,
      messages,
      max_tokens: request.maxTokens || options?.maxTokens || 1000,
      temperature: request.temperature ?? options?.temperature ?? 0.7,
      stream: request.stream || options?.stream || false,
      ...(options?.topP && { top_p: options.topP }),
      ...(options?.stopSequences && { stop: options.stopSequences })
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw { 
        message: `OpenAI API error: ${errorData.error?.message || response.statusText}`, 
        code: errorData.error?.code || 'api_error', 
        status: response.status 
      };
    }

    const data = await response.json() as any;
    const choice = data.choices[0];
    const usage = data.usage;

    return {
      content: choice.message.content,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens
      },
      model: data.model,
      provider: 'openai',
      finishReason: choice.finish_reason
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getDefaultModel(): string {
    return 'o3';
  }

  private getContextLength(model: string): number {
    if (model.includes('gpt-4')) return 128000;
    if (model.includes('gpt-3.5')) return 4096;
    if (model.includes('o1')) return 128000;
    return 4096;
  }
}

// Anthropic Provider Handler
class AnthropicHandler implements LLMProviderHandler {
  async getAvailableModels(_apiKey?: string): Promise<LLMModelInfo[]> {
    // Anthropic doesn't have a public models endpoint, so we return known models
    return [
      {
        id: 'claude-3.7-sonnet-20250219',
        name: 'Claude 3.7 Sonnet (Hybrid Reasoning)',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation', 'reasoning', 'extended-thinking']
      },
      {
        id: 'claude-4-sonnet',
        name: 'Claude 4 Sonnet',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation', 'advanced-reasoning']
      },
      {
        id: 'claude-4-opus',
        name: 'Claude 4 Opus',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation', 'advanced-reasoning']
      },
      {
        id: 'claude-3.5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet (New)',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation', 'computer-use']
      },
      {
        id: 'claude-3.5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation']
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation']
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation']
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        contextLength: 200000,
        capabilities: ['text-generation']
      }
    ];
  }

  async makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse> {
    const apiKey = request.metadata?.['apiKey'];
    if (!apiKey) {
      throw { message: 'Anthropic API key is required', code: 'missing_api_key', status: 401 };
    }

    const messages = [];
    if (request.systemPrompt) {
      messages.push({ role: 'user', content: request.systemPrompt });
      messages.push({ role: 'assistant', content: 'I understand.' });
    }
    messages.push({ role: 'user', content: request.prompt });

    const requestBody = {
      model: request.model,
      max_tokens: request.maxTokens || options?.maxTokens || 1000,
      temperature: request.temperature ?? options?.temperature ?? 0.7,
      messages,
      ...(options?.topP && { top_p: options.topP }),
      ...(options?.topK && { top_k: options.topK }),
      ...(options?.stopSequences && { stop_sequences: options.stopSequences })
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw { 
        message: `Anthropic API error: ${errorData.error?.message || response.statusText}`, 
        code: errorData.error?.code || 'api_error', 
        status: response.status 
      };
    }

    const data = await response.json() as any;
    const content = data.content[0];
    const usage = data.usage;

    return {
      content: content.text,
      usage: {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens
      },
      model: data.model,
      provider: 'anthropic',
      finishReason: data.stop_reason
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getDefaultModel(): string {
    return 'claude-3.7-sonnet-20250219';
  }
}

// Google Provider Handler
class GoogleHandler implements LLMProviderHandler {
  async getAvailableModels(_apiKey?: string): Promise<LLMModelInfo[]> {
    return [
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        contextLength: 1048576,
        capabilities: ['text-generation', 'hybrid-reasoning']
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash (Hybrid Reasoning)',
        provider: 'google',
        contextLength: 1048576,
        capabilities: ['text-generation', 'hybrid-reasoning']
      },
      {
        id: 'gemini-2.0-pro',
        name: 'Gemini 2.0 Pro',
        provider: 'google',
        contextLength: 2000000,
        capabilities: ['text-generation', 'code-generation', 'tool-use']
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        contextLength: 1000000,
        capabilities: ['text-generation', 'multimodal', 'tool-use']
      },
      {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash-Lite',
        provider: 'google',
        contextLength: 1000000,
        capabilities: ['text-generation', 'cost-efficient']
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        contextLength: 1000000,
        capabilities: ['text-generation', 'multimodal']
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        contextLength: 1000000,
        capabilities: ['text-generation', 'multimodal']
      }
    ];
  }

  async makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse> {
    const apiKey = request.metadata?.['apiKey'];
    if (!apiKey) {
      throw { message: 'Google API key is required', code: 'missing_api_key', status: 401 };
    }

    const contents = [];
    if (request.systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: request.systemPrompt }] });
      contents.push({ role: 'model', parts: [{ text: 'I understand.' }] });
    }
    contents.push({ role: 'user', parts: [{ text: request.prompt }] });

    const requestBody = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? options?.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens || options?.maxTokens || 1000,
        ...(options?.topP && { topP: options.topP }),
        ...(options?.topK && { topK: options.topK }),
        ...(options?.stopSequences && { stopSequences: options.stopSequences })
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw { 
        message: `Google API error: ${errorData.error?.message || response.statusText}`, 
        code: errorData.error?.code || 'api_error', 
        status: response.status 
      };
    }

    const data = await response.json() as any;
    const candidate = data.candidates[0];
    const usage = data.usageMetadata;

    return {
      content: candidate.content.parts[0].text,
      usage: {
        promptTokens: usage?.promptTokenCount || 0,
        completionTokens: usage?.candidatesTokenCount || 0,
        totalTokens: usage?.totalTokenCount || 0
      },
      model: request.model,
      provider: 'google',
      finishReason: candidate.finishReason
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Hi' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  getDefaultModel(): string {
    return 'gemini-2.5-pro';
  }
}

// xAI Provider Handler
class XAIHandler implements LLMProviderHandler {
  async getAvailableModels(apiKey?: string): Promise<LLMModelInfo[]> {
    if (!apiKey) {
      const provider = PROVIDERS['xai'];
      if (!provider) {
        throw new Error('xAI provider not found');
      }
      return provider.defaultModels.map(model => ({
        id: model,
        name: model,
        provider: 'xai',
        contextLength: 131072,
        capabilities: ['text-generation']
      }));
    }

    try {
      const response = await fetch('https://api.x.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.data.map((model: any) => ({
        id: model.id,
        name: model.id,
        provider: 'xai',
        contextLength: model.context_length || 131072,
        capabilities: ['text-generation']
      }));
    } catch (error) {
      console.error('xAI model fetch error:', error);
      return this.getAvailableModels(); // Return defaults on error
    }
  }

  async makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse> {
    const apiKey = request.metadata?.['apiKey'];
    if (!apiKey) {
      throw { message: 'xAI API key is required', code: 'missing_api_key', status: 401 };
    }

    const messages = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    messages.push({ role: 'user', content: request.prompt });

    const requestBody = {
      model: request.model,
      messages,
      max_tokens: request.maxTokens || options?.maxTokens || 1000,
      temperature: request.temperature ?? options?.temperature ?? 0.7,
      stream: request.stream || options?.stream || false,
      ...(options?.topP && { top_p: options.topP }),
      ...(options?.stopSequences && { stop: options.stopSequences })
    };

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw { 
        message: `xAI API error: ${errorData.error?.message || response.statusText}`, 
        code: errorData.error?.code || 'api_error', 
        status: response.status 
      };
    }

    const data = await response.json() as any;
    
    const choice = data.choices?.[0];
    const usage = data.usage;

    if (!choice) {
      throw { 
        message: 'xAI API returned no choices', 
        code: 'no_choices', 
        status: 500 
      };
    }

    const content = choice.message?.content;
    if (!content) {
      throw { 
        message: 'xAI API returned no content', 
        code: 'no_content', 
        status: 500 
      };
    }

    return {
      content: content,
      usage: {
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0,
        totalTokens: usage?.total_tokens || 0
      },
      model: data.model,
      provider: 'xai',
      finishReason: choice.finish_reason
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.x.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getDefaultModel(): string {
    return 'grok-3-beta';
  }
}

// Ollama Provider Handler
class OllamaHandler implements LLMProviderHandler {
  private getOllamaBaseUrl(): string {
    // Use default Ollama URL - environment variables may not be available in all contexts
    return 'http://127.0.0.1:11434';
  }

  async getAvailableModels(_apiKey?: string): Promise<LLMModelInfo[]> {
    try {
      // Use fallback for Ollama base URL
      const baseUrl = this.getOllamaBaseUrl();
      const response = await fetch(`${baseUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.models.map((model: any) => ({
        id: model.name,
        name: model.name,
        provider: 'ollama',
        contextLength: model.size || 4096,
        capabilities: ['text-generation']
      }));
    } catch (error) {
      console.error('Ollama model fetch error:', error);
      return [];
    }
  }

  async makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse> {
    const baseUrl = this.getOllamaBaseUrl();
    
    const requestBody = {
      model: request.model,
      prompt: request.systemPrompt ? `${request.systemPrompt}\n\n${request.prompt}` : request.prompt,
      stream: false,
      options: {
        temperature: request.temperature ?? options?.temperature ?? 0.7,
        num_predict: request.maxTokens || options?.maxTokens || 1000,
        ...(options?.topP && { top_p: options.topP }),
        ...(options?.topK && { top_k: options.topK }),
        ...(options?.stopSequences && { stop: options.stopSequences })
      }
    };

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw { 
        message: `Ollama API error: ${response.status}`, 
        code: 'api_error', 
        status: response.status 
      };
    }

    const data = await response.json() as any;

    return {
      content: data.response,
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      },
      model: data.model,
      provider: 'ollama',
      finishReason: data.done ? 'stop' : 'length'
    };
  }

  async validateApiKey(_apiKey: string): Promise<boolean> {
    // Ollama doesn't require API keys
    return true;
  }

  getDefaultModel(): string {
    return 'llama2';
  }
}

// Main LLM Adapter Service
export class LLMAdapter {
  private handlers: Record<string, LLMProviderHandler> = {
    openai: new OpenAIHandler(),
    anthropic: new AnthropicHandler(),
    google: new GoogleHandler(),
    xai: new XAIHandler(),
    ollama: new OllamaHandler()
  };

  /**
   * Get available models for a provider
   */
  async getAvailableModels(provider: string, apiKey?: string): Promise<LLMModelInfo[]> {
    const handler = this.handlers[provider];
    if (!handler) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return await handler.getAvailableModels(apiKey);
  }

  /**
   * Make a request to an LLM provider
   */
  async makeRequest(request: AIRequest, options?: LLMRequestOptions): Promise<AIResponse> {
    const handler = this.handlers[request.provider];
    if (!handler) {
      throw new Error(`Unsupported provider: ${request.provider}`);
    }

    return await handler.makeRequest(request, options);
  }

  /**
   * Validate API key for a provider
   */
  async validateApiKey(provider: string, apiKey: string): Promise<boolean> {
    const handler = this.handlers[provider];
    if (!handler) {
      return false;
    }

    return await handler.validateApiKey(apiKey);
  }

  /**
   * Get all supported providers
   */
  getProviders(): LLMProvider[] {
    return Object.values(PROVIDERS);
  }

  /**
   * Get provider info
   */
  getProvider(providerId: string): LLMProvider | undefined {
    return PROVIDERS[providerId];
  }

  /**
   * Test connection to a provider
   */
  async testConnection(provider: string, apiKey?: string): Promise<boolean> {
    try {
      const handler = this.handlers[provider];
      if (!handler) {
        return false;
      }

      if (provider === 'ollama') {
        // For Ollama, test by trying to get models
        const models = await handler.getAvailableModels();
        return models.length > 0;
      }

      if (!apiKey) {
        return false;
      }

      return await handler.validateApiKey(apiKey);
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const llmAdapter = new LLMAdapter();
export default llmAdapter; 