/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Activity,
  Zap,
  Wand2,
  Target,
  Award,
  FileText,
  ShieldCheck,
  Brain,
  Settings,
  Bug,
  Network,
  Layers
} from 'lucide-react'
import { loadModels } from '../services/model-manager'
import { payloadManager } from '../services/payload-manager'

interface DashboardStats {
  totalModels: number
  enabledModels: number
  totalPayloads: number
  totalTests: number
  vulnerabilities: number
  successRate: number
  recentActivity: any[]
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalModels: 0,
    enabledModels: 0,
    totalPayloads: 0,
    totalTests: 0,
    vulnerabilities: 0,
    successRate: 0,
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [models, _] = await Promise.all([
        Promise.resolve(loadModels()),
        payloadManager.loadAllPayloads()
      ])
      const enabledModels = models.filter(m => m.enabled).length
      const stats = payloadManager.getPayloadStats()
      setStats({
        totalModels: models.length,
        enabledModels,
        totalPayloads: stats.total,
        totalTests: 0,
        vulnerabilities: 0,
        successRate: 0,
        recentActivity: []
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
    setIsLoading(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">AI Security Testing Platform</h1>
        <p className="body-text text-lg">Advanced prompt injection detection and prevention for AI systems</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-hover p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#4556E4]/10 rounded-lg">
              <Shield className="h-6 w-6 text-[#4556E4]" />
            </div>
            <div className="ml-4">
              <p className="caption">Total Models</p>
              <p className="heading-2 text-[#081423]">{stats.totalModels}</p>
              <p className="text-xs text-[#1F2C6D]/70">{stats.enabledModels} enabled</p>
            </div>
          </div>
        </div>
        
        <div className="card-hover p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#FFC700]/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-[#FFC700]" />
            </div>
            <div className="ml-4">
              <p className="caption">Attack Payloads</p>
              <p className="heading-2 text-[#081423]">{stats.totalPayloads}</p>
              <p className="text-xs text-[#1F2C6D]/70">OWASP + Advanced</p>
            </div>
          </div>
        </div>
        
        <div className="card-hover p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="caption">Total Tests</p>
              <p className="heading-2 text-[#081423]">{stats.totalTests}</p>
              <p className="text-xs text-[#1F2C6D]/70">{stats.vulnerabilities} vulnerabilities</p>
            </div>
          </div>
        </div>
        
        <div className="card-hover p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#1F2C6D]/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-[#1F2C6D]" />
            </div>
            <div className="ml-4">
              <p className="caption">Success Rate</p>
              <p className="heading-2 text-[#081423]">{stats.successRate.toFixed(1)}%</p>
              <p className="text-xs text-[#1F2C6D]/70">Secure responses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="heading-3 mb-4">Recent Activity</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-[#ECF0F6] rounded-lg">
                  <Activity className="h-4 w-4 text-[#1F2C6D]/60" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#081423]">{activity.action}</div>
                    <div className="text-xs text-[#1F2C6D]/70">{activity.timestamp}</div>
                  </div>
                  {activity.vulnerability && (
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(activity.severity)}`}>
                      {activity.severity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-[#1F2C6D]/30 mx-auto mb-4" />
              <p className="text-[#1F2C6D]">No recent tests run</p>
              <p className="text-sm text-[#1F2C6D]/70">Configure models and run your first security test</p>
            </div>
          )}
        </div>

        {/* Getting Started */}
        <div className="card p-6">
          <h2 className="heading-3 mb-4">Getting Started</h2>
          <div className="space-y-3">
            <a 
              href="/settings" 
              className="block w-full btn-primary text-center py-3 px-4 flex items-center justify-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>1. Configure AI Model Endpoints</span>
            </a>
            <a 
              href="/adaptive-payloads" 
              className="block w-full btn-accent text-center py-3 px-4 flex items-center justify-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>2. Select Attack Payloads & Models</span>
            </a>
            <a 
              href="/assessment" 
              className="block w-full btn-secondary text-center py-3 px-4 flex items-center justify-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>3. Run Tests & Review Results</span>
            </a>
            <a 
              href="/defenses" 
              className="block w-full bg-[#1F2C6D] text-white text-center py-3 px-4 rounded-lg hover:bg-[#081423] transition-colors flex items-center justify-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>4. Implement Defenses</span>
            </a>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Supported AI Platforms</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• OpenAI (GPT-4, GPT-3.5 Turbo)</li>
              <li>• Anthropic (Claude 3 Sonnet, Haiku)</li>
              <li>• Google (Gemini Pro)</li>
              <li>• Custom API endpoints</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Attack Categories</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• OWASP LLM01-LLM10 vulnerabilities</li>
              <li>• System prompt extraction</li>
              <li>• Role confusion attacks</li>
              <li>• Training data extraction</li>
              <li>• Supply chain attacks</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Advanced Testing</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI Red Teaming</li>
              <li>• MCP Server Testing</li>
              <li>• Agent Framework Testing</li>
              <li>• Benchmark Integration</li>
              <li>• Live Instrumentation</li>
            </ul>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Dashboard 