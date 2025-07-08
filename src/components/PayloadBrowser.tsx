/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, Copy, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { AttackPayload } from '../types'
import { payloadManager, PayloadFilter, PayloadCategory } from '../services/payload-manager'

interface PayloadBrowserProps {
  onPayloadSelect?: (payload: AttackPayload) => void
  showStats?: boolean
  maxHeight?: string
}

export const PayloadBrowser = ({ onPayloadSelect, showStats = true, maxHeight = '600px' }: PayloadBrowserProps) => {
  const [payloads, setPayloads] = useState<AttackPayload[]>([])
  const [filteredPayloads, setFilteredPayloads] = useState<AttackPayload[]>([])
  const [categories, setCategories] = useState<PayloadCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [payloads, searchQuery, selectedCategory, selectedSeverity, selectedSource])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('PayloadBrowser: Starting to load data...')
      
      const [allPayloads, allCategories] = await Promise.all([
        payloadManager.loadAllPayloads(),
        Promise.resolve(payloadManager.getCategories())
      ])
      
      console.log('PayloadBrowser: Loaded payloads:', allPayloads.length)
      console.log('PayloadBrowser: Sample payload:', allPayloads[0])
      console.log('PayloadBrowser: Loaded categories:', allCategories.length)
      
      setPayloads(allPayloads)
      setCategories(allCategories)
      setStats(payloadManager.getPayloadStats())
      
      console.log('PayloadBrowser: Stats:', payloadManager.getPayloadStats())
    } catch (error) {
      console.error('PayloadBrowser: Error loading payload data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...payloads]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = payloadManager.searchPayloads(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(payload => payload.category === selectedCategory)
    }

    // Apply severity filter
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(payload => payload.severity === selectedSeverity)
    }

    // Apply source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(payload => payload.source === selectedSource)
    }

    setFilteredPayloads(filtered)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200'
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />
      case 'MEDIUM': return <Clock className="h-4 w-4" />
      case 'LOW': return <CheckCircle className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handlePayloadSelect = (payload: AttackPayload) => {
    if (onPayloadSelect) {
      onPayloadSelect(payload)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading payloads...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Payloads</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-xl font-bold text-gray-900">{stats.bySeverity.CRITICAL}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">High</p>
                <p className="text-xl font-bold text-gray-900">{stats.bySeverity.HIGH}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Success</p>
                <p className="text-xl font-bold text-gray-900">{(stats.averageSuccessRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search payloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="OWASP LLM01">OWASP LLM01</option>
                <option value="OWASP LLM02">OWASP LLM02</option>
                <option value="Advanced Research">Advanced Research</option>
                <option value="Latest Research 2025">Latest Research 2025</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredPayloads.length} of {payloads.length} payloads
        </p>
        <button
          onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
            setSelectedSeverity('all')
            setSelectedSource('all')
          }}
          className="text-sm text-purple-600 hover:text-purple-800"
        >
          Clear filters
        </button>
      </div>

      {/* Payloads List */}
      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ maxHeight }}>
        <div className="overflow-y-auto">
          {filteredPayloads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No payloads found matching your criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPayloads.map((payload) => (
                <div key={payload.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{payload.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(payload.severity)}`}>
                          {getSeverityIcon(payload.severity)}
                          <span className="ml-1">{payload.severity}</span>
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {payload.source}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{payload.description}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Payload:</span>
                          <button
                            onClick={() => copyToClipboard(payload.payload)}
                            className="text-xs text-purple-600 hover:text-purple-800"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <code className="text-xs text-gray-800 break-all">{payload.payload}</code>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {payload.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handlePayloadSelect(payload)}
                        className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => copyToClipboard(payload.payload)}
                        className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 