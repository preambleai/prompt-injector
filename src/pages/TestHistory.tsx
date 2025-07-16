import React, { useState, useEffect, useMemo } from 'react'
import { Copy, Trash2, Download, ChevronDown, ChevronUp, BarChart3, CheckCircle, XCircle, Calendar, Filter, Clock, TrendingUp, Shield, Target, Eye, FileText, X } from 'lucide-react'

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

function exportResults(results: any[], filename = 'llm-test-history.json') {
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const PAGE_SIZE = 100 // Increased for better performance with large datasets

interface FilterOptions {
  status: string
  model: string
  category: string
  dateRange: string
}

// Helper to calculate comprehensive statistics from test history
const calculateStats = (history: any[]) => {
  const total = history.length
  const passed = history.filter(r => r.vulnerability && r.detectionMethod !== 'error' && !r.error).length
  const failed = history.filter(r => !r.vulnerability && r.detectionMethod !== 'error' && !r.error).length
  const errors = history.filter(r => r.detectionMethod === 'error' || r.error).length
  const successRate = total > 0 ? (passed / total) * 100 : 0
  
  // Calculate ASR (count all tests except errors)
  let asrTested = 0
  let asrSuccess = 0
  history.forEach(result => {
    if (result.detectionMethod !== 'error' && !result.error) {
      asrTested++
      if (result.vulnerability) asrSuccess++
    }
  })
  const asr = asrTested > 0 ? (asrSuccess / asrTested) * 100 : 0
  
  // Get unique models and categories
  const uniqueModels = new Set(history.map(r => r.model?.name).filter(Boolean)).size
  const uniqueCategories = new Set(history.map(r => r.payload?.category).filter(Boolean)).size
  
  return {
    total,
    passed,
    failed,
    errors,
    successRate,
    asr,
    uniqueModels,
    uniqueCategories
  }
}

const TestHistory = () => {
  const [history, setHistory] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    model: 'all',
    category: 'all',
    dateRange: 'all'
  })
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    errors: 0,
    successRate: 0,
    asr: 0,
    uniqueModels: 0,
    uniqueCategories: 0
  })

  // Memoized filter options for better performance
  const filterOptions = useMemo(() => {
    const models = Array.from(new Set(history.map(r => r.model?.name).filter(Boolean))).sort()
    const categories = Array.from(new Set(history.map(r => r.payload?.category).filter(Boolean))).sort()
    
    return { models, categories }
  }, [history])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('llmTestHistory') || '[]')
    const reversedData = data.reverse() // Most recent first
    setHistory(reversedData)
    setStats(calculateStats(reversedData))
  }, [])

  const handleDelete = (id: string) => {
    const newHistory = history.filter(r => r.id !== id)
    setHistory(newHistory)
    setStats(calculateStats(newHistory))
    localStorage.setItem('llmTestHistory', JSON.stringify([...newHistory].reverse()))
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  const handleDeleteAll = () => {
    setHistory([])
    setStats(calculateStats([]))
    localStorage.removeItem('llmTestHistory')
    setSelected(new Set())
  }

  const handleBatchDelete = () => {
    const newHistory = history.filter(r => !selected.has(r.id))
    setHistory(newHistory)
    setStats(calculateStats(newHistory))
    localStorage.setItem('llmTestHistory', JSON.stringify([...newHistory].reverse()))
    setSelected(new Set())
  }

  const handleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  const handleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(r => r.id)))
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1) // Reset to first page when filtering
  }

  const clearAllFilters = () => {
    setFilters({
      status: 'all',
      model: 'all',
      category: 'all',
      dateRange: 'all'
    })
    setPage(1)
  }

  // Enhanced filtering with better performance
  const filtered = useMemo(() => {
    return history.filter(r => {
      // Status filter
      if (filters.status !== 'all') {
        const hasError = r.detectionMethod === 'error' || r.error
        const status = hasError ? 'error' : (r.vulnerability ? 'pass' : 'fail')
        if (status !== filters.status) return false
      }

      // Model filter
      if (filters.model !== 'all' && r.model?.name !== filters.model) return false

      // Category filter
      if (filters.category !== 'all' && r.payload?.category !== filters.category) return false

      // Date range filter
      if (filters.dateRange !== 'all') {
        const testDate = new Date(r.timestamp)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 0) return false
            break
          case 'week':
            if (daysDiff > 7) return false
            break
          case 'month':
            if (daysDiff > 30) return false
            break
          case 'year':
            if (daysDiff > 365) return false
            break
        }
      }

      return true
    })
  }, [history, filters])

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(f => f !== 'all')

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="heading-1 mb-2">Test History</h1>
            <p className="body-text text-lg text-[#1F2C6D]/70">
              Review, analyze, and export your past LLM security tests to improve your attack strategies.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              className="btn-secondary flex items-center gap-2 px-4 py-2 font-medium" 
              onClick={() => exportResults(Array.from(selected.size ? filtered.filter(r => selected.has(r.id)) : filtered))}
            >
              <Download className="h-4 w-4" />
              Export {selected.size > 0 ? `(${selected.size})` : 'All'}
            </button>
            <button 
              className="btn-secondary flex items-center gap-2 px-4 py-2 font-medium text-red-600 hover:bg-red-50" 
              onClick={handleBatchDelete} 
              disabled={selected.size === 0}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
        
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-700">Total Tests</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
                <p className="text-xs text-blue-600">{stats.uniqueModels} models • {stats.uniqueCategories} categories</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-700">Attack Success Rate</p>
                <p className="text-2xl font-bold text-green-800">{stats.asr.toFixed(1)}%</p>
                <p className="text-xs text-green-600">{stats.passed} successful • {stats.failed} failed • {stats.errors} errors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1F2C6D]/70">Status</label>
                         <select
               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4] min-w-[120px]"
               value={filters.status}
               onChange={(e) => handleFilterChange('status', e.target.value)}
             >
               <option value="all">All Status</option>
               <option value="pass">Success</option>
               <option value="fail">Fail</option>
               <option value="error">Error</option>
             </select>
          </div>

          {/* Model Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1F2C6D]/70">Model</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4] min-w-[140px]"
              value={filters.model}
              onChange={(e) => handleFilterChange('model', e.target.value)}
            >
              <option value="all">All Models</option>
              {filterOptions.models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1F2C6D]/70">Category</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4] min-w-[140px]"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1F2C6D]/70">Date Range</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4] min-w-[120px]"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Filter Status and Clear Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#1F2C6D]/70">
              {filtered.length} of {history.length} results
              {hasActiveFilters && (
                <span className="text-[#4556E4] ml-1">(filtered)</span>
              )}
            </span>
            {hasActiveFilters && (
              <button
                className="flex items-center gap-1 text-sm text-[#4556E4] hover:text-[#4556E4]/80"
                onClick={clearAllFilters}
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#1F2C6D]/60" />
            <span className="text-sm text-[#1F2C6D]/60">
              {Object.values(filters).filter(f => f !== 'all').length} active filters
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="card p-4 mb-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selected.size} test{selected.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary text-xs px-3 py-1 flex items-center gap-1"
                onClick={() => exportResults(Array.from(filtered.filter(r => selected.has(r.id))))}
              >
                <Download className="h-3 w-3" />
                Export Selected
              </button>
              <button
                className="btn-secondary text-xs px-3 py-1 flex items-center gap-1 text-red-600 hover:bg-red-50"
                onClick={handleBatchDelete}
              >
                <Trash2 className="h-3 w-3" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {/* Select All Header */}
        {paged.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selected.size === filtered.length && filtered.length > 0} 
                onChange={handleSelectAll}
                className="h-4 w-4 text-[#4556E4] border-gray-300 rounded focus:ring-[#4556E4]"
              />
              <span className="text-sm text-[#1F2C6D]/70">
                Select all {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </label>
            <span className="text-xs text-[#1F2C6D]/60">
              Page {page} of {totalPages}
            </span>
          </div>
        )}
        
        {/* Results Cards */}
        {paged.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="heading-3 mb-2">No test results found</h3>
            <p className="body-text text-[#1F2C6D]/70">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Run some security tests to see results here'}
            </p>
            {hasActiveFilters && (
              <button
                className="btn-secondary mt-4 px-4 py-2"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          paged.map(result => {
            const isExpanded = expanded === result.id
            const getStatusConfig = () => {
              if (result.detectionMethod === 'error' || result.error) {
                return { 
                  bg: 'bg-yellow-50 border-yellow-200', 
                  badge: 'bg-yellow-100 text-yellow-800', 
                  dot: 'bg-yellow-500',
                  text: 'ERROR'
                }
              }
              if (result.vulnerability) {
                return { 
                  bg: 'bg-green-50 border-green-200', 
                  badge: 'bg-green-100 text-green-800', 
                  dot: 'bg-green-500',
                  text: 'SUCCESS'
                }
              }
              return { 
                bg: 'bg-red-50 border-red-200', 
                badge: 'bg-red-100 text-red-800', 
                dot: 'bg-red-500',
                text: 'FAIL'
              }
            }
            
            const status = getStatusConfig()
            
            return (
              <div key={result.id} className={`card transition-all duration-200 ${status.bg}`}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selected.has(result.id)}
                      onChange={() => handleSelect(result.id)}
                      className="mt-1 h-4 w-4 text-[#4556E4] border-gray-300 rounded focus:ring-[#4556E4]"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${status.dot}`}></div>
                          <div>
                            <h3 className="font-semibold text-[#081423] text-sm">
                              {result.payload?.name || 'Unknown Payload'}
                            </h3>
                            <p className="text-xs text-[#1F2C6D]/60 mt-1">
                              {result.model?.name || 'Unknown Model'} • {result.payload?.category || 'Unknown Category'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${status.badge}`}>
                            {status.text}
                          </span>
                          <div className="flex gap-1">
                            <button
                              className="text-[#4556E4] hover:text-[#4556E4]/80 p-1 rounded transition-colors"
                              onClick={() => setExpanded(isExpanded ? null : result.id)}
                              title={isExpanded ? 'Hide details' : 'Show details'}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                              onClick={() => handleDelete(result.id)}
                              title="Delete test"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[#1F2C6D]/60">Detection Method:</span>
                          <p className="text-[#081423] font-medium">{result.detectionMethod}</p>
                        </div>
                        <div>
                          <span className="text-[#1F2C6D]/60">Timestamp:</span>
                          <p className="text-[#081423] font-medium">{new Date(result.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#081423]">Payload</span>
                          <button
                            className="btn-secondary text-xs px-2 py-1 flex items-center gap-1"
                            onClick={() => copyToClipboard(result.payload?.payload || '')}
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                        <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto max-h-40">
                          {result.payload?.payload}
                        </pre>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#081423]">Model Response</span>
                          <button
                            className="btn-secondary text-xs px-2 py-1 flex items-center gap-1"
                            onClick={() => copyToClipboard(result.response || '')}
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                        <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto max-h-48">
                          {result.response}
                        </pre>
                      </div>
                      
                      <div>
                        <span className="font-medium text-[#081423]">Expected Output</span>
                        <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto max-h-20 mt-2">
                          {result.payload?.expectedOutput || '(N/A)'}
                        </pre>
                      </div>
                      
                      {result.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <span className="font-medium text-red-800">Error Details</span>
                          <p className="text-sm text-red-700 mt-1">{result.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="text-sm text-[#1F2C6D]/70">
            Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} results
          </div>
          <div className="flex items-center gap-2">
            <button 
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'btn-secondary hover:bg-gray-100'
              }`}
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              <ChevronUp className="h-4 w-4 rotate-90" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-[#4556E4] text-white'
                        : 'btn-secondary hover:bg-gray-100'
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button 
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                page === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'btn-secondary hover:bg-gray-100'
              }`}
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)}
            >
              <ChevronUp className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestHistory 