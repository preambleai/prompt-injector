/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'privacy' | 'compliance' | 'performance' | 'quality';
  priority: 'low' | 'medium' | 'high' | 'critical';
  automated: boolean;
  estimatedTime: number; // in minutes
  prerequisites: string[];
  testSteps: string[];
  expectedResults: string[];
  riskMitigation: string[];
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'privacy' | 'compliance' | 'performance' | 'quality';
  testCases: TestCase[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTotalTime: number;
  automatedPercentage: number;
}

export interface RiskAssessment {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: {
    dataSensitivity: number;
    systemComplexity: number;
    deploymentEnvironment: number;
    complianceRequirements: number;
    attackSurface: number;
  };
  recommendations: string[];
  complianceGaps: string[];
  securityPriorities: string[];
}

export interface TestingStrategy {
  solutionType: string;
  components: string[];
  useCase: string;
  dataSensitivity: string;
  deploymentEnvironment: string;
  riskAssessment: RiskAssessment;
  testSuites: TestSuite[];
  timeline: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
  };
  resources: {
    automated: number;
    manual: number;
    expert: number;
  };
}

// Test case definitions for different AI components
const llmTestCases: TestCase[] = [
  {
    id: 'llm-prompt-injection',
    name: 'Prompt Injection Testing',
    description: 'Test LLM resistance to various prompt injection techniques',
    category: 'security',
    priority: 'high',
    automated: true,
    estimatedTime: 30,
    prerequisites: ['LLM API access', 'Test environment setup'],
    testSteps: [
      'Deploy adversarial prompt templates',
      'Test role confusion attacks',
      'Validate output filtering',
      'Check for system prompt leakage'
    ],
    expectedResults: [
      'LLM maintains intended behavior',
      'No unauthorized access to system prompts',
      'Output remains within expected bounds'
    ],
    riskMitigation: [
      'Implement input validation',
      'Use output filtering',
      'Monitor for suspicious patterns'
    ]
  },
  {
    id: 'llm-bias-detection',
    name: 'Bias Detection Testing',
    description: 'Test LLM for bias in responses across different demographics',
    category: 'quality',
    priority: 'high',
    automated: true,
    estimatedTime: 45,
    prerequisites: ['Bias testing dataset', 'Demographic analysis tools'],
    testSteps: [
      'Run bias evaluation datasets',
      'Test demographic fairness',
      'Analyze response patterns',
      'Validate fairness metrics'
    ],
    expectedResults: [
      'Consistent responses across demographics',
      'No discriminatory patterns detected',
      'Fairness metrics within acceptable ranges'
    ],
    riskMitigation: [
      'Implement bias detection monitoring',
      'Use diverse training data',
      'Regular bias audits'
    ]
  },
  {
    id: 'llm-hallucination-testing',
    name: 'Hallucination Detection',
    description: 'Test LLM for factual accuracy and hallucination detection',
    category: 'quality',
    priority: 'medium',
    automated: true,
    estimatedTime: 60,
    prerequisites: ['Fact-checking dataset', 'Ground truth data'],
    testSteps: [
      'Test factual accuracy',
      'Validate source attribution',
      'Check for hallucination patterns',
      'Assess confidence scoring'
    ],
    expectedResults: [
      'High factual accuracy rates',
      'Proper source attribution',
      'Low hallucination rates'
    ],
    riskMitigation: [
      'Implement fact-checking',
      'Use RAG for factual queries',
      'Monitor confidence scores'
    ]
  }
]

const agentTestCases: TestCase[] = [
  {
    id: 'agent-tool-abuse',
    name: 'Tool Usage Security Testing',
    description: 'Test agent resistance to tool abuse and unauthorized actions',
    category: 'security',
    priority: 'critical',
    automated: true,
    estimatedTime: 45,
    prerequisites: ['Agent environment', 'Tool access logs'],
    testSteps: [
      'Test unauthorized tool access',
      'Validate tool permission checks',
      'Monitor tool usage patterns',
      'Test privilege escalation'
    ],
    expectedResults: [
      'Tools only accessible with proper permissions',
      'No unauthorized tool execution',
      'Proper access control enforcement'
    ],
    riskMitigation: [
      'Implement tool access controls',
      'Monitor tool usage',
      'Regular permission audits'
    ]
  },
  {
    id: 'agent-workflow-integrity',
    name: 'Workflow Integrity Testing',
    description: 'Test agent workflow resistance to manipulation and hijacking',
    category: 'security',
    priority: 'high',
    automated: false,
    estimatedTime: 90,
    prerequisites: ['Workflow documentation', 'Process monitoring tools'],
    testSteps: [
      'Test workflow manipulation',
      'Validate task execution order',
      'Check for workflow bypass',
      'Monitor decision integrity'
    ],
    expectedResults: [
      'Workflows execute as designed',
      'No unauthorized workflow changes',
      'Decision integrity maintained'
    ],
    riskMitigation: [
      'Implement workflow validation',
      'Monitor process integrity',
      'Regular workflow audits'
    ]
  }
]

const ragTestCases: TestCase[] = [
  {
    id: 'rag-source-attribution',
    name: 'Source Attribution Testing',
    description: 'Test RAG system for proper source attribution and citation',
    category: 'quality',
    priority: 'high',
    automated: true,
    estimatedTime: 30,
    prerequisites: ['Knowledge base', 'Citation validation tools'],
    testSteps: [
      'Test source retrieval accuracy',
      'Validate citation generation',
      'Check attribution completeness',
      'Monitor source relevance'
    ],
    expectedResults: [
      'Accurate source retrieval',
      'Complete citations provided',
      'Relevant sources used'
    ],
    riskMitigation: [
      'Implement citation validation',
      'Monitor source quality',
      'Regular knowledge base audits'
    ]
  },
  {
    id: 'rag-data-leakage',
    name: 'Data Leakage Prevention',
    description: 'Test RAG system for data leakage and unauthorized information disclosure',
    category: 'security',
    priority: 'critical',
    automated: true,
    estimatedTime: 60,
    prerequisites: ['Sensitive data markers', 'Leakage detection tools'],
    testSteps: [
      'Test sensitive data retrieval',
      'Validate access controls',
      'Monitor information disclosure',
      'Check data filtering'
    ],
    expectedResults: [
      'No unauthorized data disclosure',
      'Proper access controls enforced',
      'Sensitive data protected'
    ],
    riskMitigation: [
      'Implement data classification',
      'Use access controls',
      'Monitor data access patterns'
    ]
  }
]

const mcpTestCases: TestCase[] = [
  {
    id: 'mcp-protocol-security',
    name: 'MCP Protocol Security Testing',
    description: 'Test MCP server protocol implementation for vulnerabilities',
    category: 'security',
    priority: 'high',
    automated: true,
    estimatedTime: 45,
    prerequisites: ['MCP server access', 'Protocol testing tools'],
    testSteps: [
      'Test protocol message validation',
      'Validate authentication mechanisms',
      'Check for protocol bypass',
      'Monitor message integrity'
    ],
    expectedResults: [
      'Protocol messages properly validated',
      'Authentication working correctly',
      'No protocol bypass possible'
    ],
    riskMitigation: [
      'Implement message validation',
      'Use secure authentication',
      'Monitor protocol usage'
    ]
  },
  {
    id: 'mcp-tool-chain-security',
    name: 'Tool Chain Security Testing',
    description: 'Test MCP server tool chain for security vulnerabilities',
    category: 'security',
    priority: 'critical',
    automated: false,
    estimatedTime: 120,
    prerequisites: ['Tool chain documentation', 'Security scanning tools'],
    testSteps: [
      'Audit tool chain components',
      'Test tool execution security',
      'Validate input sanitization',
      'Check for privilege escalation'
    ],
    expectedResults: [
      'Secure tool chain implementation',
      'No privilege escalation possible',
      'Proper input validation'
    ],
    riskMitigation: [
      'Implement tool chain security',
      'Use least privilege principle',
      'Regular security audits'
    ]
  }
]

// Risk assessment logic
export const calculateRiskAssessment = (
  solutionType: string,
  components: string[],
  useCase: string,
  dataSensitivity: string,
  deploymentEnvironment: string
): RiskAssessment => {
  let dataSensitivityScore = 0;
  let systemComplexityScore = 0;
  let deploymentRiskScore = 0;
  let complianceScore = 0;
  let attackSurfaceScore = 0;

  // Data sensitivity scoring
  switch (dataSensitivity) {
    case 'public':
      dataSensitivityScore = 1;
      break;
    case 'internal':
      dataSensitivityScore = 3;
      break;
    case 'pii':
      dataSensitivityScore = 5;
      break;
    case 'phi':
      dataSensitivityScore = 7;
      break;
    case 'financial':
      dataSensitivityScore = 8;
      break;
  }

  // System complexity scoring
  systemComplexityScore = components.length * 2;
  if (solutionType === 'multi-agent-system' || solutionType === 'hybrid-system') {
    systemComplexityScore += 3;
  }

  // Deployment environment scoring
  switch (deploymentEnvironment) {
    case 'public-cloud':
      deploymentRiskScore = 4;
      break;
    case 'private-cloud':
      deploymentRiskScore = 2;
      break;
    case 'edge-devices':
      deploymentRiskScore = 6;
      break;
    case 'hybrid':
      deploymentRiskScore = 5;
      break;
  }

  // Compliance requirements scoring
  const complianceMap: { [key: string]: number } = {
    'customer-service': 4,
    'content-creation': 2,
    'data-analysis': 5,
    'process-automation': 3,
    'financial-services': 8,
    'healthcare': 9
  };
  complianceScore = complianceMap[useCase] || 3;

  // Attack surface scoring
  attackSurfaceScore = components.length * 1.5;
  if (components.includes('external-apis')) attackSurfaceScore += 2;
  if (components.includes('data-sources')) attackSurfaceScore += 2;

  const totalScore = (dataSensitivityScore + systemComplexityScore + deploymentRiskScore + complianceScore + attackSurfaceScore) / 5;

  let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (totalScore <= 2) overallRiskLevel = 'low';
  else if (totalScore <= 4) overallRiskLevel = 'medium';
  else if (totalScore <= 6) overallRiskLevel = 'high';
  else overallRiskLevel = 'critical';

  return {
    overallRiskLevel,
    riskFactors: {
      dataSensitivity: dataSensitivityScore,
      systemComplexity: systemComplexityScore,
      deploymentEnvironment: deploymentRiskScore,
      complianceRequirements: complianceScore,
      attackSurface: attackSurfaceScore
    },
    recommendations: generateRecommendations(overallRiskLevel, components),
    complianceGaps: generateComplianceGaps(useCase, dataSensitivity),
    securityPriorities: generateSecurityPriorities(overallRiskLevel, components)
  };
};

const generateRecommendations = (riskLevel: string, components: string[]): string[] => {
  const recommendations: string[] = [];
  
  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push('Implement comprehensive security monitoring');
    recommendations.push('Conduct regular security audits');
    recommendations.push('Establish incident response procedures');
  }
  
  if (components.includes('llm')) {
    recommendations.push('Implement prompt injection detection');
    recommendations.push('Add output validation and filtering');
  }
  
  if (components.includes('agent-framework')) {
    recommendations.push('Implement tool usage monitoring');
    recommendations.push('Add workflow integrity checks');
  }
  
  if (components.includes('vector-database')) {
    recommendations.push('Implement data access controls');
    recommendations.push('Add embedding validation');
  }
  
  return recommendations;
};

const generateComplianceGaps = (useCase: string, dataSensitivity: string): string[] => {
  const gaps: string[] = [];
  
  if (dataSensitivity === 'pii' || dataSensitivity === 'phi') {
    gaps.push('Data minimization requirements');
    gaps.push('Right to deletion implementation');
    gaps.push('Consent management system');
  }
  
  if (useCase === 'financial-services') {
    gaps.push('SOX compliance controls');
    gaps.push('Financial data protection');
    gaps.push('Audit trail requirements');
  }
  
  if (useCase === 'healthcare') {
    gaps.push('HIPAA compliance measures');
    gaps.push('PHI protection controls');
    gaps.push('Healthcare data governance');
  }
  
  return gaps;
};

const generateSecurityPriorities = (riskLevel: string, components: string[]): string[] => {
  const priorities: string[] = [];
  
  priorities.push('Implement access controls');
  priorities.push('Add monitoring and logging');
  
  if (components.includes('llm')) {
    priorities.push('Prompt injection protection');
    priorities.push('Output validation');
  }
  
  if (components.includes('agent-framework')) {
    priorities.push('Tool usage security');
    priorities.push('Workflow integrity');
  }
  
  if (riskLevel === 'critical') {
    priorities.push('Zero-trust architecture');
    priorities.push('Advanced threat detection');
  }
  
  return priorities;
};

// Test suite generation
export const generateTestSuites = (
  solutionType: string,
  components: string[],
  useCase: string,
  dataSensitivity: string,
  riskAssessment: RiskAssessment
): TestSuite[] => {
  const testSuites: TestSuite[] = [];
  
  // Core security testing
  const securityTestCases: TestCase[] = [];
  
  if (components.includes('llm')) {
    securityTestCases.push(...llmTestCases);
  }
  
  if (components.includes('agent-framework')) {
    securityTestCases.push(...agentTestCases);
  }
  
  if (components.includes('vector-database')) {
    securityTestCases.push(...ragTestCases);
  }
  
  if (components.includes('mcp-servers')) {
    securityTestCases.push(...mcpTestCases);
  }
  
  if (securityTestCases.length > 0) {
    testSuites.push({
      id: 'security-core',
      name: 'Core Security Testing',
      description: 'Comprehensive security testing for AI system components',
      category: 'security',
      testCases: securityTestCases,
      priority: riskAssessment.overallRiskLevel,
      estimatedTotalTime: securityTestCases.reduce((sum, tc) => sum + tc.estimatedTime, 0),
      automatedPercentage: securityTestCases.filter(tc => tc.automated).length / securityTestCases.length * 100
    });
  }
  
  // Privacy and compliance testing
  if (dataSensitivity !== 'public') {
    const privacyTestCases: TestCase[] = [
      {
        id: 'privacy-data-minimization',
        name: 'Data Minimization Testing',
        description: 'Test compliance with data minimization principles',
        category: 'privacy',
        priority: 'high',
        automated: false,
        estimatedTime: 60,
        prerequisites: ['Data inventory', 'Privacy policy'],
        testSteps: [
          'Audit data collection practices',
          'Validate data retention policies',
          'Check data usage compliance',
          'Review data sharing practices'
        ],
        expectedResults: [
          'Only necessary data collected',
          'Proper data retention periods',
          'Compliant data usage'
        ],
        riskMitigation: [
          'Implement data minimization',
          'Regular privacy audits',
          'Update privacy policies'
        ]
      }
    ];
    
    testSuites.push({
      id: 'privacy-compliance',
      name: 'Privacy & Compliance Testing',
      description: 'Privacy and regulatory compliance testing',
      category: 'privacy',
      testCases: privacyTestCases,
      priority: dataSensitivity === 'phi' || dataSensitivity === 'financial' ? 'critical' : 'high',
      estimatedTotalTime: privacyTestCases.reduce((sum, tc) => sum + tc.estimatedTime, 0),
      automatedPercentage: 0
    });
  }
  
  return testSuites;
};

// Generate complete testing strategy
export const generateTestingStrategy = (
  solutionType: string,
  components: string[],
  useCase: string,
  dataSensitivity: string,
  deploymentEnvironment: string
): TestingStrategy => {
  const riskAssessment = calculateRiskAssessment(solutionType, components, useCase, dataSensitivity, deploymentEnvironment);
  const testSuites = generateTestSuites(solutionType, components, useCase, dataSensitivity, riskAssessment);
  
  return {
    solutionType,
    components,
    useCase,
    dataSensitivity,
    deploymentEnvironment,
    riskAssessment,
    testSuites,
    timeline: generateTimeline(testSuites, riskAssessment.overallRiskLevel),
    resources: calculateResources(testSuites)
  };
};

const generateTimeline = (testSuites: TestSuite[], riskLevel: string) => {
  const phase1: string[] = ['Setup testing environment', 'Configure monitoring tools'];
  const phase2: string[] = ['Execute automated tests', 'Conduct manual testing'];
  const phase3: string[] = ['Review results', 'Generate reports', 'Implement fixes'];
  
  if (riskLevel === 'critical') {
    phase1.push('Security team review');
    phase2.push('Penetration testing');
    phase3.push('Compliance validation');
  }
  
  return { phase1, phase2, phase3 };
};

const calculateResources = (testSuites: TestSuite[]) => {
  const totalTime = testSuites.reduce((sum, suite) => sum + suite.estimatedTotalTime, 0);
  const automatedTime = testSuites.reduce((sum, suite) => 
    sum + (suite.estimatedTotalTime * suite.automatedPercentage / 100), 0);
  
  return {
    automated: Math.ceil(automatedTime / 60), // hours
    manual: Math.ceil((totalTime - automatedTime) / 60), // hours
    expert: Math.ceil(totalTime / 120) // hours for expert review
  };
};

export default {
  calculateRiskAssessment,
  generateTestSuites,
  generateTestingStrategy
}; 