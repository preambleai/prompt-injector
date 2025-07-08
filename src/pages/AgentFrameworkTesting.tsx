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
  Terminal,
  Monitor,
  Gauge,
  ActivitySquare,
  Workflow,
  MessageSquare,
  Users2,
  Layers,
  GitMerge
} from 'lucide-react'
import { 
  AgentFrameworkTestingManager, 
  AgentTestConfig, 
  AgentTestResult, 
  AgentFramework,
  mockAgentFrameworks 
} from '../services/agent-framework-testing'

const AgentFrameworkTesting: React.FC = () => {
  const [agentManager] = useState(new AgentFrameworkTestingManager())
  const [testConfig, setTestConfig] = useState<AgentTestConfig>({
    enabled: true,
    framework: 'langchain',
    instrumentation: true,
    realTimeMonitoring: true,
    toolCallMonitoring: true,
    midChainDetection: true,
    configurableActions: 'log',
    timeout: 30000
  })
  const [testResults, setTestResults] = useState<AgentTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['langchain'])
  const [showDetails, setShowDetails] = useState(false)
  const [showInstrumentation, setShowInstrumentation] = useState(false)

  const frameworks = [
    {
      id: 'langchain',
      name: 'LangChain',
      description: 'Framework for developing applications with LLMs',
      icon: <Layers className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
      features: ['LLM Chains', 'Agents', 'Tools', 'Memory'],
      vulnerabilities: ['Prompt Injection', 'Tool Abuse', 'Memory Injection']
    },
    {
      id: 'langgraph',
      name: 'LangGraph',
      description: 'State machine and workflow orchestration for LLMs',
      icon: <Workflow className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
      features: ['State Machines', 'Workflows', 'State Management'],
      vulnerabilities: ['Workflow Hijacking', 'State Injection', 'State Manipulation']
    },
    {
      id: 'autogen',
      name: 'AutoGen',
      description: 'Multi-agent conversation framework',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
      features: ['Multi-Agent Conversations', 'GroupChat', 'Agent Coordination'],
      vulnerabilities: ['Agent Manipulation', 'Conversation Poisoning', 'Agent Hijacking']
    },
    {
      id: 'crewai',
      name: 'CrewAI',
      description: 'Crew-based agent orchestration',
      icon: <Users2 className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600',
      features: ['Crew Management', 'Task Orchestration', 'Role Management'],
      vulnerabilities: ['Role Escalation', 'Crew Hijacking', 'Task Manipulation']
    },
    {
      id: 'semantic-kernel',
      name: 'Semantic Kernel',
      description: 'Microsoft\'s AI orchestration framework',
      icon: <GitMerge className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
      features: ['Kernel Orchestration', 'Skills', 'Memory'],
      vulnerabilities: ['Kernel Injection', 'Skill Abuse', 'Memory Manipulation']
    },
    {
      id: 'llamaindex',
      name: 'LlamaIndex',
      description: 'Data framework for LLM applications',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      features: ['RAG Pipelines', 'Document Processing', 'Vector Storage'],
      vulnerabilities: ['RAG Injection', 'Document Poisoning', 'Vector Manipulation']
    }
  ]

  const handleFrameworkToggle = (frameworkId: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(frameworkId) 
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    )
  }

  const handleSelectAllFrameworks = () => {
    setSelectedFrameworks(frameworks.map(f => f.id))
  }

  const handleClearAllFrameworks = () => {
    setSelectedFrameworks([])
  }

  const runAgentTests = async () => {
    if (selectedFrameworks.length === 0) {
      alert('Please select at least one framework')
      return
    }

    setIsRunning(true)
    setTestResults([])

    try {
      const allResults: AgentTestResult[] = []
      
      for (const frameworkId of selectedFrameworks) {
        const config: AgentTestConfig = {
          ...testConfig,
          framework: frameworkId as any
        }
        
        const results = await agentManager.runComprehensiveTest(config)
        allResults.push(...results)
      }
      
      setTestResults(allResults)
    } catch (error) {
      console.error('Failed to run agent framework tests:', error)
    }

    setIsRunning(false)
  }

  const exportResults = (format: 'json' | 'csv') => {
    const data = agentManager.exportResults(format)
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-framework-test-results.${format}`
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
    const summary = agentManager.getSummary()
    return summary
  }

  const getFrameworkBreakdown = () => {
    const breakdown: Record<string, any> = {}
    
    frameworks.forEach(framework => {
      const frameworkResults = testResults.filter(r => r.framework === framework.id)
      breakdown[framework.id] = {
        name: framework.name,
        totalTests: frameworkResults.length,
        vulnerabilities: frameworkResults.filter(r => r.vulnerability).length,
        toolCalls: frameworkResults.reduce((acc, r) => acc + r.toolCalls?.length || 0, 0),
        vulnerableToolCalls: frameworkResults.reduce((acc, r) => acc + (r.toolCalls?.filter(t => t.vulnerability).length || 0), 0),
        midChainVulnerabilities: frameworkResults.reduce((acc, r) => acc + (r.midChainVulnerabilities?.length || 0), 0)
      }
    })
    
    return breakdown
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Agent Framework Testing</h1>
        <p className="text-gray-600">
          Comprehensive security testing for AI agent frameworks with live instrumentation and monitoring
        </p>
      </div>

      {/* Framework Selection */}
      <div className="card p-6 mb-6">
        <h2 className="heading-2 mb-4">Agent Frameworks</h2>
        <p className="text-gray-600 mb-6">
          Select the agent frameworks you want to test
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {frameworks.map((framework) => (
            <div
              key={framework.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedFrameworks.includes(framework.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFrameworkToggle(framework.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${framework.color}`}>
                  {framework.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                  <p className="text-sm text-gray-600">{framework.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Features:</h4>
                  <div className="space-y-1">
                    {framework.features.map((feature, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Vulnerabilities:</h4>
                  <div className="space-y-1">
                    {framework.vulnerabilities.map((vuln, index) => (
                      <div key={index} className="text-xs text-red-500 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {vuln}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSelectAllFrameworks}
            className="btn-secondary"
          >
            Select All Frameworks
          </button>
          <button
            onClick={handleClearAllFrameworks}
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
              Live Instrumentation
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testConfig.instrumentation}
                onChange={(e) => setTestConfig(prev => ({ ...prev, instrumentation: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Enable real-time monitoring</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tool Call Monitoring
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testConfig.toolCallMonitoring}
                onChange={(e) => setTestConfig(prev => ({ ...prev, toolCallMonitoring: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Monitor tool calls</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mid-Chain Detection
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testConfig.midChainDetection}
                onChange={(e) => setTestConfig(prev => ({ ...prev, midChainDetection: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Detect mid-chain vulnerabilities</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configurable Actions
            </label>
            <select
              value={testConfig.configurableActions}
              onChange={(e) => setTestConfig(prev => ({ ...prev, configurableActions: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="log">Log Only</option>
              <option value="block">Block & Redact</option>
              <option value="auto-patch">Auto-Patch</option>
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
            onClick={runAgentTests}
            disabled={isRunning || selectedFrameworks.length === 0}
            className="btn-primary"
          >
            {isRunning ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Running Agent Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Agent Framework Tests
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

          <button
            onClick={() => setShowInstrumentation(!showInstrumentation)}
            className="btn-secondary"
            disabled={testResults.length === 0}
          >
            <Monitor className="h-4 w-4 mr-2" />
            {showInstrumentation ? 'Hide Instrumentation' : 'Show Instrumentation'}
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

        {/* Framework Breakdown */}
        {testResults.length > 0 && (
          <div className="mb-6">
            <h3 className="heading-3 mb-4">Framework Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(getFrameworkBreakdown()).map(([frameworkId, data]) => (
                <div key={frameworkId} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{data.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Tests:</span>
                      <span className="font-medium">{data.totalTests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vulnerabilities:</span>
                      <span className="font-medium text-red-600">{data.vulnerabilities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tool Calls:</span>
                      <span className="font-medium">{data.toolCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vulnerable Tool Calls:</span>
                      <span className="font-medium text-red-600">{data.vulnerableToolCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid-Chain Vulnerabilities:</span>
                      <span className="font-medium text-red-600">{data.midChainVulnerabilities}</span>
                    </div>
                  </div>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Framework</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vulnerability</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tool Calls</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Mid-Chain</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Confidence</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result) => (
                    <tr key={result.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {result.framework}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.agentId}
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
                        <div className="text-sm">
                          <span className="font-medium">{result.toolCalls?.length || 0}</span>
                          {result.toolCalls && result.toolCalls.length > 0 && (
                            <span className="text-red-600 ml-1">
                              ({result.toolCalls.filter(t => t.vulnerability).length} vulnerable)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <span className="font-medium">{result.midChainVulnerabilities?.length || 0}</span>
                        </div>
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
                          <strong>Framework-Specific Vulnerabilities:</strong>
                          <ul className="text-gray-600 mt-1">
                            {result.frameworkSpecificVulnerabilities && result.frameworkSpecificVulnerabilities.length > 0 ? (
                              result.frameworkSpecificVulnerabilities.map((vuln, index) => (
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
                          <strong>Mid-Chain Vulnerabilities:</strong>
                          <ul className="text-gray-600 mt-1">
                            {result.midChainVulnerabilities && result.midChainVulnerabilities.length > 0 ? (
                              result.midChainVulnerabilities.map((vuln, index) => (
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
                          <strong>Tool Calls:</strong>
                          <ul className="text-gray-600 mt-1">
                            {result.toolCalls && result.toolCalls.length > 0 ? (
                              result.toolCalls.map((tool, index) => (
                                <li key={index} className="flex items-center">
                                  <Wrench className="h-3 w-3 text-blue-500 mr-1" />
                                  {tool.name}
                                  {tool.vulnerability && (
                                    <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
                                  )}
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

            {/* Instrumentation Data */}
            {showInstrumentation && (
              <div className="mt-6">
                <h4 className="heading-4 mb-4">Instrumentation Data</h4>
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">{result.model.name} - Instrumentation</h5>
                      
                      {result.instrumentationData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Performance Metrics:</strong>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between">
                                <span>Total Execution Time:</span>
                                <span>{result.instrumentationData.performance.totalExecutionTime}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Average Tool Call Time:</span>
                                <span>{result.instrumentationData.performance.averageToolCallTime}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Memory Usage:</span>
                                <span>{result.instrumentationData.performance.memoryUsage}MB</span>
                              </div>
                              <div className="flex justify-between">
                                <span>CPU Usage:</span>
                                <span>{result.instrumentationData.performance.cpuUsage}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <strong>Alerts:</strong>
                            <ul className="mt-2">
                              {result.instrumentationData.alerts && result.instrumentationData.alerts.length > 0 ? (
                                result.instrumentationData.alerts.map((alert, index) => (
                                  <li key={index} className="flex items-center text-red-600">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {alert.message}
                                  </li>
                                ))
                              ) : (
                                <li className="text-green-600">No alerts</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
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

export default AgentFrameworkTesting 