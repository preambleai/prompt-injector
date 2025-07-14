
/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Play, ChevronLeft, ChevronRight, Info, Search, ChevronDown, Copy } from 'lucide-react'
import { loadModels } from '../services/model-manager'
import { payloadManager } from '../services/payload-manager'
import { AttackPayload } from '../types'
import { executeTest } from '../services/attack-engine'
import { useNavigate } from 'react-router-dom'

interface TestResult {
  id: string
  modelId: string
  payloadId: string
  timestamp: string
  success: boolean
  response: string
  vulnerability: boolean
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

// Utility to save test result to localStorage
function saveTestResultToHistory(result: any) {
  const history = JSON.parse(localStorage.getItem('llmTestHistory') || '[]')
  history.push(result)
  localStorage.setItem('llmTestHistory', JSON.stringify(history))
}

// Utility to export all results as JSON
function exportResults() {
  const history = localStorage.getItem('llmTestHistory') || '[]'
  const blob = new Blob([history], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'llm-test-history.json'
  a.click()
  URL.revokeObjectURL(url)
}

// Utility to copy text to clipboard
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

// --- Define 5 LLM attack categories and their mapping (static, outside component) ---
const LLM_ATTACK_CATEGORIES = [
  {
    id: 'prompt-injection',
    name: 'Prompt Injection',
    description: 'Override or manipulate system instructions to change model behavior.',
    color: 'bg-blue-100 border-blue-400',
    icon: '📝',
    match: (p: AttackPayload) => /injection/i.test(p.category) && !/leak|jailbreak/i.test(p.category),
  },
  {
    id: 'jailbreak',
    name: 'Jailbreak Attacks',
    description: 'Bypass safety guardrails and alignment to elicit unsafe or policy-violating outputs.',
    color: 'bg-red-100 border-red-400',
    icon: '🔓',
    match: (p: AttackPayload) => /jailbreak|role|pretend|social/i.test(p.category),
  },
  {
    id: 'data-leakage',
    name: 'Data Leakage',
    description: 'Extract system prompts, training data, or sensitive information from the model.',
    color: 'bg-yellow-100 border-yellow-400',
    icon: '🔍',
    match: (p: AttackPayload) => /leak|extract|disclos|history/i.test(p.category),
  },
  {
    id: 'hallucination',
    name: 'Hallucinations',
    description: 'Induce the model to generate plausible but false or misleading content.',
    color: 'bg-purple-100 border-purple-400',
    icon: '🧠',
    match: (p: AttackPayload) => /hallucinat|fabricat|misinfo|confiden/i.test(p.category),
  },
  {
    id: 'resource-abuse',
    name: 'Resource Abuse',
    description: 'Waste computational resources or cause denial of service via prompt abuse.',
    color: 'bg-green-100 border-green-400',
    icon: '⚡',
    match: (p: AttackPayload) => /resource|token|rate|cost|bomb/i.test(p.category),
  },
]

const Assessment = () => {
  // --- Map payloads to categories (must be after availablePayloads is defined) ---
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedPayloads, setSelectedPayloads] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [availablePayloads, setAvailablePayloads] = useState<AttackPayload[]>([])
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [payloadSearch, setPayloadSearch] = useState('')
  const [expandedPayload, setExpandedPayload] = useState<string | null>(null)
  // --- Add new state for category filter and dropdown ---
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const uniqueCategories = Array.from(new Set(availablePayloads.map(p => p.category))).sort()
  const [expandedResult, setExpandedResult] = useState<string | null>(null)
  const navigate = useNavigate()
  // --- State for improved payload selection UI ---
  const [activeCatId, setActiveCatId] = useState<string>('');
  const [catSearch, setCatSearch] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Move categorizedPayloads here and use useMemo
  const categorizedPayloads = useMemo(() =>
    LLM_ATTACK_CATEGORIES.map(cat => ({
      ...cat,
      payloads: availablePayloads.filter((p: AttackPayload) => cat.match(p)),
    })),
    [availablePayloads]
  )

  // Set activeCatId to first category id after categorizedPayloads is available
  useEffect(() => {
    if (categorizedPayloads.length > 0 && !activeCatId) {
      setActiveCatId(categorizedPayloads[0].id);
    }
  }, [categorizedPayloads, activeCatId]);

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [models, payloads] = await Promise.all([
        loadModels(),
        payloadManager.loadAllPayloads()
      ])
      // Only show models that are enabled by the user, including Ollama
      setAvailableModels(models.filter(m => m.enabled && m.model && m.provider))
      setAvailablePayloads(payloads)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // On final step, go to Test History or reset
      navigate('/test-history')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const handlePayloadToggle = (payloadId: string) => {
    setSelectedPayloads(prev => 
      prev.includes(payloadId) 
        ? prev.filter(id => id !== payloadId)
        : [...prev, payloadId]
    )
  }

  // --- Handler for category chip click ---
  const handleCategoryChipClick = (cat: string) => setCategoryFilter(cat)

  // --- Handler for select all filtered payloads ---
  const handleSelectAllFiltered = () => {
    const ids = filteredPayloads.map(p => p.id)
    setSelectedPayloads(ids)
  }

  // --- Handler for clear selection ---
  const handleClearSelection = () => setSelectedPayloads([])

  // --- Handler for select by category (from dropdown) ---
  const handleSelectCategory = (cat: string) => {
    const ids = filteredPayloads.filter(p => p.category === cat).map(p => p.id)
    setSelectedPayloads(prev => Array.from(new Set([...prev, ...ids])))
  }

  // --- Handler for deselect by category (from dropdown) ---
  const handleDeselectCategory = (cat: string) => {
    const ids = filteredPayloads.filter(p => p.category === cat).map(p => p.id)
    setSelectedPayloads(prev => prev.filter(id => !ids.includes(id)))
  }

  const runTests = async () => {
    setIsRunning(true)
    setProgress(0)
    setTestResults([])

    const totalTests = selectedModel ? selectedPayloads.length : 0
    let completedTests = 0

    if (!selectedModel) {
      alert('Please select an AI model to run tests.')
      setIsRunning(false)
      return
    }

    const model = availableModels.find(m => m.id === selectedModel)
    if (!model) {
      alert('Selected model not found.')
      setIsRunning(false)
      return
    }

    for (const payloadId of selectedPayloads) {
      const payload = availablePayloads.find(p => p.id === payloadId)
      if (!payload) continue

      try {
        // Use real test execution
        const result = await executeTest(model, payload)
        setTestResults(prev => [...prev, result])
        saveTestResultToHistory(result)
        completedTests++
        setProgress((completedTests / totalTests) * 100)
      } catch (error) {
        const errorResult = {
          id: `${model.id}-${payloadId}-${Date.now()}`,
          model,
          payload,
          response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          vulnerability: false,
          confidence: 0,
          detectionMethod: 'error',
          duration: 0,
          timestamp: new Date().toISOString(),
          success: false,
          executionTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            modelProvider: model.provider,
            payloadCategory: payload.category,
            payloadSeverity: payload.severity
          }
        }
        setTestResults(prev => [...prev, errorResult])
        saveTestResultToHistory(errorResult)
        completedTests++
        setProgress((completedTests / totalTests) * 100)
      }
    }

    setIsRunning(false)
  }

  // --- Filter payloads by search and category chip ---
  const filteredPayloads = availablePayloads.filter(payload =>
    (categoryFilter === 'all' || payload.category === categoryFilter) &&
    (
      payload.name.toLowerCase().includes(payloadSearch.toLowerCase()) ||
      payload.category.toLowerCase().includes(payloadSearch.toLowerCase()) ||
      (payload.description && payload.description.toLowerCase().includes(payloadSearch.toLowerCase()))
    )
  )

  // --- Selection summary ---
  const selectionSummary = categoryFilter === 'all'
    ? `${selectedPayloads.length} of ${filteredPayloads.length} payloads selected`
    : `${filteredPayloads.filter(p => selectedPayloads.includes(p.id)).length} of ${filteredPayloads.length} in '${categoryFilter}' selected`

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-semibold mr-2">Select AI Model</h2>
        <span className="relative group inline-block ml-1 align-middle">
          <Info className="h-4 w-4 text-blue-400" />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">Choose one LLM to test. Only models you have configured and enabled will appear, including Ollama.</span>
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableModels.map((model) => (
          <label
            key={model.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
              selectedModel === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              checked={selectedModel === model.id}
              onChange={() => handleModelSelect(model.id)}
              className="h-4 w-4 text-blue-600 mr-3"
              name="llm-model"
            />
            <div>
              <div className="font-medium">{model.name}</div>
              <div className="text-xs text-gray-500">{model.provider}</div>
            </div>
          </label>
        ))}
      </div>
      {availableModels.length === 0 && (
        <div className="text-gray-500 text-sm mt-2">No models available. Please add and enable models in <a href='/settings' className='text-blue-600 underline'>Settings</a>.</div>
      )}
    </div>
  )

  // --- Modernized renderStep2 ---
  const renderStep2 = () => {
    // Get the active category object
    const activeCat = categorizedPayloads.find(cat => cat.id === activeCatId)
    // Get payloads for the active category
    const catPayloads = activeCat ? activeCat.payloads : []
    // Filtered payloads by search
    const filteredCatPayloads = catPayloads.filter(p =>
      p.name.toLowerCase().includes(catSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(catSearch.toLowerCase())) ||
      (p.tags && p.tags.join(' ').toLowerCase().includes(catSearch.toLowerCase()))
    )
    // Selected payloads in this category
    const selectedInCat = filteredCatPayloads.filter(p => selectedPayloads.includes(p.id))
    // Bulk actions
    const handleSelectAllInCat = () => {
      setSelectedPayloads(prev => Array.from(new Set([...prev, ...filteredCatPayloads.map(p => p.id)])))
    }
    const handleDeselectAllInCat = () => {
      setSelectedPayloads(prev => prev.filter(id => !filteredCatPayloads.some(p => p.id === id)))
    }
    const handleClearAll = () => setSelectedPayloads([])
    // Card row selection
    const handleRowToggle = (id: string) => {
      setSelectedPayloads(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id])
    }
    // Expand/collapse details
    // --- UI ---
    return (
      <div className="flex gap-6 min-h-[500px]">
        {/* Sidebar: Categories */}
        <aside className="w-64 bg-white border-r border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-2 sticky top-24 h-fit self-start">
          <h3 className="text-lg font-semibold mb-2">Attack Categories</h3>
          {categorizedPayloads.map(cat => {
            const total = cat.payloads.length
            const selected = cat.payloads.filter((p: AttackPayload) => selectedPayloads.includes(p.id)).length
            return (
              <button
                key={cat.id}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors ${activeCatId === cat.id ? 'bg-blue-100 border border-blue-400 font-bold' : 'hover:bg-gray-100'}`}
                onClick={() => { setActiveCatId(cat.id); setCatSearch(''); setExpandedRow(null) }}
                type="button"
              >
                <span className="flex items-center gap-2"><span className="text-xl">{cat.icon}</span> {cat.name}</span>
                <span className="text-xs text-gray-600">{selected}/{total}</span>
              </button>
            )
          })}
          <button className="mt-4 btn-secondary text-xs px-3 py-2 rounded" onClick={handleClearAll}>Clear All</button>
        </aside>
        {/* Main: Payload Card List */}
        <section className="flex-1 flex flex-col">
          {/* Sticky controls */}
          <div className="sticky top-0 z-10 bg-white pb-2 pt-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="w-full max-w-xs border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Search payloads..."
                value={catSearch}
                onChange={e => { setCatSearch(e.target.value); setExpandedRow(null) }}
              />
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <div className="ml-auto flex gap-2">
                <button className="btn-secondary text-xs px-3 py-1 rounded" onClick={handleSelectAllInCat}>Select All</button>
                <button className="btn-secondary text-xs px-3 py-1 rounded" onClick={handleDeselectAllInCat}>Deselect All</button>
              </div>
            </div>
          </div>
          {/* Compact grouped list view */}
          <div className="flex flex-col gap-0 overflow-y-auto py-2">
            {activeCatId === 'all'
              ? categorizedPayloads.map(cat => (
                  <div key={cat.id} className="mb-6">
                    <div className="sticky top-0 z-10 bg-white py-2 px-1 border-b border-gray-200">
                      <span className="font-bold text-lg flex items-center gap-2">{cat.icon} {cat.name} <span className="text-xs text-gray-500 font-normal ml-2">{cat.payloads.length} payload{cat.payloads.length !== 1 ? 's' : ''}</span></span>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {cat.payloads.length === 0 && (
                        <li className="text-gray-400 text-sm py-6 text-center">No payloads in this category.</li>
                      )}
                      {cat.payloads.filter(p =>
                        p.name.toLowerCase().includes(catSearch.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(catSearch.toLowerCase())) ||
                        (p.tags && p.tags.join(' ').toLowerCase().includes(catSearch.toLowerCase()))
                      ).map(payload => (
                        <li
                          key={payload.id}
                          className={`group flex items-start gap-4 px-4 py-3 transition bg-white cursor-pointer ${selectedPayloads.includes(payload.id) ? 'bg-blue-50 border-l-4 border-blue-400' : 'hover:bg-gray-50'} ${expandedRow === payload.id ? 'z-10' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPayloads.includes(payload.id)}
                            onChange={e => { e.stopPropagation(); handleRowToggle(payload.id); }}
                            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                            tabIndex={0}
                          />
                          <div className="flex-1 min-w-0" onClick={() => setExpandedRow(expandedRow === payload.id ? null : payload.id)}>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-base text-gray-900 break-words line-clamp-1" title={payload.name}>{payload.name}</span>
                              {payload.tags && payload.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {payload.tags.map(tag => (
                                    <span key={tag} className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs whitespace-nowrap">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-gray-700 text-sm mt-1 mb-1 break-words line-clamp-2" title={payload.description}>{payload.description}</div>
                            {expandedRow === payload.id && (
                              <div className="mt-2 bg-gray-50 border-t pt-2 px-1 rounded">
                                <div className="mb-2"><span className="font-semibold">Payload:</span> <pre className="inline whitespace-pre-wrap break-all bg-gray-100 p-2 rounded max-w-full overflow-x-auto text-sm" style={{maxHeight:'200px'}}>{payload.payload}</pre></div>
                                <div className="mb-2"><span className="font-semibold">Description:</span> {payload.description}</div>
                                <div className="mb-2"><span className="font-semibold">Tags:</span> {payload.tags?.join(', ')}</div>
                                <div className="mb-2"><span className="font-semibold">Category:</span> {payload.category}</div>
                                <div className="mb-2"><span className="font-semibold">Source:</span> {payload.source}</div>
                              </div>
                            )}
                          </div>
                          <button
                            className="ml-2 mt-1 text-gray-400 group-hover:text-blue-600 focus:outline-none"
                            onClick={e => { e.stopPropagation(); setExpandedRow(expandedRow === payload.id ? null : payload.id); }}
                            aria-label={expandedRow === payload.id ? 'Hide Details' : 'Show Details'}
                            tabIndex={0}
                          >
                            <span className="sr-only">{expandedRow === payload.id ? 'Hide Details' : 'Show Details'}</span>
                            <svg className={`w-5 h-5 transition-transform ${expandedRow === payload.id ? 'rotate-90 text-blue-600' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : (
                <div>
                  <div className="sticky top-0 z-10 bg-white py-2 px-1 border-b border-gray-200">
                    <span className="font-bold text-lg flex items-center gap-2">{activeCat?.icon} {activeCat?.name} <span className="text-xs text-gray-500 font-normal ml-2">{activeCat?.payloads.length} payload{activeCat?.payloads.length !== 1 ? 's' : ''}</span></span>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {activeCat?.payloads.length === 0 && (
                      <li className="text-gray-400 text-sm py-6 text-center">No payloads in this category.</li>
                    )}
                    {activeCat?.payloads.filter(p =>
                      p.name.toLowerCase().includes(catSearch.toLowerCase()) ||
                      (p.description && p.description.toLowerCase().includes(catSearch.toLowerCase())) ||
                      (p.tags && p.tags.join(' ').toLowerCase().includes(catSearch.toLowerCase()))
                    ).map(payload => (
                      <li
                        key={payload.id}
                        className={`group flex items-start gap-4 px-4 py-3 transition bg-white cursor-pointer ${selectedPayloads.includes(payload.id) ? 'bg-blue-50 border-l-4 border-blue-400' : 'hover:bg-gray-50'} ${expandedRow === payload.id ? 'z-10' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPayloads.includes(payload.id)}
                          onChange={e => { e.stopPropagation(); handleRowToggle(payload.id); }}
                          className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                          tabIndex={0}
                        />
                        <div className="flex-1 min-w-0" onClick={() => setExpandedRow(expandedRow === payload.id ? null : payload.id)}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base text-gray-900 break-words line-clamp-1" title={payload.name}>{payload.name}</span>
                            {payload.tags && payload.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {payload.tags.map(tag => (
                                  <span key={tag} className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs whitespace-nowrap">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-gray-700 text-sm mt-1 mb-1 break-words line-clamp-2" title={payload.description}>{payload.description}</div>
                          {expandedRow === payload.id && (
                            <div className="mt-2 bg-gray-50 border-t pt-2 px-1 rounded">
                              <div className="mb-2"><span className="font-semibold">Payload:</span> <pre className="inline whitespace-pre-wrap break-all bg-gray-100 p-2 rounded max-w-full overflow-x-auto text-sm" style={{maxHeight:'200px'}}>{payload.payload}</pre></div>
                              <div className="mb-2"><span className="font-semibold">Description:</span> {payload.description}</div>
                              <div className="mb-2"><span className="font-semibold">Tags:</span> {payload.tags?.join(', ')}</div>
                              <div className="mb-2"><span className="font-semibold">Category:</span> {payload.category}</div>
                              <div className="mb-2"><span className="font-semibold">Source:</span> {payload.source}</div>
                            </div>
                          )}
                        </div>
                        <button
                          className="ml-2 mt-1 text-gray-400 group-hover:text-blue-600 focus:outline-none"
                          onClick={e => { e.stopPropagation(); setExpandedRow(expandedRow === payload.id ? null : payload.id); }}
                          aria-label={expandedRow === payload.id ? 'Hide Details' : 'Show Details'}
                          tabIndex={0}
                        >
                          <span className="sr-only">{expandedRow === payload.id ? 'Hide Details' : 'Show Details'}</span>
                          <svg className={`w-5 h-5 transition-transform ${expandedRow === payload.id ? 'rotate-90 text-blue-600' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
          {/* Sticky summary bar */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 py-3 px-4 flex items-center justify-between mt-2 z-20">
            <span className="text-base font-medium">Total selected: {selectedPayloads.length}</span>
            <button
              onClick={nextStep}
              className="btn-primary px-6 py-2 flex items-center space-x-2"
              disabled={selectedPayloads.length === 0}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-semibold mr-2">Run Security Tests</h2>
        <span className="relative group inline-block ml-1 align-middle">
          <Info className="h-4 w-4 text-blue-400" />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">Run the selected payloads against your chosen models.</span>
        </span>
      </div>
      {isRunning ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Running tests...</p>
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <span className="font-medium">Test Summary:</span> {selectedModel ? '1 model' : 'No model selected'} × {selectedPayloads.length} payload(s) = {selectedPayloads.length} total tests
          </div>
          <button
            onClick={runTests}
            disabled={!selectedModel || selectedPayloads.length === 0}
            className="w-full btn-primary py-3 px-6 flex items-center justify-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>Start Security Testing</span>
          </button>
        </div>
      )}
      {testResults.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">ASR: {testResults.filter(r => r.success).length} / {testResults.length} = {testResults.length > 0 ? (testResults.filter(r => r.success).length / testResults.length) * 100 : 0}%</span>
              <button
                className="btn-secondary px-3 py-1 text-xs rounded"
                onClick={exportResults}
              >Export Results</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left">Payload</th>
                  <th className="px-3 py-2 text-left">LLM Output</th>
                  <th className="px-3 py-2 text-left">Expected Output</th>
                  <th className="px-3 py-2 text-left">Result</th>
                  <th className="px-3 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result) => {
                  const expected = result.payload?.expectedOutput || '(N/A)'
                  const isPass = !result.vulnerability
                  return (
                    <tr key={result.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2 max-w-xs truncate" title={result.payload?.payload}>{result.payload?.payload}</td>
                      <td className="px-3 py-2 max-w-xs truncate" title={result.response}>{result.response}</td>
                      <td className="px-3 py-2 max-w-xs truncate" title={expected}>{expected}</td>
                      <td className="px-3 py-2">
                        {isPass ? (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 font-semibold">PASS</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 font-semibold">FAIL</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="text-xs text-blue-600 underline"
                          onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                        >{expandedResult === result.id ? 'Hide' : 'Show'} Details</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {/* Expanded details below table */}
            {testResults.map(result => expandedResult === result.id && (
              <div key={result.id + '-details'} className="bg-gray-50 border border-gray-200 rounded p-4 my-2 overflow-x-auto">
                <div className="mb-2 flex items-start"><span className="font-semibold mr-2">Payload:</span> <pre className="inline whitespace-pre-wrap break-all flex-1 max-w-full overflow-x-auto" style={{maxHeight:'300px'}}>{result.payload?.payload}</pre> <button className="ml-2 text-xs text-blue-600 underline flex items-center gap-1" onClick={() => copyToClipboard(result.payload?.payload || '')}><Copy className="h-4 w-4" />Copy</button></div>
                <div className="mb-2 flex items-start"><span className="font-semibold mr-2">LLM Output:</span> <pre className="inline whitespace-pre-wrap break-all flex-1 max-w-full overflow-x-auto" style={{maxHeight:'300px'}}>{result.response}</pre> <button className="ml-2 text-xs text-blue-600 underline flex items-center gap-1" onClick={() => copyToClipboard(result.response || '')}><Copy className="h-4 w-4" />Copy</button></div>
                <div className="mb-2"><span className="font-semibold">Expected Output:</span> <pre className="inline whitespace-pre-wrap break-all">{result.payload?.expectedOutput || '(N/A)'}</pre></div>
                <div className="mb-2"><span className="font-semibold">Result:</span> {result.vulnerability ? 'FAIL' : 'PASS'}</div>
                <div className="mb-2"><span className="font-semibold">Detection Method:</span> {result.detectionMethod}</div>
                {result.error && <div className="mb-2 text-red-600"><span className="font-semibold">Error:</span> {result.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Assessment</h1>
        <p className="text-gray-600">Test your AI models against various attack payloads. Select models and payloads, then run tests to see which payloads can exploit your LLMs.</p>
      </div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Select Model</span>
          <span>Select Payloads</span>
          <span>Run Tests</span>
        </div>
      </div>
      {/* Step Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderCurrentStep()}
      </div>
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn-secondary px-6 py-2 flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/test-history')}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
            disabled={testResults.length === 0}
          >
            <span>View Results</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Assessment 