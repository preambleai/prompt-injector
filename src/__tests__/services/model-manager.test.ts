import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { loadModels, saveModels, testModelConnection } from '../../services/model-manager'
import { AIModel } from '../../types'

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
})

describe('ModelManager', () => {
  let mockModels: AIModel[]

  beforeEach(() => {
    mockModels = [
      {
        id: 'openai-gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1',
        apiKey: 'test-key-1',
        model: 'gpt-4',
        enabled: true
      },
      {
        id: 'anthropic-claude-3',
        name: 'Claude 3',
        provider: 'anthropic',
        endpoint: 'https://api.anthropic.com/v1',
        apiKey: 'test-key-2',
        model: 'claude-3-sonnet-20240229',
        enabled: false
      }
    ]

    // Reset mocks
    jest.clearAllMocks()
  })

  describe('loadModels', () => {
    it('should load models from localStorage successfully', async () => {
      const mockStoredModels = JSON.stringify(mockModels)
      ;(localStorage.getItem as jest.Mock).mockReturnValue(mockStoredModels)

      const result = loadModels()

      expect(localStorage.getItem).toHaveBeenCalledWith('prompt-injector-models')
      expect(result).toEqual(mockModels)
    })

    it('should return default models when localStorage is empty', async () => {
      ;(localStorage.getItem as jest.Mock).mockReturnValue(null)

      const result = loadModels()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      // Should contain default models
      expect(result.some(model => model.provider === 'OpenAI')).toBe(true)
      expect(result.some(model => model.provider === 'Anthropic')).toBe(true)
    })

    it('should handle invalid JSON in localStorage', async () => {
      ;(localStorage.getItem as jest.Mock).mockReturnValue('invalid-json')

      const result = loadModels()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('saveModels', () => {
    it('should save models to localStorage successfully', async () => {
      saveModels(mockModels)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'prompt-injector-models',
        JSON.stringify(mockModels)
      )
    })

    it('should handle empty models array', async () => {
      saveModels([])

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'prompt-injector-models',
        JSON.stringify([])
      )
    })

    it('should handle models with sensitive data', async () => {
      const modelsWithSensitiveData = [
        {
          ...mockModels[0],
          apiKey: 'secret-api-key'
        }
      ]

      saveModels(modelsWithSensitiveData)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'prompt-injector-models',
        JSON.stringify(modelsWithSensitiveData)
      )
    })
  })

  describe('testModelConnection', () => {
    it('should handle missing API key', async () => {
      const modelWithoutKey = { ...mockModels[0], apiKey: '' }

      const result = await testModelConnection(modelWithoutKey)

      expect(result.success).toBe(false)
      expect(result.error).toContain('API key')
    })
  })
}) 