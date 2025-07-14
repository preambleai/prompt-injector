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
import AdaptivePayloads from './pages/AdaptivePayloads'
import Settings from './pages/Settings'
import TestHistory from './pages/TestHistory'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/adaptive-payloads" element={<AdaptivePayloads />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test-history" element={<TestHistory />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App 