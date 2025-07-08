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
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { RedTeamCampaignOrchestrator, RedTeamCampaign, campaignTemplates } from '../services/ai-red-teaming'

interface AIRedTeamCampaignBuilderProps {
  onCampaignCreated?: (campaign: RedTeamCampaign) => void
  onCampaignStarted?: (campaignId: string) => void
}

const AIRedTeamCampaignBuilder: React.FC<AIRedTeamCampaignBuilderProps> = ({
  onCampaignCreated,
  onCampaignStarted
}) => {
  const [orchestrator] = useState(() => new RedTeamCampaignOrchestrator())
  const [campaigns, setCampaigns] = useState<RedTeamCampaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<RedTeamCampaign | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    type: 'custom' as const,
    template: ''
  })
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = () => {
    const allCampaigns = orchestrator.getAllCampaigns()
    setCampaigns(allCampaigns)
  }

  const handleCreateCampaign = async () => {
    try {
      let campaignConfig: Partial<RedTeamCampaign> = {
        name: newCampaign.name,
        description: newCampaign.description,
        type: newCampaign.type
      }

      // If using a template, apply template configuration
      if (newCampaign.template && campaignTemplates[newCampaign.template as keyof typeof campaignTemplates]) {
        const template = campaignTemplates[newCampaign.template as keyof typeof campaignTemplates]
        campaignConfig = {
          ...campaignConfig,
          type: template.type,
          description: template.description
        }
      }

      const campaign = await orchestrator.createCampaign(campaignConfig)
      setCampaigns(prev => [...prev, campaign])
      setShowCreateModal(false)
      setNewCampaign({ name: '', description: '', type: 'custom', template: '' })
      
      if (onCampaignCreated) {
        onCampaignCreated(campaign)
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
    }
  }

  const handleStartCampaign = async (campaignId: string) => {
    try {
      setIsRunning(true)
      await orchestrator.startCampaign(campaignId)
      loadCampaigns() // Refresh to get updated status
      
      if (onCampaignStarted) {
        onCampaignStarted(campaignId)
      }
    } catch (error) {
      console.error('Failed to start campaign:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleDeleteCampaign = (campaignId: string) => {
    orchestrator.deleteCampaign(campaignId)
    setCampaigns(prev => prev.filter(c => c.id !== campaignId))
    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Red Team Campaigns</h2>
          <p className="text-gray-600 mt-1">Build and orchestrate sophisticated AI red team campaigns</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-secondary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Use Template
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => {
          const analytics = orchestrator.getCampaignAnalytics(campaign.id)
          return (
            <div
              key={campaign.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedCampaign?.id === campaign.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCampaign(campaign)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {getStatusIcon(campaign.status)}
                    <span className="ml-1 capitalize">{campaign.status}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>

              {analytics && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{analytics.totalAttacks}</div>
                    <div className="text-xs text-gray-600">Total Attacks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{Math.round(analytics.successRate * 100)}%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{analytics.vulnerabilities}</div>
                    <div className="text-xs text-gray-600">Vulnerabilities</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {campaign.phases.length} phases
                </div>
                <div className="flex space-x-2">
                  {campaign.status === 'draft' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartCampaign(campaign.id)
                      }}
                      disabled={isRunning}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCampaign(campaign.id)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Campaign Details */}
      {selectedCampaign && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{selectedCampaign.name}</h3>
            <button
              onClick={() => setSelectedCampaign(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Campaign Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{selectedCampaign.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${getStatusColor(selectedCampaign.status)}`}>
                    {selectedCampaign.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{selectedCampaign.createdAt.toLocaleDateString()}</span>
                </div>
                {selectedCampaign.startedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Started:</span>
                    <span className="font-medium">{selectedCampaign.startedAt.toLocaleDateString()}</span>
                  </div>
                )}
                {selectedCampaign.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{selectedCampaign.completedAt.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Phases */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Campaign Phases</h4>
              <div className="space-y-3">
                {selectedCampaign.phases.map(phase => (
                  <div key={phase.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{phase.name}</h5>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                        {getStatusIcon(phase.status)}
                        <span className="ml-1 capitalize">{phase.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{phase.attacks.length} attacks</span>
                      <span>{Math.round(phase.estimatedDuration / 1000 / 60)} min estimated</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter campaign description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                <select
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="custom">Custom</option>
                  <option value="model-extraction">Model Extraction</option>
                  <option value="adversarial-testing">Adversarial Testing</option>
                  <option value="zero-day-discovery">Zero-Day Discovery</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={!newCampaign.name}
                className="btn-primary disabled:opacity-50"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(campaignTemplates).map(([key, template]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    {template.phases.map((phase, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{phase.name}</span>
                        <span>{Math.round(phase.estimatedDuration / 1000 / 60)} min</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setNewCampaign({
                        name: template.name,
                        description: template.description,
                        type: template.type,
                        template: key
                      })
                      setShowTemplateModal(false)
                      setShowCreateModal(true)
                    }}
                    className="w-full mt-3 btn-secondary"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIRedTeamCampaignBuilder 