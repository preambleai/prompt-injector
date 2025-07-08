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
  Server,
  Code,
  Network,
  Lock,
  Unlock,
  Key,
  FileText,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  ChevronRight,
  ChevronLeft,
  Bug,
  Wrench,
  Database,
  Terminal
} from 'lucide-react'
import { MCPTestingManager, MCPTestConfig, MCPTestResult, MCPServer } from '../services/mcp-testing'

const MCPTesting: React.FC = () => {
  const [mcpManager] = useState(new MCPTestingManager())
  const [testConfig, setTestConfig] = useState<MCPTestConfig>({
    enabled: true,
    testType: 'server',
    targetMCP: 'all',
    authentication: true,
    authorization: true,
    protocolVersion: '1.0.0',
    timeout: 30000
  })
  const [testResults, setTestResults] = useState<MCPTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTestTypes, setSelectedTestTypes] = useState<string[]>(['server'])
  const [showDetails, setShowDetails] = useState(false)

  const testTypes = [
    {
      id: 'server',
      name: 'MCP Server Testing',
      description: 'Test MCP servers for vulnerabilities',
      icon: <Server className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
      features: ['Authentication Testing', 'Authorization Testing', 'Tool Access Control']
    },
    {
      id: 'client',
      name: 'MCP Client Testing',
      description: 'Test AI agents using MCP servers',
      icon: <Code className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
      features: ['Claude Desktop', 'Cursor IDE', 'GitHub Copilot']
    },
    {
      id: 'protocol',
      name: 'Protocol Testing',
      description: 'Test MCP protocol implementation',
      icon: <Network className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
      features: ['Message Validation', 'Authentication Bypass', 'Authorization Bypass']
    },
    {
      id: 'tool-chain',
      name: 'Tool Chain Testing',
      description: 'Test complex MCP tool chains',
      icon: <Wrench className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600',
      features: ['Multi-Tool Workflows', 'Permission Escalation', 'Tool Abuse']
    },
    {
      id: 'security-tools',
      name: 'Security Tools Testing',
      description: 'Test security tools exposed via MCP',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
      features: ['Nmap', 'SQLMap', 'FFUF', 'MobSF']
    }
  ]

  const handleTestTypeToggle = (testTypeId: string) => {
    setSelectedTestTypes(prev => 
      prev.includes(testTypeId) 
        ? prev.filter(id => id !== testTypeId)
        : [...prev, testTypeId]
    )
  }

  const handleSelectAllTestTypes = () => {
    setSelectedTestTypes(testTypes.map(t => t.id))
  }

  const handleClearAllTestTypes = () => {
    setSelectedTestTypes([])
  }

  const runMCPTests = async () => {
    if (selectedTestTypes.length === 0) {
      alert('Please select at least one test type')
      return
    }

    setIsRunning(true)
    setTestResults([])

    try {
      const allResults: MCPTestResult[] = []
      
      for (const testType of selectedTestTypes) {
        const config: MCPTestConfig = {
          ...testConfig,
          testType: testType as any
        }
        
        const results = await mcpManager.runComprehensiveTest(config)
        allResults.push(...results)
      }
      
      setTestResults(allResults)
    } catch (error) {
      console.error('Failed to run MCP tests:', error)
    }

    setIsRunning(false)
  }

  const exportResults = (format: 'json' | 'csv') => {
    const data = mcpManager.exportResults(format)
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mcp-test-results.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'failure': return 'text-red-600 bg-red-100'
      case 'bypassed': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'failure': return <AlertTriangle className="h-4 w-4" />
      case 'bypassed': return <Unlock className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTestSummary = () => {
    const summary = mcpManager.getSummary()
    return summary
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">MCP Testing Environment</h1>
        <p className="text-gray-600">
          Comprehensive security testing for Model Context Protocol servers, clients, and tools
        </p>
      </div>

      {/* Test Type Selection */}
      <div className="card p-6 mb-6">
        <h2 className="heading-2 mb-4">Test Types</h2>
        <p className="text-gray-600 mb-6">
          Select the types of MCP testing you want to perform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {testTypes.map((testType) => (
            <div
              key={testType.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedTestTypes.includes(testType.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTestTypeToggle(testType.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${testType.color}`}>
                  {testType.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{testType.name}</h3>
                  <p className="text-sm text-gray-600">{testType.description}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                {testType.features.map((feature, index) => (
                  <div key={index} className="text-xs text-gray-500 flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSelectAllTestTypes}
            className="btn-secondary"
          >
            Select All Test Types
          </button>
          <button
            onClick={handleClearAllTestTypes}
            className="btn-secondary"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="card p-6 mb-6">
        <h2 className="heading-2 mb-4">Test Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication Testing
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testConfig.authentication}
                onChange={(e) => setTestConfig(prev => ({ ...prev, authentication: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Test authentication mechanisms</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authorization Testing
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testConfig.authorization}
                onChange={(e) => setTestConfig(prev => ({ ...prev, authorization: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Test authorization controls</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protocol Version
            </label>
            <select
              value={testConfig.protocolVersion}
              onChange={(e) => setTestConfig(prev => ({ ...prev, protocolVersion: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1.0.0">MCP 1.0.0</option>
              <option value="1.1.0">MCP 1.1.0</option>
              <option value="2.0.0">MCP 2.0.0</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (ms)
            </label>
            <input
              type="number"
              value={testConfig.timeout}
              onChange={(e) => setTestConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              min="1000"
              max="60000"
              step="1000"
            />
          </div>
        </div>
      </div>

      {/* Test Execution */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-2">Test Execution</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => exportResults('json')}
              className="btn-secondary"
              disabled={testResults.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </button>
            <button
              onClick={() => exportResults('csv')}
              className="btn-secondary"
              disabled={testResults.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={runMCPTests}
            disabled={isRunning || selectedTestTypes.length === 0}
            className="btn-primary"
          >
            {isRunning ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Running MCP Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run MCP Tests
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-secondary"
            disabled={testResults.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Test Summary */}
        {testResults.length > 0 && (
          <div className="mb-6">
            <h3 className="heading-3 mb-4">Test Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(getTestSummary()).map(([key, value]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <div className="text-2xl font-bold text-blue-600">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <h3 className="heading-3 mb-4">Test Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Test Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Target</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vulnerability</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Auth Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Authz Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Confidence</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result) => (
                    <tr key={result.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {result.detectionMethod}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.mcpServerId || result.mcpClientId || 'Protocol'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {result.model.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.payload.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          result.vulnerability ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                        }`}>
                          {result.vulnerability ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Vulnerable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Secure
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.authenticationStatus)}`}>
                          {getStatusIcon(result.authenticationStatus)}
                          <span className="ml-1 capitalize">{result.authenticationStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.authorizationStatus)}`}>
                          {getStatusIcon(result.authorizationStatus)}
                          <span className="ml-1 capitalize">{result.authorizationStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium">
                          {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {result.duration}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detailed Results */}
            {showDetails && (
              <div className="mt-6">
                <h4 className="heading-4 mb-4">Detailed Results</h4>
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-900">{result.payload.name}</h5>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          result.vulnerability ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                        }`}>
                          {result.vulnerability ? 'Vulnerable' : 'Secure'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Response:</strong>
                          <p className="text-gray-600 mt-1">{result.response}</p>
                        </div>
                        
                        <div>
                          <strong>Protocol Vulnerabilities:</strong>
                          <ul className="text-gray-600 mt-1">
                            {result.protocolVulnerabilities.length > 0 ? (
                              result.protocolVulnerabilities.map((vuln, index) => (
                                <li key={index} className="flex items-center">
                                  <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                                  {vuln}
                                </li>
                              ))
                            ) : (
                              <li className="text-green-600">None detected</li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <strong>Tool Chain Vulnerabilities:</strong>
                          <ul className="text-gray-600 mt-1">
                            {result.toolChainVulnerabilities.length > 0 ? (
                              result.toolChainVulnerabilities.map((vuln, index) => (
                                <li key={index} className="flex items-center">
                                  <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                                  {vuln}
                                </li>
                              ))
                            ) : (
                              <li className="text-green-600">None detected</li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <strong>Security Tools Tested:</strong>
                          <ul className="text-gray-600 mt-1">
                            {result.securityToolsTested.length > 0 ? (
                              result.securityToolsTested.map((tool, index) => (
                                <li key={index} className="flex items-center">
                                  <Shield className="h-3 w-3 text-blue-500 mr-1" />
                                  {tool}
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500">None</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MCPTesting 