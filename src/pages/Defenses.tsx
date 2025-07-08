/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Shield, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Lock, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Settings,
  Download,
  Upload,
  Code,
  FileText,
  GitBranch,
  Database,
  Cpu,
  Network,
  Key,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Github,
  Globe,
  BookOpen,
  TestTube,
  Target,
  Bug,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Layers,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  RotateCcw as RotateCcwIcon,
  Wand2 as Wand2Icon
} from 'lucide-react'

interface DefenseMechanism {
  id: string
  name: string
  description: string
  category: 'detection' | 'prevention' | 'response' | 'monitoring' | 'training' | 'architecture'
  status: 'active' | 'inactive' | 'testing'
  effectiveness: number
  performanceImpact: number
  configuration: Record<string, any>
  lastUpdated: string
  defenseType: 'secalign' | 'spotlighting' | 'adversarial' | 'ensemble' | 'robust' | 'constitutional' | 'custom'
  supportedAttacks: string[]
  implementation: {
    complexity: 'low' | 'medium' | 'high'
    deploymentTime: string
    resourceRequirements: string
    integrationGuide: string
  }
}

interface DefenseTest {
  id: string
  mechanismId: string
  testType: string
  status: 'running' | 'completed' | 'failed'
  results: {
    attacksBlocked: number
    falsePositives: number
    responseTime: number
    accuracy: number
    robustness: number
    generalization: number
  }
  timestamp: string
}

interface DefenseValidation {
  id: string
  mechanismId: string
  benchmark: string
  score: number
  metrics: Record<string, number>
  timestamp: string
}

const Defenses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [defenses, setDefenses] = useState<DefenseMechanism[]>([])
  const [tests, setTests] = useState<DefenseTest[]>([])
  const [validations, setValidations] = useState<DefenseValidation[]>([])
  const [selectedDefense, setSelectedDefense] = useState<DefenseMechanism | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanisms' | 'testing' | 'validation' | 'deployment'>('overview')
  const [isRunningTest, setIsRunningTest] = useState(false)
  const [defenseFilter, setDefenseFilter] = useState<string>('all')
  const [defenseSearch, setDefenseSearch] = useState<string>('')

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'mechanisms', 'testing', 'validation', 'deployment'].includes(tabParam)) {
      setActiveTab(tabParam as any)
    }
  }, [searchParams])

  useEffect(() => {
    loadDefenses()
    loadTests()
    loadValidations()
  }, [])

  const loadDefenses = () => {
    const mockDefenses: DefenseMechanism[] = [
      {
        id: 'preamble-trust-platform',
        name: 'Preamble AI Trust Platform',
        description: 'Customizable guardrails for AI applications with comprehensive monitoring',
        category: 'prevention',
        status: 'active',
        effectiveness: 97.2,
        performanceImpact: 1.3,
        configuration: {
          inputValidation: true,
          outputValidation: true,
          contentFiltering: true,
          regexMatching: true,
          toxicLanguageDetection: true,
          competitorCheck: true,
          pydanticValidation: true,
          onFailAction: 'exception',
          threshold: 0.8,
          customizableRules: true,
          enterpriseIntegration: true,
          complianceReporting: true,
          realTimeMonitoring: true
        },
        lastUpdated: '2024-01-16T09:15:00Z',
        defenseType: 'custom',
        supportedAttacks: [
          'Prompt Injection',
          'Toxic Language',
          'Competitor Mentions',
          'Invalid Output Format',
          'Data Leakage',
          'Content Policy Violations',
          'Enterprise Compliance Violations',
          'Custom Rule Violations'
        ],
        implementation: {
          complexity: 'low',
          deploymentTime: '30 minutes',
          resourceRequirements: '2GB RAM, no GPU required',
          integrationGuide: 'https://preamble.com/solution'
        }
      },
      {
        id: 'semantic-guardian',
        name: 'Semantic Guardian Detector Stack',
        description: 'Advanced AI-powered detection using heuristic pre-filter, RAG similarity search, and judge model ensemble',
        category: 'detection',
        status: 'active',
        effectiveness: 98.5,
        performanceImpact: 2.3,
        configuration: {
          heuristicThreshold: 0.9,
          ragSimilarityThreshold: 0.75,
          judgeEnsembleWeights: { llama: 0.4, mixtral: 0.3, ensemble: 0.3 },
          responseTimeLimit: 15000,
          uncertaintyHandling: true,
          fallbackModels: ['mixtral-22b', 'llama-3-8b']
        },
        lastUpdated: '2024-01-15T10:30:00Z',
        defenseType: 'ensemble',
        supportedAttacks: [
          'Prompt Injection',
          'Jailbreaking',
          'Role Confusion',
          'Instruction Override',
          'Context Manipulation',
          'Adversarial Examples'
        ],
        implementation: {
          complexity: 'medium',
          deploymentTime: '2-4 hours',
          resourceRequirements: '4GB RAM, GPU recommended',
          integrationGuide: 'https://docs.preamble.ai/semantic-guardian'
        }
      },
      {
        id: 'secalign-defense',
        name: 'SecAlign Implementation',
        description: 'Safety-aligned fine-tuning with preference optimization and adversarial training',
        category: 'training',
        status: 'active',
        effectiveness: 95.2,
        performanceImpact: 1.8,
        configuration: {
          fineTuningEnabled: true,
          adversarialTraining: true,
          preferenceOptimization: true,
          safetyAlignment: 0.95,
          humanFeedback: true,
          rewardModeling: true,
          policyGradient: true
        },
        lastUpdated: '2024-01-14T14:20:00Z',
        defenseType: 'secalign',
        supportedAttacks: [
          'Prompt Injection',
          'Jailbreaking',
          'Harmful Content',
          'Bias Exploitation',
          'Adversarial Training'
        ],
        implementation: {
          complexity: 'high',
          deploymentTime: '1-2 weeks',
          resourceRequirements: '16GB RAM, GPU required',
          integrationGuide: 'https://docs.preamble.ai/secalign'
        }
      },
      {
        id: 'spotlighting-system',
        name: 'Spotlighting System',
        description: 'Delimiter-based isolation with encoding strategies and context separation',
        category: 'prevention',
        status: 'active',
        effectiveness: 92.7,
        performanceImpact: 3.1,
        configuration: {
          delimiterStrategy: 'multi-layer',
          encodingEnabled: true,
          contextSeparation: true,
          inputSanitization: true,
          cryptographicTechniques: true,
          attentionMechanisms: true
        },
        lastUpdated: '2024-01-13T09:15:00Z',
        defenseType: 'spotlighting',
        supportedAttacks: [
          'Prompt Injection',
          'Context Overflow',
          'System Prompt Manipulation',
          'Delimiter Bypass',
          'Encoding Attacks'
        ],
        implementation: {
          complexity: 'medium',
          deploymentTime: '4-8 hours',
          resourceRequirements: '2GB RAM, no GPU required',
          integrationGuide: 'https://docs.preamble.ai/spotlighting'
        }
      },
      {
        id: 'adversarial-training',
        name: 'Adversarial Training Engine',
        description: 'Gradient-based adversarial training with robust optimization',
        category: 'training',
        status: 'active',
        effectiveness: 94.8,
        performanceImpact: 2.5,
        configuration: {
          adversarialExamples: true,
          gradientBasedOptimization: true,
          worstCaseAnalysis: true,
          transferLearning: true,
          ensembleMethods: true,
          adaptiveDefenses: true
        },
        lastUpdated: '2024-01-12T16:45:00Z',
        defenseType: 'adversarial',
        supportedAttacks: [
          'Adversarial Examples',
          'Universal Attacks',
          'Transfer Attacks',
          'Model Extraction',
          'Membership Inference'
        ],
        implementation: {
          complexity: 'high',
          deploymentTime: '2-4 weeks',
          resourceRequirements: '32GB RAM, multiple GPUs',
          integrationGuide: 'https://docs.preamble.ai/adversarial-training'
        }
      },
      {
        id: 'constitutional-ai',
        name: 'Constitutional AI Framework',
        description: 'AI system with built-in constitutional principles and value learning',
        category: 'architecture',
        status: 'testing',
        effectiveness: 91.3,
        performanceImpact: 1.2,
        configuration: {
          constitutionalPrinciples: true,
          valueLearning: true,
          ethicalAlignment: true,
          transparency: true,
          accountability: true,
          fairness: true
        },
        lastUpdated: '2024-01-11T11:30:00Z',
        defenseType: 'constitutional',
        supportedAttacks: [
          'Value Manipulation',
          'Ethical Bypass',
          'Bias Exploitation',
          'Harmful Content',
          'Unethical Instructions'
        ],
        implementation: {
          complexity: 'high',
          deploymentTime: '3-6 weeks',
          resourceRequirements: '8GB RAM, GPU recommended',
          integrationGuide: 'https://docs.preamble.ai/constitutional-ai'
        }
      },
      {
        id: 'robust-optimization',
        name: 'Robust Optimization Defense',
        description: 'Worst-case optimization with differential privacy and federated learning',
        category: 'prevention',
        status: 'active',
        effectiveness: 93.5,
        performanceImpact: 2.8,
        configuration: {
          differentialPrivacy: true,
          federatedLearning: true,
          homomorphicEncryption: true,
          secureComputation: true,
          privacyPreserving: true
        },
        lastUpdated: '2024-01-10T15:20:00Z',
        defenseType: 'robust',
        supportedAttacks: [
          'Data Poisoning',
          'Model Inversion',
          'Membership Inference',
          'Privacy Violations',
          'Training Data Theft'
        ],
        implementation: {
          complexity: 'high',
          deploymentTime: '1-3 weeks',
          resourceRequirements: '16GB RAM, GPU required',
          integrationGuide: 'https://docs.preamble.ai/robust-optimization'
        }
      },
      {
        id: 'real-time-monitoring',
        name: 'Real-Time Monitoring & Response',
        description: 'Continuous monitoring with behavioral analysis and automated response',
        category: 'monitoring',
        status: 'active',
        effectiveness: 96.1,
        performanceImpact: 1.5,
        configuration: {
          monitoringEnabled: true,
          anomalyThreshold: 0.8,
          alertingEnabled: true,
          logRetention: 30,
          behavioralAnalysis: true,
          automatedResponse: true,
          incidentResponse: true
        },
        lastUpdated: '2024-01-09T13:45:00Z',
        defenseType: 'custom',
        supportedAttacks: [
          'Real-time Attacks',
          'Zero-day Exploits',
          'Behavioral Anomalies',
          'Performance Degradation',
          'Resource Abuse'
        ],
        implementation: {
          complexity: 'medium',
          deploymentTime: '1-2 days',
          resourceRequirements: '4GB RAM, no GPU required',
          integrationGuide: 'https://docs.preamble.ai/real-time-monitoring'
        }
      },
      {
        id: 'auto-patch-advisor',
        name: 'Auto-Patch Advisor',
        description: 'Automated fix generation with OWASP LLM controls mapping and compliance reporting',
        category: 'response',
        status: 'active',
        effectiveness: 89.7,
        performanceImpact: 0.5,
        configuration: {
          automatedFixGeneration: true,
          owaspMapping: true,
          complianceReporting: true,
          integrationConnectors: true,
          oneClickDeployment: true,
          patchValidation: true
        },
        lastUpdated: '2024-01-08T10:15:00Z',
        defenseType: 'custom',
        supportedAttacks: [
          'Vulnerability Remediation',
          'Compliance Violations',
          'Security Misconfigurations',
          'Best Practice Violations'
        ],
        implementation: {
          complexity: 'low',
          deploymentTime: '2-4 hours',
          resourceRequirements: '2GB RAM, no GPU required',
          integrationGuide: 'https://docs.preamble.ai/auto-patch-advisor'
        }
      }
    ]
    setDefenses(mockDefenses)
  }

  const loadTests = () => {
    const mockTests: DefenseTest[] = [
      {
        id: 'test-1',
        mechanismId: 'semantic-guardian',
        testType: 'comprehensive',
        status: 'completed',
        results: {
          attacksBlocked: 985,
          falsePositives: 15,
          responseTime: 12.5,
          accuracy: 98.5,
          robustness: 97.2,
          generalization: 96.8
        },
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'test-2',
        mechanismId: 'secalign-defense',
        testType: 'adversarial',
        status: 'completed',
        results: {
          attacksBlocked: 952,
          falsePositives: 48,
          responseTime: 8.3,
          accuracy: 95.2,
          robustness: 94.1,
          generalization: 93.7
        },
        timestamp: '2024-01-14T14:20:00Z'
      }
    ]
    setTests(mockTests)
  }

  const loadValidations = () => {
    const mockValidations: DefenseValidation[] = [
      {
        id: 'val-1',
        mechanismId: 'semantic-guardian',
        benchmark: 'INJECAGENT',
        score: 98.5,
        metrics: {
          recall: 98.5,
          precision: 97.2,
          f1Score: 97.8,
          falsePositiveRate: 2.8
        },
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'val-2',
        mechanismId: 'secalign-defense',
        benchmark: 'AdvBench',
        score: 95.2,
        metrics: {
          robustness: 95.2,
          generalization: 94.1,
          transferability: 93.7,
          adversarialAccuracy: 94.8
        },
        timestamp: '2024-01-14T14:20:00Z'
      }
    ]
    setValidations(mockValidations)
  }

  const runDefenseTest = async (defenseId: string) => {
    setIsRunningTest(true)
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsRunningTest(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'detection': return <Eye className="h-5 w-5" />
      case 'prevention': return <Shield className="h-5 w-5" />
      case 'response': return <Zap className="h-5 w-5" />
      case 'monitoring': return <Activity className="h-5 w-5" />
      case 'training': return <Brain className="h-5 w-5" />
      case 'architecture': return <Layers className="h-5 w-5" />
      default: return <ShieldCheck className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'testing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 95) return 'text-green-600'
    if (effectiveness >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceImpactColor = (impact: number) => {
    if (impact <= 2) return 'text-green-600'
    if (impact <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDefenseTypeColor = (type: string) => {
    switch (type) {
      case 'secalign': return 'bg-blue-100 text-blue-800'
      case 'spotlighting': return 'bg-purple-100 text-purple-800'
      case 'adversarial': return 'bg-orange-100 text-orange-800'
      case 'ensemble': return 'bg-indigo-100 text-indigo-800'
      case 'robust': return 'bg-green-100 text-green-800'
      case 'constitutional': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDefenses = defenses.filter(defense => {
    const matchesFilter = defenseFilter === 'all' || defense.category === defenseFilter
    const matchesSearch = defense.name.toLowerCase().includes(defenseSearch.toLowerCase()) ||
      defense.description.toLowerCase().includes(defenseSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const loadOpenSourceTools = () => {
    // Tools moved to Tools & Resources page
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Defense Implementation</h1>
          <p className="text-gray-600 mt-2">Advanced defense mechanisms and security controls for AI systems</p>
        </div>
        <button className="btn-primary">
          <Wand2Icon className="h-5 w-5 mr-2" />
          Deploy Defense
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setActiveTab('overview')
            setSearchParams({})
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            setActiveTab('mechanisms')
            setSearchParams({ tab: 'mechanisms' })
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'mechanisms' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Defense Mechanisms
        </button>
        <button
          onClick={() => {
            setActiveTab('testing')
            setSearchParams({ tab: 'testing' })
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'testing' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Testing & Validation
        </button>
        <button
          onClick={() => {
            setActiveTab('validation')
            setSearchParams({ tab: 'validation' })
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'validation' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Benchmark Results
        </button>
        <button
          onClick={() => {
            setActiveTab('deployment')
            setSearchParams({ tab: 'deployment' })
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'deployment' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Deployment Guide
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Defense Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Detection</h3>
                  <p className="text-sm text-gray-600">Real-time threat detection</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Defenses:</span>
                  <span className="font-medium">{defenses.filter(d => d.category === 'detection' && d.status === 'active').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Effectiveness:</span>
                  <span className="font-medium text-green-600">98.5%</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Prevention</h3>
                  <p className="text-sm text-gray-600">Attack prevention mechanisms</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Defenses:</span>
                  <span className="font-medium">{defenses.filter(d => d.category === 'prevention' && d.status === 'active').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Effectiveness:</span>
                  <span className="font-medium text-green-600">93.1%</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Training</h3>
                  <p className="text-sm text-gray-600">Model training defenses</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Defenses:</span>
                  <span className="font-medium">{defenses.filter(d => d.category === 'training' && d.status === 'active').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Effectiveness:</span>
                  <span className="font-medium text-green-600">95.0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Defense Effectiveness Summary */}
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Defense Effectiveness Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-gray-600">Detection Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3%</div>
                <div className="text-sm text-gray-600">False Positives</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">12.5ms</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Active Defenses</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Defense Mechanisms Tab */}
      {activeTab === 'mechanisms' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search defenses..."
                    value={defenseSearch}
                    onChange={(e) => setDefenseSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4556E4]"
                  />
                </div>
                <select
                  value={defenseFilter}
                  onChange={(e) => setDefenseFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4556E4]"
                >
                  <option value="all">All Categories</option>
                  <option value="detection">Detection</option>
                  <option value="prevention">Prevention</option>
                  <option value="response">Response</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="training">Training</option>
                  <option value="architecture">Architecture</option>
                </select>
              </div>
            </div>
          </div>

          {/* Defense Mechanisms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDefenses.map((defense) => (
              <div key={defense.id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#4556E4]/10 rounded-lg">
                      {getCategoryIcon(defense.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{defense.name}</h3>
                      <p className="text-sm text-gray-600">{defense.description}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(defense.status)}`}>
                    {defense.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Effectiveness:</span>
                    <span className={`text-sm font-medium ${getEffectivenessColor(defense.effectiveness)}`}>
                      {defense.effectiveness}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Performance Impact:</span>
                    <span className={`text-sm font-medium ${getPerformanceImpactColor(defense.performanceImpact)}`}>
                      {defense.performanceImpact}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDefenseTypeColor(defense.defenseType)}`}>
                      {defense.defenseType}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Supported Attacks:</h4>
                  <div className="flex flex-wrap gap-1">
                    {defense.supportedAttacks.slice(0, 3).map((attack, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {attack}
                      </span>
                    ))}
                    {defense.supportedAttacks.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{defense.supportedAttacks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedDefense(defense)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </button>
                  <button
                    onClick={() => runDefenseTest(defense.id)}
                    disabled={isRunningTest}
                    className="flex-1 btn-primary text-sm"
                  >
                    {isRunningTest ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testing & Validation Tab */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Defense Testing Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Defense
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attacks Blocked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((test) => {
                    const defense = defenses.find(d => d.id === test.mechanismId)
                    return (
                      <tr key={test.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {defense?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.testType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            test.status === 'completed' ? 'bg-green-100 text-green-800' :
                            test.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.results.attacksBlocked}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.results.accuracy}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.results.responseTime}ms
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Benchmark Results Tab */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Benchmark Validation Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {validations.map((validation) => {
                const defense = defenses.find(d => d.id === validation.mechanismId)
                return (
                  <div key={validation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{defense?.name || 'Unknown'}</h4>
                      <span className="text-2xl font-bold text-green-600">{validation.score}%</span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {validation.benchmark}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(validation.metrics).map(([metric, value]) => (
                        <div key={metric} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Deployment Guide Tab */}
      {activeTab === 'deployment' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Defense Deployment Guide</h3>
            <div className="space-y-6">
              {defenses.map((defense) => (
                <div key={defense.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{defense.name}</h4>
                      <p className="text-sm text-gray-600">{defense.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDefenseTypeColor(defense.defenseType)}`}>
                      {defense.defenseType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Complexity</div>
                      <div className="font-semibold capitalize">{defense.implementation.complexity}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Deployment Time</div>
                      <div className="font-semibold">{defense.implementation.deploymentTime}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Resources</div>
                      <div className="font-semibold">{defense.implementation.resourceRequirements}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={defense.implementation.integrationGuide}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Integration Guide
                    </a>
                    <button className="btn-secondary text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Config
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Defense Detail Modal */}
      {selectedDefense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="heading-2">{selectedDefense.name}</h2>
                <button
                  onClick={() => setSelectedDefense(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Configuration</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedDefense.configuration).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Implementation Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Complexity:</span> {selectedDefense.implementation.complexity}</div>
                    <div><span className="font-medium">Deployment Time:</span> {selectedDefense.implementation.deploymentTime}</div>
                    <div><span className="font-medium">Resource Requirements:</span> {selectedDefense.implementation.resourceRequirements}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Supported Attacks</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDefense.supportedAttacks.map((attack, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {attack}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDefense(null)}
                  className="btn-secondary"
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

export default Defenses 