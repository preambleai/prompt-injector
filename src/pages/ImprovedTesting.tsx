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
  Settings, 
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
  Wand2,
  Server,
  Network,
  Bot,
  Database,
  ChevronRight,
  XCircle,
  Layers,
  Code,
  Wrench,
  Lock,
  Unlock,
  Key,
  FileText,
  Pause,
  Square,
  RotateCcw,
  Bug,
  Terminal,
  Monitor,
  Gauge,
  ActivitySquare,
  Workflow,
  MessageSquare,
  Users2,
  GitMerge,
  Cpu,
  Users,
  Activity,
  TrendingUp,
  GitBranch,
  Globe,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  Filter,
  Search,
  PieChart,
  BarChart,
  LineChart,
  ShoppingCart,
  Heart,
  Building
} from 'lucide-react'
import { AttackPayload, AIModel, TestResult, TestConfiguration } from '../types'
import { loadAttackPayloads, executeTestSuite } from '../services/attack-engine'
import { loadModels, saveModels, testModelConnection } from '../services/model-manager'
import { MCPTestingManager, MCPTestConfig, MCPTestResult } from '../services/mcp-testing'
import { AgentFrameworkTestingManager, AgentTestConfig, AgentTestResult } from '../services/agent-framework-testing'

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
  businessContexts: string[]; // Which business contexts this architecture supports
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

const ImprovedTesting: React.FC = () => {
  // Core state
  const [currentStep, setCurrentStep] = useState<'business-context' | 'technical-architecture' | 'config' | 'execution' | 'results'>('business-context')
  const [selectedBusinessContext, setSelectedBusinessContext] = useState<BusinessContext | null>(null)
  const [selectedTechnicalArchitecture, setSelectedTechnicalArchitecture] = useState<TechnicalArchitecture | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  
  // Data state
  const [payloads, setPayloads] = useState<AttackPayload[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedPayloads, setSelectedPayloads] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  
  // Execution state
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Configuration state
  const [configuration, setConfiguration] = useState<TestConfiguration>({
    selectedPayloads: [],
    selectedModels: [],
    maxConcurrent: 5,
    timeout: 30000
  })

  // MCP Testing state
  const [mcpManager] = useState(new MCPTestingManager())
  const [mcpTestConfig, setMcpTestConfig] = useState<MCPTestConfig>({
    enabled: true,
    testType: 'server',
    targetMCP: 'all',
    authentication: true,
    authorization: true,
    protocolVersion: '1.0.0',
    timeout: 30000
  })
  const [selectedMcpTestTypes, setSelectedMcpTestTypes] = useState<string[]>(['server'])

  // Agent Framework Testing state
  const [agentManager] = useState(new AgentFrameworkTestingManager())
  const [agentTestConfig, setAgentTestConfig] = useState<AgentTestConfig>({
    enabled: true,
    framework: 'langchain',
    instrumentation: true,
    realTimeMonitoring: true,
    toolCallMonitoring: true,
    midChainDetection: true,
    configurableActions: 'log',
    timeout: 30000
  })
  const [selectedAgentFrameworks, setSelectedAgentFrameworks] = useState<string[]>(['langchain'])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
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
    setIsLoading(false)
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

  const handleSelectAllPayloads = () => {
    setSelectedPayloads(payloads.map(p => p.id))
  }

  const handleSelectAllModels = () => {
    setSelectedModels(models.filter(m => m.enabled).map(m => m.id))
  }

  const handleClearAll = () => {
    setSelectedPayloads([])
    setSelectedModels([])
  }

  const runTests = async () => {
    if (!selectedBusinessContext || !selectedTechnicalArchitecture) {
      alert('Please select both business context and technical architecture')
      return
    }

    setIsRunning(true)
    setResults([])
    setCurrentStep('execution')
    setProgress(0)

    try {
      let testResults: TestResult[] = []

      switch (selectedTechnicalArchitecture.type) {
        case 'mcp-server':
          // MCP server testing logic
          const mcpResults = await mcpManager.runComprehensiveTest(mcpTestConfig)
          testResults.push(...mcpResults)
          break
          
        case 'llm':
          // LLM testing logic
          if (selectedPayloads.length === 0 || selectedModels.length === 0) {
            alert('Please select at least one payload and one model')
            return
          }
          const selectedModelsData = models.filter(m => selectedModels.includes(m.id))
          const selectedPayloadsData = payloads.filter(p => selectedPayloads.includes(p.id))
          
          const testConfig: TestConfiguration = {
            selectedPayloads,
            selectedModels,
            maxConcurrent: configuration.maxConcurrent,
            timeout: configuration.timeout
          }
          
          testResults = await executeTestSuite(testConfig)
          break
          
        case 'ai-agent':
          // AI agent testing logic
          const agentResults = await agentManager.runComprehensiveTest(agentTestConfig)
          testResults.push(...agentResults)
          break
          
        case 'multi-agent-system':
          // Multi-agent system testing logic
          const multiAgentResults = await agentManager.runComprehensiveTest({
            ...agentTestConfig,
            framework: 'multi-agent' as any
          })
          testResults.push(...multiAgentResults)
          break
      }

      setResults(testResults)
      setCurrentStep('results')
    } catch (error) {
      console.error('Failed to run tests:', error)
    }

    setIsRunning(false)
  }

  const handleModelUpdate = (modelId: string, updates: Partial<AIModel>) => {
    const updatedModels = models.map(model => 
      model.id === modelId ? { ...model, ...updates } : model
    )
    setModels(updatedModels)
    saveModels(updatedModels)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200'
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
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
      case 'warning': return <AlertCircle className="h-4 w-4" />
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
                      <div className="text-sm text-gray-500">{payload.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTechnicalArchitecture.type === 'mcp-server' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">MCP Server Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Types</label>
                <div className="grid grid-cols-2 gap-3">
                  {['server', 'client', 'protocol', 'tool-chain', 'security-tools'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMcpTestTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMcpTestTypes([...selectedMcpTestTypes, type])
                          } else {
                            setSelectedMcpTestTypes(selectedMcpTestTypes.filter(t => t !== type))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(selectedTechnicalArchitecture.type === 'ai-agent' || selectedTechnicalArchitecture.type === 'multi-agent-system') && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Agent Framework Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Frameworks</label>
                <div className="grid grid-cols-2 gap-3">
                  {['langchain', 'langgraph', 'autogen', 'crewai', 'semantic-kernel', 'llamaindex'].map((framework) => (
                    <label key={framework} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAgentFrameworks.includes(framework)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgentFrameworks([...selectedAgentFrameworks, framework])
                          } else {
                            setSelectedAgentFrameworks(selectedAgentFrameworks.filter(f => f !== framework))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{framework.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Severity</th>
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
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                      {result.status}
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

export default ImprovedTesting 