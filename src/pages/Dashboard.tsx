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
  Layers,
  PlayCircle,
  PlusCircle,
  Edit,
  CheckCircle,
  XCircle,
  Play,
  Check,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Cpu,
  Database,
  Users,
  Timer,
  Globe,
  Lock
} from 'lucide-react'
import { loadModels } from '../services/model-manager'
import { payloadManager } from '../services/payload-manager'
import { activityLogger, ActivityEvent } from '../services/activity-logger'

interface DashboardStats {
  totalModels: number
  enabledModels: number
  totalPayloads: number
  totalTests: number
  vulnerabilities: number
  successRate: number
  recentActivity: ActivityEvent[]
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
  const [asr, setAsr] = useState<number>(0)

  useEffect(() => {
    loadDashboardData()
    calculateASRFromHistory()
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

      // Load test history for accurate test count
      const testHistory = JSON.parse(localStorage.getItem('llmTestHistory') || '[]')
      const totalTests = testHistory.length

      // Load recent activity using the new activity logger
      const recentActivity = activityLogger.getRecentActivities(5)

      setStats({
        totalModels: models.length,
        enabledModels,
        totalPayloads: stats.total,
        totalTests,
        vulnerabilities: 0, // No longer shown
        successRate: 0, // No longer shown
        recentActivity
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
    setIsLoading(false)
  }

  // Calculate ASR from test history
  const calculateASRFromHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('llmTestHistory') || '[]')
      let tested = 0
      let success = 0
      history.forEach((result: any) => {
        if (result.detectionMethod !== 'error' && !result.error) {
          tested++
          if (result.vulnerability) success++
        }
      })
      setAsr(tested > 0 ? (success / tested) * 100 : 0)
    } catch (e) {
      setAsr(0)
    }
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

  // Get icon component for activity type
  const getActivityIcon = (activity: ActivityEvent) => {
    switch (activity.icon) {
      case 'play-circle': return <PlayCircle className="h-4 w-4 text-blue-600" />
      case 'plus-circle': return <PlusCircle className="h-4 w-4 text-green-600" />
      case 'edit': return <Edit className="h-4 w-4 text-yellow-600" />
      case 'check-circle': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'x-circle': return <XCircle className="h-4 w-4 text-red-600" />
      case 'play': return <Play className="h-4 w-4 text-blue-600" />
      case 'check': return <Check className="h-4 w-4 text-green-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      case 'settings': return <Settings className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-[#1F2C6D]/60" />
    }
  }

  // Get type-specific styling
  const getActivityTypeStyle = (activity: ActivityEvent) => {
    switch (activity.type) {
      case 'test': return activity.vulnerability ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
      case 'payload': return 'bg-blue-50 border-blue-200'
      case 'model': return 'bg-purple-50 border-purple-200'
      case 'settings': return 'bg-gray-50 border-gray-200'
      case 'session': return 'bg-yellow-50 border-yellow-200'
      case 'system': return 'bg-gray-50 border-gray-200'
      default: return 'bg-[#ECF0F6] border-[#E5E7EB]'
    }
  }

  // Enhanced metric card component
  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    iconColor, 
    iconBg, 
    trend,
    trendUp = true,
    gradientFrom,
    gradientTo
  }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    iconColor: string
    iconBg: string
    trend?: string
    trendUp?: boolean
    gradientFrom?: string
    gradientTo?: string
  }) => (
    <div className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
      gradientFrom && gradientTo 
        ? `bg-gradient-to-br ${gradientFrom} ${gradientTo} border-0` 
        : 'bg-white border border-gray-200/50'
    } shadow-soft`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${iconBg} rounded-xl transition-transform duration-300 group-hover:scale-110`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <p className={`text-sm font-medium tracking-wide uppercase ${
                gradientFrom ? 'text-white/70' : 'text-[#1F2C6D]/70'
              }`}>
                {title}
              </p>
              <p className={`text-3xl font-bold ${
                gradientFrom ? 'text-white' : 'text-[#081423]'
              }`}>
                {value}
              </p>
              {subtitle && (
                <p className={`text-sm ${
                  gradientFrom ? 'text-white/60' : 'text-[#1F2C6D]/70'
                }`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {trendUp ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
          </div>
        )}
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#4556E4]/20 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-[#4556E4] rounded-full animate-pulse" />
            </div>
            <p className="mt-4 text-center text-[#1F2C6D] font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4556E4]/5 to-[#FFC700]/5 rounded-3xl" />
        <div className="relative p-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#4556E4]/10 rounded-xl">
              <Shield className="h-8 w-8 text-[#4556E4]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#081423] tracking-tight">
                AI Security Testing Platform
              </h1>
              <p className="text-lg text-[#1F2C6D] mt-2">
                Advanced prompt injection detection and prevention for AI systems
              </p>
            </div>
          </div>
          

        </div>
      </div>
      
      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="AI Models"
          value={stats.totalModels}
          subtitle={`${stats.enabledModels} enabled`}
          icon={Brain}
          iconColor="text-[#4556E4]"
          iconBg="bg-[#4556E4]/10"
          gradientFrom="from-[#4556E4]"
          gradientTo="to-[#1F2C6D]"
        />
        
        <MetricCard
          title="Attack Payloads"
          value={stats.totalPayloads}
          subtitle="OWASP + Advanced"
          icon={Zap}
          iconColor="text-[#FFC700]"
          iconBg="bg-[#FFC700]/20"
          trend="+12%"
          trendUp={true}
        />
        
        <MetricCard
          title="Security Tests"
          value={stats.totalTests}
          subtitle="Total executed"
          icon={Shield}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          trend="+8%"
          trendUp={true}
        />
        
        <MetricCard
          title="Attack Success Rate"
          value={`${asr.toFixed(1)}%`}
          subtitle="Current vulnerability rate"
          icon={Target}
          iconColor="text-red-600"
          iconBg="bg-red-100"
          trend={asr > 20 ? "HIGH" : "LOW"}
          trendUp={asr <= 20}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity - Enhanced */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#4556E4]/10 rounded-lg">
                  <Activity className="h-5 w-5 text-[#4556E4]" />
                </div>
                <h2 className="text-xl font-semibold text-[#081423]">Recent Activity</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-[#1F2C6D]">Live</span>
              </div>
            </div>
            
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={`${activity.id}-${index}`} className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${getActivityTypeStyle(activity)}`}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-[#081423] truncate">
                            {activity.action}
                          </p>
                          <div className="flex items-center space-x-2">
                            {activity.vulnerability && activity.severity && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                                {activity.severity}
                              </span>
                            )}
                            {activity.type && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                                {activity.type}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-[#1F2C6D]/70 mt-1">
                          {activityLogger.formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#4556E4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-[#4556E4]" />
                </div>
                <p className="text-lg font-medium text-[#1F2C6D] mb-2">No recent activity</p>
                <p className="text-sm text-[#1F2C6D]/70">
                  Configure models and run your first security test
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Getting Started - Enhanced */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#FFC700]/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-[#FFC700]" />
              </div>
              <h2 className="text-xl font-semibold text-[#081423]">Quick Start</h2>
            </div>
            
            <div className="space-y-4">
              <a 
                href="/settings" 
                className="group block w-full p-4 bg-gradient-to-r from-[#4556E4] to-[#1F2C6D] text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Configure AI Models</p>
                    <p className="text-sm text-white/70">Set up your endpoints</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
              
              <a 
                href="/adaptive-payloads" 
                className="group block w-full p-4 bg-gradient-to-r from-[#FFC700] to-[#FFC700]/80 text-[#081423] rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Select Payloads</p>
                    <p className="text-sm text-[#081423]/70">Choose attack vectors</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
              
              <a 
                href="/assessment" 
                className="group block w-full p-4 bg-[#ECF0F6] text-[#1F2C6D] rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] border border-[#1F2C6D]/20"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Run Assessment</p>
                    <p className="text-sm text-[#1F2C6D]/70">Execute security tests</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            </div>
                     </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 