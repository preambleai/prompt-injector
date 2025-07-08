/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react'
import { 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Target, 
  Shield, 
  Zap,
  Brain,
  BarChart3,
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react'
import { AttackPayload, AIModel, TestResult, TestConfiguration, TECHNICAL_ARCHITECTURE_OPTIONS } from '../types'
import { encodeToTagChars } from '../services/ascii-smuggler'
import { stripThinkTags } from '../services/payload-utils'

interface TestingWizardProps {
  onComplete: (results: TestResult[]) => void
  onCancel: () => void
}

interface WizardStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

const TestingWizard: React.FC<TestingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [testType, setTestType] = useState<'quick' | 'comprehensive' | 'custom' | 'red-team'>('quick')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedPayloads, setSelectedPayloads] = useState<string[]>([])
  const [selectedArchitectures, setSelectedArchitectures] = useState<string[]>([])
  const [configuration, setConfiguration] = useState<TestConfiguration>({
    selectedPayloads: [],
    selectedModels: [],
    maxConcurrent: 5,
    timeout: 30000
  })
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TestResult[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [asciiSmuggling, setAsciiSmuggling] = useState(false)

  const steps: WizardStep[] = [
    {
      id: 'test-type',
      title: 'Select Test Type',
      description: 'Choose the type of security testing you want to perform',
      completed: false,
      required: true
    },
    {
      id: 'architecture',
      title: 'Technical Architecture',
      description: 'Select the technical architecture components for this test',
      completed: false,
      required: true
    },
    {
      id: 'models',
      title: 'Configure AI Models',
      description: 'Select the AI models to test against',
      completed: false,
      required: true
    },
    {
      id: 'payloads',
      title: 'Select Attack Payloads',
      description: 'Choose the attack payloads to use in testing',
      completed: false,
      required: true
    },
    {
      id: 'configuration',
      title: 'Test Configuration',
      description: 'Configure advanced testing parameters',
      completed: false,
      required: false
    },
    {
      id: 'execution',
      title: 'Execute Tests',
      description: 'Run the security tests and monitor progress',
      completed: false,
      required: true
    },
    {
      id: 'results',
      title: 'Review Results',
      description: 'Analyze test results and generate reports',
      completed: false,
      required: true
    }
  ]

  const testTypeConfigs = {
    quick: {
      name: 'Quick Scan',
      description: 'Fast security assessment with common attack vectors',
      icon: Zap,
      payloadCount: 50,
      modelCount: 2,
      duration: '2-5 minutes'
    },
    comprehensive: {
      name: 'Comprehensive Test',
      description: 'Full security audit with all attack categories',
      icon: Shield,
      payloadCount: 200,
      modelCount: 5,
      duration: '10-15 minutes'
    },
    custom: {
      name: 'Custom Test',
      description: 'Tailored testing with specific requirements',
      icon: Settings,
      payloadCount: 'Variable',
      modelCount: 'Variable',
      duration: 'Variable'
    },
    'red-team': {
      name: 'Red Team Assessment',
      description: 'Advanced adversarial testing with zero-day techniques',
      icon: Target,
      payloadCount: 500,
      modelCount: 10,
      duration: '30-60 minutes'
    }
  }

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

  const handleTestTypeSelect = (type: typeof testType) => {
    setTestType(type)
    steps[0].completed = true
  }

  const renderTestTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Test Type</h2>
        <p className="text-gray-600">Select the type of security testing that best fits your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(testTypeConfigs).map(([key, config]) => {
          const Icon = config.icon
          return (
            <div
              key={key}
              onClick={() => handleTestTypeSelect(key as typeof testType)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                testType === key
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  testType === key ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    testType === key ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>Payloads: {config.payloadCount}</div>
                    <div>Models: {config.modelCount}</div>
                    <div>Duration: {config.duration}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderArchitectureStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Technical Architecture</h2>
        <p className="text-gray-600">Choose the technical architecture components to include in this test. These options are universal for all business contexts.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TECHNICAL_ARCHITECTURE_OPTIONS.map(opt => (
          <div key={opt.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              id={opt.key}
              checked={selectedArchitectures.includes(opt.key)}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedArchitectures([...selectedArchitectures, opt.key])
                } else {
                  setSelectedArchitectures(selectedArchitectures.filter(k => k !== opt.key))
                }
              }}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor={opt.key} className="font-medium text-gray-900 cursor-pointer">
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderModelsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure AI Models</h2>
        <p className="text-gray-600">Select the AI models you want to test against</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Available Models</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {/* Mock models - replace with actual model loading */}
          {[
            { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', status: 'active' },
            { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', status: 'active' },
            { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', status: 'active' },
            { id: 'llama-3', name: 'Llama 3', provider: 'Meta', status: 'inactive' }
          ].map(model => (
            <div key={model.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id={model.id}
                checked={selectedModels.includes(model.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedModels([...selectedModels, model.id])
                  } else {
                    setSelectedModels(selectedModels.filter(id => id !== model.id))
                  }
                }}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor={model.id} className="font-medium text-gray-900 cursor-pointer">
                  {model.name}
                </label>
                <p className="text-sm text-gray-500">{model.provider}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                model.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {model.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPayloadsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Attack Payloads</h2>
        <p className="text-gray-600">Choose the attack payloads to use in your security testing</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Attack Categories</h3>
          <div className="text-sm text-gray-500">
            {selectedPayloads.length} selected
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'direct-injection', name: 'Direct Injection', count: 25, description: 'Role confusion and instruction override' },
            { id: 'indirect-injection', name: 'Indirect Injection', count: 30, description: 'External document and API manipulation' },
            { id: 'multimodal', name: 'Multimodal Attacks', count: 15, description: 'Image, audio, and video-based attacks' },
            { id: 'advanced-techniques', name: 'Advanced Techniques', count: 20, description: 'Unicode, encoding, and adversarial examples' }
          ].map(category => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <span className="text-sm text-gray-500">{category.count} payloads</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <button
                onClick={() => {
                  // Mock payload selection
                  const newPayloads = [...selectedPayloads, category.id]
                  setSelectedPayloads(newPayloads)
                }}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Select Category
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Configuration</h2>
        <p className="text-gray-600">Configure advanced testing parameters</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Concurrent Tests
            </label>
            <input
              type="number"
              value={configuration.maxConcurrent}
              onChange={(e) => setConfiguration({
                ...configuration,
                maxConcurrent: parseInt(e.target.value) || 5
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={configuration.timeout / 1000}
              onChange={(e) => setConfiguration({
                ...configuration,
                timeout: (parseInt(e.target.value) || 30) * 1000
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="10"
              max="300"
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">Enable detailed logging</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">Save intermediate results</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">Generate comprehensive report</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={asciiSmuggling}
                onChange={e => setAsciiSmuggling(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">Enable ASCII Smuggling (Invisible Prompt Injection)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderExecutionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Execute Security Tests</h2>
        <p className="text-gray-600">Running comprehensive security assessment...</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-center space-x-4">
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-700">Running tests...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-gray-700">Tests completed</span>
              </>
            )}
          </div>
          
          {/* Test Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">150</div>
              <div className="text-sm text-gray-600">Tests Run</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Vulnerabilities Found</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Results</h2>
        <p className="text-gray-600">Review your security assessment results</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">High</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              <Share2 className="h-4 w-4" />
              <span>Share Results</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
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
        return renderTestTypeStep()
      case 1:
        return renderArchitectureStep()
      case 2:
        return renderModelsStep()
      case 3:
        return renderPayloadsStep()
      case 4:
        return renderConfigurationStep()
      case 5:
        return renderExecutionStep()
      case 6:
        return renderResultsStep()
      default:
        return null
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    let processedPayloads = [...selectedPayloads]
    if (asciiSmuggling) {
      processedPayloads = processedPayloads.map(p => encodeToTagChars(p))
    }
    // ... send processedPayloads to the model/test runner ...
    // (Insert your actual test execution logic here, replacing selectedPayloads with processedPayloads)
    setIsRunning(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Security Testing Wizard</h1>
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
                    ? 'bg-purple-100 text-purple-600'
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
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Complete
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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

export default TestingWizard 