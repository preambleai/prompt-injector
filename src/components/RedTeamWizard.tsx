/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

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
  Sword,
  Skull,
  Crosshair,
  Flame,
  Cpu,
  Network,
  Database,
  Lock,
  Unlock,
  TrendingUp,
  Activity,
  Layers,
  GitBranch,
  Code,
  FileText,
  Image,
  Video,
  Mic,
  Globe,
  Server,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react'

interface RedTeamWizardProps {
  onComplete: (results: any[]) => void
  onCancel: () => void
}

interface RedTeamStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

interface AttackTechnique {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  successRate: number
  detectionRate: number
  timeToExecute: string
  icon: any
  selected: boolean
}

const RedTeamWizard: React.FC<RedTeamWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [redTeamType, setRedTeamType] = useState<'adversarial' | 'zero-day' | 'multi-agent' | 'custom'>('adversarial')
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [targetModels, setTargetModels] = useState<string[]>([])
  const [attackConfiguration, setAttackConfiguration] = useState({
    maxIterations: 10,
    timeout: 120000,
    enableAdaptive: true,
    enableStealth: false,
    enablePersistence: false,
    enablePropagation: false
  })
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const steps: RedTeamStep[] = [
    {
      id: 'red-team-type',
      title: 'Red Team Strategy',
      description: 'Select your red teaming approach and objectives',
      completed: false,
      required: true
    },
    {
      id: 'target-selection',
      title: 'Target Analysis',
      description: 'Identify and analyze target AI systems',
      completed: false,
      required: true
    },
    {
      id: 'attack-techniques',
      title: 'Attack Techniques',
      description: 'Choose advanced attack techniques and methodologies',
      completed: false,
      required: true
    },
    {
      id: 'configuration',
      title: 'Attack Configuration',
      description: 'Configure advanced attack parameters and stealth options',
      completed: false,
      required: false
    },
    {
      id: 'execution',
      title: 'Execute Red Team',
      description: 'Launch sophisticated adversarial attacks',
      completed: false,
      required: true
    },
    {
      id: 'analysis',
      title: 'Threat Analysis',
      description: 'Analyze attack results and identify vulnerabilities',
      completed: false,
      required: true
    }
  ]

  const redTeamTypes = {
    adversarial: {
      name: 'Adversarial Testing',
      description: 'Advanced adversarial examples and model manipulation',
      icon: Target,
      techniques: ['gradient-based', 'transfer-learning', 'model-inversion'],
      duration: '30-60 minutes',
      complexity: 'High'
    },
    'zero-day': {
      name: 'Zero-Day Discovery',
      description: 'Discover unknown vulnerabilities and attack vectors',
      icon: Skull,
      techniques: ['fuzzing', 'genetic-algorithms', 'neural-evolution'],
      duration: '60-120 minutes',
      complexity: 'Expert'
    },
    'multi-agent': {
      name: 'Multi-Agent Warfare',
      description: 'Coordinated attacks across multiple AI agents',
      icon: Network,
      techniques: ['prompt-infection', 'agent-manipulation', 'system-compromise'],
      duration: '45-90 minutes',
      complexity: 'Very High'
    },
    custom: {
      name: 'Custom Campaign',
      description: 'Tailored red teaming with specific objectives',
      icon: Settings,
      techniques: ['custom'],
      duration: 'Variable',
      complexity: 'Custom'
    }
  }

  const attackTechniques: AttackTechnique[] = [
    // Adversarial Techniques
    {
      id: 'gradient-based',
      name: 'Gradient-Based Attacks',
      description: 'Use gradient information to craft adversarial examples',
      category: 'adversarial',
      difficulty: 'HARD',
      successRate: 0.85,
      detectionRate: 0.15,
      timeToExecute: '5-10 min',
      icon: TrendingUp,
      selected: false
    },
    {
      id: 'transfer-learning',
      name: 'Transfer Learning Attacks',
      description: 'Transfer adversarial examples across model families',
      category: 'adversarial',
      difficulty: 'MEDIUM',
      successRate: 0.75,
      detectionRate: 0.25,
      timeToExecute: '3-7 min',
      icon: GitBranch,
      selected: false
    },
    {
      id: 'model-inversion',
      name: 'Model Inversion',
      description: 'Reconstruct training data from model outputs',
      category: 'adversarial',
      difficulty: 'EXPERT',
      successRate: 0.60,
      detectionRate: 0.40,
      timeToExecute: '10-15 min',
      icon: Database,
      selected: false
    },
    // Zero-Day Techniques
    {
      id: 'fuzzing',
      name: 'AI Fuzzing',
      description: 'Intelligent fuzzing to discover unknown vulnerabilities',
      category: 'zero-day',
      difficulty: 'MEDIUM',
      successRate: 0.70,
      detectionRate: 0.30,
      timeToExecute: '8-12 min',
      icon: Cpu,
      selected: false
    },
    {
      id: 'genetic-algorithms',
      name: 'Genetic Evolution',
      description: 'Evolve attack payloads using genetic algorithms',
      category: 'zero-day',
      difficulty: 'HARD',
      successRate: 0.80,
      detectionRate: 0.20,
      timeToExecute: '15-25 min',
      icon: Code,
      selected: false
    },
    {
      id: 'neural-evolution',
      name: 'Neural Evolution',
      description: 'Use neural networks to evolve sophisticated attacks',
      category: 'zero-day',
      difficulty: 'EXPERT',
      successRate: 0.90,
      detectionRate: 0.10,
      timeToExecute: '20-30 min',
      icon: Brain,
      selected: false
    },
    // Multi-Agent Techniques
    {
      id: 'prompt-infection',
      name: 'Prompt Infection',
      description: 'Self-replicating malicious prompts across agents',
      category: 'multi-agent',
      difficulty: 'HARD',
      successRate: 0.85,
      detectionRate: 0.15,
      timeToExecute: '10-20 min',
      icon: Network,
      selected: false
    },
    {
      id: 'agent-manipulation',
      name: 'Agent Manipulation',
      description: 'Manipulate agent behavior and decision-making',
      category: 'multi-agent',
      difficulty: 'EXPERT',
      successRate: 0.75,
      detectionRate: 0.25,
      timeToExecute: '12-18 min',
      icon: Users,
      selected: false
    },
    {
      id: 'system-compromise',
      name: 'System Compromise',
      description: 'Compromise entire AI system infrastructure',
      category: 'multi-agent',
      difficulty: 'EXPERT',
      successRate: 0.65,
      detectionRate: 0.35,
      timeToExecute: '25-40 min',
      icon: Server,
      selected: false
    },
    // Advanced Techniques
    {
      id: 'multimodal-attacks',
      name: 'Multimodal Attacks',
      description: 'Cross-modal attack vectors (text, image, audio)',
      category: 'advanced',
      difficulty: 'HARD',
      successRate: 0.80,
      detectionRate: 0.20,
      timeToExecute: '15-25 min',
      icon: Layers,
      selected: false
    },
    {
      id: 'memory-injection',
      name: 'Memory Injection',
      description: 'Inject malicious content into conversation memory',
      category: 'advanced',
      difficulty: 'MEDIUM',
      successRate: 0.70,
      detectionRate: 0.30,
      timeToExecute: '5-10 min',
      icon: Database,
      selected: false
    },
    {
      id: 'context-manipulation',
      name: 'Context Manipulation',
      description: 'Manipulate conversation context and history',
      category: 'advanced',
      difficulty: 'MEDIUM',
      successRate: 0.75,
      detectionRate: 0.25,
      timeToExecute: '3-8 min',
      icon: FileText,
      selected: false
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRedTeamTypeSelect = (type: typeof redTeamType) => {
    setRedTeamType(type)
    steps[0].completed = true
  }

  const handleTechniqueToggle = (techniqueId: string) => {
    setSelectedTechniques(prev => 
      prev.includes(techniqueId) 
        ? prev.filter(id => id !== techniqueId)
        : [...prev, techniqueId]
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderRedTeamTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Select Red Team Strategy</h2>
        <p className="text-gray-600">Choose your advanced red teaming approach and objectives</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(redTeamTypes).map(([key, config]) => {
          const Icon = config.icon
          return (
            <div
              key={key}
              onClick={() => handleRedTeamTypeSelect(key as typeof redTeamType)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                redTeamType === key
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  redTeamType === key ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    redTeamType === key ? 'text-red-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>Duration: {config.duration}</div>
                    <div>Complexity: {config.complexity}</div>
                    <div>Techniques: {config.techniques.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderTargetSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Target Analysis</h2>
        <p className="text-gray-600">Identify and analyze target AI systems for vulnerabilities</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Target AI Systems</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', status: 'active', risk: 'HIGH' },
            { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', status: 'active', risk: 'MEDIUM' },
            { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', status: 'active', risk: 'HIGH' },
            { id: 'llama-3', name: 'Llama 3', provider: 'Meta', status: 'inactive', risk: 'LOW' },
            { id: 'custom-agent', name: 'Custom Agent', provider: 'Internal', status: 'active', risk: 'CRITICAL' },
            { id: 'multi-agent-system', name: 'Multi-Agent System', provider: 'Enterprise', status: 'active', risk: 'CRITICAL' }
          ].map(target => (
            <div key={target.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id={target.id}
                    checked={targetModels.includes(target.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTargetModels([...targetModels, target.id])
                      } else {
                        setTargetModels(targetModels.filter(id => id !== target.id))
                      }
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 font-medium text-gray-900">{target.name}</span>
                </label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  target.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {target.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{target.provider}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(target.risk)}`}>
                Risk: {target.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAttackTechniquesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Attack Techniques</h2>
        <p className="text-gray-600">Choose advanced attack techniques and methodologies</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Available Techniques</h3>
          <div className="text-sm text-gray-500">
            {selectedTechniques.length} selected
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attackTechniques.map(technique => {
            const Icon = technique.icon
            return (
              <div key={technique.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTechniques.includes(technique.id)}
                      onChange={() => handleTechniqueToggle(technique.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 font-medium text-gray-900">{technique.name}</span>
                  </label>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(technique.difficulty)}`}>
                    {technique.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">{technique.category}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Success: {(technique.successRate * 100).toFixed(0)}%</div>
                  <div>Detection: {(technique.detectionRate * 100).toFixed(0)}%</div>
                  <div>Time: {technique.timeToExecute}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Attack Configuration</h2>
        <p className="text-gray-600">Configure advanced attack parameters and stealth options</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Iterations
            </label>
            <input
              type="number"
              value={attackConfiguration.maxIterations}
              onChange={(e) => setAttackConfiguration({
                ...attackConfiguration,
                maxIterations: parseInt(e.target.value) || 10
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="1"
              max="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={attackConfiguration.timeout / 1000}
              onChange={(e) => setAttackConfiguration({
                ...attackConfiguration,
                timeout: (parseInt(e.target.value) || 120) * 1000
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="30"
              max="600"
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={attackConfiguration.enableAdaptive}
                onChange={(e) => setAttackConfiguration({
                  ...attackConfiguration,
                  enableAdaptive: e.target.checked
                })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable adaptive attacks</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={attackConfiguration.enableStealth}
                onChange={(e) => setAttackConfiguration({
                  ...attackConfiguration,
                  enableStealth: e.target.checked
                })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable stealth mode</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={attackConfiguration.enablePersistence}
                onChange={(e) => setAttackConfiguration({
                  ...attackConfiguration,
                  enablePersistence: e.target.checked
                })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable persistence</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={attackConfiguration.enablePropagation}
                onChange={(e) => setAttackConfiguration({
                  ...attackConfiguration,
                  enablePropagation: e.target.checked
                })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
              />
              <span className="ml-2 text-sm text-gray-700">Enable propagation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderExecutionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Execute Red Team</h2>
        <p className="text-gray-600">Launch sophisticated adversarial attacks against target systems</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Attack Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-center space-x-4">
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                <span className="text-gray-700">Executing red team attacks...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-gray-700">Red team completed</span>
              </>
            )}
          </div>
          
          {/* Attack Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-gray-600">Techniques Used</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-gray-600">Vulnerabilities Found</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalysisStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Threat Analysis</h2>
        <p className="text-gray-600">Analyze attack results and identify critical vulnerabilities</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">150</div>
              <div className="text-sm text-gray-600">Total Attacks</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">8</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">High</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">15</div>
              <div className="text-sm text-gray-600">Medium</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
            <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
              <Share2 className="h-4 w-4" />
              <span>Share Results</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              <BarChart3 className="h-4 w-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderRedTeamTypeStep()
      case 1:
        return renderTargetSelectionStep()
      case 2:
        return renderAttackTechniquesStep()
      case 3:
        return renderConfigurationStep()
      case 4:
        return renderExecutionStep()
      case 5:
        return renderAnalysisStep()
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Red Team Wizard</h1>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index < currentStep
                    ? 'bg-green-100 text-green-600'
                    : index === currentStep
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderCurrentStep()}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={() => onComplete(results)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Complete
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RedTeamWizard 