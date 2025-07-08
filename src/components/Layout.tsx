/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
  Shield, Settings, BarChart3, Bug, FileText, ShieldCheck,
  ChevronRight, Target, Network, Brain, Award, Layers, Zap, Wand2
} from 'lucide-react'
import SearchBar from './SearchBar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Adaptive Payloads', href: '/adaptive-payloads', icon: Zap },
    { name: 'Assessment', href: '/assessment', icon: Wand2 },
    { name: 'Red Teaming', href: '/red-teaming', icon: Target },
    { name: 'Benchmark Integration', href: '/benchmark-integration', icon: Award },
    { name: 'Results', href: '/results', icon: FileText },
    { name: 'Defenses', href: '/defenses', icon: ShieldCheck },
    { name: 'Compliance & Risk', href: '/compliance-testing', icon: Shield },
    { name: 'Tools & Resources', href: '/tools-resources', icon: Brain },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#ECF0F6]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* App Logo - Clickable */}
                <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <Shield className="h-8 w-8 text-[#4556E4]" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-[#1F2C6D]">Prompt Injector</span>
                    <span className="text-xs text-gray-500">AI Security Testing</span>
                  </div>
                </Link>
              </div>
              
              {/* Current Page Indicator */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span className="text-[#1F2C6D] font-medium">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <SearchBar />
              
              {/* App Version */}
              <div className="hidden sm:flex items-center text-xs text-gray-500">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#ECF0F6] text-[#1F2C6D] border-l-4 border-[#4556E4]'
                        : 'text-[#1F2C6D] hover:bg-[#ECF0F6] hover:text-[#4556E4]'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto text-[#4556E4]" />}
                  </Link>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">© 2025 Preamble, Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Prompt Injector v1.0.0</span>
              <span>•</span>
              <span>Local Mode</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 