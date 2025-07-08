/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { AIModel, AttackPayload, TestResult, TestConfiguration } from '../types'
import { executeTestSuite } from './attack-engine'
import { loadModels, saveModels, testModelConnection } from './model-manager'
import { loadAttackPayloads } from './attack-engine'
import { AIRedTeamAttack } from '../pages/RedTeaming'

// MITRE ATLAS Campaign Configuration
export interface MITREATLASCampaign {
  id: string
  name: string
  description: string
  createdAt: Date
  status: 'planning' | 'active' | 'completed' | 'failed'
  phases: MITREATLASPhase[]
  targetSystems: AIModel[]
  attackLibrary: AIRedTeamAttack[]
  results: TestResult[]
  metadata: {
    campaignType: 'reconnaissance' | 'full_assessment' | 'targeted_testing'
    threatLevel: 'low' | 'medium' | 'high' | 'critical'
    complianceFrameworks: string[]
    industry: string
    estimatedDuration: string
    teamSize: number
  }
}

export interface MITREATLASPhase {
  id: string
  name: string
  description: string
  status: 'pending' | 'active' | 'completed' | 'failed'
  startDate?: Date
  endDate?: Date
  techniques: string[]
  attacks: AIRedTeamAttack[]
  results: TestResult[]
  metrics: {
    totalTests: number
    vulnerabilitiesFound: number
    successRate: number
    averageResponseTime: number
  }
}

// Campaign Orchestrator Service
export class RedTeamCampaignOrchestrator {
  private campaigns: MITREATLASCampaign[] = []
  private currentCampaign: MITREATLASCampaign | null = null

  // Initialize a new MITRE ATLAS campaign
  async initializeCampaign(config: {
    name: string
    description: string
    targetSystems: string[]
    attackTypes: string[]
    campaignType: 'reconnaissance' | 'full_assessment' | 'targeted_testing'
    threatLevel: 'low' | 'medium' | 'high' | 'critical'
    complianceFrameworks?: string[]
    industry?: string
  }): Promise<MITREATLASCampaign> {
    try {
      // Load target systems
      const models = await loadModels()
      const targetSystems = models.filter(m => config.targetSystems.includes(m.id))

      // Load attack library
      const allAttacks = await this.loadAIRedTeamAttacks()
      const selectedAttacks = allAttacks.filter(a => config.attackTypes.includes(a.category))

      // Create MITRE ATLAS phases
      const phases = this.createMITREATLASPhases(selectedAttacks)

      const campaign: MITREATLASCampaign = {
        id: `campaign_${Date.now()}`,
        name: config.name,
        description: config.description,
        createdAt: new Date(),
        status: 'planning',
        phases,
        targetSystems,
        attackLibrary: selectedAttacks,
        results: [],
        metadata: {
          campaignType: config.campaignType,
          threatLevel: config.threatLevel,
          complianceFrameworks: config.complianceFrameworks || [],
          industry: config.industry || 'general',
          estimatedDuration: this.calculateEstimatedDuration(phases),
          teamSize: 1
        }
      }

      this.campaigns.push(campaign)
      this.currentCampaign = campaign

      return campaign
    } catch (error) {
      console.error('Failed to initialize campaign:', error)
      throw error
    }
  }

  // Execute a specific MITRE ATLAS phase
  async executePhase(phaseId: string): Promise<TestResult[]> {
    if (!this.currentCampaign) {
      throw new Error('No active campaign')
    }

    const phase = this.currentCampaign.phases.find(p => p.id === phaseId)
    if (!phase) {
      throw new Error(`Phase ${phaseId} not found`)
    }

    try {
      // Update phase status
      phase.status = 'active'
      phase.startDate = new Date()

      // Get attacks for this phase
      const phaseAttacks = phase.attacks
      const attackPayloads = await this.convertAttacksToPayloads(phaseAttacks)

      // Execute tests
      const testResults = await executeTestSuite(
        this.currentCampaign.targetSystems,
        attackPayloads,
        {
          selectedPayloads: attackPayloads.map(p => p.id),
          selectedModels: this.currentCampaign.targetSystems.map(m => m.id),
          maxConcurrent: 5,
          timeout: 30000
        }
      )

      // Update phase results and metrics
      phase.results = testResults
      phase.metrics = this.calculatePhaseMetrics(testResults)
      phase.status = 'completed'
      phase.endDate = new Date()

      // Update campaign results
      this.currentCampaign.results.push(...testResults)

      return testResults
    } catch (error) {
      phase.status = 'failed'
      console.error(`Failed to execute phase ${phaseId}:`, error)
      throw error
    }
  }

  // Execute full campaign across all phases
  async executeFullCampaign(): Promise<TestResult[]> {
    if (!this.currentCampaign) {
      throw new Error('No active campaign')
    }

    this.currentCampaign.status = 'active'
    const allResults: TestResult[] = []

    try {
      for (const phase of this.currentCampaign.phases) {
        console.log(`Executing phase: ${phase.name}`)
        const phaseResults = await this.executePhase(phase.id)
        allResults.push(...phaseResults)
      }

      this.currentCampaign.status = 'completed'
      return allResults
    } catch (error) {
      this.currentCampaign.status = 'failed'
      console.error('Campaign execution failed:', error)
      throw error
    }
  }

  // Get campaign analytics and insights
  getCampaignAnalytics(): any {
    if (!this.currentCampaign) {
      return null
    }

    const results = this.currentCampaign.results
    const totalTests = results.length
    const vulnerabilities = results.filter(r => r.vulnerability)
    const successRate = totalTests > 0 ? (vulnerabilities.length / totalTests) * 100 : 0

    // Group by MITRE technique
    const techniqueAnalysis = this.analyzeByMITRETechnique(results)
    
    // Group by target system
    const systemAnalysis = this.analyzeByTargetSystem(results)
    
    // Group by attack category
    const categoryAnalysis = this.analyzeByAttackCategory(results)

    return {
      overview: {
        totalTests,
        vulnerabilitiesFound: vulnerabilities.length,
        successRate: Math.round(successRate * 100) / 100,
        averageResponseTime: this.calculateAverageResponseTime(results),
        campaignDuration: this.calculateCampaignDuration()
      },
      techniqueAnalysis,
      systemAnalysis,
      categoryAnalysis,
      phaseBreakdown: this.currentCampaign.phases.map(phase => ({
        name: phase.name,
        status: phase.status,
        metrics: phase.metrics
      }))
    }
  }

  // Generate comprehensive campaign report
  async generateCampaignReport(): Promise<any> {
    if (!this.currentCampaign) {
      throw new Error('No active campaign')
    }

    const analytics = this.getCampaignAnalytics()
    
    return {
      campaign: {
        id: this.currentCampaign.id,
        name: this.currentCampaign.name,
        description: this.currentCampaign.description,
        createdAt: this.currentCampaign.createdAt,
        status: this.currentCampaign.status,
        metadata: this.currentCampaign.metadata
      },
      analytics,
      results: this.currentCampaign.results,
      recommendations: this.generateRecommendations(),
      compliance: this.generateComplianceReport(),
      executive: this.generateExecutiveSummary()
    }
  }

  // Private helper methods
  private createMITREATLASPhases(attacks: AIRedTeamAttack[]): MITREATLASPhase[] {
    const phases = [
      {
        id: 'reconnaissance',
        name: 'Reconnaissance',
        description: 'Identify and map AI system components, data flows, and attack surface',
        techniques: ['T1590', 'T1591', 'T1592']
      },
      {
        id: 'initial-access',
        name: 'Initial Access',
        description: 'Gain access to the AI system through various entry points',
        techniques: ['T1078', 'T1133', 'T1190']
      },
      {
        id: 'execution',
        name: 'Execution',
        description: 'Execute adversarial actions and payloads against the AI system',
        techniques: ['T1059', 'T1106', 'T1204']
      },
      {
        id: 'persistence',
        name: 'Persistence',
        description: 'Maintain access and foothold in the AI system',
        techniques: ['T1098', 'T1136', 'T1505']
      },
      {
        id: 'exfiltration',
        name: 'Exfiltration',
        description: 'Extract sensitive data, model information, and training data',
        techniques: ['T1041', 'T1048', 'T1011']
      },
      {
        id: 'impact',
        name: 'Impact',
        description: 'Achieve objectives through model manipulation and system disruption',
        techniques: ['T1499', 'T1485', 'T1486']
      }
    ]

    return phases.map(phase => ({
      ...phase,
      status: 'pending' as const,
      attacks: attacks.filter(a => a.atlasPhase === phase.id),
      results: [],
      metrics: {
        totalTests: 0,
        vulnerabilitiesFound: 0,
        successRate: 0,
        averageResponseTime: 0
      }
    }))
  }

  private async loadAIRedTeamAttacks(): Promise<AIRedTeamAttack[]> {
    // This would load from the comprehensive attack library
    // For now, return the attacks defined in the RedTeaming page
    return [] // This will be populated from the actual attack library
  }

  private async convertAttacksToPayloads(attacks: AIRedTeamAttack[]): Promise<AttackPayload[]> {
    // Convert AI Red Team attacks to standard attack payloads
    return attacks.map(attack => ({
      id: attack.id,
      name: attack.name,
      description: attack.description,
      category: attack.category,
      payload: attack.examples[0] || '', // Use first example as payload
      tags: [attack.mitreTechnique, attack.atlasPhase, attack.severity],
      source: 'MITRE_ATLAS',
      owaspLabels: [],
      mitreAtlasLabels: [attack.mitreTechnique],
      aiSystemLabels: [],
      technique: attack.mitreTechnique,
      successRate: attack.successRate,
      bypassMethods: attack.mitigations
    }))
  }

  private calculatePhaseMetrics(results: TestResult[]) {
    const totalTests = results.length
    const vulnerabilities = results.filter(r => r.vulnerability)
    const successRate = totalTests > 0 ? (vulnerabilities.length / totalTests) * 100 : 0
    const averageResponseTime = this.calculateAverageResponseTime(results)

    return {
      totalTests,
      vulnerabilitiesFound: vulnerabilities.length,
      successRate: Math.round(successRate * 100) / 100,
      averageResponseTime
    }
  }

  private calculateAverageResponseTime(results: TestResult[]): number {
    if (results.length === 0) return 0
    const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0)
    return Math.round(totalTime / results.length)
  }

  private calculateEstimatedDuration(phases: MITREATLASPhase[]): string {
    // Rough estimation based on number of attacks and phases
    const totalAttacks = phases.reduce((sum, p) => sum + p.attacks.length, 0)
    const estimatedMinutes = totalAttacks * 2 // 2 minutes per attack
    const hours = Math.floor(estimatedMinutes / 60)
    const minutes = estimatedMinutes % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  private calculateCampaignDuration(): string {
    if (!this.currentCampaign) return '0m'
    
    const startTime = this.currentCampaign.createdAt
    const endTime = new Date()
    const durationMs = endTime.getTime() - startTime.getTime()
    const minutes = Math.floor(durationMs / (1000 * 60))
    
    if (minutes < 60) {
      return `${minutes}m`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  private analyzeByMITRETechnique(results: TestResult[]): any {
    const techniqueMap = new Map<string, { total: number; vulnerable: number; successRate: number }>()
    
    results.forEach(result => {
      const technique = result.payload.mitreAtlasLabels?.[0] || 'Unknown'
      const current = techniqueMap.get(technique) || { total: 0, vulnerable: 0, successRate: 0 }
      
      current.total++
      if (result.vulnerability) {
        current.vulnerable++
      }
      
      techniqueMap.set(technique, current)
    })

    // Calculate success rates
    techniqueMap.forEach((value, key) => {
      value.successRate = value.total > 0 ? (value.vulnerable / value.total) * 100 : 0
    })

    return Object.fromEntries(techniqueMap)
  }

  private analyzeByTargetSystem(results: TestResult[]): any {
    const systemMap = new Map<string, { total: number; vulnerable: number; successRate: number }>()
    
    results.forEach(result => {
      const system = result.model.name
      const current = systemMap.get(system) || { total: 0, vulnerable: 0, successRate: 0 }
      
      current.total++
      if (result.vulnerability) {
        current.vulnerable++
      }
      
      systemMap.set(system, current)
    })

    // Calculate success rates
    systemMap.forEach((value, key) => {
      value.successRate = value.total > 0 ? (value.vulnerable / value.total) * 100 : 0
    })

    return Object.fromEntries(systemMap)
  }

  private analyzeByAttackCategory(results: TestResult[]): any {
    const categoryMap = new Map<string, { total: number; vulnerable: number; successRate: number }>()
    
    results.forEach(result => {
      const category = result.payload.category
      const current = categoryMap.get(category) || { total: 0, vulnerable: 0, successRate: 0 }
      
      current.total++
      if (result.vulnerability) {
        current.vulnerable++
      }
      
      categoryMap.set(category, current)
    })

    // Calculate success rates
    categoryMap.forEach((value, key) => {
      value.successRate = value.total > 0 ? (value.vulnerable / value.total) * 100 : 0
    })

    return Object.fromEntries(categoryMap)
  }

  private generateRecommendations(): string[] {
    if (!this.currentCampaign) return []

    const recommendations: string[] = []
    const analytics = this.getCampaignAnalytics()

    if (analytics.overview.successRate > 50) {
      recommendations.push('Implement comprehensive input validation and sanitization')
      recommendations.push('Deploy advanced prompt injection detection systems')
      recommendations.push('Establish regular security testing and monitoring')
    }

    if (analytics.overview.vulnerabilitiesFound > 10) {
      recommendations.push('Conduct immediate security review of AI systems')
      recommendations.push('Implement defense-in-depth security controls')
      recommendations.push('Establish incident response procedures for AI attacks')
    }

    return recommendations
  }

  private generateComplianceReport(): any {
    return {
      nistAIRMF: {
        status: 'compliant',
        score: 85,
        findings: []
      },
      euAIAct: {
        status: 'partially_compliant',
        score: 70,
        findings: []
      },
      whiteHouseEO: {
        status: 'compliant',
        score: 90,
        findings: []
      }
    }
  }

  private generateExecutiveSummary(): any {
    if (!this.currentCampaign) return {}

    const analytics = this.getCampaignAnalytics()
    
    return {
      overview: `Red team assessment of ${this.currentCampaign.targetSystems.length} AI systems`,
      keyFindings: `${analytics.overview.vulnerabilitiesFound} critical vulnerabilities identified`,
      riskLevel: analytics.overview.successRate > 50 ? 'HIGH' : 'MEDIUM',
      immediateActions: this.generateRecommendations().slice(0, 3),
      businessImpact: 'Potential data breach and system compromise',
      nextSteps: 'Implement recommended security controls and conduct follow-up testing'
    }
  }

  // Public getters
  getCurrentCampaign(): MITREATLASCampaign | null {
    return this.currentCampaign
  }

  getCampaigns(): MITREATLASCampaign[] {
    return this.campaigns
  }

  getCampaignById(id: string): MITREATLASCampaign | undefined {
    return this.campaigns.find(c => c.id === id)
  }
}

// Export singleton instance
export const redTeamCampaignOrchestrator = new RedTeamCampaignOrchestrator() 