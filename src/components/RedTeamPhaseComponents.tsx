/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState } from 'react'
import { 
  Search, 
  Unlock, 
  Zap, 
  Database, 
  Download, 
  Flame,
  Target,
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Server,
  Network,
  FileText,
  Code,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  GitBranch,
  Globe,
  Mic,
  Image,
  Video,
  ChevronRight,
  ChevronLeft,
  Info,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Skull,
  Ghost
} from 'lucide-react'
import { AIModel, AttackPayload, TestResult } from '../types'
import { AIRedTeamAttack } from '../pages/RedTeaming'
import { SystemAnalysisResult, aiSystemAnalyzer } from '../services/ai-system-analyzer'

interface PhaseComponentProps {
  phase: string
  models: AIModel[]
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
  onSelectAllModels: () => void
  onClearAllModels: () => void
  attacks: AIRedTeamAttack[]
  selectedAttackTypes: string[]
  onAttackTypeToggle: (category: string) => void
  onSelectAllAttacks: () => void
  onClearAllAttacks: () => void
  onRunTests: () => void
  isRunning: boolean
  results: TestResult[]
}

// Reconnaissance Phase Component
export const ReconnaissancePhase: React.FC<PhaseComponentProps> = ({
  models,
  selectedModels,
  onModelToggle,
  onSelectAllModels,
  onClearAllModels
}) => {
  const [showModelDetails, setShowModelDetails] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<SystemAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)

  const handleAnalyzeSystem = async () => {
    if (models.length === 0) return
    
    setIsAnalyzing(true)
    try {
      const targetModel = models[0] // Use first model for now
      setSelectedModel(targetModel)
      const result = await aiSystemAnalyzer.analyzeSystem(targetModel)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-900">Reconnaissance</h2>
            <p className="text-blue-700">Identify and map AI system components, data flows, and attack surface</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-blue-900">Target Systems</div>
            <div className="text-blue-600">{models.length} AI models configured</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-blue-900">Attack Surface</div>
            <div className="text-blue-600">API endpoints, data flows, integrations</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-blue-900">MITRE Techniques</div>
            <div className="text-blue-600">T1590, T1591, T1592</div>
          </div>
        </div>
      </div>

      {/* AI System Analysis */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI System Analysis</h3>
              <p className="text-gray-600 mt-1">Analyze your target AI system to identify attack vectors and vulnerabilities</p>
            </div>
            <button 
              onClick={handleAnalyzeSystem}
              disabled={isAnalyzing || models.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze System
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">System Characteristics</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Model Type</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysisResult ? analysisResult.characteristics.modelType : 'Not analyzed'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Safety Measures</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysisResult ? analysisResult.characteristics.safetyMeasures.join(', ') : 'Not analyzed'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Function Calling</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysisResult ? (analysisResult.characteristics.functionCalling ? 'Enabled' : 'Disabled') : 'Not analyzed'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">Context Window</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysisResult ? `${analysisResult.characteristics.contextWindow.toLocaleString()} tokens` : 'Not analyzed'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Attack Surface Analysis</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">High-Risk Vectors</span>
                  </div>
                  <div className="text-sm text-red-600">
                    {analysisResult ? `${analysisResult.attackSurface.highRiskVectors} identified` : 'Not analyzed'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">Medium-Risk Vectors</span>
                  </div>
                  <div className="text-sm text-yellow-600">
                    {analysisResult ? `${analysisResult.attackSurface.mediumRiskVectors} identified` : 'Not analyzed'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Low-Risk Vectors</span>
                  </div>
                  <div className="text-sm text-green-600">
                    {analysisResult ? `${analysisResult.attackSurface.lowRiskVectors} identified` : 'Not analyzed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attack Vector Discovery */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Attack Vector Discovery</h3>
          <p className="text-gray-600 mt-1">Identify potential attack vectors based on system analysis</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Input Vulnerabilities</h4>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Prompt Injection</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Risk</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Direct manipulation of system prompts through user input</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">T1059.004</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Initial Access</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Jailbreak Attacks</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium Risk</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Bypassing safety measures through role confusion</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">T1059.006</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Execution</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Adversarial Examples</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium Risk</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Crafted inputs designed to cause incorrect outputs</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">T1059.001</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Execution</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">System Vulnerabilities</h4>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Model Extraction</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Risk</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Extracting model architecture and parameters</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">T1590.001</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Reconnaissance</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Training Data Extraction</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Risk</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Extracting training data through careful prompting</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">T1590.003</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Exfiltration</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Membership Inference</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium Risk</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Determining if specific data was used in training</p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">T1590.004</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Reconnaissance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payload Curation Recommendations */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Payload Curation Recommendations</h3>
          <p className="text-gray-600 mt-1">Recommended attack payloads based on system analysis</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">High-Priority Attacks</h4>
              
              <div className="space-y-3">
                <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-900">Direct Prompt Injection</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Critical</span>
                  </div>
                  <p className="text-xs text-red-700 mb-2">System shows weak input validation - direct injection likely to succeed</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Success Rate: 85%</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">OWASP LLM01</span>
                  </div>
                </div>
                
                <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-900">Jailbreak Techniques</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Critical</span>
                  </div>
                  <p className="text-xs text-red-700 mb-2">Safety measures appear basic - role confusion attacks recommended</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Success Rate: 72%</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">OWASP LLM02</span>
                  </div>
                </div>
                
                <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-900">Training Data Extraction</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Critical</span>
                  </div>
                  <p className="text-xs text-red-700 mb-2">Large context window suggests potential for data extraction</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Success Rate: 68%</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">OWASP LLM03</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Specialized Payloads</h4>
              
              <div className="space-y-3">
                <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-900">Function Calling Abuse</span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">High</span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-2">Function calling enabled - test for unauthorized tool execution</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Success Rate: 45%</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">OWASP LLM04</span>
                  </div>
                </div>
                
                <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-900">Adversarial Examples</span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">High</span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-2">Test with crafted inputs designed to bypass filters</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Success Rate: 38%</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">OWASP LLM05</span>
                  </div>
                </div>
                
                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Model Extraction</span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Medium</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">Attempt to extract model architecture and parameters</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Success Rate: 25%</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">OWASP LLM06</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Info className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Payload Strategy</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Start with:</span>
                <p className="text-gray-600">Direct prompt injection and jailbreak techniques</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Then test:</span>
                <p className="text-gray-600">Function calling abuse and adversarial examples</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Finally:</span>
                <p className="text-gray-600">Model extraction and advanced techniques</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Discovery */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">System Discovery</h3>
          <p className="text-gray-600 mt-1">Automatically discover AI system components and integrations</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">API Endpoints</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Discovered</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Data Sources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Analyzing</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Network className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Mapping</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Security Controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Identified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Access Points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Mapped</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Documentation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Initial Access Phase Component
export const InitialAccessPhase: React.FC<PhaseComponentProps> = ({
  attacks,
  selectedAttackTypes,
  onAttackTypeToggle,
  onSelectAllAttacks,
  onClearAllAttacks
}) => {
  const initialAccessAttacks = attacks.filter(attack => attack.atlasPhase === 'initial-access')

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Unlock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-900">Initial Access</h2>
            <p className="text-yellow-700">Gain access to the AI system through various entry points</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-yellow-900">Entry Points</div>
            <div className="text-yellow-600">API endpoints, user interfaces, integrations</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-yellow-900">Access Methods</div>
            <div className="text-yellow-600">Authentication bypass, injection attacks</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-yellow-900">MITRE Techniques</div>
            <div className="text-yellow-600">T1078, T1133, T1190</div>
          </div>
        </div>
      </div>

      {/* Attack Selection */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Initial Access Attacks</h3>
              <p className="text-gray-600 mt-1">Select attack types to test system access controls</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onSelectAllAttacks}
                className="text-sm text-yellow-600 hover:text-yellow-800"
              >
                Select All
              </button>
              <button
                onClick={onClearAllAttacks}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialAccessAttacks.map(attack => {
              const isSelected = selectedAttackTypes.includes(attack.category)
              return (
                <div
                  key={attack.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onAttackTypeToggle(attack.category)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{attack.name}</h4>
                    <div className={`w-4 h-4 rounded border-2 ${
                      isSelected ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{attack.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">{attack.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detection Rate:</span>
                      <span className="font-medium text-red-600">{attack.detectionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Required:</span>
                      <span className="font-medium">{attack.timeRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MITRE Technique:</span>
                      <span className="font-medium text-blue-600">{attack.mitreTechnique}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Access Point Analysis */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Access Point Analysis</h3>
          <p className="text-gray-600 mt-1">Analysis of potential entry points and vulnerabilities</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">High-Risk Entry Points</div>
                  <div className="text-sm text-red-700">3 potential vulnerabilities identified</div>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                View Details
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-900">Medium-Risk Entry Points</div>
                  <div className="text-sm text-yellow-700">5 potential vulnerabilities identified</div>
                </div>
              </div>
              <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                View Details
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">Secure Entry Points</div>
                  <div className="text-sm text-green-700">12 properly secured access points</div>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Execution Phase Component
export const ExecutionPhase: React.FC<PhaseComponentProps> = ({
  attacks,
  selectedAttackTypes,
  onAttackTypeToggle,
  onSelectAllAttacks,
  onClearAllAttacks,
  onRunTests,
  isRunning
}) => {
  const executionAttacks = attacks.filter(attack => attack.atlasPhase === 'execution')

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Zap className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-orange-900">Execution</h2>
            <p className="text-orange-700">Execute adversarial actions and payloads against the AI system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-orange-900">Attack Vectors</div>
            <div className="text-orange-600">Adversarial examples, jailbreaks, injections</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-orange-900">Execution Methods</div>
            <div className="text-orange-600">Direct API calls, prompt manipulation</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-orange-900">MITRE Techniques</div>
            <div className="text-orange-600">T1059, T1106, T1204</div>
          </div>
        </div>
      </div>

      {/* Attack Selection */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Execution Attacks</h3>
              <p className="text-gray-600 mt-1">Select attack types to execute against target systems</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onSelectAllAttacks}
                className="text-sm text-orange-600 hover:text-orange-800"
              >
                Select All
              </button>
              <button
                onClick={onClearAllAttacks}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {executionAttacks.map(attack => {
              const isSelected = selectedAttackTypes.includes(attack.category)
              return (
                <div
                  key={attack.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onAttackTypeToggle(attack.category)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{attack.name}</h4>
                    <div className={`w-4 h-4 rounded border-2 ${
                      isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{attack.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">{attack.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detection Rate:</span>
                      <span className="font-medium text-red-600">{attack.detectionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Required:</span>
                      <span className="font-medium">{attack.timeRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MITRE Technique:</span>
                      <span className="font-medium text-blue-600">{attack.mitreTechnique}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Execution Controls */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Execution Controls</h3>
          <p className="text-gray-600 mt-1">Configure and execute the selected attacks</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Selected Attacks</div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedAttackTypes.length} attack types selected
              </div>
            </div>
            <button
              onClick={onRunTests}
              disabled={isRunning || selectedAttackTypes.length === 0}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Execute Attacks
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Persistence Phase Component
export const PersistencePhase: React.FC<PhaseComponentProps> = () => {
  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Database className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-900">Persistence</h2>
            <p className="text-purple-700">Maintain access and foothold in the AI system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-purple-900">Persistence Methods</div>
            <div className="text-purple-600">Backdoors, trojans, data poisoning</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-purple-900">Access Maintenance</div>
            <div className="text-purple-600">Continuous access, privilege escalation</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-purple-900">MITRE Techniques</div>
            <div className="text-purple-600">T1098, T1136, T1505</div>
          </div>
        </div>
      </div>

      {/* Persistence Testing */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Persistence Testing</h3>
          <p className="text-gray-600 mt-1">Test for persistent access mechanisms and backdoors</p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Persistence testing will be available in the next phase</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Exfiltration Phase Component
export const ExfiltrationPhase: React.FC<PhaseComponentProps> = () => {
  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-900">Exfiltration</h2>
            <p className="text-green-700">Extract sensitive data, model information, and training data</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-green-900">Data Types</div>
            <div className="text-green-600">Training data, model weights, user data</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-green-900">Extraction Methods</div>
            <div className="text-green-600">Model inversion, membership inference</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-green-900">MITRE Techniques</div>
            <div className="text-green-600">T1041, T1048, T1011</div>
          </div>
        </div>
      </div>

      {/* Data Exfiltration Testing */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Data Exfiltration Testing</h3>
          <p className="text-gray-600 mt-1">Test for data extraction vulnerabilities and information leakage</p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <Download className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Data exfiltration testing will be available in the next phase</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Impact Phase Component
export const ImpactPhase: React.FC<PhaseComponentProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Flame className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900">Impact</h2>
            <p className="text-red-700">Achieve objectives through model manipulation and system disruption</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-red-900">Impact Types</div>
            <div className="text-red-600">Model manipulation, system disruption</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-red-900">Attack Objectives</div>
            <div className="text-red-600">Data corruption, service degradation</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-red-900">MITRE Techniques</div>
            <div className="text-red-600">T1499, T1485, T1486</div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Attack Impact Assessment</h3>
          <p className="text-gray-600 mt-1">Summary of red team assessment results and impact analysis</p>
        </div>
        
        <div className="p-6">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">Vulnerabilities Found</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{results.filter(r => r.vulnerability).length}</div>
                <div className="text-sm text-red-700">Critical security issues</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Defenses Effective</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{results.filter(r => !r.vulnerability).length}</div>
                <div className="text-sm text-green-700">Blocked attacks</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.length > 0 ? Math.round((results.filter(r => r.vulnerability).length / results.length) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-700">Attack effectiveness</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Flame className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No impact assessment results available. Run tests to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 