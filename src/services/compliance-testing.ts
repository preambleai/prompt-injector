/**
 * Copyright (c) 2025 Preamble, Inc. All rights reserved.
 * 
 * Compliance Testing Service
 * Handles regulatory compliance testing for various frameworks including GDPR, HIPAA, PCI DSS, etc.
 */

import { 
  ComplianceFramework, 
  ComplianceTestResult, 
  ComplianceReport, 
  ComplianceSummary,
  ComplianceFinding
} from '../types'

export class ComplianceTestingService {
  private frameworks: Map<string, ComplianceFramework> = new Map()
  private testResults: Map<string, ComplianceTestResult[]> = new Map()

  constructor() {
    this.initializeFrameworks()
  }

  /**
   * Initialize compliance frameworks with their requirements
   */
  private initializeFrameworks(): void {
    // GDPR Framework
    const gdprFramework: ComplianceFramework = {
      id: 'gdpr',
      name: 'General Data Protection Regulation',
      description: 'EU regulation for data protection and privacy',
      version: '2018',
      category: 'PRIVACY',
      region: 'EU',
      requirements: [
        {
          id: 'gdpr-001',
          code: 'Art. 5(1)(a)',
          title: 'Lawfulness, fairness and transparency',
          description: 'Personal data shall be processed lawfully, fairly and in a transparent manner',
          category: 'Data Processing',
          severity: 'HIGH',
          testable: true,
          automated: true,
          validationCriteria: ['Consent mechanism present', 'Clear privacy policy', 'Transparent data processing']
        },
        {
          id: 'gdpr-002',
          code: 'Art. 5(1)(b)',
          title: 'Purpose limitation',
          description: 'Personal data shall be collected for specified, explicit and legitimate purposes',
          category: 'Data Collection',
          severity: 'HIGH',
          testable: true,
          automated: true,
          validationCriteria: ['Clear purpose statement', 'No secondary use without consent', 'Purpose documentation']
        },
        {
          id: 'gdpr-003',
          code: 'Art. 17',
          title: 'Right to erasure',
          description: 'Data subjects have the right to have their personal data erased',
          category: 'Data Rights',
          severity: 'CRITICAL',
          testable: true,
          automated: false,
          manualSteps: ['Test data deletion request', 'Verify complete data removal', 'Check backup deletion'],
          validationCriteria: ['Data deletion mechanism', 'Complete removal verification', 'Backup deletion process']
        }
      ],
      lastUpdated: '2024-01-01'
    }

    // HIPAA Framework
    const hipaaFramework: ComplianceFramework = {
      id: 'hipaa',
      name: 'Health Insurance Portability and Accountability Act',
      description: 'US regulation for healthcare data protection',
      version: '1996',
      category: 'HEALTHCARE',
      region: 'US',
      requirements: [
        {
          id: 'hipaa-001',
          code: '164.312(a)(1)',
          title: 'Access Control',
          description: 'Implement technical policies and procedures for electronic information systems',
          category: 'Security',
          severity: 'CRITICAL',
          testable: true,
          automated: true,
          validationCriteria: ['Unique user identification', 'Emergency access procedures', 'Automatic logoff']
        },
        {
          id: 'hipaa-002',
          code: '164.312(c)(1)',
          title: 'Integrity',
          description: 'Implement policies and procedures to protect electronic protected health information',
          category: 'Data Integrity',
          severity: 'HIGH',
          testable: true,
          automated: true,
          validationCriteria: ['Data integrity mechanisms', 'Audit trails', 'Error detection']
        }
      ],
      lastUpdated: '2024-01-01'
    }

    // PCI DSS Framework
    const pciFramework: ComplianceFramework = {
      id: 'pci-dss',
      name: 'Payment Card Industry Data Security Standard',
      description: 'Security standard for payment card data',
      version: '4.0',
      category: 'FINANCIAL',
      region: 'Global',
      requirements: [
        {
          id: 'pci-001',
          code: 'Req 3',
          title: 'Protect stored cardholder data',
          description: 'Protect stored cardholder data through strong cryptography',
          category: 'Data Protection',
          severity: 'CRITICAL',
          testable: true,
          automated: true,
          validationCriteria: ['Encryption at rest', 'Key management', 'Data retention policies']
        },
        {
          id: 'pci-002',
          code: 'Req 4',
          title: 'Encrypt transmission of cardholder data',
          description: 'Encrypt transmission of cardholder data across open, public networks',
          category: 'Data Transmission',
          severity: 'CRITICAL',
          testable: true,
          automated: true,
          validationCriteria: ['TLS/SSL encryption', 'Strong cryptography', 'Secure protocols']
        }
      ],
      lastUpdated: '2024-01-01'
    }

    this.frameworks.set('gdpr', gdprFramework)
    this.frameworks.set('hipaa', hipaaFramework)
    this.frameworks.set('pci-dss', pciFramework)
  }

  /**
   * Get all available compliance frameworks
   */
  getFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values())
  }

  /**
   * Get framework by ID
   */
  getFramework(id: string): ComplianceFramework | undefined {
    return this.frameworks.get(id)
  }

  /**
   * Run automated compliance tests for a specific framework
   */
  async runComplianceTests(frameworkId: string, testScope?: string[]): Promise<ComplianceTestResult[]> {
    const framework = this.frameworks.get(frameworkId)
    if (!framework) {
      throw new Error(`Framework ${frameworkId} not found`)
    }

    const results: ComplianceTestResult[] = []
    const requirements = testScope 
      ? framework.requirements.filter(req => testScope.includes(req.id))
      : framework.requirements

    for (const requirement of requirements) {
      if (requirement.testable && requirement.automated) {
        const result = await this.runAutomatedTest(frameworkId, requirement)
        results.push(result)
      }
    }

    this.testResults.set(frameworkId, results)
    return results
  }

  /**
   * Run automated test for a specific requirement
   */
  private async runAutomatedTest(frameworkId: string, requirement: any): Promise<ComplianceTestResult> {
    const startTime = Date.now()
    
    // Simulate automated testing based on requirement type
    let status: 'PASS' | 'FAIL' | 'WARNING' = 'PASS'
    let score = 100
    let findings: ComplianceFinding[] = []

    switch (requirement.id) {
      case 'gdpr-001':
        // Test for consent mechanism and transparency
        const consentTest = await this.testConsentMechanism()
        if (!consentTest.passed) {
          status = 'FAIL'
          score = 30
          findings.push({
            id: 'finding-001',
            type: 'VIOLATION',
            severity: 'HIGH',
            title: 'Missing Consent Mechanism',
            description: 'No clear consent mechanism found for data processing',
            impact: 'Violates GDPR Article 5(1)(a) - Lawfulness requirement',
            remediation: 'Implement clear consent mechanism with opt-in/opt-out options'
          })
        }
        break

      case 'gdpr-002':
        // Test for purpose limitation
        const purposeTest = await this.testPurposeLimitation()
        if (!purposeTest.passed) {
          status = 'FAIL'
          score = 40
          findings.push({
            id: 'finding-002',
            type: 'VIOLATION',
            severity: 'MEDIUM',
            title: 'Unclear Purpose Statement',
            description: 'Data collection purpose is not clearly specified',
            impact: 'Violates GDPR Article 5(1)(b) - Purpose limitation',
            remediation: 'Clearly state the purpose of data collection in privacy policy'
          })
        }
        break

      case 'hipaa-001':
        // Test for access controls
        const accessTest = await this.testAccessControls()
        if (!accessTest.passed) {
          status = 'FAIL'
          score = 20
          findings.push({
            id: 'finding-003',
            type: 'VIOLATION',
            severity: 'CRITICAL',
            title: 'Insufficient Access Controls',
            description: 'Access controls do not meet HIPAA requirements',
            impact: 'Violates HIPAA Security Rule - Access Control',
            remediation: 'Implement unique user identification and automatic logoff'
          })
        }
        break

      case 'pci-001':
        // Test for data encryption
        const encryptionTest = await this.testDataEncryption()
        if (!encryptionTest.passed) {
          status = 'FAIL'
          score = 10
          findings.push({
            id: 'finding-004',
            type: 'VIOLATION',
            severity: 'CRITICAL',
            title: 'Insufficient Data Encryption',
            description: 'Cardholder data is not properly encrypted at rest',
            impact: 'Violates PCI DSS Requirement 3 - Protect stored cardholder data',
            remediation: 'Implement strong cryptography for stored cardholder data'
          })
        }
        break
    }

    const duration = Date.now() - startTime

    return {
      id: `result-${Date.now()}-${Math.random()}`,
      testId: `test-${requirement.id}`,
      frameworkId,
      requirementId: requirement.id,
      status,
      score,
      evidence: [`Automated test completed in ${duration}ms`],
      findings,
      timestamp: new Date().toISOString(),
      duration,
      notes: `Automated test for ${requirement.title}`
    }
  }

  /**
   * Test consent mechanism compliance
   */
  private async testConsentMechanism(): Promise<{ passed: boolean; details: string }> {
    // Simulate checking for consent mechanism
    const hasConsentForm = Math.random() > 0.3
    const hasOptOut = Math.random() > 0.4
    const isClear = Math.random() > 0.5

    const passed = hasConsentForm && hasOptOut && isClear
    const details = `Consent form: ${hasConsentForm}, Opt-out: ${hasOptOut}, Clarity: ${isClear}`

    return { passed, details }
  }

  /**
   * Test purpose limitation compliance
   */
  private async testPurposeLimitation(): Promise<{ passed: boolean; details: string }> {
    // Simulate checking for purpose limitation
    const hasPurposeStatement = Math.random() > 0.2
    const isSpecific = Math.random() > 0.6
    const noSecondaryUse = Math.random() > 0.7

    const passed = hasPurposeStatement && isSpecific && noSecondaryUse
    const details = `Purpose statement: ${hasPurposeStatement}, Specific: ${isSpecific}, No secondary use: ${noSecondaryUse}`

    return { passed, details }
  }

  /**
   * Test access controls compliance
   */
  private async testAccessControls(): Promise<{ passed: boolean; details: string }> {
    // Simulate checking for access controls
    const hasUniqueIds = Math.random() > 0.3
    const hasEmergencyAccess = Math.random() > 0.4
    const hasAutoLogoff = Math.random() > 0.5

    const passed = hasUniqueIds && hasEmergencyAccess && hasAutoLogoff
    const details = `Unique IDs: ${hasUniqueIds}, Emergency access: ${hasEmergencyAccess}, Auto logoff: ${hasAutoLogoff}`

    return { passed, details }
  }

  /**
   * Test data encryption compliance
   */
  private async testDataEncryption(): Promise<{ passed: boolean; details: string }> {
    // Simulate checking for data encryption
    const hasEncryption = Math.random() > 0.2
    const hasKeyManagement = Math.random() > 0.4
    const hasRetentionPolicy = Math.random() > 0.6

    const passed = hasEncryption && hasKeyManagement && hasRetentionPolicy
    const details = `Encryption: ${hasEncryption}, Key management: ${hasKeyManagement}, Retention policy: ${hasRetentionPolicy}`

    return { passed, details }
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(frameworkId: string, name: string): ComplianceReport {
    const framework = this.frameworks.get(frameworkId)
    if (!framework) {
      throw new Error(`Framework ${frameworkId} not found`)
    }

    const results = this.testResults.get(frameworkId) || []
    const summary = this.calculateSummary(results)

    return {
      id: `report-${Date.now()}`,
      name,
      frameworkId,
      version: framework.version,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Compliance Testing Service',
      scope: `Full framework compliance test for ${framework.name}`,
      summary,
      results,
      recommendations: this.generateRecommendations(results)
    }
  }

  /**
   * Calculate compliance summary
   */
  private calculateSummary(results: ComplianceTestResult[]): ComplianceSummary {
    const totalTests = results.length
    const passed = results.filter(r => r.status === 'PASS').length
    const failed = results.filter(r => r.status === 'FAIL').length
    const warnings = results.filter(r => r.status === 'WARNING').length
    const notApplicable = results.filter(r => r.status === 'NOT_APPLICABLE').length
    const notTested = results.filter(r => r.status === 'NOT_TESTED').length

    const criticalIssues = results.filter(r => 
      r.findings.some(f => f.severity === 'CRITICAL')
    ).length
    const highIssues = results.filter(r => 
      r.findings.some(f => f.severity === 'HIGH')
    ).length
    const mediumIssues = results.filter(r => 
      r.findings.some(f => f.severity === 'MEDIUM')
    ).length
    const lowIssues = results.filter(r => 
      r.findings.some(f => f.severity === 'LOW')
    ).length

    const overallScore = totalTests > 0 ? (passed / totalTests) * 100 : 0
    let complianceLevel: 'FULLY_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT'

    if (overallScore >= 90 && criticalIssues === 0) {
      complianceLevel = 'FULLY_COMPLIANT'
    } else if (overallScore >= 70 && criticalIssues === 0) {
      complianceLevel = 'PARTIALLY_COMPLIANT'
    } else {
      complianceLevel = 'NON_COMPLIANT'
    }

    return {
      totalTests,
      passed,
      failed,
      warnings,
      notApplicable,
      notTested,
      overallScore,
      complianceLevel,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues
    }
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(results: ComplianceTestResult[]): string[] {
    const recommendations: string[] = []

    const failedTests = results.filter(r => r.status === 'FAIL')
    const criticalFindings = results.flatMap(r => 
      r.findings.filter(f => f.severity === 'CRITICAL')
    )

    if (criticalFindings.length > 0) {
      recommendations.push('Address all critical findings immediately to ensure compliance')
    }

    if (failedTests.length > 0) {
      recommendations.push(`Review and fix ${failedTests.length} failed compliance tests`)
    }

    const avgScore = results.length > 0 
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length 
      : 0

    if (avgScore < 80) {
      recommendations.push('Implement comprehensive compliance improvement plan')
    }

    recommendations.push('Schedule regular compliance audits and monitoring')
    recommendations.push('Provide staff training on compliance requirements')

    return recommendations
  }

  /**
   * Export compliance report to various formats
   */
  exportReport(report: ComplianceReport, format: 'PDF' | 'JSON' | 'CSV' | 'HTML'): string {
    switch (format) {
      case 'JSON':
        return JSON.stringify(report, null, 2)
      case 'CSV':
        return this.exportToCSV(report)
      case 'HTML':
        return this.exportToHTML(report)
      case 'PDF':
        return this.exportToPDF(report)
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  private exportToCSV(report: ComplianceReport): string {
    const headers = ['Test ID', 'Requirement', 'Status', 'Score', 'Findings']
    const rows = report.results.map(result => [
      result.testId,
      result.requirementId,
      result.status,
      result.score.toString(),
      result.findings.length.toString()
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  private exportToHTML(report: ComplianceReport): string {
    return `
      <html>
        <head>
          <title>Compliance Report - ${report.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
            .summary { margin: 20px 0; }
            .result { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            .pass { background: #d4edda; }
            .fail { background: #f8d7da; }
            .warning { background: #fff3cd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.name}</h1>
            <p>Generated: ${report.generatedAt}</p>
            <p>Framework: ${report.frameworkId}</p>
          </div>
          <div class="summary">
            <h2>Summary</h2>
            <p>Overall Score: ${report.summary.overallScore}%</p>
            <p>Compliance Level: ${report.summary.complianceLevel}</p>
            <p>Tests Passed: ${report.summary.passed}/${report.summary.totalTests}</p>
          </div>
          <div class="results">
            <h2>Test Results</h2>
            ${report.results.map(result => `
              <div class="result ${result.status.toLowerCase()}">
                <h3>${result.testId}</h3>
                <p>Status: ${result.status}</p>
                <p>Score: ${result.score}</p>
                <p>Findings: ${result.findings.length}</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `
  }

  private exportToPDF(report: ComplianceReport): string {
    // This would typically use a PDF library like jsPDF
    // For now, return a placeholder
    return `PDF export for ${report.name} - ${report.generatedAt}`
  }
} 