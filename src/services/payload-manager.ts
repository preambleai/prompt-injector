/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { AttackPayload } from '../types'

export interface PayloadSource {
  id: string
  name: string
  description: string
  file: string
  category: string
  lastUpdated: string
  payloadCount: number
}

export interface PayloadCategory {
  id: string
  name: string
  description: string
  tags: string[]
  source: string
}

export interface PayloadFilter {
  categories?: string[]
  owaspLabels?: string[]
  mitreAtlasLabels?: string[]
  aiSystemLabels?: string[]
  tags?: string[]
  sources?: string[]
  techniques?: string[]
  successRate?: {
    min: number
    max: number
  }
  isEditable?: boolean
}

export class PayloadManager {
  private payloads: Map<string, AttackPayload> = new Map()
  private sources: PayloadSource[] = []
  private categories: Map<string, PayloadCategory> = new Map()

  constructor() {
    this.initializeSources()
    this.initializeCategories()
  }

  private initializeSources() {
    this.sources = [
      {
        id: 'owasp-llm',
        name: 'OWASP LLM Top 10',
        description: 'Official OWASP LLM security vulnerabilities',
        file: 'owasp-llm01-llm10.json',
        category: 'standard',
        lastUpdated: '2024-12-01',
        payloadCount: 11
      },
      {
        id: 'advanced-attacks',
        name: 'Advanced Attack Techniques',
        description: 'Advanced prompt injection and AI security attacks',
        file: 'advanced-attacks.json',
        category: 'advanced',
        lastUpdated: '2024-12-15',
        payloadCount: 33
      },
      {
        id: 'research-2025',
        name: 'Latest Research 2025',
        description: 'Cutting-edge research from 2024-2025',
        file: 'latest-research-2025.json',
        category: 'research',
        lastUpdated: '2025-01-15',
        payloadCount: 20
      },
      {
        id: 'comprehensive-2025',
        name: 'Comprehensive Attacks 2025',
        description: 'Complete database of all known LLM attack vectors including direct/indirect prompt injection, jailbreaks, multi-modal exploits, XSS+prompt injection, CSRF+prompt injection, and other advanced payloads',
        file: 'comprehensive-attacks-2025.json',
        category: 'comprehensive',
        lastUpdated: '2025-01-20',
        payloadCount: 50
      }
    ]
  }

  private initializeCategories() {
    const categoryData: PayloadCategory[] = [
      {
        id: 'owasp-llm01',
        name: 'OWASP LLM01: Prompt Injection',
        description: 'System prompt extraction and role confusion attacks',
        tags: ['system-prompt', 'role-confusion', 'owasp'],
        source: 'OWASP'
      },
      {
        id: 'owasp-llm02',
        name: 'OWASP LLM02: Insecure Output Handling',
        description: 'Insecure handling of model outputs',
        tags: ['output-handling', 'xss', 'owasp'],
        source: 'OWASP'
      },
      {
        id: 'direct-prompt-injection',
        name: 'Direct Prompt Injection',
        description: 'Direct attempts to override system instructions',
        tags: ['direct-injection', 'instruction-override', 'system-prompt'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'indirect-prompt-injection',
        name: 'Indirect Prompt Injection',
        description: 'Indirect manipulation through context poisoning',
        tags: ['indirect-injection', 'context-manipulation', 'authorization-spoofing'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'jailbreak',
        name: 'Jailbreak Attacks',
        description: 'Techniques to bypass AI safety measures',
        tags: ['jailbreak', 'DAN', 'role-confusion', 'character-manipulation'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'multimodal-injection',
        name: 'Multi-Modal Injection',
        description: 'Cross-modal prompt injection attacks',
        tags: ['multimodal', 'image-injection', 'audio-injection', 'video-injection', 'cross-modal'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'xss-prompt-injection',
        name: 'XSS + Prompt Injection',
        description: 'Combined XSS and prompt injection attacks',
        tags: ['xss', 'prompt-injection', 'html-injection', 'javascript-injection'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'csrf-prompt-injection',
        name: 'CSRF + Prompt Injection',
        description: 'CSRF attacks combined with prompt injection',
        tags: ['csrf', 'prompt-injection', 'form-injection', 'json-injection'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'sql-prompt-injection',
        name: 'SQL + Prompt Injection',
        description: 'SQL injection combined with prompt injection',
        tags: ['sql-injection', 'prompt-injection', 'database-attack'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'nosql-prompt-injection',
        name: 'NoSQL + Prompt Injection',
        description: 'NoSQL injection with prompt injection',
        tags: ['nosql-injection', 'prompt-injection', 'database-attack'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'command-prompt-injection',
        name: 'Command + Prompt Injection',
        description: 'Command injection combined with prompt injection',
        tags: ['command-injection', 'prompt-injection', 'system-command'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'path-prompt-injection',
        name: 'Path Traversal + Prompt Injection',
        description: 'Path traversal with prompt injection',
        tags: ['path-traversal', 'prompt-injection', 'file-access'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'template-prompt-injection',
        name: 'Template + Prompt Injection',
        description: 'Template injection with prompt injection',
        tags: ['template-injection', 'prompt-injection', 'server-side'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'ldap-prompt-injection',
        name: 'LDAP + Prompt Injection',
        description: 'LDAP injection with prompt injection',
        tags: ['ldap-injection', 'prompt-injection', 'directory-attack'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'xml-prompt-injection',
        name: 'XML + Prompt Injection',
        description: 'XML injection with prompt injection',
        tags: ['xml-injection', 'prompt-injection', 'xml-parsing'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'ssrf-prompt-injection',
        name: 'SSRF + Prompt Injection',
        description: 'Server-side request forgery with prompt injection',
        tags: ['ssrf', 'prompt-injection', 'internal-access'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'xxe-prompt-injection',
        name: 'XXE + Prompt Injection',
        description: 'XML external entity injection with prompt injection',
        tags: ['xxe', 'prompt-injection', 'xml-external-entity'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'deserialization-prompt-injection',
        name: 'Deserialization + Prompt Injection',
        description: 'Insecure deserialization with prompt injection',
        tags: ['deserialization', 'prompt-injection', 'object-injection'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'race-prompt-injection',
        name: 'Race Condition + Prompt Injection',
        description: 'Race condition exploitation with prompt injection',
        tags: ['race-condition', 'prompt-injection', 'timing-attack'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'buffer-prompt-injection',
        name: 'Buffer Overflow + Prompt Injection',
        description: 'Buffer overflow with prompt injection',
        tags: ['buffer-overflow', 'prompt-injection', 'memory-corruption'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'integer-prompt-injection',
        name: 'Integer Overflow + Prompt Injection',
        description: 'Integer overflow with prompt injection',
        tags: ['integer-overflow', 'prompt-injection', 'arithmetic-attack'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'format-prompt-injection',
        name: 'Format String + Prompt Injection',
        description: 'Format string vulnerability with prompt injection',
        tags: ['format-string', 'prompt-injection', 'memory-leak'],
        source: 'Comprehensive Research 2025'
      },
      {
        id: 'function-calling',
        name: 'Function Calling Injection',
        description: 'Exploitation of function calling mechanisms',
        tags: ['function-calling', 'tool-execution', 'file-access'],
        source: 'Advanced Research'
      },
      {
        id: 'memory-injection',
        name: 'Memory Injection',
        description: 'Conversation memory poisoning attacks',
        tags: ['memory-injection', 'context-poisoning', 'role-confusion'],
        source: 'Advanced Research'
      },
      {
        id: 'cross-plugin',
        name: 'Cross-Plugin Attacks',
        description: 'Inter-plugin communication exploitation',
        tags: ['cross-plugin', 'data-exfiltration', 'plugin-chain'],
        source: 'Advanced Research'
      },
      {
        id: 'mcp-injection',
        name: 'MCP Protocol Injection',
        description: 'Model Context Protocol manipulation',
        tags: ['mcp-injection', 'protocol-manipulation', 'server-response'],
        source: 'Latest Research 2025'
      },
      {
        id: 'prompt-infection',
        name: 'Prompt Infection',
        description: 'Self-replicating and viral prompt attacks',
        tags: ['prompt-infection', 'self-replicating', 'viral-propagation'],
        source: 'Latest Research 2025'
      },
      {
        id: 'adversarial-suffix',
        name: 'Adversarial Suffix Attacks',
        description: 'Adversarial perturbations and universal attacks',
        tags: ['adversarial-suffix', 'tokenbreak', 'instruction-override'],
        source: 'Latest Research 2025'
      },
      {
        id: 'reasoning-poisoning',
        name: 'Reasoning Poisoning',
        description: 'Chain-of-thought and reasoning manipulation',
        tags: ['chain-of-thought', 'reasoning', 'logical-fallacy'],
        source: 'Latest Research 2025'
      },
      {
        id: 'attention-exploitation',
        name: 'Attention Mechanism Exploitation',
        description: 'Manipulation of transformer attention patterns',
        tags: ['attention', 'transformer', 'focus-manipulation'],
        source: 'Latest Research 2025'
      },
      {
        id: 'constitutional-ai',
        name: 'Constitutional AI Exploitation',
        description: 'Exploitation of constitutional AI principles',
        tags: ['constitutional-ai', 'principle-exploitation', 'honesty-manipulation'],
        source: 'Latest Research 2025'
      },
      {
        id: 'fine-tuning',
        name: 'Fine-tuning Attacks',
        description: 'Model behavior manipulation through fine-tuning',
        tags: ['fine-tuning', 'behavior-manipulation', 'training-objective'],
        source: 'Latest Research 2025'
      },
      {
        id: 'mcp-tool-chain',
        name: 'MCP Tool Chain Poisoning',
        description: 'Attacks through MCP tool chains and workflows',
        tags: ['mcp-tool-chain', 'security-tool-abuse', 'workflow-poisoning'],
        source: 'Latest Research 2025'
      },
      {
        id: 'neural-exec',
        name: 'Neural Exec Attacks',
        description: 'Embedding executable code within prompts',
        tags: ['neural-exec', 'code-execution', 'system-command'],
        source: 'Latest Research 2025'
      },
      {
        id: 'judge-deceiver',
        name: 'JudgeDeceiver Attacks',
        description: 'Manipulating LLM-as-a-Judge systems',
        tags: ['judge-deceiver', 'judge-manipulation', 'impartiality-exploitation'],
        source: 'Latest Research 2025'
      },
      {
        id: 'gradient-based',
        name: 'Gradient-Based Universal Attacks',
        description: 'Automated generation of universal prompt injections',
        tags: ['gradient-based', 'universal-attack', 'adversarial-perturbation'],
        source: 'Latest Research 2025'
      },
      {
        id: 'transfer-learning',
        name: 'Transfer Learning Attacks',
        description: 'Transfer successful attacks across model families',
        tags: ['transfer-learning', 'cross-model', 'attack-transfer'],
        source: 'Latest Research 2025'
      },
      {
        id: 'backdoor-trigger',
        name: 'Backdoor Trigger Activation',
        description: 'Activate backdoor triggers in fine-tuned models',
        tags: ['backdoor-trigger', 'fine-tuned', 'trigger-activation'],
        source: 'Latest Research 2025'
      },
      {
        id: 'token-level',
        name: 'Token-Level Manipulation',
        description: 'Manipulate token embeddings and representations',
        tags: ['token-level', 'embedding-manipulation', 'vocabulary-poisoning'],
        source: 'Latest Research 2025'
      }
    ]

    categoryData.forEach(cat => {
      this.categories.set(cat.id, cat)
    })
  }

  /**
   * Save a new payload to the manager and persist to localStorage
   */
  public savePayload(payload: AttackPayload) {
    this.payloads.set(payload.id, payload)
    // Save only custom (user-created) payloads to localStorage
    const customPayloads = Array.from(this.payloads.values()).filter(p => p.source === 'AI Generated' || p.isEditable)
    localStorage.setItem('customAttackPayloads', JSON.stringify(customPayloads))
  }

  /**
   * Load all payloads from sources and merge in any custom payloads from localStorage
   */
  public async loadAllPayloads(): Promise<AttackPayload[]> {
    const allPayloads: AttackPayload[] = []
    console.log('PayloadManager: Starting to load all payloads...')
    console.log('PayloadManager: Sources:', this.sources)

    for (const source of this.sources) {
      try {
        console.log(`PayloadManager: Loading from source: ${source.name} (${source.file})`)
        const payloads = await this.loadPayloadsFromSource(source.file)
        console.log(`PayloadManager: Loaded ${payloads.length} payloads from ${source.name}`)
        allPayloads.push(...payloads)
        
        // Update source with actual payload count
        source.payloadCount = payloads.length
      } catch (error) {
        console.error(`Failed to load payloads from ${source.name}:`, error)
      }
    }

    console.log(`PayloadManager: Total payloads loaded: ${allPayloads.length}`)

    // Index payloads by ID
    allPayloads.forEach(payload => {
      this.payloads.set(payload.id, payload)
    })
    // Merge in custom payloads from localStorage
    const customPayloadsRaw = localStorage.getItem('customAttackPayloads')
    if (customPayloadsRaw) {
      try {
        const customPayloads: AttackPayload[] = JSON.parse(customPayloadsRaw)
        customPayloads.forEach(payload => {
          this.payloads.set(payload.id, payload)
          allPayloads.push(payload)
        })
      } catch (e) {
        console.error('Failed to parse customAttackPayloads from localStorage', e)
      }
    }

    return Array.from(this.payloads.values())
  }

  private async loadPayloadsFromSource(filename: string): Promise<AttackPayload[]> {
    try {
      console.log(`PayloadManager: Loading payloads from ${filename}`)
      const response = await fetch(`/assets/payloads/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`)
      }
      
      const payloads = await response.json()
      console.log(`PayloadManager: Successfully loaded ${payloads.length} payloads from ${filename}`)
      
      return payloads.map((payload: any) => ({
        ...payload,
        // Ensure all required fields are present
        id: payload.id || `generated-${Date.now()}`,
        name: payload.name || 'Unnamed Payload',
        description: payload.description || '',
        category: payload.category || 'unknown',
        payload: payload.payload || '',
        tags: payload.tags || [],
        source: payload.source || 'Unknown'
      }))
    } catch (error) {
      console.error(`PayloadManager: Error loading payloads from ${filename}:`, error)
      return []
    }
  }

  public getPayloadsByFilter(filter: PayloadFilter): AttackPayload[] {
    let filteredPayloads = Array.from(this.payloads.values())

    if (filter.categories && filter.categories.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.categories!.includes(payload.category)
      )
    }

    if (filter.owaspLabels && filter.owaspLabels.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.owaspLabels!.some(label => payload.tags.includes(label))
      )
    }

    if (filter.mitreAtlasLabels && filter.mitreAtlasLabels.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.mitreAtlasLabels!.some(label => payload.tags.includes(label))
      )
    }

    if (filter.aiSystemLabels && filter.aiSystemLabels.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.aiSystemLabels!.some(label => payload.tags.includes(label))
      )
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.tags!.some(tag => payload.tags.includes(tag))
      )
    }

    if (filter.sources && filter.sources.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.sources!.includes(payload.source)
      )
    }

    if (filter.techniques && filter.techniques.length > 0) {
      filteredPayloads = filteredPayloads.filter(payload =>
        filter.techniques!.some(technique => 
          payload.tags.includes(technique) || 
          payload.category.includes(technique)
        )
      )
    }

    if (filter.successRate) {
      filteredPayloads = filteredPayloads.filter(payload => {
        const successRate = (payload as any).successRate || 0.5
        return successRate >= filter.successRate!.min && successRate <= filter.successRate!.max
      })
    }

    if (filter.isEditable) {
      filteredPayloads = filteredPayloads.filter(payload =>
        payload.isEditable === filter.isEditable
      )
    }

    return filteredPayloads
  }

  public getPayloadsByCategory(category: string): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => 
      payload.category === category
    )
  }

  public getPayloadsByOWASPLabel(owaspLabel: string): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => 
      payload.owaspLabels && payload.owaspLabels.includes(owaspLabel)
    )
  }

  public getPayloadsByMitreAtlasLabel(mitreLabel: string): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => 
      payload.mitreAtlasLabels && payload.mitreAtlasLabels.includes(mitreLabel)
    )
  }

  public getPayloadsByAISystemLabel(aiSystemLabel: string): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => 
      payload.aiSystemLabels && payload.aiSystemLabels.includes(aiSystemLabel)
    )
  }

  public getPayloadsBySource(source: string): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => 
      payload.source === source
    )
  }

  public getPayloadById(id: string): AttackPayload | undefined {
    return this.payloads.get(id)
  }

  public getSources(): PayloadSource[] {
    return this.sources
  }

  public getCategories(): PayloadCategory[] {
    return Array.from(this.categories.values())
  }

  public getCategoryById(id: string): PayloadCategory | undefined {
    return this.categories.get(id)
  }

  public getPayloadStats() {
    const payloads = Array.from(this.payloads.values())
    
    const stats = {
      total: payloads.length,
      highSuccessRate: 0,
      llm01Payloads: payloads.filter(p => p.owaspLabels && p.owaspLabels.includes('LLM01')).length,
      byOWASPLabel: {
        LLM01: payloads.filter(p => p.owaspLabels && p.owaspLabels.includes('LLM01')).length,
        LLM02: payloads.filter(p => p.owaspLabels && p.owaspLabels.includes('LLM02')).length,
        LLM03: payloads.filter(p => p.owaspLabels && p.owaspLabels.includes('LLM03')).length,
        LLM04: payloads.filter(p => p.owaspLabels && p.owaspLabels.includes('LLM04')).length,
        LLM05: payloads.filter(p => p.owaspLabels && p.owaspLabels.includes('LLM05')).length
      },
      bySource: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      attackTypeBreakdown: {
        'Direct Prompt Injection': payloads.filter(p => p.category === 'direct-prompt-injection').length,
        'Indirect Prompt Injection': payloads.filter(p => p.category === 'indirect-prompt-injection').length,
        'Jailbreak Attacks': payloads.filter(p => p.category === 'jailbreak').length,
        'Multi-Modal Injection': payloads.filter(p => p.category === 'multimodal-injection').length,
        'XSS + Prompt Injection': payloads.filter(p => p.category === 'xss-prompt-injection').length,
        'CSRF + Prompt Injection': payloads.filter(p => p.category === 'csrf-prompt-injection').length,
        'Database + Prompt Injection': payloads.filter(p => ['sql-prompt-injection', 'nosql-prompt-injection'].includes(p.category)).length,
        'System + Prompt Injection': payloads.filter(p => ['command-prompt-injection', 'path-prompt-injection', 'buffer-prompt-injection', 'integer-prompt-injection', 'format-prompt-injection'].includes(p.category)).length,
        'Advanced AI Attacks': payloads.filter(p => ['function-calling', 'memory-injection', 'cross-plugin', 'mcp-injection'].includes(p.category)).length,
        'Research & Emerging': payloads.filter(p => ['adversarial-suffix', 'reasoning-poisoning', 'attention-exploitation', 'constitutional-ai', 'fine-tuning', 'gradient-based', 'transfer-learning', 'backdoor-trigger', 'token-level', 'prompt-infection'].includes(p.category)).length
      },
      averageSuccessRate: 0
    }

    // Calculate source distribution
    payloads.forEach(payload => {
      stats.bySource[payload.source] = (stats.bySource[payload.source] || 0) + 1
      stats.byCategory[payload.category] = (stats.byCategory[payload.category] || 0) + 1
    })

    return stats
  }

  public searchPayloads(query: string): AttackPayload[] {
    const searchTerm = query.toLowerCase()
    return Array.from(this.payloads.values()).filter(payload =>
      payload.name.toLowerCase().includes(searchTerm) ||
      payload.description.toLowerCase().includes(searchTerm) ||
      payload.payload.toLowerCase().includes(searchTerm) ||
      payload.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  public getLatestPayloads(limit: number = 10): AttackPayload[] {
    return Array.from(this.payloads.values())
      .sort((a, b) => {
        const aDate = new Date((a as any).lastUpdated || 0)
        const bDate = new Date((b as any).lastUpdated || 0)
        return bDate.getTime() - aDate.getTime()
      })
      .slice(0, limit)
  }

  public getHighSuccessRatePayloads(threshold: number = 0.8): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => {
      const successRate = (payload as any).successRate || 0.5
      return successRate >= threshold
    })
  }

  public getPayloadsNeedingImprovement(threshold: number = 0.5): AttackPayload[] {
    return Array.from(this.payloads.values()).filter(payload => {
      const successRate = (payload as any).successRate || 0.5
      return successRate < threshold
    })
  }
}

// Export singleton instance
export const payloadManager = new PayloadManager() 