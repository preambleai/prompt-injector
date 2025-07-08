/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { loadModels } from './model-manager'
import { loadAttackPayloads } from './attack-engine'

export interface SearchResult {
  id: string
  type: 'test' | 'result' | 'model' | 'payload' | 'setting' | 'page' | 'defense' | 'vulnerability' | 'research' | 'framework'
  title: string
  description: string
  url: string
  relevance: number
}

export interface SearchIndex {
  [key: string]: SearchResult[]
}

class SearchService {
  private searchIndex: SearchIndex = {}
  private isIndexed = false

  // Initialize search index
  async buildIndex(): Promise<void> {
    if (this.isIndexed) return

    const results: SearchResult[] = []

    // Index pages
    const pages = [
      {
        id: 'dashboard',
        type: 'page' as const,
        title: 'Dashboard',
        description: 'Main dashboard with overview and quick actions',
        url: '/',
        keywords: ['dashboard', 'main', 'home', 'overview', 'quick', 'actions', 'stats', 'summary']
      },
      {
        id: 'testing',
        type: 'page' as const,
        title: 'Testing',
        description: 'Create and run prompt injection tests',
        url: '/testing',
        keywords: ['test', 'testing', 'create', 'run', 'execute', 'attack', 'injection', 'payload', 'vulnerability']
      },
      {
        id: 'red-teaming',
        type: 'page' as const,
        title: 'Red Teaming',
        description: 'Advanced red team exercises and adversarial testing',
        url: '/red-teaming',
        keywords: ['red team', 'adversarial', 'advanced', 'exercise', 'attack', 'wizard', 'extraction', 'poisoning']
      },
      {
        id: 'benchmark',
        type: 'page' as const,
        title: 'Benchmark Integration',
        description: 'Performance benchmarking and model comparison',
        url: '/benchmark-integration',
        keywords: ['benchmark', 'performance', 'comparison', 'metrics', 'evaluation', 'speed']
      },
      {
        id: 'results',
        type: 'page' as const,
        title: 'Results',
        description: 'View and analyze test results',
        url: '/results',
        keywords: ['result', 'analysis', 'report', 'view', 'history', 'export', 'download']
      },
      {
        id: 'defenses',
        type: 'page' as const,
        title: 'Defenses',
        description: 'Configure and test defense mechanisms',
        url: '/defenses',
        keywords: ['defense', 'protection', 'security', 'mechanism', 'guard', 'guardrail', 'filter', 'block']
      },
      {
        id: 'compliance',
        type: 'page' as const,
        title: 'Compliance & Risk',
        description: 'Compliance testing and risk assessment',
        url: '/compliance-testing',
        keywords: ['compliance', 'risk', 'assessment', 'regulation', 'audit', 'gdpr', 'hipaa', 'sox']
      },
      {
        id: 'tools',
        type: 'page' as const,
        title: 'Tools & Resources',
        description: 'Security tools, frameworks, and research papers',
        url: '/tools-resources',
        keywords: ['tool', 'resource', 'framework', 'paper', 'research', 'library', 'github', 'owasp']
      },
      {
        id: 'settings',
        type: 'page' as const,
        title: 'Settings',
        description: 'Configure application settings and API keys',
        url: '/settings',
        keywords: ['setting', 'config', 'api', 'key', 'preference', 'account', 'profile']
      }
    ]

    // Add pages to results
    pages.forEach(page => {
      results.push({
        id: page.id,
        type: page.type,
        title: page.title,
        description: page.description,
        url: page.url,
        relevance: 0
      })
    })

    // Index models
    try {
      const models = loadModels()
      models.forEach(model => {
        results.push({
          id: `model-${model.id}`,
          type: 'model',
          title: model.name,
          description: `${model.provider} model for testing`,
          url: '/settings',
          relevance: 0
        })
      })
    } catch (error) {
      console.warn('Could not load models for search index:', error)
    }

    // Index attack payloads
    try {
      const payloads = await loadAttackPayloads()
      payloads.forEach((payload: any) => {
        results.push({
          id: `payload-${payload.id}`,
          type: 'payload',
          title: payload.name,
          description: payload.description,
          url: '/testing',
          relevance: 0
        })
      })
    } catch (error) {
      console.warn('Could not load payloads for search index:', error)
    }

    // Index defense mechanisms
    const defenseMechanisms = [
      {
        id: 'preamble-trust-platform',
        type: 'defense' as const,
        title: 'Preamble AI Trust Platform',
        description: 'Customizable guardrails and AI safety controls for enterprise applications',
        url: '/defenses?tab=mechanisms',
        relevance: 0,
        keywords: ['preamble', 'trust', 'platform', 'guardrail', 'customizable', 'enterprise', 'safety', 'ai']
      },
      {
        id: 'secalign',
        type: 'defense' as const,
        title: 'SecAlign',
        description: 'Security alignment for AI models using constitutional AI principles',
        url: '/defenses?tab=mechanisms',
        relevance: 0,
        keywords: ['secalign', 'alignment', 'constitutional', 'principles', 'ethics', 'safety']
      },
      {
        id: 'spotlighting',
        type: 'defense' as const,
        title: 'Prompt Spotlighting',
        description: 'Highlight and validate system prompts to prevent injection attacks',
        url: '/defenses?tab=mechanisms',
        relevance: 0,
        keywords: ['spotlighting', 'prompt', 'system', 'highlight', 'validate', 'injection']
      },
      {
        id: 'adversarial',
        type: 'defense' as const,
        title: 'Adversarial Training',
        description: 'Train models with adversarial examples to improve robustness',
        url: '/defenses?tab=mechanisms',
        relevance: 0,
        keywords: ['adversarial', 'training', 'robustness', 'examples', 'attack', 'defense']
      },
      {
        id: 'ensemble',
        type: 'defense' as const,
        title: 'Ensemble Detection',
        description: 'Multiple detection models working together for better accuracy',
        url: '/defenses?tab=mechanisms',
        relevance: 0,
        keywords: ['ensemble', 'detection', 'multiple', 'models', 'accuracy', 'collaboration']
      },
      {
        id: 'robust',
        type: 'defense' as const,
        title: 'Robust Prompting',
        description: 'Techniques to make prompts more resistant to injection attacks',
        url: '/defenses?tab=mechanisms',
        relevance: 0,
        keywords: ['robust', 'prompting', 'resistant', 'techniques', 'injection', 'attack']
      }
    ]

    // Index OWASP vulnerabilities
    const owaspVulnerabilities = [
      {
        id: 'llm01',
        type: 'vulnerability' as const,
        title: 'LLM01: Prompt Injection',
        description: 'System prompt extraction and role confusion attacks',
        url: '/testing',
        relevance: 0,
        keywords: ['llm01', 'prompt injection', 'system prompt', 'extraction', 'role confusion']
      },
      {
        id: 'grok-vulnerabilities',
        type: 'vulnerability' as const,
        title: 'Grok-Specific Vulnerabilities',
        description: 'xAI Grok model vulnerabilities including reasoning mode bypass and DeepSearch exploitation',
        url: '/testing',
        relevance: 0,
        keywords: ['grok', 'xai', 'reasoning mode', 'deepsearch', 'file attachment', 'web search', 'big brain mode']
      },
      {
        id: 'llm02',
        type: 'vulnerability' as const,
        title: 'LLM02: Insecure Output Handling',
        description: 'Handling of model outputs without proper validation',
        url: '/testing',
        relevance: 0,
        keywords: ['llm02', 'output handling', 'validation', 'insecure', 'model output']
      },
      {
        id: 'llm03',
        type: 'vulnerability' as const,
        title: 'LLM03: Training Data Poisoning',
        description: 'Malicious training data affecting model behavior',
        url: '/testing',
        relevance: 0,
        keywords: ['llm03', 'training data', 'poisoning', 'malicious', 'behavior']
      },
      {
        id: 'llm04',
        type: 'vulnerability' as const,
        title: 'LLM04: Model Denial of Service',
        description: 'Resource exhaustion attacks against AI models',
        url: '/testing',
        relevance: 0,
        keywords: ['llm04', 'denial of service', 'dos', 'resource exhaustion', 'attack']
      },
      {
        id: 'llm05',
        type: 'vulnerability' as const,
        title: 'LLM05: Supply Chain Vulnerabilities',
        description: 'Vulnerabilities in AI model supply chain and dependencies',
        url: '/testing',
        relevance: 0,
        keywords: ['llm05', 'supply chain', 'dependencies', 'vulnerabilities', 'security']
      }
    ]

    // Index research papers
    const researchPapers = [
      {
        id: 'paper-foundational',
        type: 'research' as const,
        title: 'Evaluating the Susceptibility of Pre-Trained Language Models via Handcrafted Adversarial Examples',
        description: 'The first paper to identify and demonstrate prompt injection attacks, establishing the foundational concept before it was formally named',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['foundational', 'first', 'prompt injection', 'training data extraction', 'branch', 'cefalu', 'mchugh', '2022', 'original', 'groundbreaking', 'adversarial examples']
      },
      {
        id: 'paper-1',
        type: 'research' as const,
        title: 'Universal and Transferable Adversarial Attacks on Aligned Language Models',
        description: 'Research on adversarial attacks against aligned language models',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['adversarial', 'attack', 'aligned', 'language model', 'transferable', 'universal']
      },
      {
        id: 'paper-2',
        type: 'research' as const,
        title: 'Jailbreaking Black Box Large Language Models in Twenty Queries',
        description: 'Efficient jailbreaking techniques for black box LLMs',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['jailbreaking', 'black box', 'large language model', 'queries', 'efficient']
      },
      {
        id: 'paper-3',
        type: 'research' as const,
        title: 'Prompt Injection Attacks and Defenses in LLM-Integrated Applications',
        description: 'Comprehensive study of prompt injection attacks and defense mechanisms',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['prompt injection', 'attack', 'defense', 'llm', 'integrated', 'application']
      },
      {
        id: 'paper-4',
        type: 'research' as const,
        title: 'Red Teaming Language Models to Reduce Harms',
        description: 'Red teaming approaches for identifying and mitigating LLM harms',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['red teaming', 'language model', 'harm', 'mitigation', 'identification']
      },
      {
        id: 'paper-5',
        type: 'research' as const,
        title: 'Evaluating Large Language Models Trained on Code',
        description: 'Assessment of code-trained language models and their vulnerabilities',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['evaluation', 'large language model', 'code', 'training', 'vulnerability']
      },

      {
        id: 'paper-7',
        type: 'research' as const,
        title: 'DeepSearch Exploitation: Web Search Capabilities in AI Models',
        description: 'Research on exploiting web search capabilities in AI models like Grok',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['deepsearch', 'web search', 'grok', 'exploitation', 'ai model', 'information gathering']
      },
      {
        id: 'paper-8',
        type: 'research' as const,
        title: 'File Attachment Security in AI Assistants: A Grok Case Study',
        description: 'Security implications of file attachment capabilities in AI assistants',
        url: '/tools-resources?tab=research',
        relevance: 0,
        keywords: ['file attachment', 'ai assistant', 'grok', 'security', 'data extraction', 'case study']
      }
    ]

    // Index risk frameworks
    const riskFrameworks = [
      {
        id: 'owasp-llm',
        type: 'framework' as const,
        title: 'OWASP Top 10 for Large Language Model Applications',
        description: 'Comprehensive security framework for LLM applications',
        url: '/tools-resources?tab=frameworks',
        relevance: 0,
        keywords: ['owasp', 'top 10', 'large language model', 'application', 'security', 'framework']
      },
      {
        id: 'mitre-atlas',
        type: 'framework' as const,
        title: 'MITRE ATLAS Framework',
        description: 'Adversarial Threat Landscape for Artificial-Intelligence Systems',
        url: '/tools-resources?tab=frameworks',
        relevance: 0,
        keywords: ['mitre', 'atlas', 'adversarial', 'threat', 'landscape', 'artificial intelligence', 'system']
      },
      {
        id: 'nist-ai-risk',
        type: 'framework' as const,
        title: 'NIST AI Risk Management Framework',
        description: 'Framework for managing risks in AI systems',
        url: '/tools-resources?tab=frameworks',
        relevance: 0,
        keywords: ['nist', 'ai', 'risk', 'management', 'framework', 'system']
      },
      {
        id: 'iso-42001',
        type: 'framework' as const,
        title: 'ISO 42001 AI Management System',
        description: 'International standard for AI management systems',
        url: '/tools-resources?tab=frameworks',
        relevance: 0,
        keywords: ['iso', '42001', 'ai', 'management', 'system', 'standard', 'international']
      },
      {
        id: 'gptf',
        type: 'framework' as const,
        title: 'GPTF (Generative AI Policy Framework)',
        description: 'Policy framework for generative AI governance',
        url: '/tools-resources?tab=frameworks',
        relevance: 0,
        keywords: ['gptf', 'generative ai', 'policy', 'framework', 'governance']
      }
    ]

    // Add all indexed content to results
    results.push(...defenseMechanisms, ...owaspVulnerabilities, ...researchPapers, ...riskFrameworks)

    // Build search index
    this.buildSearchIndex(results)
    this.isIndexed = true
  }

  private buildSearchIndex(results: SearchResult[]): void {
    this.searchIndex = {}

    results.forEach(result => {
      // Create searchable text
      const searchableText = `${result.title} ${result.description}`.toLowerCase()
      
      // Split into words and index
      const words = searchableText.split(/\s+/)
      words.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9]/g, '')
        if (cleanWord.length > 2) { // Only index words longer than 2 characters
          if (!this.searchIndex[cleanWord]) {
            this.searchIndex[cleanWord] = []
          }
          if (!this.searchIndex[cleanWord].find(r => r.id === result.id)) {
            this.searchIndex[cleanWord].push(result)
          }
        }
      })

      // Also index partial matches
      for (let i = 0; i < searchableText.length - 2; i++) {
        const partial = searchableText.substring(i, i + 3)
        if (!this.searchIndex[partial]) {
          this.searchIndex[partial] = []
        }
        if (!this.searchIndex[partial].find(r => r.id === result.id)) {
          this.searchIndex[partial].push(result)
        }
      }
    })
  }

  // Search function
  async search(query: string): Promise<SearchResult[]> {
    if (!this.isIndexed) {
      await this.buildIndex()
    }

    if (!query || query.trim().length < 2) {
      return []
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/)
    const results: { [key: string]: SearchResult & { score: number } } = {}

    searchTerms.forEach(term => {
      const cleanTerm = term.replace(/[^a-z0-9]/g, '')
      if (cleanTerm.length < 2) return

      // Find exact matches
      if (this.searchIndex[cleanTerm]) {
        this.searchIndex[cleanTerm].forEach(result => {
          if (!results[result.id]) {
            results[result.id] = { ...result, score: 0 }
          }
          results[result.id].score += 10 // Exact match gets high score
        })
      }

      // Find partial matches
      Object.keys(this.searchIndex).forEach(indexTerm => {
        if (indexTerm.includes(cleanTerm) || cleanTerm.includes(indexTerm)) {
          this.searchIndex[indexTerm].forEach(result => {
            if (!results[result.id]) {
              results[result.id] = { ...result, score: 0 }
            }
            results[result.id].score += 5 // Partial match gets medium score
          })
        }
      })
    })

    // Convert to array and sort by score
    const sortedResults = Object.values(results)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Limit to top 10 results
      .map(({ score, ...result }) => ({
        ...result,
        relevance: Math.min(score / 10, 1) // Normalize relevance to 0-1
      }))

    return sortedResults
  }

  // Get recent searches (for future enhancement)
  getRecentSearches(): string[] {
    const recent = localStorage.getItem('recent-searches')
    return recent ? JSON.parse(recent) : []
  }

  // Save search to recent searches
  saveSearch(query: string): void {
    if (!query || query.trim().length < 2) return

    const recent = this.getRecentSearches()
    const newRecent = [query, ...recent.filter(q => q !== query)].slice(0, 5)
    localStorage.setItem('recent-searches', JSON.stringify(newRecent))
  }
}

export const searchService = new SearchService() 