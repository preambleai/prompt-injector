/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
  Shield, Settings, BarChart3, Bug, FileText, ShieldCheck,
  ChevronRight, Target, Network, Brain, Award, Layers, Zap, Wand2, Clock, ChevronsLeft, ChevronsRight, Users
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Adaptive Payloads', href: '/adaptive-payloads', icon: Zap },
    { name: 'Assessment', href: '/assessment', icon: Wand2 },
    { name: 'Test History', href: '/test-history', icon: Clock },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

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
        <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out`}>
          {/* Sidebar Toggle Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <span className="text-sm font-medium text-[#1F2C6D]">Navigation</span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-[#ECF0F6] transition-all duration-200 hover:shadow-sm"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronsRight className="h-5 w-5 text-[#1F2C6D] hover:text-[#4556E4] transition-colors" />
              ) : (
                <ChevronsLeft className="h-5 w-5 text-[#1F2C6D] hover:text-[#4556E4] transition-colors" />
              )}
            </button>
          </div>

          <nav className="mt-4">
            <div className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-3 text-sm font-medium rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-[#ECF0F6] text-[#1F2C6D] border-l-4 border-[#4556E4]'
                        : 'text-[#1F2C6D] hover:bg-[#ECF0F6] hover:text-[#4556E4]'
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {isActive && <ChevronRight className="h-4 w-4 text-[#4556E4]" />}
                      </>
                    )}
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