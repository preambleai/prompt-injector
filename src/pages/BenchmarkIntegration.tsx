import React, { useState, useEffect } from 'react'
import { 
  Target, 
  Shield, 
  Zap, 
  Brain, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Share2,
  Eye,
  EyeOff,
  Cpu,
  Users,
  Activity,
  TrendingUp,
  GitBranch,
  Globe,
  BookOpen,
  GraduationCap,
  TestTube,
  Award,
  FileText,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { AIModel } from '../types'
import { BenchmarkManager, ResearchIntegration, AcademicBenchmarkResult } from '../services/benchmark-integration'
import { loadModels } from '../services/model-manager'

const BenchmarkIntegration: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [benchmarkResults, setBenchmarkResults] = useState<AcademicBenchmarkResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>([])

  const benchmarkManager = new BenchmarkManager()
  const researchIntegration = new ResearchIntegration()

  const availableBenchmarks = [
    {
      id: 'agentdojo',
      name: 'AgentDojo',
      description: 'Prompt injection success testing in agent-based systems',
      icon: <Cpu className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
      metrics: ['Success Rate', 'False Positive Rate', 'Agent Impact Score']
    },
    {
      id: 'advbench',
      name: 'AdvBench',
      description: 'Universal attacks and adversarial examples',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
      metrics: ['Universal Attack Success', 'Adversarial Robustness', 'Transfer Rate']
    },
    {
      id: 'injectagent',
      name: 'INJECAGENT',
      description: '98% recall target with <4% false positives',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
      metrics: ['Recall', 'Precision', 'F1 Score', 'False Positive Rate']
    },
    {
      id: 'usenix-2024',
      name: 'USENIX Security 2024',
      description: 'Formal prompt injection attack and defense evaluation',
      icon: <Award className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
      metrics: ['Attack Success Rate', 'Defense Effectiveness', 'Performance Impact']
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const modelsData = await loadModels()
      setModels(modelsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
    setIsLoading(false)
  }

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const handleBenchmarkToggle = (benchmarkId: string) => {
    setSelectedBenchmarks(prev => 
      prev.includes(benchmarkId) 
        ? prev.filter(id => id !== benchmarkId)
        : [...prev, benchmarkId]
    )
  }

  const handleSelectAllModels = () => {
    if (models && Array.isArray(models)) {
      setSelectedModels(models.filter(m => m.enabled).map(m => m.id))
    }
  }

  const handleSelectAllBenchmarks = () => {
    setSelectedBenchmarks(availableBenchmarks.map(b => b.id))
  }

  const handleClearAll = () => {
    setSelectedModels([])
    setSelectedBenchmarks([])
  }

  const runBenchmarks = async () => {
    if (selectedModels.length === 0 || selectedBenchmarks.length === 0) {
      alert('Please select at least one model and one benchmark')
      return
    }

    setIsRunning(true)
    setBenchmarkResults([])

    try {
      const selectedModelsData = models && Array.isArray(models) ? models.filter(m => selectedModels.includes(m.id)) : []
      
      if (selectedBenchmarks.includes('all')) {
        const results = await benchmarkManager.runAllBenchmarks(selectedModelsData)
        setBenchmarkResults(results)
      } else {
        const allResults: AcademicBenchmarkResult[] = []
        for (const benchmarkId of selectedBenchmarks) {
          const results = await benchmarkManager.runSpecificBenchmark(benchmarkId, selectedModelsData)
          allResults.push(...results)
        }
        setBenchmarkResults(allResults)
      }
    } catch (error) {
      console.error('Failed to run benchmarks:', error)
    }

    setIsRunning(false)
  }

  const getBenchmarkSummary = () => {
    const summary = benchmarkManager.getBenchmarkSummary()
    return summary
  }

  const exportResults = (format: 'json' | 'csv' | 'pdf') => {
    const data = benchmarkManager.exportResults(format)
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `benchmark-results.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'partial': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      case 'partial': return <Clock className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Academic Benchmark Integration</h1>
        <p className="text-gray-600">
          Validate your AI security testing against industry-standard academic benchmarks
        </p>
      </div>

      {/* Benchmark Selection */}
      <div className="card p-6 mb-6">
        <h2 className="heading-2 mb-4">Available Benchmarks</h2>
        <p className="text-gray-600 mb-6">
          Select the academic benchmarks you want to run against your models
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {availableBenchmarks.map((benchmark) => (
            <div
              key={benchmark.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedBenchmarks.includes(benchmark.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBenchmarkToggle(benchmark.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${benchmark.color}`}>
                  {benchmark.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{benchmark.name}</h3>
                  <p className="text-sm text-gray-600">{benchmark.description}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                {benchmark.metrics.map((metric, index) => (
                  <div key={index} className="text-xs text-gray-500 flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSelectAllBenchmarks}
            className="btn-secondary"
          >
            Select All Benchmarks
          </button>
          <button
            onClick={handleClearAll}
            className="btn-secondary"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="card p-6 mb-6">
        <h2 className="heading-2 mb-4">Target Models</h2>
        <p className="text-gray-600 mb-6">
          Choose the AI models to test against the selected benchmarks
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <Activity className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
              <p className="text-gray-500">Loading models...</p>
            </div>
          ) : models.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No models available</p>
            </div>
          ) : (
            models.map((model) => (
            <div
              key={model.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedModels.includes(model.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleModelToggle(model.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
                <div className={`w-3 h-3 rounded-full ${
                  model.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{model.provider}</p>
              <p className="text-xs text-gray-500">{model.model}</p>
            </div>
          ))
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSelectAllModels}
            className="btn-secondary"
          >
            Select All Models
          </button>
          <button
            onClick={handleClearAll}
            className="btn-secondary"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Benchmark Execution */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-2">Benchmark Execution</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => exportResults('json')}
              className="btn-secondary"
              disabled={benchmarkResults.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </button>
            <button
              onClick={() => exportResults('csv')}
              className="btn-secondary"
              disabled={benchmarkResults.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={runBenchmarks}
            disabled={isRunning || selectedModels.length === 0 || selectedBenchmarks.length === 0}
            className="btn-primary"
          >
            {isRunning ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Running Benchmarks...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Selected Benchmarks
              </>
            )}
          </button>
          

        </div>

        {/* Benchmark Summary */}
        {benchmarkResults.length > 0 && (
          <div className="mb-6">
            <h3 className="heading-3 mb-4">Benchmark Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(getBenchmarkSummary()).map(([name, summary]) => (
                <div key={name} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 capitalize">{name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Tests:</span>
                      <span className="font-medium">{summary.total_tests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Passed:</span>
                      <span className="text-green-600 font-medium">{summary.passed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Failed:</span>
                      <span className="text-red-600 font-medium">{summary.failed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Partial:</span>
                      <span className="text-yellow-600 font-medium">{summary.partial}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benchmark Results */}
        {benchmarkResults.length > 0 && (
          <div>
            <h3 className="heading-3 mb-4">Detailed Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Benchmark</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Model</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Metrics</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkResults.map((result) => (
                    <tr key={result.benchmarkId} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{result.benchmarkName}</div>
                          <div className="text-sm text-gray-500">{result.benchmarkId}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{result.modelName}</div>
                          <div className="text-sm text-gray-500">{result.modelId}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {getStatusIcon(result.status)}
                          <span className="ml-1 capitalize">{result.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {Object.entries(result.metrics).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-gray-600">{key.replace(/_/g, ' ')}:</span>
                              <span className="ml-2 font-medium">{(value * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>


    </div>
  )
}

export default BenchmarkIntegration 