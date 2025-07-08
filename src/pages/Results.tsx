/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Eye, 
  Filter,
  Download,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Brain,
  Search,
  Filter as FilterIcon
} from 'lucide-react'
import { TestResult, AttackPayload, AIModel } from '../types'

interface ResultsStats {
  totalTests: number
  vulnerabilities: number
  passed: number
  successRate: number
  averageConfidence: number
  detectionMethods: Record<string, number>
  severityBreakdown: Record<string, number>
  recentActivity: Array<{
    action: string
    timestamp: string
    vulnerability?: boolean
  }>
}

const Results: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([])
  const [stats, setStats] = useState<ResultsStats>({
    totalTests: 0,
    vulnerabilities: 0,
    passed: 0,
    successRate: 0,
    averageConfidence: 0,
    detectionMethods: {},
    severityBreakdown: {},
    recentActivity: []
  })
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [filters, setFilters] = useState({
    vulnerability: 'all',
    severity: 'all',
    detectionMethod: 'all',
    model: 'all',
    dateRange: 'all'
  })
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'analytics'>('table')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadResults()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [results, filters, searchTerm])

  const loadResults = () => {
    // Load results from localStorage or API
    const storedResults = localStorage.getItem('testResults')
    if (storedResults) {
      const parsedResults: TestResult[] = JSON.parse(storedResults)
      setResults(parsedResults)
      calculateStats(parsedResults)
    }
  }

  const calculateStats = (testResults: TestResult[]) => {
    const totalTests = testResults.length
    const vulnerabilities = testResults.filter(r => r.vulnerability).length
    const passed = totalTests - vulnerabilities
    const successRate = totalTests > 0 ? (passed / totalTests) * 100 : 0
    const averageConfidence = totalTests > 0 
      ? testResults.reduce((sum, r) => sum + r.confidence, 0) / totalTests 
      : 0

    // Detection methods breakdown
    const detectionMethods: Record<string, number> = {}
    testResults.forEach(result => {
      const method = result.detectionMethod || 'unknown'
      detectionMethods[method] = (detectionMethods[method] || 0) + 1
    })

    // Severity breakdown
    const severityBreakdown: Record<string, number> = {}
    testResults.forEach(result => {
      const severity = result.payload.severity
      severityBreakdown[severity] = (severityBreakdown[severity] || 0) + 1
    })

    // Recent activity
    const recentActivity = testResults
      .slice(-10)
      .map(result => ({
        action: `${result.payload.name} on ${result.model.name}`,
        timestamp: result.timestamp,
        vulnerability: result.vulnerability
      }))
      .reverse()

    setStats({
      totalTests,
      vulnerabilities,
      passed,
      successRate,
      averageConfidence,
      detectionMethods,
      severityBreakdown,
      recentActivity
    })
  }

  const applyFilters = () => {
    let filtered = results

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.payload.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.payload.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply vulnerability filter
    if (filters.vulnerability !== 'all') {
      filtered = filtered.filter(result => 
        filters.vulnerability === 'vulnerable' ? result.vulnerability : !result.vulnerability
      )
    }

    // Apply severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(result => result.payload.severity === filters.severity)
    }

    // Apply detection method filter
    if (filters.detectionMethod !== 'all') {
      filtered = filtered.filter(result => result.detectionMethod === filters.detectionMethod)
    }

    // Apply model filter
    if (filters.model !== 'all') {
      filtered = filtered.filter(result => result.model.id === filters.model)
    }

    setFilteredResults(filtered)
  }

  const exportResults = (format: 'csv' | 'json' | 'pdf') => {
    const data = filteredResults.map(result => ({
      id: result.id,
      timestamp: result.timestamp,
      model: result.model.name,
      payload: result.payload.name,
      vulnerability: result.vulnerability,
      confidence: result.confidence,
      detectionMethod: result.detectionMethod,
      severity: result.payload.severity,
      duration: result.duration,
      response: result.response.substring(0, 200) + '...'
    }))

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      const csv = [
        ['ID', 'Timestamp', 'Model', 'Payload', 'Vulnerability', 'Confidence', 'Detection Method', 'Severity', 'Duration'],
        ...data.map(row => [
          row.id,
          row.timestamp,
          row.model,
          row.payload,
          row.vulnerability ? 'Yes' : 'No',
          row.confidence.toFixed(3),
          row.detectionMethod,
          row.severity,
          row.duration
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `test-results-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDetectionMethodColor = (method: string) => {
    switch (method) {
      case 'heuristic_pre_filter': return 'bg-blue-100 text-blue-800'
      case 'rag_similarity_search': return 'bg-purple-100 text-purple-800'
      case 'judge_model_ensemble': return 'bg-indigo-100 text-indigo-800'
      case 'ensemble': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Test Results & Analytics</h1>
        <p className="body-text text-lg">Comprehensive analysis of your AI security testing results</p>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vulnerabilities</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">0%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Test Duration</p>
              <p className="text-2xl font-bold text-gray-900">0s</p>
            </div>
            <Clock className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.vulnerability}
                onChange={(e) => setFilters({ ...filters, vulnerability: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-transparent"
              >
                <option value="all">All Results</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="secure">Secure</option>
              </select>

              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={filters.detectionMethod}
                onChange={(e) => setFilters({ ...filters, detectionMethod: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-transparent"
              >
                <option value="all">All Methods</option>
                <option value="heuristic_pre_filter">Heuristic</option>
                <option value="rag_similarity_search">RAG Similarity</option>
                <option value="judge_model_ensemble">Judge Ensemble</option>
                <option value="ensemble">Ensemble</option>
              </select>
            </div>
          </div>

          {/* View Mode and Export */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'analytics' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
                }`}
              >
                Analytics
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => exportResults('csv')}
                className="btn-secondary px-3 py-2 text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </button>
              <button
                onClick={() => exportResults('json')}
                className="btn-secondary px-3 py-2 text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {viewMode === 'table' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="heading-3">Test Results ({filteredResults.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{result.payload.name}</div>
                        <div className="text-sm text-gray-500">{result.payload.description}</div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(result.payload.severity)}`}>
                            {result.payload.severity}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.model.name}</div>
                      <div className="text-sm text-gray-500">{result.model.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.vulnerability 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {result.vulnerability ? 'Vulnerable' : 'Secure'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDetectionMethodColor(result.detectionMethod)}`}>
                        {result.detectionMethod.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.duration}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="text-[#4556E4] hover:text-[#1F2C6D] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result) => (
            <div key={result.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{result.payload.name}</h3>
                  <p className="text-sm text-gray-600">{result.payload.description}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(result.payload.severity)}`}>
                  {result.payload.severity}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Model:</span>
                  <span className="text-sm font-medium">{result.model.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    result.vulnerability 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {result.vulnerability ? 'Vulnerable' : 'Secure'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Confidence:</span>
                  <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Detection:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDetectionMethodColor(result.detectionMethod)}`}>
                    {result.detectionMethod.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium">{result.duration}ms</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedResult(result)}
                  className="w-full btn-secondary text-sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detection Methods Breakdown */}
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Detection Methods</h3>
            <div className="space-y-3">
              {Object.entries(stats.detectionMethods).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{method.replace(/_/g, ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#4556E4] h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalTests) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="card p-6">
            <h3 className="heading-3 mb-4">Severity Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stats.severityBreakdown).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${severity === 'CRITICAL' ? 'bg-red-500' : severity === 'HIGH' ? 'bg-orange-500' : severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${(count / stats.totalTests) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="heading-2">Test Result Details</h2>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Test Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Payload:</span> {selectedResult.payload.name}</div>
                    <div><span className="font-medium">Description:</span> {selectedResult.payload.description}</div>
                    <div><span className="font-medium">Category:</span> {selectedResult.payload.category}</div>
                    <div><span className="font-medium">Severity:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedResult.payload.severity)}`}>
                        {selectedResult.payload.severity}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Model Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Model:</span> {selectedResult.model.name}</div>
                    <div><span className="font-medium">Provider:</span> {selectedResult.model.provider}</div>
                    <div><span className="font-medium">Endpoint:</span> {selectedResult.model.endpoint}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Detection Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card-hover p-4">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className={`text-lg font-semibold ${selectedResult.vulnerability ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedResult.vulnerability ? 'Vulnerable' : 'Secure'}
                    </div>
                  </div>
                  <div className="card-hover p-4">
                    <div className="text-sm text-gray-500">Confidence</div>
                    <div className={`text-lg font-semibold ${getConfidenceColor(selectedResult.confidence)}`}>
                      {(selectedResult.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="card-hover p-4">
                    <div className="text-sm text-gray-500">Detection Method</div>
                    <div className="text-lg font-semibold">{selectedResult.detectionMethod.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </div>

              {selectedResult.metadata?.detectionReasoning && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Detection Reasoning</h3>
                  <div className="card-hover p-4">
                    <p className="text-sm text-gray-700">{selectedResult.metadata.detectionReasoning}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Model Response</h3>
                <div className="card-hover p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedResult.response}</pre>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedResult(null)}
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

export default Results 