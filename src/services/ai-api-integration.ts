// Universal AI API Integration Service
// Uses the new LLM adapter for all provider communication

import { llmAdapter, LLMModelInfo } from './llm-adapter';
import { AIRequest, AIResponse, AIError, AIModel } from '../types';

export interface AIIntegrationService {
  getAvailableModels(provider: string, apiKey?: string): Promise<AIModel[]>;
  makeRequest(request: AIRequest): Promise<AIResponse>;
  testConnection(provider: string, apiKey?: string): Promise<boolean>;
  validateApiKey(provider: string, apiKey: string): Promise<boolean>;
  getProviders(): any[];
  testOllamaConnection(): Promise<boolean>;
}

class AIIntegrationServiceImpl implements AIIntegrationService {
  /**
   * Test Ollama connection specifically
   */
  async testOllamaConnection(): Promise<boolean> {
    try {
      return await llmAdapter.testConnection('ollama');
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models for a provider
   */
  async getAvailableModels(provider: string, apiKey?: string): Promise<AIModel[]> {
    try {
      const llmModels = await llmAdapter.getAvailableModels(provider, apiKey);
      
      // Convert LLMModelInfo to AIModel for compatibility
      return llmModels.map((model: LLMModelInfo) => ({
        id: model.id,
              name: model.name,
        provider: model.provider,
        endpoint: this.getEndpointForProvider(model.provider),
        model: model.id,
        enabled: false, // Models are disabled by default
        apiKey: '' // API key will be set separately
      }));
    } catch (error) {
      console.error(`Error getting models for ${provider}:`, error);
      return [];
    }
  }

  /**
   * Get the appropriate endpoint for a provider
   */
  private getEndpointForProvider(provider: string): string {
    const providerInfo = llmAdapter.getProvider(provider);
    return providerInfo?.baseUrl || '';
  }

  /**
   * Make a request to an AI provider
   */
  async makeRequest(request: AIRequest): Promise<AIResponse> {
    try {
      return await llmAdapter.makeRequest(request);
    } catch (error: any) {
      throw {
        message: error?.message || 'AI request failed',
        code: error?.code || 'ai_request_failed',
        status: error?.status || 500
      } as AIError;
    }
  }

  /**
   * Test connection to a provider
   */
  async testConnection(provider: string, apiKey?: string): Promise<boolean> {
    try {
      return await llmAdapter.testConnection(provider, apiKey);
    } catch (error) {
      console.error(`Connection test failed for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Validate API key for a provider
   */
  async validateApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      return await llmAdapter.validateApiKey(provider, apiKey);
    } catch (error) {
      console.error(`API key validation failed for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Get all supported providers
   */
  getProviders(): any[] {
    return llmAdapter.getProviders();
  }
}

// Export singleton instance
const aiAPIIntegration = new AIIntegrationServiceImpl();
export default aiAPIIntegration;