/**
 * Copyright (c) 2025 Preamble, Inc. All rights reserved.
 * 
 * Compliance & Risk Management Page
 * Provides comprehensive compliance testing and risk management for AI systems
 */

import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  FileText,
  Download,
  Upload,
  Settings,
  Eye,
  Target,
  Zap,
  Brain,
  Lock,
  Users,
  Globe,
  Database,
  Code,
  Search,
  Filter,
  Star,
  ExternalLink,
  BookOpen,
  Activity,
  Layers,
  GitBranch,
  Cpu,
  Network,
  Key,
  Calendar,
  Github,
  TestTube
} from 'lucide-react'

interface ComplianceFramework {
  id: string
  name: string
  description: string
  category: 'PRIVACY' | 'HEALTHCARE' | 'FINANCIAL' | 'AI_REGULATION' | 'GENERAL'
  version: string
  region: string
  requirements: ComplianceRequirement[]
  lastUpdated: string
  status: 'ACTIVE' | 'DEPRECATED' | 'DRAFT'
  aiSpecific: boolean
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

interface ComplianceRequirement {
  id: string
  title: string
  description: string
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_TESTED'
  testResults: TestResult[]
  lastTested: string
  riskScore: number
  remediationSteps: string[]
  aiRelevance: boolean
}

interface TestResult {
  id: string
  requirementId: string
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_TESTED'
  details: string
  timestamp: string
  evidence: string
  riskScore: number
}

interface ComplianceReport {
  id: string
  frameworkId: string
  title: string
  generatedAt: string
  summary: {
    totalRequirements: number
    passed: number
    failed: number
    warnings: number
    overallRiskScore: number
    compliancePercentage: number
  }
  details: ComplianceRequirement[]
  recommendations: string[]
  nextSteps: string[]
}

interface RiskAssessment {
  id: string
  name: string
  category: 'AI_SECURITY' | 'DATA_PRIVACY' | 'MODEL_SAFETY' | 'COMPLIANCE' | 'OPERATIONAL'
  riskScore: number
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  mitigationStrategies: string[]
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATED' | 'ACCEPTED'
  lastUpdated: string
}

const ComplianceTesting: React.FC = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([])
  const [selectedFramework, setSelectedFramework] = useState<string>('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentReport, setCurrentReport] = useState<ComplianceReport | null>(null)
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'frameworks' | 'testing' | 'results' | 'risk' | 'reports'>('overview')
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all')
  const [frameworkSearch, setFrameworkSearch] = useState<string>('')

  useEffect(() => {
    loadFrameworks()
    loadRiskAssessments()
  }, [])

  const loadFrameworks = () => {
    const mockFrameworks: ComplianceFramework[] = [
      {
        id: 'nist-ai-rmf',
        name: 'NIST AI Risk Management Framework',
        description: 'Comprehensive framework for managing risks in AI systems',
        category: 'AI_REGULATION',
        version: '1.0',
        region: 'US',
        requirements: [
          {
            id: 'nist-1',
            title: 'AI System Governance',
            description: 'Establish governance structures for AI system development and deployment',
            category: 'Governance',
            severity: 'HIGH',
            status: 'PASS',
            testResults: [],
            lastTested: '2024-01-15T10:30:00Z',
            riskScore: 0.2,
            remediationSteps: ['Document governance policies', 'Establish oversight committee'],
            aiRelevance: true
          },
          {
            id: 'nist-2',
            title: 'Risk Assessment',
            description: 'Conduct comprehensive risk assessments for AI systems',
            category: 'Risk Management',
            severity: 'CRITICAL',
            status: 'FAIL',
            testResults: [],
            lastTested: '2024-01-14T14:20:00Z',
            riskScore: 0.8,
            remediationSteps: ['Implement risk assessment process', 'Document risk findings'],
            aiRelevance: true
          }
        ],
        lastUpdated: '2024-01-15T10:30:00Z',
        status: 'ACTIVE',
        aiSpecific: true,
        riskLevel: 'HIGH'
      },
      {
        id: 'eu-ai-act',
        name: 'EU AI Act',
        description: 'European Union regulation for artificial intelligence',
        category: 'AI_REGULATION',
        version: '2024',
        region: 'EU',
        requirements: [
          {
            id: 'eu-1',
            title: 'High-Risk AI System Classification',
            description: 'Classify AI systems according to risk levels',
            category: 'Classification',
            severity: 'CRITICAL',
            status: 'WARNING',
            testResults: [],
            lastTested: '2024-01-13T09:15:00Z',
            riskScore: 0.6,
            remediationSteps: ['Review AI system classification', 'Update risk assessments'],
            aiRelevance: true
          }
        ],
        lastUpdated: '2024-01-13T09:15:00Z',
        status: 'ACTIVE',
        aiSpecific: true,
        riskLevel: 'CRITICAL'
      },
      {
        id: 'eo-14110',
        name: 'White House Executive Order 14110',
        description: 'Executive Order on Safe, Secure, and Trustworthy AI',
        category: 'AI_REGULATION',
        version: '2023',
        region: 'US',
        requirements: [
          {
            id: 'eo-1',
            title: 'Dual-Use Foundation Model Testing',
            description: 'Test high-risk AI systems for dual-use capabilities',
            category: 'Testing',
            severity: 'CRITICAL',
            status: 'NOT_TESTED',
            testResults: [],
            lastTested: '',
            riskScore: 0.9,
            remediationSteps: ['Implement dual-use testing', 'Establish testing protocols'],
            aiRelevance: true
          }
        ],
        lastUpdated: '2024-01-12T16:45:00Z',
        status: 'ACTIVE',
        aiSpecific: true,
        riskLevel: 'CRITICAL'
      },
      {
        id: 'gdpr',
        name: 'General Data Protection Regulation',
        description: 'EU regulation on data protection and privacy',
        category: 'PRIVACY',
        version: '2018',
        region: 'EU',
        requirements: [
          {
            id: 'gdpr-1',
            title: 'Data Processing Lawfulness',
            description: 'Ensure lawful basis for AI data processing',
            category: 'Data Protection',
            severity: 'HIGH',
            status: 'PASS',
            testResults: [],
            lastTested: '2024-01-11T11:30:00Z',
            riskScore: 0.3,
            remediationSteps: ['Document legal basis', 'Update privacy notices'],
            aiRelevance: true
          }
        ],
        lastUpdated: '2024-01-11T11:30:00Z',
        status: 'ACTIVE',
        aiSpecific: false,
        riskLevel: 'HIGH'
      },
      {
        id: 'hipaa',
        name: 'Health Insurance Portability and Accountability Act',
        description: 'US healthcare data protection regulation',
        category: 'HEALTHCARE',
        version: '1996',
        region: 'US',
        requirements: [
          {
            id: 'hipaa-1',
            title: 'PHI Protection',
            description: 'Protect Protected Health Information in AI systems',
            category: 'Data Protection',
            severity: 'CRITICAL',
            status: 'FAIL',
            testResults: [],
            lastTested: '2024-01-10T15:20:00Z',
            riskScore: 0.7,
            remediationSteps: ['Implement PHI encryption', 'Establish access controls'],
            aiRelevance: true
          }
        ],
        lastUpdated: '2024-01-10T15:20:00Z',
        status: 'ACTIVE',
        aiSpecific: false,
        riskLevel: 'CRITICAL'
      },
      {
        id: 'sox',
        name: 'Sarbanes-Oxley Act',
        description: 'US financial reporting and corporate governance regulation',
        category: 'FINANCIAL',
        version: '2002',
        region: 'US',
        requirements: [
          {
            id: 'sox-1',
            title: 'Financial Data Integrity',
            description: 'Ensure integrity of financial data processed by AI systems',
            category: 'Data Integrity',
            severity: 'HIGH',
            status: 'WARNING',
            testResults: [],
            lastTested: '2024-01-09T13:45:00Z',
            riskScore: 0.5,
            remediationSteps: ['Implement data validation', 'Establish audit trails'],
            aiRelevance: true
          }
        ],
        lastUpdated: '2024-01-09T13:45:00Z',
        status: 'ACTIVE',
        aiSpecific: false,
        riskLevel: 'HIGH'
      }
    ]
    setFrameworks(mockFrameworks)
  }

  const loadRiskAssessments = () => {
    const mockRiskAssessments: RiskAssessment[] = [
      {
        id: 'risk-1',
        name: 'Prompt Injection Vulnerabilities',
        category: 'AI_SECURITY',
        riskScore: 0.85,
        likelihood: 'HIGH',
        impact: 'CRITICAL',
        description: 'Risk of prompt injection attacks compromising AI system security',
        mitigationStrategies: [
          'Implement semantic guardian detection',
          'Deploy SecAlign defense mechanisms',
          'Regular security testing and validation'
        ],
        status: 'ASSESSED',
        lastUpdated: '2024-01-15T10:30:00Z'
      },
      {
        id: 'risk-2',
        name: 'Model Extraction Attacks',
        category: 'AI_SECURITY',
        riskScore: 0.65,
        likelihood: 'MEDIUM',
        impact: 'HIGH',
        description: 'Risk of attackers extracting model architecture and parameters',
        mitigationStrategies: [
          'Implement API rate limiting',
          'Deploy model watermarking',
          'Monitor for extraction patterns'
        ],
        status: 'IDENTIFIED',
        lastUpdated: '2024-01-14T14:20:00Z'
      },
      {
        id: 'risk-3',
        name: 'Data Privacy Violations',
        category: 'DATA_PRIVACY',
        riskScore: 0.75,
        likelihood: 'HIGH',
        impact: 'HIGH',
        description: 'Risk of AI systems violating data privacy regulations',
        mitigationStrategies: [
          'Implement differential privacy',
          'Deploy federated learning',
          'Regular privacy audits'
        ],
        status: 'MITIGATED',
        lastUpdated: '2024-01-13T09:15:00Z'
      },
      {
        id: 'risk-4',
        name: 'Model Bias and Discrimination',
        category: 'MODEL_SAFETY',
        riskScore: 0.55,
        likelihood: 'MEDIUM',
        impact: 'HIGH',
        description: 'Risk of AI models exhibiting bias or discriminatory behavior',
        mitigationStrategies: [
          'Implement bias detection tools',
          'Regular fairness testing',
          'Diverse training data validation'
        ],
        status: 'ASSESSED',
        lastUpdated: '2024-01-12T16:45:00Z'
      },
      {
        id: 'risk-5',
        name: 'Regulatory Non-Compliance',
        category: 'COMPLIANCE',
        riskScore: 0.70,
        likelihood: 'HIGH',
        impact: 'CRITICAL',
        description: 'Risk of failing to meet regulatory requirements for AI systems',
        mitigationStrategies: [
          'Regular compliance audits',
          'Automated compliance monitoring',
          'Stay updated with regulations'
        ],
        status: 'IDENTIFIED',
        lastUpdated: '2024-01-11T11:30:00Z'
      }
    ]
    setRiskAssessments(mockRiskAssessments)
  }

  const runComplianceTests = async () => {
    if (!selectedFramework) return

    setIsRunning(true)
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock test results
      const framework = frameworks.find(f => f.id === selectedFramework)
      if (framework) {
        const mockResults: TestResult[] = framework.requirements.map(req => ({
          id: `test-${req.id}`,
          requirementId: req.id,
          status: req.status,
          details: `Test completed for ${req.title}`,
          timestamp: new Date().toISOString(),
          evidence: `Evidence for ${req.title}`,
          riskScore: req.riskScore
        }))
        setTestResults(mockResults)
        setActiveTab('results')
      }
    } catch (error) {
      console.error('Error running compliance tests:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const generateReport = () => {
    if (!selectedFramework || testResults.length === 0) return

    const framework = frameworks.find(f => f.id === selectedFramework)
    if (!framework) return

    const passed = testResults.filter(r => r.status === 'PASS').length
    const failed = testResults.filter(r => r.status === 'FAIL').length
    const warnings = testResults.filter(r => r.status === 'WARNING').length
    const total = testResults.length
    const compliancePercentage = total > 0 ? (passed / total) * 100 : 0
    const overallRiskScore = testResults.reduce((sum, r) => sum + r.riskScore, 0) / total

    const report: ComplianceReport = {
      id: `report-${Date.now()}`,
      frameworkId: selectedFramework,
      title: `${framework.name} Compliance Report`,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRequirements: total,
        passed,
        failed,
        warnings,
        overallRiskScore,
        compliancePercentage
      },
      details: framework.requirements,
      recommendations: [
        'Implement automated compliance monitoring',
        'Establish regular compliance review process',
        'Train staff on compliance requirements'
      ],
      nextSteps: [
        'Address failed requirements within 30 days',
        'Schedule follow-up compliance review',
        'Update compliance documentation'
      ]
    }
    setCurrentReport(report)
    setActiveTab('reports')
  }

  const exportReport = (format: 'PDF' | 'JSON' | 'CSV' | 'HTML') => {
    if (!currentReport) return

    try {
      const data = JSON.stringify(currentReport, null, 2)
      const blob = new Blob([data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compliance-report-${currentReport.id}.${format.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'text-green-600 bg-green-100'
      case 'FAIL': return 'text-red-600 bg-red-100'
      case 'WARNING': return 'text-yellow-600 bg-yellow-100'
      case 'NOT_TESTED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-800 bg-red-200'
      case 'HIGH': return 'text-orange-800 bg-orange-200'
      case 'MEDIUM': return 'text-yellow-800 bg-yellow-200'
      case 'LOW': return 'text-blue-800 bg-blue-200'
      default: return 'text-gray-800 bg-gray-200'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-100'
      case 'HIGH': return 'text-orange-600 bg-orange-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI_REGULATION': return <Brain className="h-5 w-5" />
      case 'PRIVACY': return <Lock className="h-5 w-5" />
      case 'HEALTHCARE': return <Users className="h-5 w-5" />
      case 'FINANCIAL': return <BarChart3 className="h-5 w-5" />
      default: return <Shield className="h-5 w-5" />
    }
  }

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesFilter = frameworkFilter === 'all' || framework.category === frameworkFilter
    const matchesSearch = framework.name.toLowerCase().includes(frameworkSearch.toLowerCase()) ||
      framework.description.toLowerCase().includes(frameworkSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const overallComplianceScore = frameworks.reduce((score, framework) => {
    const passedRequirements = framework.requirements.filter(r => r.status === 'PASS').length
    const totalRequirements = framework.requirements.length
    return score + (totalRequirements > 0 ? (passedRequirements / totalRequirements) * 100 : 0)
  }, 0) / frameworks.length

  const criticalRisks = riskAssessments.filter(risk => risk.likelihood === 'CRITICAL' || risk.impact === 'CRITICAL').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance & Risk Management</h1>
          <p className="text-gray-600 mt-2">Comprehensive compliance testing and risk management for AI systems</p>
        </div>
        <button className="btn-primary">
          <Shield className="h-5 w-5 mr-2" />
          Run Full Assessment
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('frameworks')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'frameworks' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Frameworks
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'testing' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Testing
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'results' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Results
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'risk' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Risk Assessment
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Reports
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-hover p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="caption">Overall Compliance</p>
                  <p className="heading-2 text-[#081423]">{overallComplianceScore.toFixed(1)}%</p>
                  <p className="text-xs text-[#1F2C6D]/70">Across all frameworks</p>
                </div>
              </div>
            </div>

            <div className="card-hover p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="caption">Critical Risks</p>
                  <p className="heading-2 text-[#081423]">{criticalRisks}</p>
                  <p className="text-xs text-[#1F2C6D]/70">Require immediate attention</p>
                </div>
              </div>
            </div>

            <div className="card-hover p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="caption">Active Frameworks</p>
                  <p className="heading-2 text-[#081423]">{frameworks.filter(f => f.status === 'ACTIVE').length}</p>
                  <p className="text-xs text-[#1F2C6D]/70">Compliance frameworks</p>
                </div>
              </div>
            </div>

            <div className="card-hover p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="caption">AI-Specific</p>
                  <p className="heading-2 text-[#081423]">{frameworks.filter(f => f.aiSpecific).length}</p>
                  <p className="text-xs text-[#1F2C6D]/70">AI regulations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Status by Framework */}
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Compliance Status by Framework</h3>
            <div className="space-y-4">
              {frameworks.map((framework) => {
                const passedRequirements = framework.requirements.filter(r => r.status === 'PASS').length
                const totalRequirements = framework.requirements.length
                const compliancePercentage = totalRequirements > 0 ? (passedRequirements / totalRequirements) * 100 : 0
                
                return (
                  <div key={framework.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#4556E4]/10 rounded-lg">
                        {getCategoryIcon(framework.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{framework.name}</h4>
                        <p className="text-sm text-gray-600">{framework.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">{compliancePercentage.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">{passedRequirements}/{totalRequirements} requirements</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Risk Assessment Summary */}
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Risk Assessment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskAssessments.slice(0, 4).map((risk) => (
                <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{risk.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(risk.likelihood)}`}>
                      {risk.likelihood}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Risk Score:</span>
                    <span className="text-sm font-medium">{(risk.riskScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Frameworks Tab */}
      {activeTab === 'frameworks' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frameworks..."
                    value={frameworkSearch}
                    onChange={(e) => setFrameworkSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4556E4]"
                  />
                </div>
                <select
                  value={frameworkFilter}
                  onChange={(e) => setFrameworkFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4556E4]"
                >
                  <option value="all">All Categories</option>
                  <option value="AI_REGULATION">AI Regulation</option>
                  <option value="PRIVACY">Privacy</option>
                  <option value="HEALTHCARE">Healthcare</option>
                  <option value="FINANCIAL">Financial</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Frameworks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFrameworks.map((framework) => (
              <div key={framework.id} className="card-hover p-6">
                                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#4556E4]/10 rounded-lg">
                        {getCategoryIcon(framework.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                        <p className="text-sm text-gray-600">{framework.description}</p>
                      </div>
                    </div>
                  </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Region:</span>
                    <span className="text-sm font-medium">{framework.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Version:</span>
                    <span className="text-sm font-medium">{framework.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Requirements:</span>
                    <span className="text-sm font-medium">{framework.requirements.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">AI-Specific:</span>
                    <span className={`text-sm font-medium ${framework.aiSpecific ? 'text-green-600' : 'text-gray-600'}`}>
                      {framework.aiSpecific ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedFramework(framework.id)
                      setActiveTab('testing')
                    }}
                    className="flex-1 btn-primary text-sm"
                  >
                    <TestTube className="h-4 w-4 mr-1" />
                    Test Framework
                  </button>
                  <button className="flex-1 btn-secondary text-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Run Compliance Tests</h3>
            
            {selectedFramework && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Selected Framework</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {frameworks.find(f => f.id === selectedFramework)?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {frameworks.find(f => f.id === selectedFramework)?.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFramework('')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!selectedFramework && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Please select a framework to test</p>
              </div>
            )}

            {selectedFramework && (
              <div className="space-y-4">
                <button
                  onClick={runComplianceTests}
                  disabled={isRunning}
                  className="w-full btn-primary py-3"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Running Compliance Tests...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-5 w-5 mr-2" />
                      Run Compliance Tests
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Test Results</h3>
            {testResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requirement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {testResults.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.requirementId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(result.riskScore * 100).toFixed(0)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No test results available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Risk Assessment Tab */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Risk Assessment</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {riskAssessments.map((risk) => (
                <div key={risk.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{risk.name}</h4>
                      <p className="text-sm text-gray-600">{risk.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Risk Score:</span>
                      <span className="text-sm font-medium">{(risk.riskScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="text-sm font-medium capitalize">{risk.status}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Mitigation Strategies:</h5>
                    <ul className="space-y-1">
                      {risk.mitigationStrategies.map((strategy, index) => (
                        <li key={index} className="text-sm text-gray-600">• {strategy}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 btn-secondary text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button className="flex-1 btn-primary text-sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Mitigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Compliance Reports</h3>
            
            {currentReport ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">{currentReport.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{currentReport.summary.totalRequirements}</div>
                      <div className="text-sm text-gray-600">Total Requirements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentReport.summary.passed}</div>
                      <div className="text-sm text-gray-600">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{currentReport.summary.failed}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{currentReport.summary.compliancePercentage.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Compliance</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => exportReport('PDF')}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => exportReport('JSON')}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export JSON
                  </button>
                  <button
                    onClick={() => exportReport('CSV')}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reports available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ComplianceTesting 