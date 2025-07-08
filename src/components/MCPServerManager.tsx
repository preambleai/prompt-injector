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
  Download, 
  Settings, 
  Trash2, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Globe, 
  Key, 
  Lock, 
  Unlock, 
  Wifi, 
  WifiOff,
  Copy,
  ExternalLink,
  FileText,
  Link,
  Zap,
  Shield,
  Database,
  Cloud,
  Code,
  Network,
  Activity,
  MoreVertical,
  Edit,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
  HelpCircle
} from 'lucide-react'
import { 
  MCPServerConfig, 
  MCPServerTestResult, 
  MCPServerImportResult,
  mcpServerManager 
} from '../services/mcp-server-manager'

interface MCPServerManagerProps {
  onServerUpdate?: (servers: MCPServerConfig[]) => void
}

const MCPServerManager: React.FC<MCPServerManagerProps> = ({ onServerUpdate }) => {
  const [servers, setServers] = useState<MCPServerConfig[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedServer, setSelectedServer] = useState<MCPServerConfig | null>(null)
  const [testingServer, setTestingServer] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, MCPServerTestResult>>({})
  const [importResult, setImportResult] = useState<MCPServerImportResult | null>(null)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

  // Form state for adding new server
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    endpoint: '',
    protocol: 'https' as const,
    version: '1.0.0',
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
    connection: {
      timeout: 30000,
      retries: 3,
      keepAlive: true
    },
    metadata: {
      provider: '',
      category: '',
      tags: [] as string[],
      documentation: '',
      repository: ''
    }
  })

  // Import form state
  const [importForm, setImportForm] = useState({
    url: '',
    name: '',
    file: null as File | null
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

  const resetNewServerForm = () => {
    setNewServer({
      name: '',
      description: '',
      endpoint: '',
      protocol: 'https',
      version: '1.0.0',
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
      connection: {
        timeout: 30000,
        retries: 3,
        keepAlive: true
      },
      metadata: {
        provider: '',
        category: '',
        tags: [],
        documentation: '',
        repository: ''
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
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
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </button>
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
                onClick={() => setShowAddModal(true)}
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
                          {getProtocolIcon(server.protocol)}
                          <span>{server.protocol.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          {getAuthIcon(server.authentication.type)}
                          <span>{server.authentication.type}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {server.endpoint}
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
                      onClick={() => setSelectedServer(server)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Settings className="h-3 w-3" />
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

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add MCP Server</h3>
                <button
                  onClick={() => setShowAddModal(false)}
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
                      value={newServer.version}
                      onChange={(e) => setNewServer({ ...newServer, version: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700">Protocol</label>
                    <select
                      value={newServer.protocol}
                      onChange={(e) => setNewServer({ ...newServer, protocol: e.target.value as any })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="https">HTTPS</option>
                      <option value="http">HTTP</option>
                      <option value="wss">WSS</option>
                      <option value="ws">WS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                    <input
                      type="text"
                      value={newServer.endpoint}
                      onChange={(e) => setNewServer({ ...newServer, endpoint: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="api.example.com/mcp"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Authentication</label>
                  <select
                    value={newServer.authentication.type}
                    onChange={(e) => setNewServer({ 
                      ...newServer, 
                      authentication: { 
                        ...newServer.authentication, 
                        type: e.target.value as any 
                      } 
                    })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="none">None</option>
                    <option value="api-key">API Key</option>
                    <option value="oauth">OAuth</option>
                    <option value="jwt">JWT</option>
                    <option value="basic">Basic Auth</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {newServer.authentication.type !== 'none' && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    {newServer.authentication.type === 'api-key' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">API Key</label>
                        <input
                          type="password"
                          value={newServer.authentication.credentials.apiKey}
                          onChange={(e) => setNewServer({
                            ...newServer,
                            authentication: {
                              ...newServer.authentication,
                              credentials: {
                                ...newServer.authentication.credentials,
                                apiKey: e.target.value
                              }
                            }
                          })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="sk-..."
                        />
                      </div>
                    )}
                    
                    {newServer.authentication.type === 'basic' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Username</label>
                          <input
                            type="text"
                            value={newServer.authentication.credentials.username}
                            onChange={(e) => setNewServer({
                              ...newServer,
                              authentication: {
                                ...newServer.authentication,
                                credentials: {
                                  ...newServer.authentication.credentials,
                                  username: e.target.value
                                }
                              }
                            })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <input
                            type="password"
                            value={newServer.authentication.credentials.password}
                            onChange={(e) => setNewServer({
                              ...newServer,
                              authentication: {
                                ...newServer.authentication,
                                credentials: {
                                  ...newServer.authentication.credentials,
                                  password: e.target.value
                                }
                              }
                            })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timeout (ms)</label>
                    <input
                      type="number"
                      value={newServer.connection.timeout}
                      onChange={(e) => setNewServer({
                        ...newServer,
                        connection: {
                          ...newServer.connection,
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
                      value={newServer.connection.retries}
                      onChange={(e) => setNewServer({
                        ...newServer,
                        connection: {
                          ...newServer.connection,
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddServer}
                  disabled={isLoading || !newServer.name || !newServer.endpoint}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Server'}
                </button>
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
    </div>
  )
}

export default MCPServerManager 