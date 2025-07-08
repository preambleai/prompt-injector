import React, { useState, useEffect } from 'react'
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Brain,
  Settings,
  Zap,
  Download,
  RefreshCw,
  Trash2,
  Play
} from 'lucide-react'
import { aiAPIIntegration, AIModel } from '@/services/ai-api-integration'

// Type definitions
interface AIProviderConfig {
  id: string
  name: string
  baseUrl: string
  apiKey?: string
  enabled: boolean
  rateLimit?: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  timeout?: number
  retryAttempts?: number
}

interface OllamaModelBrowserProps {
  availableModels: string[]
  installedModels: string[]
  loadingAvailable: boolean
  onDownloadModel: (modelName: string) => Promise<void>
  onRefreshModels: () => void
}

interface AIProviderManagerProps {
  onProviderUpdate?: (status: { ollama: boolean }) => void
}

const AIProviderManager: React.FC<AIProviderManagerProps> = ({ onProviderUpdate }) => {
  const [ollamaStatus, setOllamaStatus] = useState<boolean>(false)
  const [testingOllama, setTestingOllama] = useState(false)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('phi4:latest')

  useEffect(() => {
    // Load selected model from localStorage if available
    const storedModel = localStorage.getItem('ollama-selected-model')
    if (storedModel) {
      setSelectedModel(storedModel)
    }
    checkOllamaStatus()
    loadAvailableModels()
  }, [])

  const checkOllamaStatus = async () => {
    try {
      const isAvailable = await aiAPIIntegration.testOllamaConnection()
      setOllamaStatus(isAvailable)
      onProviderUpdate?.({ ollama: isAvailable })
    } catch (error) {
      console.error('Error checking Ollama status:', error)
      setOllamaStatus(false)
      onProviderUpdate?.({ ollama: false })
    }
  }

  const loadAvailableModels = async () => {
    setLoadingModels(true)
    try {
      const models = await aiAPIIntegration.getAvailableModels('ollama')
      const modelNames = models.map((model: AIModel) => model.name)
      setAvailableModels(modelNames)
      
      // Set default model if available
      if (modelNames.length > 0) {
        const storedModel = localStorage.getItem('ollama-selected-model')
        const defaultModel = storedModel && modelNames.includes(storedModel)
          ? storedModel
          : (modelNames.find((name: string) => name.includes('phi4')) || modelNames[0])
        setSelectedModel(defaultModel)
      }
    } catch (error) {
      console.error('Error loading available models:', error)
      // Set fallback models
      setAvailableModels(['phi4:latest', 'phi4-mini:3.8b', 'qwen3:1.7b'])
    } finally {
      setLoadingModels(false)
    }
  }

  const testOllamaConnection = async () => {
    setTestingOllama(true)
    try {
      const isAvailable = await aiAPIIntegration.testOllamaConnection()
      setOllamaStatus(isAvailable)
      onProviderUpdate?.({ ollama: isAvailable })
      
      if (isAvailable) {
        // Test with a simple request
        const response = await aiAPIIntegration.makeRequest({
          provider: 'ollama',
          model: selectedModel,
          prompt: 'Hello, this is a test message.',
          maxTokens: 50,
          temperature: 0.7
        })
        
        console.log('Ollama test successful:', response.content)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Ollama test failed:', error)
      setOllamaStatus(false)
      onProviderUpdate?.({ ollama: false })
      return false
    } finally {
      setTestingOllama(false)
    }
  }

  const getStatusIcon = () => {
    if (testingOllama) {
      return <TestTube className="w-5 h-5 text-yellow-500 animate-pulse" />
    }
    if (ollamaStatus) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusText = () => {
    if (testingOllama) {
      return 'Testing connection...'
    }
    if (ollamaStatus) {
      return 'Connected'
    }
    return 'Not connected'
  }

  const getStatusColor = () => {
    if (testingOllama) {
      return 'text-yellow-600'
    }
    if (ollamaStatus) {
      return 'text-green-600'
    }
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Provider Configuration</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Ollama Configuration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <h4 className="font-medium text-gray-900">Ollama (Local AI)</h4>
              </div>
              <button
                onClick={testOllamaConnection}
                disabled={testingOllama}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <TestTube className="w-4 h-4" />
                <span>Test Connection</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base URL
                </label>
                <input
                  type="text"
                  value="http://localhost:11434"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value)
                    localStorage.setItem('ollama-selected-model', e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loadingModels}
                >
                  {loadingModels ? (
                    <option>Loading models...</option>
                  ) : (
                    availableModels.map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Status:</strong> {ollamaStatus ? 'Connected' : 'Not connected'}</p>
                <p><strong>Available Models:</strong> {availableModels.length}</p>
              </div>
            </div>
          </div>

          {/* Connection Instructions */}
          {!ollamaStatus && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Ollama Not Running</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    To use AI-powered features, please start Ollama:
                  </p>
                  <div className="mt-2 bg-yellow-100 p-2 rounded text-sm font-mono text-yellow-800">
                    ollama serve
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    Then install a model: <code className="bg-yellow-100 px-1 rounded">ollama pull phi4:latest</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Fallback Mode</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Even without Ollama, you can still create payloads using our built-in templates and encoding features.
                  AI generation will be disabled, but all other functionality remains available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIProviderManager 