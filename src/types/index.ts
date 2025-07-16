export interface AttackPayload {
  id: string
  name: string
  nameUrl?: string
  description: string
  category?: string // Made optional to match all payloads
  payload: string
  tags: string[]
  source: string
  severity?: string // Made optional to match all payloads
  // OWASP LLM01 labels
  owasp?: string[]
  // MITRE ATLAS labels
  mitreAtlas?: string[]
  // AI system/component specific labels
  aiSystem?: string[]
  // Technical details
  technique?: string
  successRate?: number
  bypassMethods?: string[]
  isEditable?: boolean
  version?: string
  lastModified?: string
  createdBy?: string
  expectedOutput?: string
  /**
   * List of keywords or phrases that indicate a successful attack if present in the model output
   */
  successIndicators?: string[]
  /**
   * List of keywords or phrases that indicate the model refused or blocked the attack
   */
  failureIndicators?: string[]
}

export interface AIModel {
  id: string
  name: string
  provider: string
  endpoint: string
  apiKey?: string
  model: string
  enabled: boolean
  defaultForPayloads?: boolean // If true, this model is used for payload creation/mutation
}

export interface TestResult {
  id: string
  timestamp: string
  model: AIModel
  payload: AttackPayload
  response: string
  vulnerability: boolean
  confidence: number
  detectionMethod: string
  duration: number
  success: boolean
  error?: string
  executionTime: number
  metadata?: {
    modelProvider: string
    payloadCategory: string
    payloadSeverity: string
    error?: string
    detectionMethod?: string
    reasoning?: string
    responseTime?: number
    detectionReasoning?: string
    detectionResponseTime?: number
    uncertaintyLevel?: 'low' | 'medium' | 'high'
    similarityScore?: number
    matchedExploit?: string
    judgeVotes?: Array<{
      modelId: string
      modelName: string
      isVulnerable: boolean
      confidence: number
      reasoning: string
      responseTime: number
    }>
  }
}

export interface TestConfiguration {
  selectedPayloads: string[]
  selectedModels: string[]
  maxConcurrent: number
  timeout: number
}

export interface TestSession {
  id: string
  name: string
  configuration: TestConfiguration
  results: TestResult[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

export interface ComplianceFramework {
  id: string
  name: string
  description: string
  version: string
  category: 'PRIVACY' | 'SECURITY' | 'ACCESSIBILITY' | 'ENVIRONMENTAL' | 'FINANCIAL' | 'HEALTHCARE'
  region: string
  requirements: ComplianceRequirement[]
  lastUpdated: string
}

export interface ComplianceRequirement {
  id: string
  code: string
  title: string
  description: string
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  testable: boolean
  automated: boolean
  manualSteps?: string[]
  validationCriteria: string[]
}

export interface ComplianceTest {
  id: string
  frameworkId: string
  requirementId: string
  name: string
  description: string
  testType: 'AUTOMATED' | 'MANUAL' | 'HYBRID'
  testMethod: string
  expectedResult: string
  validationRules: string[]
  dataRequirements?: string[]
  dependencies?: string[]
}

export interface ComplianceTestResult {
  id: string
  testId: string
  frameworkId: string
  requirementId: string
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE' | 'NOT_TESTED'
  score: number
  evidence: string[]
  findings: ComplianceFinding[]
  timestamp: string
  duration: number
  tester?: string
  notes?: string
}

export interface ComplianceFinding {
  id: string
  type: 'VIOLATION' | 'RECOMMENDATION' | 'OBSERVATION'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  impact: string
  remediation: string
  references?: string[]
}

export interface ComplianceReport {
  id: string
  name: string
  frameworkId: string
  version: string
  generatedAt: string
  generatedBy: string
  scope: string
  summary: ComplianceSummary
  results: ComplianceTestResult[]
  recommendations: string[]
  attachments?: string[]
}

export interface ComplianceSummary {
  totalTests: number
  passed: number
  failed: number
  warnings: number
  notApplicable: number
  notTested: number
  overallScore: number
  complianceLevel: 'FULLY_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT'
  criticalIssues: number
  highIssues: number
  mediumIssues: number
  lowIssues: number
}

export interface DataPrivacyTest {
  id: string
  testType: 'DATA_ENCRYPTION' | 'ACCESS_CONTROLS' | 'DATA_RETENTION' | 'USER_CONSENT' | 'DATA_PORTABILITY' | 'BREACH_NOTIFICATION'
  dataType: string
  testScenario: string
  expectedBehavior: string
  actualBehavior?: string
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
}

export interface SecurityComplianceTest {
  id: string
  testType: 'AUTHENTICATION' | 'AUTHORIZATION' | 'ENCRYPTION' | 'AUDIT_LOGGING' | 'VULNERABILITY_SCANNING' | 'INCIDENT_RESPONSE'
  securityControl: string
  testMethod: string
  expectedOutcome: string
  actualOutcome?: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface AccessibilityTest {
  id: string
  testType: 'SCREEN_READER' | 'KEYBOARD_NAVIGATION' | 'COLOR_CONTRAST' | 'ALT_TEXT' | 'FOCUS_INDICATORS' | 'RESPONSIVE_DESIGN'
  wcagLevel: 'A' | 'AA' | 'AAA'
  testElement: string
  successCriteria: string
  testResult: 'PASS' | 'FAIL' | 'PARTIAL'
  notes?: string
}

export interface MCPTestResult {
  id: string
  timestamp: string
  testType: string
  model: AIModel
  payload: AttackPayload
  response: string
  vulnerability: boolean
  confidence: number
  detectionMethod: string
  duration: number
  executionTime: number
  error?: string
}

export interface AgentTestResult {
  id: string
  timestamp: string
  testType: string
  model: AIModel
  payload: AttackPayload
  response: string
  vulnerability: boolean
  confidence: number
  detectionMethod: string
  duration: number
  executionTime: number
  error?: string
}

export interface RedTeamResult {
  id: string
  timestamp: string
  model: AIModel
  payload: AttackPayload
  response: string
  vulnerability: boolean
  confidence: number
  detectionMethod: string
  duration: number
  executionTime: number
  error?: string
  payloadId: string
}

// General-purpose technical architecture options for all business contexts
export const TECHNICAL_ARCHITECTURE_OPTIONS = [
  { key: 'mcp_server', label: 'MCP Server' },
  { key: 'llm', label: 'LLM / AI Model' },
  { key: 'single_agent', label: 'Single Agent' },
  { key: 'multi_agent', label: 'Multi-Agent System' },
]

export interface AIRequest {
  provider: string;
  model: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
  finishReason: string;
  reasoningContent?: string;
  thinkingBlocks?: string[];
}

export interface AIError {
  message: string;
  code?: string;
  status?: number;
  rateLimitInfo?: {
    resetTime: number;
    remaining: number;
  };
} 