/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Target, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Share2,
  Server,
  Network,
  Bot,
  HelpCircle,
  ArrowLeft,
  Building,
  ShoppingCart,
  Heart,
  Code,
  BarChart3,
  Workflow,
  MessageSquare,
  DollarSign
} from 'lucide-react'
import { AttackPayload, AIModel, TestResult } from '../types'
import { loadAttackPayloads, executeTestSuite } from '../services/attack-engine'
import { loadModels, testModelConnection } from '../services/model-manager'

interface BusinessContext {
  id: string;
  name: string;
  category: 'customer-facing' | 'internal-business' | 'industry-specific';
  description: string;
  icon: React.ComponentType<any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  compliance: string[];
  color: string;
}

interface TechnicalArchitecture {
  id: string;
  name: string;
  type: 'mcp-server' | 'llm' | 'ai-agent' | 'multi-agent-system';
  description: string;
  icon: React.ComponentType<any>;
  capabilities: string[];
  color: string;
  businessContexts: string[];
}

const businessContexts: BusinessContext[] = [
  {
    id: 'customer-service',
    name: 'Customer Service & Support',
    category: 'customer-facing',
    description: 'Chatbots, help desks, ticket routing, and customer support systems',
    icon: MessageSquare,
    riskLevel: 'high',
    compliance: ['GDPR', 'CCPA', 'PCI-DSS'],
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    category: 'customer-facing',
    description: 'Shopping assistants, product recommendations, and retail automation',
    icon: ShoppingCart,
    riskLevel: 'high',
    compliance: ['PCI-DSS', 'GDPR', 'CCPA'],
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'code-generation',
    name: 'Code Generation & Development',
    category: 'internal-business',
    description: 'AI-powered coding assistants, code review, and development tools',
    icon: Code,
    riskLevel: 'critical',
    compliance: ['SOC2', 'ISO27001', 'FedRAMP'],
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis & Reporting',
    category: 'internal-business',
    description: 'Business intelligence, financial analysis, and reporting systems',
    icon: BarChart3,
    riskLevel: 'high',
    compliance: ['SOX', 'GDPR', 'HIPAA'],
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    id: 'process-automation',
    name: 'Process Automation',
    category: 'internal-business',
    description: 'Workflow automation, task delegation, and business process optimization',
    icon: Workflow,
    riskLevel: 'medium',
    compliance: ['SOX', 'Internal Controls'],
    color: 'bg-red-100 text-red-600 border-red-200'
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    category: 'industry-specific',
    description: 'Trading algorithms, fraud detection, and financial decision support',
    icon: DollarSign,
    riskLevel: 'critical',
    compliance: ['SOX', 'GLBA', 'Basel III', 'Financial Regulations'],
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'industry-specific',
    description: 'Medical diagnosis, patient care, and healthcare administration',
    icon: Heart,
    riskLevel: 'critical',
    compliance: ['HIPAA', 'HITECH', 'FDA Regulations'],
    color: 'bg-pink-100 text-pink-600 border-pink-200'
  },
  {
    id: 'critical-infrastructure',
    name: 'Critical Infrastructure',
    category: 'industry-specific',
    description: 'SCADA systems, industrial control, and infrastructure management',
    icon: Building,
    riskLevel: 'critical',
    compliance: ['NERC CIP', 'Government Standards', 'Industry Regulations'],
    color: 'bg-gray-100 text-gray-600 border-gray-200'
  }
]

const technicalArchitectures: TechnicalArchitecture[] = [
  {
    id: 'mcp-server',
    name: 'MCP Server',
    type: 'mcp-server',
    description: 'Model Context Protocol servers and infrastructure',
    icon: Server,
    color: 'bg-green-100 text-green-600 border-green-200',
    capabilities: ['Protocol Vulnerabilities', 'Tool Chain Attacks', 'Authentication Bypass', 'Data Injection'],
    businessContexts: ['code-generation', 'data-analysis', 'process-automation', 'financial-services', 'healthcare']
  },
  {
    id: 'llm',
    name: 'Language Model (LLM)',
    type: 'llm',
    description: 'Individual language models and foundation models',
    icon: Brain,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    capabilities: ['Prompt Injection', 'Role Confusion', 'Jailbreak Attacks', 'Output Manipulation'],
    businessContexts: ['customer-service', 'ecommerce', 'code-generation', 'data-analysis', 'process-automation', 'financial-services', 'healthcare', 'critical-infrastructure']
  },
  {
    id: 'ai-agent',
    name: 'AI Agent',
    type: 'ai-agent',
    description: 'Single-agent applications and autonomous systems',
    icon: Bot,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    capabilities: ['Task Manipulation', 'Workflow Hijacking', 'Memory Injection', 'Tool Abuse'],
    businessContexts: ['customer-service', 'ecommerce', 'code-generation', 'data-analysis', 'process-automation', 'financial-services', 'healthcare', 'critical-infrastructure']
  },
  {
    id: 'multi-agent-system',
    name: 'Multi-Agent System',
    type: 'multi-agent-system',
    description: 'Complex multi-agent workflows and agent networks',
    icon: Network,
    color: 'bg-orange-100 text-orange-600 border-orange-200',
    capabilities: ['Agent Communication', 'Cross-Agent Attacks', 'System Compromise', 'Data Exfiltration'],
    businessContexts: ['process-automation', 'financial-services', 'healthcare', 'critical-infrastructure']
  }
]

const Testing: React.FC = () => {
  // Core state
  const [currentStep, setCurrentStep] = useState<'business-context' | 'technical-architecture' | 'config' | 'execution' | 'results'>('business-context')
  const [selectedBusinessContext, setSelectedBusinessContext] = useState<BusinessContext | null>(null)
  const [selectedTechnicalArchitecture, setSelectedTechnicalArchitecture] = useState<TechnicalArchitecture | null>(null)
  
  // Data state
  const [payloads, setPayloads] = useState<AttackPayload[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedPayloads, setSelectedPayloads] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [payloadsData, modelsData] = await Promise.all([
        loadAttackPayloads(),
        Promise.resolve(loadModels())
      ])
      setPayloads(payloadsData)
      setModels(modelsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleBusinessContextSelect = (context: BusinessContext) => {
    setSelectedBusinessContext(context)
    setCurrentStep('technical-architecture')
  }

  const handleTechnicalArchitectureSelect = (architecture: TechnicalArchitecture) => {
    setSelectedTechnicalArchitecture(architecture)
    setCurrentStep('config')
  }

  const handlePayloadToggle = (payloadId: string) => {
    setSelectedPayloads(prev => 
      prev.includes(payloadId) 
        ? prev.filter(id => id !== payloadId)
        : [...prev, payloadId]
    )
  }

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const runTests = async () => {
    if (!selectedBusinessContext || !selectedTechnicalArchitecture) {
      alert('Please select both business context and technical architecture')
      return
    }

    // Check for missing API keys
    const selectedModelsData = models.filter(m => selectedModels.includes(m.id))
    const missingApiKey = selectedModelsData.some(m => !m.apiKey || m.apiKey === '')
    if (missingApiKey) {
      alert('Please enter a valid API key for all selected models to begin real testing.')
      return
    }

    setIsRunning(true)
    setResults([])
    setCurrentStep('execution')
    setProgress(0)

    try {
      let testResults: TestResult[] = []

      if (selectedTechnicalArchitecture.type === 'llm') {
        // LLM testing logic
        if (selectedPayloads.length === 0 || selectedModels.length === 0) {
          alert('Please select at least one payload and one model')
          return
        }
        
        const selectedPayloadsData = payloads.filter(p => selectedPayloads.includes(p.id))
        
        testResults = await executeTestSuite(selectedModelsData, selectedPayloadsData, {
          selectedModels: selectedModels,
          selectedPayloads: selectedPayloads,
          maxConcurrent: 5,
          timeout: 30000
        })
      } else {
        // For other architectures, create mock results for now
        testResults = [
          {
            id: '1',
            payload: payloads[0] || { id: '1', name: 'Test Payload', category: 'test', severity: 'MEDIUM' },
            model: models[0] || { id: '1', name: 'Test Model', provider: 'test', model: 'test', enabled: true },
            vulnerability: false,
            executionTime: 1000,
            timestamp: new Date().toISOString(),
            response: 'Mock response for testing',
            confidence: 0.95,
            detectionMethod: 'mock',
            duration: 1000,
            success: true
          }
        ]
      }

      setResults(testResults)
      setCurrentStep('results')
    } catch (error) {
      console.error('Failed to run tests:', error)
    }

    setIsRunning(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vulnerable': return 'text-red-600 bg-red-50'
      case 'secure': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vulnerable': return <AlertTriangle className="h-4 w-4" />
      case 'secure': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const renderBusinessContextSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Business Context</h2>
        <p className="text-gray-600">Choose the type of business application you're testing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessContexts.map((context) => (
          <div
            key={context.id}
            onClick={() => handleBusinessContextSelect(context)}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${context.color}`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <context.icon className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">{context.name}</h3>
                <p className="text-sm opacity-80">{context.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  context.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                  context.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {context.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Compliance: {context.compliance.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTechnicalArchitectureSelection = () => {
    if (!selectedBusinessContext) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setCurrentStep('business-context')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Technical Architecture</h2>
            <p className="text-gray-600">Choose the technical architecture for {selectedBusinessContext.name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technicalArchitectures.map((architecture) => (
            <div
              key={architecture.id}
              onClick={() => handleTechnicalArchitectureSelect(architecture)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${architecture.color}`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <architecture.icon className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">{architecture.name}</h3>
                  <p className="text-sm opacity-80">{architecture.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Testing Capabilities:</h4>
                <ul className="text-sm space-y-1">
                  {architecture.capabilities.map((capability, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderConfiguration = () => {
    if (!selectedBusinessContext || !selectedTechnicalArchitecture) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setCurrentStep('technical-architecture')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Configure Testing for {selectedBusinessContext.name} - {selectedTechnicalArchitecture.name}
            </h2>
            <p className="text-gray-600">Set up your testing parameters and targets</p>
          </div>
        </div>

        {/* Business Context Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Business Context</h3>
          <div className="flex items-center space-x-3">
            <selectedBusinessContext.icon className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">{selectedBusinessContext.name}</div>
              <div className="text-sm text-blue-700">{selectedBusinessContext.description}</div>
              <div className="text-xs text-blue-600 mt-1">
                Risk Level: {selectedBusinessContext.riskLevel.toUpperCase()} | 
                Compliance: {selectedBusinessContext.compliance.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Technical Architecture</h3>
          <div className="flex items-center space-x-3">
            <selectedTechnicalArchitecture.icon className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">{selectedTechnicalArchitecture.name}</div>
              <div className="text-sm text-gray-700">{selectedTechnicalArchitecture.description}</div>
            </div>
          </div>
        </div>

        {/* Configuration based on technical architecture */}
        {selectedTechnicalArchitecture.type === 'llm' && (
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">AI Models</h3>
              <div className="space-y-3">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={() => handleModelToggle(model.id)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.provider} - {model.model}</div>
                    </div>
                    <button
                      onClick={() => testModelConnection(model)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      Test
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payload Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Attack Payloads</h3>
              <div className="space-y-3">
                {payloads.map((payload) => (
                  <div key={payload.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPayloads.includes(payload.id)}
                      onChange={() => handlePayloadToggle(payload.id)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{payload.name}</div>
                      <div className="text-sm text-gray-500">{payload.category} - {payload.severity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setCurrentStep('technical-architecture')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={runTests}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Run Tests</span>
          </button>
        </div>
      </div>
    )
  }

  const renderExecution = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Running Tests</h2>
        <p className="text-gray-600">
          Executing security tests for {selectedBusinessContext?.name} using {selectedTechnicalArchitecture?.name}
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            {isRunning ? 'Running security tests...' : 'Tests completed'}
          </div>
        </div>
      </div>
    </div>
  )

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
          <p className="text-gray-600">
            Results for {selectedBusinessContext?.name} - {selectedTechnicalArchitecture?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{results.length}</div>
              <div className="text-sm text-blue-600">Total Tests</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => r.vulnerability).length}
              </div>
              <div className="text-sm text-red-600">Vulnerabilities</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => !r.vulnerability).length}
              </div>
              <div className="text-sm text-green-600">Secure</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {Math.round(results.reduce((acc, r) => acc + (r.executionTime || 0), 0) / 1000)}s
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Test</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Model</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{result.payload.name}</div>
                    <div className="text-sm text-gray-500">{result.payload.category}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{result.model.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.vulnerability ? 'vulnerable' : 'secure')}`}>
                      {getStatusIcon(result.vulnerability ? 'vulnerable' : 'secure')}
                      <span className="ml-1">{result.vulnerability ? 'Vulnerable' : 'Secure'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {Math.round((result.executionTime || 0) / 1000)}s
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">AI Security Testing</h1>
        <p className="text-gray-600">
          Comprehensive security testing for AI systems with business context awareness
        </p>
      </div>

      <div className="card">
        {currentStep === 'business-context' && renderBusinessContextSelection()}
        {currentStep === 'technical-architecture' && renderTechnicalArchitectureSelection()}
        {currentStep === 'config' && renderConfiguration()}
        {currentStep === 'execution' && renderExecution()}
        {currentStep === 'results' && renderResults()}
      </div>
    </div>
  )
}

export default Testing 