/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, Settings, Bug, Shield, Target, Brain, Award, Building, BarChart3, AlertTriangle, BookOpen, Layers } from 'lucide-react'
import { searchService, SearchResult } from '../services/search'

interface SearchBarProps {
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Initialize search service and load recent searches
  useEffect(() => {
    const initSearch = async () => {
      await searchService.buildIndex()
      setRecentSearches(searchService.getRecentSearches())
    }
    initSearch()
  }, [])

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function with debouncing
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true)
        try {
          const searchResults = await searchService.search(query)
          setResults(searchResults)
          setShowResults(true)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(searchTimeout)
  }, [query])

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    searchService.saveSearch(query)
    setQuery('')
    setShowResults(false)
    navigate(result.url)
  }

  // Handle recent search click
  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery)
  }

  // Get icon for result type
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return <BarChart3 className="h-4 w-4" />
      case 'test':
        return <Bug className="h-4 w-4" />
      case 'result':
        return <FileText className="h-4 w-4" />
      case 'model':
        return <Brain className="h-4 w-4" />
      case 'payload':
        return <Target className="h-4 w-4" />
      case 'setting':
        return <Settings className="h-4 w-4" />
      case 'defense':
        return <Shield className="h-4 w-4" />
      case 'vulnerability':
        return <AlertTriangle className="h-4 w-4" />
      case 'research':
        return <BookOpen className="h-4 w-4" />
      case 'framework':
        return <Layers className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Get color for result type
  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return 'text-blue-600'
      case 'test':
        return 'text-red-600'
      case 'result':
        return 'text-green-600'
      case 'model':
        return 'text-purple-600'
      case 'payload':
        return 'text-orange-600'
      case 'setting':
        return 'text-gray-600'
      case 'defense':
        return 'text-emerald-600'
      case 'vulnerability':
        return 'text-red-600'
      case 'research':
        return 'text-indigo-600'
      case 'framework':
        return 'text-cyan-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2 || recentSearches.length > 0) {
              setShowResults(true)
            }
          }}
          placeholder="Search tests, results, settings..."
          className="w-48 md:w-64 lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4556E4] focus:border-[#4556E4] text-sm"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4556E4]"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-2">Recent Searches</div>
              {recentSearches.map((recentQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(recentQuery)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-2"
                >
                  <Search className="h-3 w-3 text-gray-400" />
                  <span>{recentQuery}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="p-2">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-start space-x-3 group"
                  >
                    <div className={`mt-0.5 ${getResultColor(result.type)}`}>
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-[#4556E4]">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 capitalize">
                        {result.type}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round(result.relevance * 100)}%
                    </div>
                  </button>
                ))
              ) : query.trim().length >= 2 && !isSearching ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No results found for "{query}"
                </div>
              ) : null}
            </div>
          )}


        </div>
      )}
    </div>
  )
}

export default SearchBar 