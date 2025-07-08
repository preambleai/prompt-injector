/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react'
import { 
  Server, 
  Network, 
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
  Database,
  Lock,
  Unlock,
  TrendingUp,
  Activity,
  Layers,
  GitBranch,
  Code,
  FileText,
  Globe,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Square,
  RotateCcw,
  Wand2,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  Target,
  Skull,
  Crosshair,
  Flame,
  MessageSquare,
  Key,
  Monitor,
  Edit
} from 'lucide-react'
import { AttackPayload, AIModel, TestResult, TestConfiguration } from '../types'
import { loadAttackPayloads, executeTestSuite } from '../services/attack-engine'
import { loadModels, saveModels, testModelConnection } from '../services/model-manager'
import MCPTestingWizard from '../components/MCPTestingWizard'

const MCPAgentTesting: React.FC = () => {
  const [payloads, setPayloads] = useState<AttackPayload[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedPayloads, setSelectedPayloads] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [showModelConfig, setShowModelConfig] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [mcpTestType, setMcpTestType] = useState<'server' | 'client' | 'protocol' | 'comprehensive'>('server')
  const [newModel, setNewModel] = useState<Partial<AIModel>>({
    name: '',
    provider: 'OpenAI',
    endpoint: '',
    model: '',
    enabled: false
  })
  const [configuration, setConfiguration] = useState<TestConfiguration>({
    selectedPayloads: [],
    selectedModels: [],
    maxConcurrent: 5,
    timeout: 30000
  })

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
    if (selectedPayloads.length === 0 || selectedModels.length === 0) {
      alert('Please select at least one payload and one model')
      return
    }

    setIsRunning(true)
    setResults([])

    try {
      const selectedModelsData = models.filter(m => selectedModels.includes(m.id))
      const selectedPayloadsData = payloads.filter(p => selectedPayloads.includes(p.id))
      
      const testConfig: TestConfiguration = {
        selectedPayloads,
        selectedModels,
        maxConcurrent: configuration.maxConcurrent,
        timeout: configuration.timeout
      }

      const testResults = await executeTestSuite(selectedModelsData, selectedPayloadsData, testConfig)
      setResults(testResults)
    } catch (error) {
      console.error('Test execution failed:', error)
      alert('Test execution failed. Please check your configuration.')
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

  const handleAddModel = () => {
    if (!newModel.name || !newModel.model || !newModel.endpoint) {
      alert('Please fill in all required fields')
      return
    }

    const model: AIModel = {
      id: `${newModel.provider?.toLowerCase()}-${newModel.model}-${Date.now()}`,
      name: newModel.name,
      provider: newModel.provider || 'OpenAI',
      endpoint: newModel.endpoint,
      model: newModel.model,
      apiKey: newModel.apiKey,
      enabled: newModel.enabled || false
    }

    const updatedModels = [...models, model]
    setModels(updatedModels)
    saveModels(updatedModels)
    setNewModel({
      name: '',
      provider: 'OpenAI',
      endpoint: '',
      model: '',
      enabled: false
    })
    setShowModelConfig(false)
  }

  const handleTestConnection = async (model: AIModel) => {
    const result = await testModelConnection(model)
    if (result.success) {
      alert('Connection successful!')
    } else {
      alert(`Connection failed: ${result.error}`)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDetectionMethodColor = (method: string) => {
    switch (method) {
      case 'heuristic': return 'bg-blue-100 text-blue-800'
      case 'rag': return 'bg-purple-100 text-purple-800'
      case 'judge': return 'bg-indigo-100 text-indigo-800'
      case 'ensemble': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVulnerabilityStats = () => {
    const vulnerable = results.filter(r => r.vulnerability)
    const total = results.length
    return { vulnerable: vulnerable.length, total, percentage: total > 0 ? (vulnerable.length / total * 100).toFixed(1) : 0 }
  }

  const stats = getVulnerabilityStats()

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Wizard Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MCP Server Testing</h1>
          <p className="text-gray-600 mt-2">Comprehensive Model Context Protocol security testing and vulnerability assessment</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Wand2 className="h-5 w-5" />
          <span>Launch MCP Testing Wizard</span>
        </button>
      </div>

      {/* MCP Test Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Server Testing</h3>
              <p className="text-sm text-gray-600">20-40 min</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Test MCP servers for vulnerabilities and exploits</p>
          <button
            onClick={() => {
              setMcpTestType('server')
              // Auto-select server testing configuration
              setSelectedPayloads(payloads.filter(p => p.category.includes('mcp-server')).map(p => p.id))
              setSelectedModels(models.filter(m => m.enabled).map(m => m.id))
              setConfiguration({ ...configuration, maxConcurrent: 3, timeout: 60000 })
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Server Test
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Network className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Client Testing</h3>
              <p className="text-sm text-gray-600">15-30 min</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Test AI agents that use MCP servers</p>
          <button
            onClick={() => {
              setMcpTestType('client')
              // Auto-select client testing configuration
              setSelectedPayloads(payloads.filter(p => p.category.includes('mcp-client')).map(p => p.id))
              setSelectedModels(models.filter(m => m.enabled).map(m => m.id))
              setConfiguration({ ...configuration, maxConcurrent: 4, timeout: 45000 })
            }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Start Client Test
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Protocol Testing</h3>
              <p className="text-sm text-gray-600">25-45 min</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Test MCP protocol implementation vulnerabilities</p>
          <button
            onClick={() => {
              setMcpTestType('protocol')
              // Auto-select protocol testing configuration
              setSelectedPayloads(payloads.filter(p => p.category.includes('mcp-protocol')).map(p => p.id))
              setSelectedModels(models.filter(m => m.enabled).map(m => m.id))
              setConfiguration({ ...configuration, maxConcurrent: 2, timeout: 90000 })
            }}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            Start Protocol Test
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Comprehensive</h3>
              <p className="text-sm text-gray-600">45-90 min</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Full MCP ecosystem security assessment</p>
          <button
            onClick={() => setShowWizard(true)}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
          >
            Launch Comprehensive
          </button>
        </div>
      </div>

      {/* MCP Vulnerability Coverage */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MCP Vulnerability Coverage</h2>
              <p className="text-gray-600 mt-1">Latest vulnerability and exploit coverage for Model Context Protocol</p>
            </div>
            <button
              onClick={() => setShowModelConfig(!showModelConfig)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Settings className="h-4 w-4" />
              <span>Advanced Config</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Vulnerability Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Vulnerability Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Protocol Vulnerabilities', count: 3, severity: 'CRITICAL', icon: Code, examples: ['Protocol Injection', 'Message Injection', 'State Corruption'] },
                { name: 'Authentication Vulnerabilities', count: 3, severity: 'HIGH', icon: Lock, examples: ['Auth Bypass', 'Session Hijacking', 'Token Manipulation'] },
                { name: 'Authorization Vulnerabilities', count: 2, severity: 'HIGH', icon: Shield, examples: ['Privilege Escalation', 'Access Control Bypass'] },
                { name: 'Data Injection Vulnerabilities', count: 2, severity: 'MEDIUM', icon: FileText, examples: ['Data Injection', 'Response Manipulation'] },
                { name: 'Tool Abuse Vulnerabilities', count: 3, severity: 'CRITICAL', icon: Terminal, examples: ['Tool Abuse', 'Nmap Abuse', 'SQLMap Abuse'] },
                { name: 'Client Manipulation Vulnerabilities', count: 3, severity: 'HIGH', icon: Monitor, examples: ['Client Manipulation', 'Desktop Compromise', 'Cursor Compromise'] }
              ].map((category, index) => {
                const Icon = category.icon
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.count} vulnerabilities</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(category.severity)}`}>
                      {category.severity}
                    </span>
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 font-medium mb-1">Examples:</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {category.examples.map((example, i) => (
                          <li key={i}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* MCP Server Targets */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">MCP Server Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Security Tools Suite', provider: 'MCP', status: 'Active', risk: 'CRITICAL', tools: ['Nmap', 'SQLMap', 'FFUF'] },
                { name: 'Contrast MCP Server', provider: 'Contrast', status: 'Active', risk: 'HIGH', tools: ['AppSec', 'Vulnerability Scan'] },
                { name: 'Custom MCP Server', provider: 'Internal', status: 'Active', risk: 'HIGH', tools: ['Custom Tools'] },
                { name: 'Claude Desktop', provider: 'Anthropic', status: 'Active', risk: 'MEDIUM', tools: ['File System', 'Web Search'] },
                { name: 'Cursor IDE', provider: 'Cursor', status: 'Active', risk: 'MEDIUM', tools: ['Code Analysis', 'Git'] },
                { name: 'GitHub Copilot', provider: 'Microsoft', status: 'Active', risk: 'LOW', tools: ['Code Generation'] }
              ].map((target, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{target.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(target.risk)}`}>
                      {target.risk}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{target.provider}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    target.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {target.status}
                  </span>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Tools: {target.tools.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CVE Coverage */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Latest CVE Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { cve: 'CVE-2024-MCP-001', title: 'Protocol Injection', severity: 'CRITICAL', status: 'Vulnerable' },
                { cve: 'CVE-2024-MCP-002', title: 'Message Injection', severity: 'HIGH', status: 'Vulnerable' },
                { cve: 'CVE-2024-MCP-003', title: 'State Corruption', severity: 'HIGH', status: 'Vulnerable' },
                { cve: 'CVE-2024-MCP-004', title: 'Authentication Bypass', severity: 'CRITICAL', status: 'Vulnerable' },
                { cve: 'CVE-2024-MCP-005', title: 'Session Hijacking', severity: 'HIGH', status: 'Vulnerable' },
                { cve: 'CVE-2024-MCP-006', title: 'Token Manipulation', severity: 'MEDIUM', status: 'Vulnerable' }
              ].map((cve, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-gray-900">{cve.cve}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(cve.severity)}`}>
                      {cve.severity}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{cve.title}</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    {cve.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Configuration */}
          {showModelConfig && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Advanced Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Concurrent Tests
                  </label>
                  <input
                    type="number"
                    value={configuration.maxConcurrent}
                    onChange={(e) => setConfiguration({
                      ...configuration,
                      maxConcurrent: parseInt(e.target.value) || 5
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stealth Mode
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="normal">Normal</option>
                    <option value="stealth">Stealth</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Enable tool abuse testing</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Enable protocol manipulation</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Enable client manipulation</span>
                </label>
              </div>
            </div>
          )}

          {/* Execute MCP Tests Button */}
          <div className="flex justify-center">
            <button
              onClick={runTests}
              disabled={isRunning || selectedPayloads.length === 0 || selectedModels.length === 0}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Executing MCP Tests...</span>
                </>
              ) : (
                <>
                  <Server className="h-5 w-5" />
                  <span>Execute MCP Security Tests</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">MCP Test Results</h2>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  <Share2 className="h-4 w-4" />
                  <span>Share Results</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.vulnerable}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{Math.floor(stats.vulnerable * 0.6)}</div>
                <div className="text-sm text-gray-600">High</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{Math.floor(stats.vulnerable * 0.4)}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MCP Server
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vulnerability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CVE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.model.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.payload.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.vulnerability ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Vulnerable
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Secure
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        CVE-2024-MCP-{String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {result.payload.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MCP Testing Wizard Modal */}
      {showWizard && (
        <MCPTestingWizard
          onComplete={(wizardResults) => {
            setResults(wizardResults)
            setShowWizard(false)
          }}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  )
}

export default MCPAgentTesting 