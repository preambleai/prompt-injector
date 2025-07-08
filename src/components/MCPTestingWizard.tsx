/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState } from 'react'
import { 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  BarChart3, 
  Shield, 
  Target, 
  Bug, 
  Database, 
  Network, 
  Users, 
  Calendar, 
  Globe, 
  BookOpen, 
  MessageSquare, 
  Key, 
  Edit,
  Server,
  Code,
  Unlock,
  TrendingUp,
  Terminal,
  Monitor,
  Eye,
  EyeOff,
  Share2
} from 'lucide-react'
import { MCPTestResult, TestConfiguration } from '../types'

interface MCPTestingWizardProps {
  onComplete: (results: any[]) => void
  onCancel: () => void
}

interface MCPStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

interface MCPVulnerability {
  id: string
  name: string
  description: string
  category: 'protocol' | 'authentication' | 'authorization' | 'data-injection' | 'tool-abuse' | 'client-manipulation'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  cve?: string
  successRate: number
  detectionRate: number
  timeToExecute: string
  icon: any
  selected: boolean
  exploitCode?: string
}

const MCPTestingWizard: React.FC<MCPTestingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [mcpTestType, setMcpTestType] = useState<'server' | 'client' | 'protocol' | 'comprehensive'>('server')
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([])
  const [targetServers, setTargetServers] = useState<string[]>([])
  const [testConfiguration, setTestConfiguration] = useState({
    maxConcurrent: 5,
    timeout: 60000,
    enableStealth: false,
    enablePersistence: false,
    enableToolAbuse: true,
    enableProtocolManipulation: true
  })
  const [isRunning] = useState(false)
  const [progress] = useState(0)
  const [results] = useState<any[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const steps: MCPStep[] = [
    {
      id: 'test-type',
      title: 'MCP Test Strategy',
      description: 'Select your MCP testing approach and objectives',
      completed: false,
      required: true
    },
    {
      id: 'target-selection',
      title: 'Target MCP Servers',
      description: 'Identify and analyze target MCP servers and tools',
      completed: false,
      required: true
    },
    {
      id: 'vulnerabilities',
      title: 'Vulnerability Selection',
      description: 'Choose advanced MCP-specific vulnerabilities and exploits',
      completed: false,
      required: true
    },
    {
      id: 'configuration',
      title: 'Test Configuration',
      description: 'Configure advanced MCP testing parameters',
      completed: false,
      required: false
    },
    {
      id: 'execution',
      title: 'Execute MCP Tests',
      description: 'Launch sophisticated MCP vulnerability tests',
      completed: false,
      required: true
    },
    {
      id: 'analysis',
      title: 'Security Analysis',
      description: 'Analyze MCP test results and identify vulnerabilities',
      completed: false,
      required: true
    }
  ]

  const mcpTestTypes = {
    server: {
      name: 'MCP Server Testing',
      description: 'Test MCP servers for vulnerabilities and exploits',
      icon: Server,
      vulnerabilities: ['protocol-injection', 'authentication-bypass', 'tool-abuse'],
      duration: '20-40 minutes',
      complexity: 'High'
    },
    client: {
      name: 'MCP Client Testing',
      description: 'Test AI agents that use MCP servers',
      icon: Network,
      vulnerabilities: ['client-manipulation', 'data-injection', 'session-hijacking'],
      duration: '15-30 minutes',
      complexity: 'Medium'
    },
    protocol: {
      name: 'Protocol Testing',
      description: 'Test MCP protocol implementation vulnerabilities',
      icon: Code,
      vulnerabilities: ['protocol-manipulation', 'message-injection', 'state-corruption'],
      duration: '25-45 minutes',
      complexity: 'Expert'
    },
    comprehensive: {
      name: 'Comprehensive MCP',
      description: 'Full MCP ecosystem security assessment',
      icon: Shield,
      vulnerabilities: ['all'],
      duration: '45-90 minutes',
      complexity: 'Very High'
    }
  }

  const mcpVulnerabilities: MCPVulnerability[] = [
    // Protocol Vulnerabilities
    {
      id: 'protocol-injection',
      name: 'Protocol Injection',
      description: 'Inject malicious content into MCP protocol messages',
      category: 'protocol',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-001',
      successRate: 0.85,
      detectionRate: 0.15,
      timeToExecute: '3-5 min',
      icon: Code,
      selected: false,
      exploitCode: '{"method": "tools/call", "params": {"name": "malicious_tool", "arguments": {"injection": "payload"}}}'
    },
    {
      id: 'message-injection',
      name: 'Message Injection',
      description: 'Inject malicious messages into MCP communication',
      category: 'protocol',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-002',
      successRate: 0.75,
      detectionRate: 0.25,
      timeToExecute: '2-4 min',
      icon: MessageSquare,
      selected: false
    },
    {
      id: 'state-corruption',
      name: 'State Corruption',
      description: 'Corrupt MCP server state through protocol manipulation',
      category: 'protocol',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-003',
      successRate: 0.70,
      detectionRate: 0.30,
      timeToExecute: '5-8 min',
      icon: Database,
      selected: false
    },
    // Authentication Vulnerabilities
    {
      id: 'authentication-bypass',
      name: 'Authentication Bypass',
      description: 'Bypass MCP server authentication mechanisms',
      category: 'authentication',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-004',
      successRate: 0.80,
      detectionRate: 0.20,
      timeToExecute: '4-6 min',
      icon: Unlock,
      selected: false
    },
    {
      id: 'session-hijacking',
      name: 'Session Hijacking',
      description: 'Hijack active MCP sessions',
      category: 'authentication',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-005',
      successRate: 0.65,
      detectionRate: 0.35,
      timeToExecute: '6-10 min',
      icon: Users,
      selected: false
    },
    {
      id: 'token-manipulation',
      name: 'Token Manipulation',
      description: 'Manipulate authentication tokens and credentials',
      category: 'authentication',
      severity: 'MEDIUM',
      cve: 'CVE-2024-MCP-006',
      successRate: 0.60,
      detectionRate: 0.40,
      timeToExecute: '3-5 min',
      icon: Key,
      selected: false
    },
    // Authorization Vulnerabilities
    {
      id: 'privilege-escalation',
      name: 'Privilege Escalation',
      description: 'Escalate privileges within MCP server',
      category: 'authorization',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-007',
      successRate: 0.70,
      detectionRate: 0.30,
      timeToExecute: '8-12 min',
      icon: TrendingUp,
      selected: false
    },
    {
      id: 'access-control-bypass',
      name: 'Access Control Bypass',
      description: 'Bypass MCP tool access controls',
      category: 'authorization',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-008',
      successRate: 0.75,
      detectionRate: 0.25,
      timeToExecute: '5-8 min',
      icon: Shield,
      selected: false
    },
    // Data Injection Vulnerabilities
    {
      id: 'data-injection',
      name: 'Data Injection',
      description: 'Inject malicious data into MCP server responses',
      category: 'data-injection',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-009',
      successRate: 0.80,
      detectionRate: 0.20,
      timeToExecute: '3-6 min',
      icon: FileText,
      selected: false
    },
    {
      id: 'response-manipulation',
      name: 'Response Manipulation',
      description: 'Manipulate MCP server responses',
      category: 'data-injection',
      severity: 'MEDIUM',
      cve: 'CVE-2024-MCP-010',
      successRate: 0.65,
      detectionRate: 0.35,
      timeToExecute: '4-7 min',
      icon: Edit,
      selected: false
    },
    // Tool Abuse Vulnerabilities
    {
      id: 'tool-abuse',
      name: 'Tool Abuse',
      description: 'Abuse MCP-exposed security tools maliciously',
      category: 'tool-abuse',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-011',
      successRate: 0.90,
      detectionRate: 0.10,
      timeToExecute: '10-15 min',
      icon: Terminal,
      selected: false
    },
    {
      id: 'nmap-abuse',
      name: 'Nmap Tool Abuse',
      description: 'Abuse Nmap tool exposed via MCP',
      category: 'tool-abuse',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-012',
      successRate: 0.85,
      detectionRate: 0.15,
      timeToExecute: '8-12 min',
      icon: Network,
      selected: false
    },
    {
      id: 'sqlmap-abuse',
      name: 'SQLMap Tool Abuse',
      description: 'Abuse SQLMap tool exposed via MCP',
      category: 'tool-abuse',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-013',
      successRate: 0.95,
      detectionRate: 0.05,
      timeToExecute: '12-18 min',
      icon: Database,
      selected: false
    },
    // Client Manipulation Vulnerabilities
    {
      id: 'client-manipulation',
      name: 'Client Manipulation',
      description: 'Manipulate MCP client behavior',
      category: 'client-manipulation',
      severity: 'HIGH',
      cve: 'CVE-2024-MCP-014',
      successRate: 0.75,
      detectionRate: 0.25,
      timeToExecute: '6-10 min',
      icon: Monitor,
      selected: false
    },
    {
      id: 'desktop-compromise',
      name: 'Desktop Compromise',
      description: 'Compromise Claude Desktop via MCP',
      category: 'client-manipulation',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-015',
      successRate: 0.80,
      detectionRate: 0.20,
      timeToExecute: '10-15 min',
      icon: Monitor,
      selected: false
    },
    {
      id: 'cursor-compromise',
      name: 'Cursor Compromise',
      description: 'Compromise Cursor IDE via MCP',
      category: 'client-manipulation',
      severity: 'CRITICAL',
      cve: 'CVE-2024-MCP-016',
      successRate: 0.85,
      detectionRate: 0.15,
      timeToExecute: '8-12 min',
      icon: Code,
      selected: false
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleMcpTestTypeSelect = (type: typeof mcpTestType) => {
    setMcpTestType(type)
    steps[0].completed = true
  }

  const handleVulnerabilityToggle = (vulnerabilityId: string) => {
    setSelectedVulnerabilities(prev => 
      prev.includes(vulnerabilityId) 
        ? prev.filter(id => id !== vulnerabilityId)
        : [...prev, vulnerabilityId]
    )
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'protocol': return 'bg-blue-100 text-blue-800'
      case 'authentication': return 'bg-purple-100 text-purple-800'
      case 'authorization': return 'bg-indigo-100 text-indigo-800'
      case 'data-injection': return 'bg-pink-100 text-pink-800'
      case 'tool-abuse': return 'bg-red-100 text-red-800'
      case 'client-manipulation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderTestTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Select MCP Test Strategy</h2>
        <p className="text-gray-600">Choose your MCP testing approach and objectives</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(mcpTestTypes).map(([key, config]) => {
          const Icon = config.icon
          return (
            <div
              key={key}
              onClick={() => handleMcpTestTypeSelect(key as typeof mcpTestType)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                mcpTestType === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  mcpTestType === key ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    mcpTestType === key ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>Duration: {config.duration}</div>
                    <div>Complexity: {config.complexity}</div>
                    <div>Vulnerabilities: {config.vulnerabilities.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderTargetSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Target MCP Servers</h2>
        <p className="text-gray-600">Identify and analyze target MCP servers and tools</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Available MCP Servers</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'security-tools', name: 'Security Tools Suite', provider: 'MCP', status: 'active', risk: 'CRITICAL', tools: ['Nmap', 'SQLMap', 'FFUF'] },
            { id: 'contrast-mcp', name: 'Contrast MCP Server', provider: 'Contrast', status: 'active', risk: 'HIGH', tools: ['AppSec', 'Vulnerability Scan'] },
            { id: 'custom-mcp', name: 'Custom MCP Server', provider: 'Internal', status: 'active', risk: 'HIGH', tools: ['Custom Tools'] },
            { id: 'claude-desktop', name: 'Claude Desktop', provider: 'Anthropic', status: 'active', risk: 'MEDIUM', tools: ['File System', 'Web Search'] },
            { id: 'cursor-ide', name: 'Cursor IDE', provider: 'Cursor', status: 'active', risk: 'MEDIUM', tools: ['Code Analysis', 'Git'] },
            { id: 'github-copilot', name: 'GitHub Copilot', provider: 'Microsoft', status: 'active', risk: 'LOW', tools: ['Code Generation'] }
          ].map(target => (
            <div key={target.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id={target.id}
                    checked={targetServers.includes(target.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTargetServers([...targetServers, target.id])
                      } else {
                        setTargetServers(targetServers.filter(id => id !== target.id))
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 font-medium text-gray-900">{target.name}</span>
                </label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  target.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {target.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{target.provider}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(target.risk)}`}>
                Risk: {target.risk}
              </span>
              {showAdvanced && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Tools: {target.tools.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderVulnerabilitiesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Vulnerability Selection</h2>
        <p className="text-gray-600">Choose advanced MCP-specific vulnerabilities and exploits</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Available Vulnerabilities</h3>
          <div className="text-sm text-gray-500">
            {selectedVulnerabilities.length} selected
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mcpVulnerabilities.map(vulnerability => {
            const Icon = vulnerability.icon
            return (
              <div key={vulnerability.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedVulnerabilities.includes(vulnerability.id)}
                      onChange={() => handleVulnerabilityToggle(vulnerability.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 font-medium text-gray-900">{vulnerability.name}</span>
                  </label>
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(vulnerability.severity)}`}>
                    {vulnerability.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{vulnerability.description}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(vulnerability.category)}`}>
                    {vulnerability.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Success: {(vulnerability.successRate * 100).toFixed(0)}%</div>
                  <div>Detection: {(vulnerability.detectionRate * 100).toFixed(0)}%</div>
                  <div>Time: {vulnerability.timeToExecute}</div>
                  {vulnerability.cve && <div>CVE: {vulnerability.cve}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Test Configuration</h2>
        <p className="text-gray-600">Configure advanced MCP testing parameters</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Concurrent Tests
            </label>
            <input
              type="number"
              value={testConfiguration.maxConcurrent}
              onChange={(e) => setTestConfiguration({
                ...testConfiguration,
                maxConcurrent: parseInt(e.target.value) || 5
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={testConfiguration.timeout / 1000}
              onChange={(e) => setTestConfiguration({
                ...testConfiguration,
                timeout: (parseInt(e.target.value) || 60) * 1000
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="30"
              max="300"
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={testConfiguration.enableStealth}
                onChange={(e) => setTestConfiguration({
                  ...testConfiguration,
                  enableStealth: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable stealth mode</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={testConfiguration.enablePersistence}
                onChange={(e) => setTestConfiguration({
                  ...testConfiguration,
                  enablePersistence: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable persistence</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={testConfiguration.enableToolAbuse}
                onChange={(e) => setTestConfiguration({
                  ...testConfiguration,
                  enableToolAbuse: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable tool abuse testing</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={testConfiguration.enableProtocolManipulation}
                onChange={(e) => setTestConfiguration({
                  ...testConfiguration,
                  enableProtocolManipulation: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable protocol manipulation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderExecutionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Execute MCP Tests</h2>
        <p className="text-gray-600">Launch sophisticated MCP vulnerability tests</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Test Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-center space-x-4">
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Executing MCP tests...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-gray-700">MCP tests completed</span>
              </>
            )}
          </div>
          
          {/* Test Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">16</div>
              <div className="text-sm text-gray-600">Vulnerabilities Tested</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">8</div>
              <div className="text-sm text-gray-600">Vulnerabilities Found</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">50%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalysisStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Security Analysis</h2>
        <p className="text-gray-600">Analyze MCP test results and identify vulnerabilities</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">16</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">High</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Medium</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              <Share2 className="h-4 w-4" />
              <span>Share Results</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              <BarChart3 className="h-4 w-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderTestTypeStep()
      case 1:
        return renderTargetSelectionStep()
      case 2:
        return renderVulnerabilitiesStep()
      case 3:
        return renderConfigurationStep()
      case 4:
        return renderExecutionStep()
      case 5:
        return renderAnalysisStep()
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">MCP Testing Wizard</h1>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index < currentStep
                    ? 'bg-green-100 text-green-600'
                    : index === currentStep
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderCurrentStep()}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={() => onComplete(results)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Complete
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MCPTestingWizard 