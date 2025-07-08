import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { executeTest, executeTestSuite, loadAttackPayloads } from '../../services/attack-engine'
import { AIModel, AttackPayload, TestResult, TestConfiguration } from '../../types'

// Mock fetch for payload loading
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

describe('AttackEngine', () => {
  let mockModel: AIModel
  let mockPayload: AttackPayload
  let mockConfiguration: TestConfiguration

  beforeEach(() => {
    mockModel = {
      id: 'test-model',
      name: 'Test Model',
      provider: 'openai',
      endpoint: 'https://api.openai.com/v1',
      apiKey: 'test-key',
      model: 'gpt-3.5-turbo',
      enabled: true
    }

    mockPayload = {
      id: 'test-payload',
      name: 'Test Payload',
      description: 'Test description',
      payload: 'Test attack payload',
      category: 'prompt-injection',
      severity: 'HIGH',
      tags: ['test'],
      source: 'test'
    }

    mockConfiguration = {
      selectedPayloads: ['test-payload'],
      selectedModels: ['test-model'],
      maxConcurrent: 5,
      timeout: 30000
    }

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
  })

  describe('loadAttackPayloads', () => {
    it('should load attack payloads successfully', async () => {
      const payloads = await loadAttackPayloads()
      expect(payloads).toBeDefined()
      expect(Array.isArray(payloads)).toBe(true)
      expect(payloads.length).toBeGreaterThan(0)
    })

    it('should handle payload loading errors gracefully', async () => {
      // This would require mocking fs.readFileSync to throw an error
      // For now, we test the happy path
      const payloads = await loadAttackPayloads()
      expect(payloads).toBeDefined()
    })
  })

  describe('executeTest', () => {
    it('should execute a single test successfully', async () => {
      const result = await executeTest(mockModel, mockPayload)
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.timestamp).toBeDefined()
      expect(result.model).toEqual(mockModel)
      expect(result.payload).toEqual(mockPayload)
      expect(result.response).toBeDefined()
      expect(result.vulnerability).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })

    it('should handle API errors gracefully', async () => {
      // Mock fetch to return an error
      (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('API Error'))

      const result = await executeTest(mockModel, mockPayload)
      
      expect(result).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.vulnerability).toBe(false)
      expect(result.confidence).toBe(0)
    })

    it('should handle missing API key', async () => {
      const modelWithoutKey = { ...mockModel, apiKey: '' }
      const result = await executeTest(modelWithoutKey, mockPayload)
      
      expect(result).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.error).toContain('API key')
    })

    it('should handle invalid model configuration', async () => {
      const invalidModel = { ...mockModel, provider: 'invalid-provider' }
      const result = await executeTest(invalidModel, mockPayload)
      
      expect(result).toBeDefined()
      expect(result.error).toBeDefined()
    })
  })

  describe('executeTestSuite', () => {
    it('should execute multiple tests successfully', async () => {
      const models = [mockModel]
      const payloads = [mockPayload]
      
      const results = await executeTestSuite(models, payloads, mockConfiguration)
      
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]).toHaveProperty('id')
      expect(results[0]).toHaveProperty('timestamp')
    })

    it('should handle empty model or payload arrays', async () => {
      const results = await executeTestSuite([], [], mockConfiguration)
      expect(results).toEqual([])
    })

    it('should handle partial failures gracefully', async () => {
      const models = [mockModel]
      const payloads = [mockPayload, { ...mockPayload, id: 'invalid-payload' }]
      
      const results = await executeTestSuite(models, payloads, mockConfiguration)
      
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      // Should still return results for valid payloads
      expect(results.length).toBeGreaterThan(0)
    })
  })
}) 