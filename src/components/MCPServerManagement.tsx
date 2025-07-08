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
  Plus, 
  Upload, 
  Settings, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Globe, 
  Key, 
  Lock, 
  Unlock, 
  RefreshCw,
  Activity,
  Shield,
  Network,
  FileText,
  Link,
  Eye
} from 'lucide-react'
import { 
  MCPServerConfig, 
  MCPServerTestResult, 
  MCPServerImportResult,
  mcpServerManager 
} from '../services/mcp-server-manager'

interface MCPServerManagementProps {
  onServerUpdate?: (servers: MCPServerConfig[]) => void
}

const MCPServerManagement: React.FC<MCPServerManagementProps> = ({ onServerUpdate }) => {
  const [servers, setServers] = useState<MCPServerConfig[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [testingServer, setTestingServer] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, MCPServerTestResult>>({})
  const [importResult, setImportResult] = useState<MCPServerImportResult | null>(null)
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardMethod, setWizardMethod] = useState<'quick' | 'manual' | 'custom' | null>(null)
  const [editingServer, setEditingServer] = useState<MCPServerConfig | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [pendingApiKeyServer, setPendingApiKeyServer] = useState<{ server: MCPServerConfig; template: any } | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')

  // Form state for adding new server
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    installation: {
      type: 'npx' as const,
      command: 'npx',
      args: [''],
      env: {}
    },
    connection: {
      protocol: 'stdio' as const,
      endpoint: '',
      timeout: 30000,
      retries: 3,
      keepAlive: true
    },
    authentication: {
      type: 'none' as const,
      credentials: {
        apiKey: '',
        username: '',
        password: '',
        token: '',
        customHeaders: {}
      }
    },
    metadata: {
      version: '1.0.0',
      provider: '',
      category: '',
      tags: [] as string[],
      documentation: '',
      repository: '',
      license: '',
      mcpVersion: '1.0.0'
    }
  })

  // Import form state
  const [importForm, setImportForm] = useState({
    url: '',
    name: '',
    file: null as File | null
  })

  // Manual config form state
  const [manualConfigForm, setManualConfigForm] = useState({
    config: '',
    isValid: false
  })

  useEffect(() => {
    loadServers()
  }, [])

  const loadServers = () => {
    const serverList = mcpServerManager.getServers()
    setServers(serverList)
    onServerUpdate?.(serverList)
  }

  const handleAddServer = async () => {
    setIsLoading(true)
    try {
      await mcpServerManager.addServer(newServer)
      setShowAddModal(false)
      resetNewServerForm()
      loadServers()
    } catch (error) {
      console.error('Failed to add server:', error)
      alert(`Failed to add server: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportFromURL = async () => {
    if (!importForm.url.trim()) {
      alert('Please enter a URL')
      return
    }

    setIsLoading(true)
    try {
      const result = await mcpServerManager.importFromURL(importForm.url, importForm.name)
      setImportResult(result)
      
      if (result.success) {
        setShowImportModal(false)
        resetImportForm()
        loadServers()
      }
    } catch (error) {
      console.error('Failed to import server:', error)
      setImportResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportFromFile = async () => {
    if (!importForm.file) {
      alert('Please select a file')
      return
    }

    setIsLoading(true)
    try {
      const result = await mcpServerManager.importFromFile(importForm.file)
      setImportResult(result)
      
      if (result.success) {
        setShowImportModal(false)
        resetImportForm()
        loadServers()
      }
    } catch (error) {
      console.error('Failed to import server:', error)
      setImportResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async (serverId: string) => {
    setTestingServer(serverId)
    try {
      const result = await mcpServerManager.testConnection(serverId)
      setTestResults(prev => ({ ...prev, [serverId]: result }))
      loadServers() // Refresh server status
    } catch (error) {
      console.error('Failed to test connection:', error)
      setTestResults(prev => ({ 
        ...prev, 
        [serverId]: {
          success: false,
          responseTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    } finally {
      setTestingServer(null)
    }
  }

  const handleDeleteServer = async (serverId: string) => {
    if (!confirm('Are you sure you want to delete this MCP server?')) {
      return
    }

    try {
      await mcpServerManager.deleteServer(serverId)
      loadServers()
    } catch (error) {
      console.error('Failed to delete server:', error)
      alert(`Failed to delete server: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleQuickInstall = async (template: { name: string; description: string; config: Partial<MCPServerConfig> }) => {
    setIsLoading(true)
    try {
      // Create a complete server configuration from template
      const serverConfig = {
        name: template.name,
        description: template.description,
        installation: template.config.installation || {
          type: 'npx' as const,
          command: 'npx',
          args: [''],
          env: {}
        },
        connection: template.config.connection || {
          protocol: 'stdio' as const,
          endpoint: '',
          timeout: 30000,
          retries: 3,
          keepAlive: true
        },
        authentication: template.config.authentication || {
          type: 'api-key' as const,
          credentials: {
            apiKey: '',
            username: '',
            password: '',
            token: '',
            customHeaders: {}
          }
        },
        metadata: template.config.metadata || {
          version: '1.0.0',
          provider: '',
          category: '',
          tags: [],
          documentation: '',
          repository: '',
          license: '',
          mcpVersion: '1.0.0'
        }
      }

      const addedServer = await mcpServerManager.addServer(serverConfig)
      loadServers()
      
      // Close the wizard
      setShowAddModal(false)
      setWizardStep(1)
      setWizardMethod(null)
      
      // Show API key modal
      setPendingApiKeyServer({ server: addedServer, template })
      setApiKeyInput('')
      setShowApiKeyModal(true)
    } catch (error) {
      console.error('Failed to install server:', error)
      alert(`Failed to install server: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInstallFromNPM = async (packageName: string) => {
    setIsLoading(true)
    try {
      await mcpServerManager.installFromNPM(packageName)
      loadServers()
      alert(`Successfully installed ${packageName} from npm`)
    } catch (error) {
      console.error('Failed to install from npm:', error)
      alert(`Failed to install from npm: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportConfig = () => {
    try {
      const config = mcpServerManager.generateMCPConfig()
      const blob = new Blob([config], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mcp-config.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export config:', error)
      alert(`Failed to export config: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleManualConfigImport = async () => {
    if (!manualConfigForm.config.trim()) {
      alert('Please enter a valid MCP configuration')
      return
    }

    setIsLoading(true)
    try {
      const servers = await mcpServerManager.importMCPConfig(manualConfigForm.config)
      setShowAddModal(false)
      setWizardStep(1)
      setWizardMethod(null)
      setManualConfigForm({ config: '', isValid: false })
      loadServers()
      alert(`Successfully imported ${servers.length} MCP server(s)`)
    } catch (error) {
      console.error('Failed to import MCP configuration:', error)
      alert(`Failed to import MCP configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const validateMCPConfig = (config: string) => {
    try {
      const parsed = JSON.parse(config)
      return parsed.mcpServers && typeof parsed.mcpServers === 'object'
    } catch {
      return false
    }
  }

  const handleConfigChange = (config: string) => {
    const isValid = validateMCPConfig(config)
    setManualConfigForm({ config, isValid })
  }

  const loadExampleConfig = () => {
    const example = mcpServerManager.generateExampleConfig()
    setManualConfigForm({ config: example, isValid: true })
  }

  const resetNewServerForm = () => {
    setNewServer({
      name: '',
      description: '',
      installation: {
        type: 'npx',
        command: 'npx',
        args: [''],
        env: {}
      },
      connection: {
        protocol: 'stdio',
        endpoint: '',
        timeout: 30000,
        retries: 3,
        keepAlive: true
      },
      authentication: {
        type: 'none',
        credentials: {
          apiKey: '',
          username: '',
          password: '',
          token: '',
          customHeaders: {}
        }
      },
      metadata: {
        version: '1.0.0',
        provider: '',
        category: '',
        tags: [],
        documentation: '',
        repository: '',
        license: '',
        mcpVersion: '1.0.0'
      }
    })
  }

  const resetImportForm = () => {
    setImportForm({
      url: '',
      name: '',
      file: null
    })
    setImportResult(null)
  }

  const getStatusIcon = (status: MCPServerConfig['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: MCPServerConfig['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'testing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case 'https':
        return <Shield className="h-4 w-4 text-green-500" />
      case 'http':
        return <Globe className="h-4 w-4 text-blue-500" />
      case 'wss':
        return <Network className="h-4 w-4 text-purple-500" />
      case 'ws':
        return <Network className="h-4 w-4 text-orange-500" />
      default:
        return <Server className="h-4 w-4 text-gray-500" />
    }
  }

  const getAuthIcon = (authType: string) => {
    switch (authType) {
      case 'api-key':
        return <Key className="h-4 w-4 text-blue-500" />
      case 'oauth':
        return <Lock className="h-4 w-4 text-green-500" />
      case 'jwt':
        return <Shield className="h-4 w-4 text-purple-500" />
      case 'basic':
        return <Lock className="h-4 w-4 text-orange-500" />
      default:
        return <Unlock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">MCP Servers</h2>
          <p className="text-sm text-gray-600">
            Manage Model Context Protocol servers for testing and integration
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportConfig}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Config
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => {
              setWizardStep(1)
              setWizardMethod(null)
              setShowAddModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </button>
        </div>
      </div>

      {/* Quick Install Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="px-6 py-8">
                    <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Official MCP Servers
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Install verified MCP servers from trusted organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickInstall(mcpServerManager.getServerTemplates()[0])}
              disabled={isLoading}
              className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="block text-sm font-semibold text-gray-900">Notion</span>
                <span className="block text-xs text-gray-500 mt-1">Docs & Database</span>
                <div className="mt-2 flex items-center justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Official
                  </span>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleQuickInstall(mcpServerManager.getServerTemplates()[1])}
              disabled={isLoading}
              className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="block text-sm font-semibold text-gray-900">Stripe</span>
                <span className="block text-xs text-gray-500 mt-1">Payments & Billing</span>
                <div className="mt-2 flex items-center justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Official
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleQuickInstall(mcpServerManager.getServerTemplates()[2])}
              disabled={isLoading}
              className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">HF</span>
                </div>
                <span className="block text-sm font-semibold text-gray-900">Hugging Face</span>
                <span className="block text-xs text-gray-500 mt-1">AI Models</span>
                <div className="mt-2 flex items-center justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Official
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleQuickInstall(mcpServerManager.getServerTemplates()[3])}
              disabled={isLoading}
              className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">BB</span>
                </div>
                <span className="block text-sm font-semibold text-gray-900">Browserbase</span>
                <span className="block text-xs text-gray-500 mt-1">Web Automation</span>
                <div className="mt-2 flex items-center justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Official
                  </span>
                </div>
              </div>
            </button>


          </div>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>These are official MCP servers from verified organizations. Click to install with default settings.</p>
            <p className="mt-1">For more servers, visit <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">MCP Server Collection</a></p>
          </div>
        </div>
      </div>

      {/* Server List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {servers.length === 0 ? (
          <div className="text-center py-12">
            <Server className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No MCP servers</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first MCP server.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setWizardStep(1)
                  setWizardMethod(null)
                  setShowAddModal(true)
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Server
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {servers.map((server) => (
              <li key={server.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(server.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {server.name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                          {server.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          {getProtocolIcon(server.connection.protocol)}
                          <span>{server.connection.protocol.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          {getAuthIcon(server.authentication.type)}
                          <span>{server.authentication.type}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {server.installation.type === 'npx' || server.installation.type === 'npm' 
                            ? server.installation.args?.[0] || 'Unknown'
                            : server.connection.endpoint || 'STDIO'}
                        </div>
                      </div>
                      {server.description && (
                        <p className="text-xs text-gray-500 mt-1">{server.description}</p>
                      )}
                      {server.lastError && (
                        <p className="text-xs text-red-500 mt-1">Error: {server.lastError}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingServer(server)
                        setShowEditModal(true)
                      }}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Settings className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleTestConnection(server.id)}
                      disabled={testingServer === server.id}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {testingServer === server.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Activity className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteServer(server.id)}
                      className="inline-flex items-center px-2 py-1 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                {/* Test Results */}
                {testResults[server.id] && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {testResults[server.id].success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {testResults[server.id].success ? 'Connection successful' : 'Connection failed'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {testResults[server.id].responseTime}ms
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const newResults = { ...testResults }
                          delete newResults[server.id]
                          setTestResults(newResults)
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Dismiss
                      </button>
                    </div>
                    {testResults[server.id].error && (
                      <p className="text-xs text-red-600 mt-1">{testResults[server.id].error}</p>
                    )}
                    {testResults[server.id].details && (
                      <div className="mt-2 text-xs text-gray-600">
                        <div>Protocol: {testResults[server.id].details?.protocolVersion}</div>
                        <div>Tools: {testResults[server.id].details?.availableTools?.length || 0} available</div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Server Wizard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add MCP Server</h3>
                  <p className="text-sm text-gray-600 mt-1">Step {wizardStep} of 3</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setWizardStep(1)
                    setWizardMethod(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= wizardStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-2 ${
                          step < wizardStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Choose Method */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">How would you like to add an MCP server?</h4>
                    <p className="text-sm text-gray-600">Choose the method that best fits your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                      onClick={() => {
                        setWizardMethod('quick')
                        setWizardStep(2)
                      }}
                      className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Quick Install</h5>
                        <p className="text-sm text-gray-600">Install from popular MCP servers with one click</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setWizardMethod('manual')
                        setWizardStep(2)
                      }}
                      className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Manual Config</h5>
                        <p className="text-sm text-gray-600">Paste your MCP configuration in JSON format.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setWizardMethod('custom')
                        setWizardStep(2)
                      }}
                      className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Custom Setup</h5>
                        <p className="text-sm text-gray-600">Configure your own MCP server from scratch</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  {wizardMethod === 'quick' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Choose an MCP Server</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mcpServerManager.getServerTemplates().map((template, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickInstall(template)}
                            disabled={isLoading}
                            className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600 font-bold text-sm">
                                    {template.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 text-left">
                                <h5 className="text-sm font-medium text-gray-900">{template.name}</h5>
                                <p className="text-xs text-gray-500">{template.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {wizardMethod === 'manual' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Paste MCP Configuration</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FileText className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-blue-800">MCP Configuration Format</h5>
                            <p className="text-sm text-blue-700 mt-1">
                              Paste your MCP configuration in JSON format. This should match the format used by Cursor, Claude Desktop, or other MCP clients.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">MCP Configuration JSON</label>
                        <button
                          onClick={loadExampleConfig}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          Load Example
                        </button>
                      </div>
                      
                      <textarea
                        value={manualConfigForm.config}
                        onChange={(e) => handleConfigChange(e.target.value)}
                        rows={12}
                        className={`block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-sm ${
                          manualConfigForm.isValid 
                            ? 'border-green-300 bg-green-50' 
                            : manualConfigForm.config 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                        }`}
                        placeholder={`{
  "mcpServers": {
    "example-server": {
      "command": "npx",
      "args": ["-y", "example-mcp-server"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}`}
                      />

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {manualConfigForm.config && (
                            <>
                              {manualConfigForm.isValid ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${
                                manualConfigForm.isValid ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {manualConfigForm.isValid ? 'Valid MCP configuration' : 'Invalid JSON format'}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Format: Cursor/Claude Desktop compatible
                        </div>
                      </div>
                    </div>
                  )}

                  {wizardMethod === 'custom' && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Custom MCP Server Configuration</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              value={newServer.name}
                              onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="My MCP Server"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Version</label>
                            <input
                              type="text"
                              value={newServer.metadata.version}
                              onChange={(e) => setNewServer({ 
                                ...newServer, 
                                metadata: { ...newServer.metadata, version: e.target.value }
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="1.0.0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={newServer.description}
                            onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                            rows={2}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Brief description of this MCP server"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Installation Type</label>
                            <select
                              value={newServer.installation.type}
                              onChange={(e) => setNewServer({ 
                                ...newServer, 
                                installation: { ...newServer.installation, type: e.target.value as any }
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="npx">NPX Package</option>
                              <option value="npm">NPM Package</option>
                              <option value="local">Local Path</option>
                              <option value="url">URL</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Connection Protocol</label>
                            <select
                              value={newServer.connection.protocol}
                              onChange={(e) => setNewServer({ 
                                ...newServer, 
                                connection: { ...newServer.connection, protocol: e.target.value as any }
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="stdio">STDIO</option>
                              <option value="http">HTTP</option>
                              <option value="https">HTTPS</option>
                              <option value="ws">WebSocket</option>
                              <option value="wss">Secure WebSocket</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Package/Path</label>
                            <input
                              type="text"
                              value={newServer.installation.args[0] || ''}
                              onChange={(e) => setNewServer({ 
                                ...newServer, 
                                installation: { 
                                  ...newServer.installation, 
                                  args: [e.target.value]
                                }
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="tavily-mcp@0.1.2 or ./local-server"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Endpoint (for HTTP/WS)</label>
                            <input
                              type="text"
                              value={newServer.connection.endpoint}
                              onChange={(e) => setNewServer({ 
                                ...newServer, 
                                connection: { ...newServer.connection, endpoint: e.target.value }
                              })}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="localhost:3000 or api.example.com/mcp"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Complete */}
              {wizardStep === 3 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Review Configuration</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Server Details</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div><strong>Name:</strong> {newServer.name}</div>
                      <div><strong>Description:</strong> {newServer.description}</div>
                      <div><strong>Installation Type:</strong> {newServer.installation.type}</div>
                      <div><strong>Protocol:</strong> {newServer.connection.protocol}</div>
                      <div><strong>Package/Path:</strong> {newServer.installation.args[0]}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => {
                    if (wizardStep > 1) {
                      setWizardStep(wizardStep - 1)
                    } else {
                      setShowAddModal(false)
                      setWizardStep(1)
                      setWizardMethod(null)
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {wizardStep === 1 ? 'Cancel' : 'Back'}
                </button>

                <div className="flex space-x-3">
                  {wizardMethod === 'quick' && wizardStep === 2 && (
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  )}

                  {wizardMethod === 'manual' && wizardStep === 2 && (
                    <button
                      onClick={handleManualConfigImport}
                      disabled={isLoading || !manualConfigForm.isValid}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Importing...' : 'Import Configuration'}
                    </button>
                  )}

                  {wizardMethod === 'custom' && wizardStep === 2 && (
                    <button
                      onClick={() => setWizardStep(3)}
                      disabled={!newServer.name || !newServer.installation.args[0]}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Next
                    </button>
                  )}

                  {wizardStep === 3 && (
                    <button
                      onClick={handleAddServer}
                      disabled={isLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add Server'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import MCP Server</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Import from URL</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Server URL</label>
                      <input
                        type="url"
                        value={importForm.url}
                        onChange={(e) => setImportForm({ ...importForm, url: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://api.example.com/mcp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Name (optional)</label>
                      <input
                        type="text"
                        value={importForm.name}
                        onChange={(e) => setImportForm({ ...importForm, name: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Leave empty to use server name"
                      />
                    </div>
                    <button
                      onClick={handleImportFromURL}
                      disabled={isLoading || !importForm.url}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      {isLoading ? 'Importing...' : 'Import from URL'}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Import from File</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Configuration File</label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => setImportForm({ 
                          ...importForm, 
                          file: e.target.files?.[0] || null 
                        })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <button
                      onClick={handleImportFromFile}
                      disabled={isLoading || !importForm.file}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {isLoading ? 'Importing...' : 'Import from File'}
                    </button>
                  </div>
                </div>

                {/* Import Result */}
                {importResult && (
                  <div className={`p-3 rounded-md ${
                    importResult.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {importResult.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm font-medium ${
                        importResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {importResult.success ? 'Import successful' : 'Import failed'}
                      </span>
                    </div>
                    {importResult.error && (
                      <p className="text-sm text-red-700 mt-1">{importResult.error}</p>
                    )}
                    {importResult.warnings && importResult.warnings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-yellow-800">Warnings:</p>
                        <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                          {importResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


          {/* Edit Server Modal */}
      {showEditModal && editingServer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit MCP Server</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingServer(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={editingServer.name}
                      onChange={(e) => setEditingServer({ ...editingServer, name: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      value={editingServer.description}
                      onChange={(e) => setEditingServer({ ...editingServer, description: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      value={editingServer.authentication.credentials?.apiKey || ''}
                      onChange={(e) => setEditingServer({
                        ...editingServer,
                        authentication: {
                          ...editingServer.authentication,
                          credentials: {
                            ...editingServer.authentication.credentials,
                            apiKey: e.target.value
                          }
                        }
                      })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                      placeholder="Enter your API key"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[type="password"]') as HTMLInputElement
                        if (input) {
                          input.type = input.type === 'password' ? 'text' : 'password'
                        }
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                                     <p className="mt-1 text-xs text-gray-500">
                     {editingServer.metadata.provider === 'notion' && 'Get your API key from https://www.notion.so/my-integrations'}
                     {editingServer.metadata.provider === 'stripe' && 'Get your API key from https://dashboard.stripe.com/apikeys'}
                     {editingServer.metadata.provider === 'huggingface' && 'Get your API key from https://huggingface.co/settings/tokens'}
                     {editingServer.metadata.provider === 'browserbase' && 'Get your API key from https://browserbase.com/dashboard'}

                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timeout (ms)</label>
                    <input
                      type="number"
                      value={editingServer.connection.timeout}
                      onChange={(e) => setEditingServer({
                        ...editingServer,
                        connection: {
                          ...editingServer.connection,
                          timeout: parseInt(e.target.value)
                        }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="1000"
                      max="300000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Retries</label>
                    <input
                      type="number"
                      value={editingServer.connection.retries}
                      onChange={(e) => setEditingServer({
                        ...editingServer,
                        connection: {
                          ...editingServer.connection,
                          retries: parseInt(e.target.value)
                        }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingServer(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await mcpServerManager.updateServer(editingServer.id, editingServer)
                      loadServers()
                      setShowEditModal(false)
                      setEditingServer(null)
                      alert('Server updated successfully!')
                    } catch (error) {
                      console.error('Failed to update server:', error)
                      alert(`Failed to update server: ${error instanceof Error ? error.message : 'Unknown error'}`)
                    }
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Server'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && pendingApiKeyServer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Configure API Key</h3>
                <button
                  onClick={() => {
                    setShowApiKeyModal(false)
                    setPendingApiKeyServer(null)
                    setApiKeyInput('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Key className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        {pendingApiKeyServer.template.name} requires an API key
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Please enter your {pendingApiKeyServer.template.config.metadata?.provider || 'service'} API key to complete the setup.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                      placeholder="Enter your API key"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[type="password"]') as HTMLInputElement
                        if (input) {
                          input.type = input.type === 'password' ? 'text' : 'password'
                        }
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Get your API key:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {pendingApiKeyServer.template.config.metadata?.provider === 'notion' && (
                      <li>• <strong>Notion:</strong> <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">https://www.notion.so/my-integrations</a></li>
                    )}
                    {pendingApiKeyServer.template.config.metadata?.provider === 'stripe' && (
                      <li>• <strong>Stripe:</strong> <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">https://dashboard.stripe.com/apikeys</a></li>
                    )}
                    {pendingApiKeyServer.template.config.metadata?.provider === 'huggingface' && (
                      <li>• <strong>Hugging Face:</strong> <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">https://huggingface.co/settings/tokens</a></li>
                    )}
                                         {pendingApiKeyServer.template.config.metadata?.provider === 'browserbase' && (
                       <li>• <strong>Browserbase:</strong> <a href="https://browserbase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">https://browserbase.com/dashboard</a></li>
                     )}

                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowApiKeyModal(false)
                    setPendingApiKeyServer(null)
                    setApiKeyInput('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Skip for now
                </button>
                <button
                  onClick={async () => {
                    if (apiKeyInput.trim()) {
                      try {
                        await mcpServerManager.updateServer(pendingApiKeyServer.server.id, {
                          authentication: {
                            type: 'api-key',
                            credentials: {
                              apiKey: apiKeyInput.trim(),
                              username: '',
                              password: '',
                              token: '',
                              customHeaders: {}
                            }
                          }
                        })
                        loadServers()
                        setShowApiKeyModal(false)
                        setPendingApiKeyServer(null)
                        setApiKeyInput('')
                        alert(`Successfully configured ${pendingApiKeyServer.template.name} with your API key!`)
                      } catch (error) {
                        console.error('Failed to update server with API key:', error)
                        alert(`Server added successfully, but failed to save API key. You can configure it later in the server settings.`)
                      }
                    } else {
                      alert('Please enter a valid API key')
                    }
                  }}
                  disabled={isLoading || !apiKeyInput.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save API Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MCPServerManagement 