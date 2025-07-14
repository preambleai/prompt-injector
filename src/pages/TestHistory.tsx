import React, { useState, useEffect } from 'react'
import { Copy, Trash2, Search, Download, ChevronDown, ChevronUp } from 'lucide-react'

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

const PAGE_SIZE = 50

const TestHistory = () => {
  const [history, setHistory] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('llmTestHistory') || '[]')
    setHistory(data.reverse()) // Most recent first
  }, [])

  const handleDelete = (id: string) => {
    const newHistory = history.filter(r => r.id !== id)
    setHistory(newHistory)
    localStorage.setItem('llmTestHistory', JSON.stringify([...newHistory].reverse()))
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  const handleDeleteAll = () => {
    setHistory([])
    localStorage.removeItem('llmTestHistory')
    setSelected(new Set())
  }

  const handleBatchDelete = () => {
    const newHistory = history.filter(r => !selected.has(r.id))
    setHistory(newHistory)
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

  const filtered = history.filter(r => {
    const payload = r.payload?.payload || ''
    const model = r.model?.name || ''
    const result = r.success ? 'pass' : 'fail'
    const category = r.payload?.category || ''
    return (
      payload.toLowerCase().includes(search.toLowerCase()) ||
      model.toLowerCase().includes(search.toLowerCase()) ||
      result.includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase())
    )
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Test History</h1>
          <p className="text-gray-600">Review, filter, and export your past LLM security tests. Use this page to analyze which payloads worked, copy them, and improve your attack strategies.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="btn-secondary flex items-center gap-1 px-3 py-2 text-xs rounded" onClick={() => exportResults(Array.from(selected.size ? filtered.filter(r => selected.has(r.id)) : filtered))}><Download className="h-4 w-4" />Export</button>
          <button className="btn-secondary flex items-center gap-1 px-3 py-2 text-xs rounded" onClick={handleBatchDelete} disabled={selected.size === 0}><Trash2 className="h-4 w-4" />Delete Selected</button>
          <button className="btn-secondary flex items-center gap-1 px-3 py-2 text-xs rounded" onClick={handleDeleteAll}><Trash2 className="h-4 w-4" />Delete All</button>
        </div>
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Search by payload, model, result, or category..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <span className="ml-auto text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="px-3 py-2 text-left"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={handleSelectAll} /></th>
              <th className="px-3 py-2 text-left">Model</th>
              <th className="px-3 py-2 text-left">Payload</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Result</th>
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-500 py-8">No test results found.</td></tr>
            )}
            {paged.map(result => (
              <React.Fragment key={result.id}>
                <tr className={expanded === result.id ? 'bg-blue-50' : ''}>
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.has(result.id)} onChange={() => handleSelect(result.id)} /></td>
                  <td className="px-3 py-2 max-w-xs truncate" title={result.model?.name}>{result.model?.name || 'Unknown'}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={result.payload?.name}>{result.payload?.name || 'Payload'}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={result.payload?.category}>{result.payload?.category || '-'}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 text-xs rounded font-semibold ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{result.success ? 'PASS' : 'FAIL'}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{new Date(result.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 flex gap-2 items-center">
                    <button className="text-xs text-blue-600 underline flex items-center gap-1" onClick={() => setExpanded(expanded === result.id ? null : result.id)}>{expanded === result.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} Details</button>
                    <button className="text-xs text-red-600 underline flex items-center gap-1" onClick={() => handleDelete(result.id)}><Trash2 className="h-4 w-4" />Delete</button>
                  </td>
                </tr>
                {expanded === result.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 border-t px-6 py-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="mb-2 flex items-start"><span className="font-semibold mr-2">Payload:</span> <pre className="inline whitespace-pre-wrap break-all flex-1 max-w-full overflow-x-auto bg-gray-100 p-2 rounded" style={{maxHeight:'300px'}}>{result.payload?.payload}</pre> <button className="ml-2 text-xs text-blue-600 underline flex items-center gap-1" onClick={() => copyToClipboard(result.payload?.payload || '')}><Copy className="h-4 w-4" />Copy</button></div>
                          <div className="mb-2 flex items-start"><span className="font-semibold mr-2">LLM Output:</span> <pre className="inline whitespace-pre-wrap break-all flex-1 max-w-full overflow-x-auto bg-gray-100 p-2 rounded" style={{maxHeight:'300px'}}>{result.response}</pre> <button className="ml-2 text-xs text-blue-600 underline flex items-center gap-1" onClick={() => copyToClipboard(result.response || '')}><Copy className="h-4 w-4" />Copy</button></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2"><span className="font-semibold">Expected Output:</span> <pre className="inline whitespace-pre-wrap break-all bg-gray-100 p-2 rounded">{result.payload?.expectedOutput || '(N/A)'}</pre></div>
                          <div className="mb-2"><span className="font-semibold">Detection Method:</span> {result.detectionMethod}</div>
                          {result.error && <div className="text-red-600"><span className="font-semibold">Error:</span> {result.error}</div>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button className="btn-secondary px-3 py-1 rounded" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button className="btn-secondary px-3 py-1 rounded" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}

export default TestHistory 