/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { useState, useEffect } from 'react'
import { Server, Key, Database, Bell, User, Globe, GitBranch } from 'lucide-react'
import { loadModels, updateModel, saveModels } from '../services/model-manager'
import { AIModel } from '../types'
import MCPServerManagement from '../components/MCPServerManagement'
import AIProviderManager from '../components/AIProviderManager'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('ai-providers')
  const [models, setModels] = useState<AIModel[]>([])

  useEffect(() => {
    loadModelsData()
  }, [])

  const loadModelsData = async () => {
    const modelsData = await loadModels()
    setModels(modelsData)
  }

  const tabs = [
    { id: 'ai-providers', name: 'AI Providers', icon: Server },
    { id: 'mcp-servers', name: 'MCP Servers', icon: Server },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
      <p className="text-gray-600 mb-6">Configure your Prompt Injector preferences</p>
      
      <div className="bg-white rounded-lg shadow">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 inline mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'ai-providers' && (
            <AIProviderManager />
          )}

          {activeTab === 'mcp-servers' && (
            <MCPServerManagement />
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings 