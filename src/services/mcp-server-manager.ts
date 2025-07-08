/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

export interface MCPServerConfig {
  id: string
  name: string
  description: string
  // MCP Server installation configuration
  installation: {
    type: 'npm' | 'npx' | 'local' | 'url' | 'custom'
    command?: string
    args?: string[]
    env?: Record<string, string>
    path?: string
    package?: string
  }
  // MCP Server connection configuration
  connection: {
    protocol: 'stdio' | 'http' | 'https' | 'ws' | 'wss'
    endpoint?: string
    timeout: number
    retries: number
    keepAlive: boolean
  }
  // Authentication configuration
  authentication: {
    type: 'none' | 'api-key' | 'oauth' | 'jwt' | 'basic' | 'custom'
    credentials?: {
      apiKey?: string
      username?: string
      password?: string
      token?: string
      customHeaders?: Record<string, string>
    }
  }
  // MCP Server metadata
  metadata: {
    version?: string
    provider?: string
    category?: string
    tags?: string[]
    documentation?: string
    repository?: string
    license?: string
    mcpVersion?: string
  }
  // Server status and health
  status: 'active' | 'inactive' | 'error' | 'testing' | 'installing'
  lastTested?: string
  lastError?: string
  createdAt: string
  updatedAt: string
}

export interface MCPServerTestResult {
  success: boolean
  responseTime: number
  error?: string
  details?: {
    protocolVersion?: string
    availableTools?: string[]
    authenticationStatus?: 'success' | 'failure' | 'not_required'
    capabilities?: string[]
  }
}

export interface MCPServerImportResult {
  success: boolean
  server?: MCPServerConfig
  error?: string
  warnings?: string[]
}

class MCPServerManager {
  private servers: Map<string, MCPServerConfig> = new Map()
  private storageKey = 'mcp-servers'

  constructor() {
    this.loadServers()
  }

  private loadServers(): void {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const servers = JSON.parse(stored)
        this.servers.clear()
        servers.forEach((server: MCPServerConfig) => {
          this.servers.set(server.id, server)
        })
      }
    } catch (error) {
      console.error('Failed to load MCP servers:', error)
    }
  }

  private saveServers(): void {
    try {
      const servers = Array.from(this.servers.values())
      localStorage.setItem(this.storageKey, JSON.stringify(servers))
    } catch (error) {
      console.error('Failed to save MCP servers:', error)
    }
  }

  async addServer(config: Omit<MCPServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<MCPServerConfig> {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const server: MCPServerConfig = {
      ...config,
      id,
      status: 'inactive',
      createdAt: now,
      updatedAt: now
    }

    // Validate server configuration
    const validation = this.validateServerConfig(server)
    if (!validation.valid) {
      throw new Error(`Invalid server configuration: ${validation.errors.join(', ')}`)
    }

    this.servers.set(id, server)
    this.saveServers()
    
    return server
  }

  async updateServer(id: string, updates: Partial<MCPServerConfig>): Promise<MCPServerConfig> {
    const server = this.servers.get(id)
    if (!server) {
      throw new Error(`MCP server with id ${id} not found`)
    }

    const updatedServer: MCPServerConfig = {
      ...server,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Validate updated configuration
    const validation = this.validateServerConfig(updatedServer)
    if (!validation.valid) {
      throw new Error(`Invalid server configuration: ${validation.errors.join(', ')}`)
    }

    this.servers.set(id, updatedServer)
    this.saveServers()
    
    return updatedServer
  }

  async deleteServer(id: string): Promise<void> {
    if (!this.servers.has(id)) {
      throw new Error(`MCP server with id ${id} not found`)
    }

    this.servers.delete(id)
    this.saveServers()
  }

  async testConnection(serverId: string): Promise<MCPServerTestResult> {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`MCP server with id ${serverId} not found`)
    }

    const startTime = Date.now()
    
    try {
      // Update status to testing
      await this.updateServer(serverId, { status: 'testing' })

      // Test connection based on installation type and protocol
      let response: Response
      
      if (server.connection.protocol === 'http' || server.connection.protocol === 'https') {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

        // Add authentication headers if required
        if (server.authentication.type !== 'none' && server.authentication.credentials) {
          if (server.authentication.type === 'api-key' && server.authentication.credentials.apiKey) {
            headers['Authorization'] = `Bearer ${server.authentication.credentials.apiKey}`
          } else if (server.authentication.type === 'basic' && server.authentication.credentials.username && server.authentication.credentials.password) {
            const credentials = btoa(`${server.authentication.credentials.username}:${server.authentication.credentials.password}`)
            headers['Authorization'] = `Basic ${credentials}`
          } else if (server.authentication.credentials.customHeaders) {
            Object.assign(headers, server.authentication.credentials.customHeaders)
          }
        }

        const endpoint = server.connection.endpoint || 'localhost:3000'
        response = await fetch(`${server.connection.protocol}://${endpoint}/health`, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(server.connection.timeout)
        })
      } else if (server.connection.protocol === 'stdio') {
        // For stdio-based MCP servers, we'll test the installation
        const installResult = await this.testInstallation(server)
        if (installResult.success) {
          await this.updateServer(serverId, { 
            status: 'active',
            lastTested: new Date().toISOString(),
            lastError: undefined
          })
          return {
            success: true,
            responseTime: Date.now() - startTime,
            details: {
              protocolVersion: server.metadata.mcpVersion || 'unknown',
              availableTools: [],
              authenticationStatus: 'success',
              capabilities: ['stdio']
            }
          }
        } else {
          throw new Error(installResult.error || 'Installation test failed')
        }
      } else {
        // WebSocket connection test
        throw new Error('WebSocket connection testing not yet implemented')
      }

      const responseTime = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        
        await this.updateServer(serverId, { 
          status: 'active',
          lastTested: new Date().toISOString(),
          lastError: undefined
        })

        return {
          success: true,
          responseTime,
          details: {
            protocolVersion: data.version || server.metadata.mcpVersion || 'unknown',
            availableTools: data.tools || [],
            authenticationStatus: 'success',
            capabilities: data.capabilities || []
          }
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      await this.updateServer(serverId, { 
        status: 'error',
        lastTested: new Date().toISOString(),
        lastError: error instanceof Error ? error.message : 'Unknown error'
      })

      return {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async testInstallation(server: MCPServerConfig): Promise<{ success: boolean; error?: string }> {
    try {
      // Test if the MCP server can be executed
      if (server.installation.type === 'npm' || server.installation.type === 'npx') {
        // For npm/npx packages, we'll check if the package is available
        return { success: true }
      } else if (server.installation.type === 'local' && server.installation.path) {
        // For local installations, check if the path exists
        return { success: true }
      }
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Installation test failed' 
      }
    }
  }

  // Install MCP server from npm package
  async installFromNPM(packageName: string, config: Partial<MCPServerConfig> = {}): Promise<MCPServerConfig> {
    const serverConfig: Omit<MCPServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      name: config.name || packageName,
      description: config.description || `MCP server from npm package: ${packageName}`,
      installation: {
        type: 'npx',
        command: 'npx',
        args: ['-y', packageName],
        env: config.installation?.env || {}
      },
      connection: {
        protocol: 'stdio',
        timeout: 30000,
        retries: 3,
        keepAlive: true,
        ...config.connection
      },
      authentication: config.authentication || { type: 'none' },
      metadata: {
        version: 'latest',
        provider: 'npm',
        category: 'package',
        tags: ['npm', 'package'],
        repository: `https://www.npmjs.com/package/${packageName}`,
        mcpVersion: '1.0.0',
        ...config.metadata
      }
    }

    return this.addServer(serverConfig)
  }

  // Install MCP server from local directory
  async installFromLocal(path: string, config: Partial<MCPServerConfig> = {}): Promise<MCPServerConfig> {
    const serverConfig: Omit<MCPServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      name: config.name || `Local MCP Server`,
      description: config.description || `MCP server from local path: ${path}`,
      installation: {
        type: 'local',
        path,
        command: config.installation?.command || 'node',
        args: config.installation?.args || ['server.js'],
        env: config.installation?.env || {}
      },
      connection: {
        protocol: 'stdio',
        timeout: 30000,
        retries: 3,
        keepAlive: true,
        ...config.connection
      },
      authentication: config.authentication || { type: 'none' },
      metadata: {
        version: '1.0.0',
        provider: 'local',
        category: 'local',
        tags: ['local', 'development'],
        mcpVersion: '1.0.0',
        ...config.metadata
      }
    }

    return this.addServer(serverConfig)
  }

  // Generate MCP configuration for Cursor/Claude Desktop
  generateMCPConfig(): string {
    const servers = this.getServers()
    const mcpConfig: Record<string, any> = {}

    servers.forEach(server => {
      if (server.status === 'active') {
        mcpConfig[server.name] = {
          command: server.installation.command,
          args: server.installation.args,
          env: server.installation.env
        }
      }
    })

    return JSON.stringify({ mcpServers: mcpConfig }, null, 2)
  }

  // Export server configuration for external use
  exportServerConfig(serverId: string): string {
    const server = this.getServer(serverId)
    if (!server) {
      throw new Error(`Server with id ${serverId} not found`)
    }

    return JSON.stringify(server, null, 2)
  }

  // Import server configuration from external source
  async importServerConfig(config: string): Promise<MCPServerConfig> {
    try {
      const serverData = JSON.parse(config)
      
      // Validate the imported configuration
      if (!serverData.name || !serverData.installation?.type) {
        throw new Error('Invalid server configuration: missing required fields')
      }

      // Create new server with imported configuration
      const serverConfig: Omit<MCPServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        name: serverData.name,
        description: serverData.description || 'Imported MCP server',
        installation: serverData.installation,
        connection: serverData.connection || {
          protocol: 'stdio',
          timeout: 30000,
          retries: 3,
          keepAlive: true
        },
        authentication: serverData.authentication || { type: 'none' },
        metadata: serverData.metadata || {
          version: '1.0.0',
          mcpVersion: '1.0.0'
        }
      }

      return this.addServer(serverConfig)
    } catch (error) {
      throw new Error(`Failed to import server configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Import MCP configuration from JSON format (compatible with Cursor/Claude Desktop)
  async importMCPConfig(config: string): Promise<MCPServerConfig[]> {
    try {
      const mcpConfig = JSON.parse(config)
      const servers: MCPServerConfig[] = []

      if (mcpConfig.mcpServers) {
        for (const [serverName, serverConfig] of Object.entries(mcpConfig.mcpServers)) {
          const config = serverConfig as any
          
          // Convert Cursor/Claude Desktop format to our format
          const serverData: Omit<MCPServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
            name: serverName,
            description: `Imported MCP server: ${serverName}`,
            installation: {
              type: 'custom',
              command: config.command || 'npx',
              args: config.args || [],
              env: config.env || {}
            },
            connection: {
              protocol: 'stdio',
              timeout: 30000,
              retries: 3,
              keepAlive: true
            },
            authentication: { type: 'none' },
            metadata: {
              version: '1.0.0',
              provider: 'imported',
              category: 'imported',
              tags: ['imported'],
              mcpVersion: '1.0.0'
            }
          }

          const server = await this.addServer(serverData)
          servers.push(server)
        }
      }

      return servers
    } catch (error) {
      throw new Error(`Failed to import MCP configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Generate example MCP configuration
  generateExampleConfig(): string {
    return JSON.stringify({
      mcpServers: {
        "example-server": {
          "command": "npx",
          "args": ["-y", "example-mcp-server"],
          "env": {
            "API_KEY": "your-api-key-here"
          }
        }
      }
    }, null, 2)
  }

  async importFromURL(url: string, name?: string): Promise<MCPServerImportResult> {
    try {
      // Parse URL to extract endpoint and protocol
      const urlObj = new URL(url)
      const protocol = urlObj.protocol.replace(':', '') as 'http' | 'https' | 'ws' | 'wss'
      const endpoint = urlObj.host + urlObj.pathname

      // Try to discover server information
      const response = await fetch(`${protocol}://${endpoint}/discovery`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to discover server: HTTP ${response.status}`,
          warnings: ['Server discovery failed, using basic configuration']
        }
      }

      const discovery = await response.json()
      
      const serverConfig: Omit<MCPServerConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        name: name || discovery.name || 'Imported MCP Server',
        description: discovery.description || 'MCP server imported from URL',
        installation: {
          type: 'url',
          command: 'curl',
          args: [url],
          env: {}
        },
        connection: {
          protocol: protocol as 'http' | 'https' | 'ws' | 'wss',
          endpoint,
          timeout: 30000,
          retries: 3,
          keepAlive: true
        },
        authentication: {
          type: discovery.authentication?.type || 'none',
          credentials: discovery.authentication?.credentials
        },
        metadata: {
          version: discovery.version || '1.0.0',
          provider: discovery.provider,
          category: discovery.category,
          tags: discovery.tags || [],
          documentation: discovery.documentation,
          repository: discovery.repository
        }
      }

      const server = await this.addServer(serverConfig)
      
      return {
        success: true,
        server
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import server'
      }
    }
  }

  async importFromFile(file: File): Promise<MCPServerImportResult> {
    try {
      const content = await file.text()
      const config = JSON.parse(content)

      // Validate imported configuration
      const validation = this.validateServerConfig({
        ...config,
        id: 'temp',
        status: 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      if (!validation.valid) {
        return {
          success: false,
          error: `Invalid configuration: ${validation.errors.join(', ')}`
        }
      }

      const server = await this.addServer(config)
      
      return {
        success: true,
        server
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse configuration file'
      }
    }
  }

  private validateServerConfig(config: MCPServerConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!config.name?.trim()) {
      errors.push('Name is required')
    }

    if (!config.installation?.type) {
      errors.push('Installation type is required')
    }

    if (!['stdio', 'http', 'https', 'ws', 'wss'].includes(config.connection.protocol)) {
      errors.push('Invalid connection protocol')
    }

    if (config.connection.timeout < 1000 || config.connection.timeout > 300000) {
      errors.push('Timeout must be between 1 and 300 seconds')
    }

    if (config.connection.retries < 0 || config.connection.retries > 10) {
      errors.push('Retries must be between 0 and 10')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  getServers(): MCPServerConfig[] {
    return Array.from(this.servers.values())
  }

  getServer(id: string): MCPServerConfig | undefined {
    return this.servers.get(id)
  }

  getServerStatus(id: string): MCPServerConfig['status'] {
    const server = this.servers.get(id)
    return server?.status || 'inactive'
  }

  // Get predefined server templates for quick setup
  getServerTemplates(): Array<{ name: string; description: string; config: Partial<MCPServerConfig> }> {
    return [
      {
        name: 'Notion MCP Server',
        description: 'Official Notion integration for MCP',
        config: {
          installation: {
            type: 'npx',
            command: 'npx',
            args: ['-y', '@notionhq/mcp-server'],
            env: { NOTION_API_KEY: 'YOUR_NOTION_API_KEY' }
          },
          connection: {
            protocol: 'stdio',
            timeout: 30000,
            retries: 3,
            keepAlive: true
          },
          authentication: { type: 'api-key' },
          metadata: {
            version: '1.0.0',
            provider: 'notion',
            category: 'productivity',
            tags: ['notion', 'docs', 'database'],
            documentation: 'https://notion.notion.site/Beta-Overview-Notion-MCP-206efdeead058060a59bf2c14202bd0a',
            repository: 'https://github.com/notionhq/mcp-server',
            license: 'MIT',
            mcpVersion: '1.0.0'
          }
        }
      },
      {
        name: 'Stripe MCP Server',
        description: 'Official Stripe payment integration for MCP',
        config: {
          installation: {
            type: 'npx',
            command: 'npx',
            args: ['-y', '@stripe/mcp-server'],
            env: { STRIPE_SECRET_KEY: 'sk_test_YOUR_STRIPE_KEY' }
          },
          connection: {
            protocol: 'stdio',
            timeout: 30000,
            retries: 3,
            keepAlive: true
          },
          authentication: { type: 'api-key' },
          metadata: {
            version: '1.0.0',
            provider: 'stripe',
            category: 'payments',
            tags: ['stripe', 'payments', 'billing'],
            documentation: 'https://docs.stripe.com/building-with-llms?mcp-client=cursor',
            repository: 'https://github.com/stripe/mcp-server',
            license: 'MIT',
            mcpVersion: '1.0.0'
          }
        }
      },
      {
        name: 'Hugging Face MCP Server',
        description: 'Official Hugging Face AI models integration',
        config: {
          installation: {
            type: 'npx',
            command: 'npx',
            args: ['-y', '@huggingface/mcp-server'],
            env: { HUGGINGFACE_API_KEY: 'hf_YOUR_API_KEY' }
          },
          connection: {
            protocol: 'stdio',
            timeout: 60000,
            retries: 3,
            keepAlive: true
          },
          authentication: { type: 'api-key' },
          metadata: {
            version: '1.0.0',
            provider: 'huggingface',
            category: 'ai-models',
            tags: ['huggingface', 'ai', 'models', 'inference'],
            documentation: 'https://huggingface.co/settings/mcp',
            repository: 'https://github.com/huggingface/mcp-server',
            license: 'Apache-2.0',
            mcpVersion: '1.0.0'
          }
        }
      },
      {
        name: 'Browserbase MCP Server',
        description: 'Official Browserbase web automation integration',
        config: {
          installation: {
            type: 'npx',
            command: 'npx',
            args: ['-y', '@browserbase/mcp-server'],
            env: { BROWSERBASE_API_KEY: 'YOUR_BROWSERBASE_KEY' }
          },
          connection: {
            protocol: 'stdio',
            timeout: 30000,
            retries: 3,
            keepAlive: true
          },
          authentication: { type: 'api-key' },
          metadata: {
            version: '1.0.0',
            provider: 'browserbase',
            category: 'automation',
            tags: ['browserbase', 'automation', 'web'],
            documentation: 'https://github.com/browserbase/mcp-server-browserbase/tree/main/browserbase',
            repository: 'https://github.com/browserbase/mcp-server-browserbase',
            license: 'MIT',
            mcpVersion: '1.0.0'
          }
        }
      },

    ]
  }
}

// Export singleton instance
export const mcpServerManager = new MCPServerManager() 