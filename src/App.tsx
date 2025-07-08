/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import RedTeaming from './pages/RedTeaming'
import BenchmarkIntegration from './pages/BenchmarkIntegration'
import Results from './pages/Results'
import Defenses from './pages/Defenses'
import ComplianceTesting from './pages/ComplianceTesting'
import ToolsResources from './pages/ToolsResources'
import AdaptivePayloads from './pages/AdaptivePayloads'
import Settings from './pages/Settings'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/red-teaming" element={<RedTeaming />} />
          <Route path="/benchmark-integration" element={<BenchmarkIntegration />} />
          <Route path="/results" element={<Results />} />
          <Route path="/defenses" element={<Defenses />} />
          <Route path="/compliance-testing" element={<ComplianceTesting />} />
          <Route path="/tools-resources" element={<ToolsResources />} />
          <Route path="/adaptive-payloads" element={<AdaptivePayloads />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App 