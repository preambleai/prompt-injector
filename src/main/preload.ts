import { contextBridge, ipcRenderer } from 'electron'

// Types for the exposed APIs
export interface AttackPayload {
  id: string
  name: string
  description: string
  payload: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
}

export interface AIModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'azure'
  model: string
  apiKey?: string
  endpoint?: string
}

export interface AttackResult {
  payloadId: string
  payload: string
  success: boolean
  response?: string
  error?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
}

export interface AttackTest {
  id: string
  name: string
  description: string
  targetModel: AIModelConfig
  payloads: string[]
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  results: AttackResult[]
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Payload methods
  getPayloads: (category?: string) => ipcRenderer.invoke('get-payloads', category),
  getPayload: (id: string) => ipcRenderer.invoke('get-payload', id),
  
  // Test methods
  createTest: (testName: string, description: string, targetModel: AIModelConfig, selectedPayloads: string[]) => 
    ipcRenderer.invoke('create-test', testName, description, targetModel, selectedPayloads),
  runTest: (testId: string) => ipcRenderer.invoke('run-test', testId),
  getTest: (testId: string) => ipcRenderer.invoke('get-test', testId),
  getTestResults: () => ipcRenderer.invoke('get-test-results'),
  getTests: () => ipcRenderer.invoke('get-test-results'), // Alias for compatibility
  deleteTest: (testId: string) => ipcRenderer.invoke('delete-test', testId),
  
  // Event listeners
  onTestCreated: (callback: (test: AttackTest) => void) => {
    ipcRenderer.on('test-created', (_event, test) => callback(test))
  },
  onTestStarted: (callback: (test: AttackTest) => void) => {
    ipcRenderer.on('test-started', (_event, test) => callback(test))
  },
  onTestCompleted: (callback: (test: AttackTest) => void) => {
    ipcRenderer.on('test-completed', (_event, test) => callback(test))
  },
  onTestFailed: (callback: (data: { testId: string; error: any }) => void) => {
    ipcRenderer.on('test-failed', (_event, data) => callback(data))
  },
  onTestProgress: (callback: (data: { testId: string; result: AttackResult }) => void) => {
    ipcRenderer.on('test-progress', (_event, data) => callback(data))
  },
  onAttackCompleted: (callback: (result: AttackResult) => void) => {
    ipcRenderer.on('attack-completed', (_event, result) => callback(result))
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
  
  // LLM API
  llmRequest: (request: any) => ipcRenderer.invoke('llm-request', request),
  makeAIRequest: (request: any) => ipcRenderer.invoke('make-ai-request', request),
  getAvailableModels: (provider: string, apiKey?: string) => ipcRenderer.invoke('get-available-models', provider, apiKey),
  testOllamaConnection: () => ipcRenderer.invoke('test-ollama-connection'),
  executeTest: (model: any, payload: any) => ipcRenderer.invoke('execute-test', model, payload),
  executeTestSuite: (models: any, payloads: any, config: any) => ipcRenderer.invoke('execute-test-suite', models, payloads, config),
  loadAttackPayloads: () => ipcRenderer.invoke('load-attack-payloads'),
  testModelConnection: (model: any) => ipcRenderer.invoke('test-model-connection', model),
  executeRedTeamAttack: (model: any, attack: any) => ipcRenderer.invoke('execute-red-team-attack', model, attack),
  executeBenchmarkTest: (model: any, benchmark: any, payload: any) => ipcRenderer.invoke('execute-benchmark-test', model, benchmark, payload),
})

// Type declaration for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getPayloads: (category?: string) => Promise<AttackPayload[]>
      getPayload: (id: string) => Promise<AttackPayload | null>
      createTest: (testName: string, description: string, targetModel: AIModelConfig, selectedPayloads: string[]) => Promise<string>
      runTest: (testId: string) => Promise<void>
      getTest: (testId: string) => Promise<AttackTest | null>
      getTestResults: () => Promise<AttackResult[]>
      getTests: () => Promise<AttackTest[]>
      deleteTest: (testId: string) => Promise<void>
      onTestCreated: (callback: (test: AttackTest) => void) => void
      onTestStarted: (callback: (test: AttackTest) => void) => void
      onTestCompleted: (callback: (test: AttackTest) => void) => void
      onTestFailed: (callback: (data: { testId: string; error: any }) => void) => void
      onTestProgress: (callback: (data: { testId: string; result: AttackResult }) => void) => void
      onAttackCompleted: (callback: (result: AttackResult) => void) => void
      removeAllListeners: (channel: string) => void
      llmRequest: (request: any) => Promise<any>
      makeAIRequest: (request: any) => Promise<any>
      getAvailableModels: (provider: string, apiKey?: string) => Promise<any>
      testOllamaConnection: () => Promise<boolean>
      executeTest: (model: any, payload: any) => Promise<any>
      executeTestSuite: (models: any, payloads: any, config: any) => Promise<any>
      loadAttackPayloads: () => Promise<any>
      testModelConnection: (model: any) => Promise<any>
      executeRedTeamAttack: (model: any, attack: any) => Promise<any>
      executeBenchmarkTest: (model: any, benchmark: any, payload: any) => Promise<any>
    }
  }
} 