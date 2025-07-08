/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from 'react'
import { generateTestingStrategy, TestingStrategy } from '../services/ai-testing-wizard'
import { aiSecurityScanner, SecurityScanRequest, SecurityScanReport, ComponentScanConfig } from '../services/ai-security-scanner'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx'

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  applicableTo: string[];
  color: string;
}

interface AssessmentReport {
  id: string;
  timestamp: string;
  solutionType: string;
  components: string[];
  useCase: string;
  dataSensitivity: string;
  deploymentEnvironment: string;
  riskAssessment: any;
  testSuites: any[];
  complianceStatus: {
    framework: string;
    status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
    gaps: string[];
    recommendations: string[];
  }[];
  executiveSummary: string;
  technicalDetails: any;
  recommendations: string[];
  nextSteps: string[];
}
import { 
  Play, 
  Target, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Share2,
  Server,
  Network,
  Bot,
  HelpCircle,
  ArrowLeft,
  Building,
  ShoppingCart,
  Heart,
  Code,
  BarChart3,
  Workflow,
  MessageSquare,
  DollarSign,
  Database,
  Shield,
  Lock,
  Eye,
  FileText,
  Zap,
  Settings,
  Users,
  Globe,
  Cloud,
  Smartphone,
  Monitor,
  Cpu,
  Database as DatabaseIcon,
  FileCode,
  Palette,
  Mic,
  Camera,
  Video,
  ChevronRight,
  ChevronLeft,
  Wand2,
  TestTube,
  Search,
  BookOpen,
  GitBranch,
  Layers,
  Activity
} from 'lucide-react'

interface AISolutionType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  components: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  testingFocus: string[];
  color: string;
}

interface AIComponent {
  id: string;
  name: string;
  category: 'llm' | 'agent' | 'rag' | 'tool' | 'infrastructure' | 'data';
  description: string;
  icon: React.ComponentType<any>;
  securityRisks: string[];
  testingApproaches: string[];
  color: string;
  specificComponents?: {
    id: string;
    name: string;
    description: string;
    provider?: string;
    version?: string;
  }[];
}

interface UseCase {
  id: string;
  name: string;
  category: 'customer-facing' | 'internal-business' | 'industry-specific';
  description: string;
  icon: React.ComponentType<any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  compliance: string[];
  dataTypes: string[];
  color: string;
}

interface DataSensitivity {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  regulations: string[];
  testingRequirements: string[];
  color: string;
}

interface DeploymentEnvironment {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  securityConsiderations: string[];
  testingApproaches: string[];
  color: string;
}

interface TestSuite {
  id: string;
  name: string;
  category: 'security' | 'privacy' | 'compliance' | 'performance' | 'quality';
  description: string;
  testCases: string[];
  automated: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  specificTests?: {
    id: string;
    name: string;
    description: string;
    category: string;
    automated: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

const aiSolutionTypes: AISolutionType[] = [
  {
    id: 'standalone-llm',
    name: 'Standalone LLM Application',
    description: 'Direct LLM integration for text generation, analysis, or processing',
    icon: Brain,
    components: ['llm', 'api-gateway', 'prompt-engine'],
    riskLevel: 'high',
    testingFocus: ['prompt-injection', 'output-validation', 'bias-detection', 'hallucination-testing'],
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    id: 'ai-agent',
    name: 'AI Agent System',
    description: 'Single agent with tool usage and autonomous decision-making',
    icon: Bot,
    components: ['llm', 'agent-framework', 'tools', 'memory', 'planning'],
    riskLevel: 'high',
    testingFocus: ['tool-abuse', 'workflow-hijacking', 'memory-injection', 'privilege-escalation'],
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    id: 'rag-system',
    name: 'RAG-Powered Application',
    description: 'Retrieval-Augmented Generation with knowledge base integration',
    icon: Search,
    components: ['llm', 'vector-database', 'embedding-model', 'document-processor'],
    riskLevel: 'high',
    testingFocus: ['source-attribution', 'data-leakage', 'knowledge-poisoning', 'retrieval-manipulation'],
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'multi-agent-system',
    name: 'Multi-Agent System',
    description: 'Complex orchestration of multiple AI agents',
    icon: Network,
    components: ['agent-orchestrator', 'multiple-agents', 'communication-protocol', 'task-distribution'],
    riskLevel: 'critical',
    testingFocus: ['inter-agent-security', 'coordination-attacks', 'system-compromise', 'data-exfiltration'],
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    id: 'hybrid-system',
    name: 'Hybrid AI System',
    description: 'Combination of multiple AI approaches and components',
    icon: Layers,
    components: ['llm', 'agent', 'rag', 'tools', 'custom-components'],
    riskLevel: 'critical',
    testingFocus: ['integration-security', 'component-interaction', 'system-wide-attacks', 'complex-vulnerabilities'],
    color: 'bg-red-100 text-red-600 border-red-200'
  }
]

const aiComponents: AIComponent[] = [
  {
    id: 'llm',
    name: 'Large Language Model',
    category: 'llm',
    description: 'Foundation models, fine-tuned models, or multi-modal models',
    icon: Brain,
    securityRisks: ['prompt-injection', 'jailbreak-attacks', 'output-manipulation', 'model-poisoning'],
    testingApproaches: ['adversarial-prompting', 'output-validation', 'bias-testing', 'hallucination-detection'],
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    specificComponents: [
      { id: 'openai-gpt4', name: 'OpenAI GPT-4', description: 'GPT-4, GPT-4 Turbo, GPT-4o', provider: 'OpenAI' },
      { id: 'openai-gpt3', name: 'OpenAI GPT-3.5', description: 'GPT-3.5 Turbo, GPT-3.5', provider: 'OpenAI' },
      { id: 'anthropic-claude', name: 'Anthropic Claude', description: 'Claude 3.5 Sonnet, Claude 3.5 Opus', provider: 'Anthropic' },
      { id: 'google-gemini', name: 'Google Gemini', description: 'Gemini 1.5 Pro, Gemini 1.5 Flash', provider: 'Google' },
      { id: 'meta-llama', name: 'Meta Llama', description: 'Llama 3.1, Llama 2', provider: 'Meta' },
      { id: 'mistral-ai', name: 'Mistral AI', description: 'Mistral Large, Mistral Medium', provider: 'Mistral AI' },
      { id: 'custom-llm', name: 'Custom/Fine-tuned Model', description: 'Custom model or fine-tuned version', provider: 'Custom' }
    ]
  },
  {
    id: 'agent-framework',
    name: 'Agent Framework',
    category: 'agent',
    description: 'AutoGen, CrewAI, LangGraph, or custom agent frameworks',
    icon: Bot,
    securityRisks: ['workflow-hijacking', 'task-manipulation', 'memory-injection', 'tool-abuse'],
    testingApproaches: ['workflow-testing', 'task-validation', 'memory-testing', 'tool-security'],
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    specificComponents: [
      { id: 'langchain', name: 'LangChain', description: 'LangChain framework and chains', provider: 'LangChain' },
      { id: 'autogen', name: 'AutoGen', description: 'AutoGen multi-agent framework', provider: 'Microsoft' },
      { id: 'crewai', name: 'CrewAI', description: 'CrewAI agent orchestration', provider: 'CrewAI' },
      { id: 'langgraph', name: 'LangGraph', description: 'LangGraph state machines', provider: 'LangChain' },
      { id: 'semantic-kernel', name: 'Semantic Kernel', description: 'Microsoft Semantic Kernel', provider: 'Microsoft' },
      { id: 'llamaindex', name: 'LlamaIndex', description: 'LlamaIndex RAG framework', provider: 'LlamaIndex' },
      { id: 'custom-agent', name: 'Custom Agent Framework', description: 'Custom agent implementation', provider: 'Custom' }
    ]
  },
  {
    id: 'vector-database',
    name: 'Vector Database',
    category: 'rag',
    description: 'Pinecone, Weaviate, Chroma, or other vector stores',
    icon: Database,
    securityRisks: ['data-leakage', 'embedding-poisoning', 'query-injection', 'access-control'],
    testingApproaches: ['data-security', 'embedding-validation', 'query-testing', 'access-control-testing'],
    color: 'bg-green-100 text-green-600 border-green-200',
    specificComponents: [
      { id: 'pinecone', name: 'Pinecone', description: 'Pinecone vector database', provider: 'Pinecone' },
      { id: 'weaviate', name: 'Weaviate', description: 'Weaviate vector database', provider: 'Weaviate' },
      { id: 'chroma', name: 'Chroma', description: 'Chroma vector database', provider: 'Chroma' },
      { id: 'qdrant', name: 'Qdrant', description: 'Qdrant vector database', provider: 'Qdrant' },
      { id: 'milvus', name: 'Milvus', description: 'Milvus vector database', provider: 'Milvus' },
      { id: 'elasticsearch', name: 'Elasticsearch', description: 'Elasticsearch with vector search', provider: 'Elastic' },
      { id: 'custom-vector', name: 'Custom Vector Store', description: 'Custom vector database implementation', provider: 'Custom' }
    ]
  },
  {
    id: 'mcp-servers',
    name: 'MCP Servers',
    category: 'tool',
    description: 'Model Context Protocol servers and tool integrations',
    icon: Server,
    securityRisks: ['protocol-vulnerabilities', 'tool-chain-attacks', 'authentication-bypass', 'data-injection'],
    testingApproaches: ['protocol-testing', 'tool-validation', 'auth-testing', 'data-security'],
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    specificComponents: [
      { id: 'security-tools-mcp', name: 'Security Tools MCP', description: 'Nmap, SQLMap, FFUF integration', provider: 'Security Tools' },
      { id: 'contrast-mcp', name: 'Contrast MCP Server', description: 'Application security testing', provider: 'Contrast Security' },
      { id: 'custom-mcp', name: 'Custom MCP Server', description: 'Custom MCP server implementation', provider: 'Custom' }
    ]
  },
  {
    id: 'external-apis',
    name: 'External APIs',
    category: 'tool',
    description: 'Third-party service integrations and API calls',
    icon: Globe,
    securityRisks: ['api-abuse', 'rate-limit-bypass', 'data-exfiltration', 'service-disruption'],
    testingApproaches: ['api-security', 'rate-limit-testing', 'data-flow-testing', 'service-resilience'],
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    specificComponents: [
      { id: 'web-search', name: 'Web Search APIs', description: 'Google, Bing, DuckDuckGo search', provider: 'Various' },
      { id: 'file-apis', name: 'File Processing APIs', description: 'PDF, Word, Excel processing', provider: 'Various' },
      { id: 'database-apis', name: 'Database APIs', description: 'SQL, NoSQL database connections', provider: 'Various' },
      { id: 'custom-api', name: 'Custom API Integration', description: 'Custom API endpoints', provider: 'Custom' }
    ]
  },
  {
    id: 'data-sources',
    name: 'Data Sources',
    category: 'data',
    description: 'Databases, files, streams, and data pipelines',
    icon: DatabaseIcon,
    securityRisks: ['data-exfiltration', 'sql-injection', 'file-access', 'stream-manipulation'],
    testingApproaches: ['data-security', 'input-validation', 'access-control', 'data-flow-testing'],
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    specificComponents: [
      { id: 'sql-database', name: 'SQL Database', description: 'PostgreSQL, MySQL, SQL Server', provider: 'Various' },
      { id: 'nosql-database', name: 'NoSQL Database', description: 'MongoDB, Cassandra, Redis', provider: 'Various' },
      { id: 'file-storage', name: 'File Storage', description: 'S3, Azure Blob, Google Cloud Storage', provider: 'Various' },
      { id: 'data-streams', name: 'Data Streams', description: 'Kafka, Kinesis, Pub/Sub', provider: 'Various' },
      { id: 'custom-data', name: 'Custom Data Source', description: 'Custom data source implementation', provider: 'Custom' }
    ]
  }
]

const useCases: UseCase[] = [
  {
    id: 'customer-service',
    name: 'Customer Service & Support',
    category: 'customer-facing',
    description: 'Chatbots, help desks, ticket routing, and customer support systems',
    icon: MessageSquare,
    riskLevel: 'high',
    compliance: ['GDPR', 'CCPA', 'PCI-DSS'],
    dataTypes: ['customer-pii', 'support-tickets', 'conversation-logs'],
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    id: 'content-creation',
    name: 'Content Creation & Management',
    category: 'customer-facing',
    description: 'Document generation, content personalization, and creative asset creation',
    icon: FileText,
    riskLevel: 'medium',
    compliance: ['Copyright', 'Trademark', 'Content Guidelines'],
    dataTypes: ['user-preferences', 'content-assets', 'brand-guidelines'],
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis & Business Intelligence',
    category: 'internal-business',
    description: 'Business intelligence, financial analysis, and reporting systems',
    icon: BarChart3,
    riskLevel: 'high',
    compliance: ['SOX', 'GDPR', 'HIPAA'],
    dataTypes: ['business-data', 'financial-records', 'analytics-results'],
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    id: 'process-automation',
    name: 'Process Automation',
    category: 'internal-business',
    description: 'Workflow automation, task delegation, and business process optimization',
    icon: Workflow,
    riskLevel: 'medium',
    compliance: ['SOX', 'Internal Controls'],
    dataTypes: ['workflow-data', 'process-logs', 'automation-configs'],
    color: 'bg-red-100 text-red-600 border-red-200'
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    category: 'industry-specific',
    description: 'Trading algorithms, fraud detection, and financial decision support',
    icon: DollarSign,
    riskLevel: 'critical',
    compliance: ['SOX', 'GLBA', 'Basel III', 'Financial Regulations'],
    dataTypes: ['financial-data', 'trading-records', 'customer-financial-info'],
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'industry-specific',
    description: 'Medical diagnosis, patient care, and healthcare administration',
    icon: Heart,
    riskLevel: 'critical',
    compliance: ['HIPAA', 'HITECH', 'FDA Regulations'],
    dataTypes: ['phi', 'medical-records', 'diagnostic-data'],
    color: 'bg-pink-100 text-pink-600 border-pink-200'
  }
]

const dataSensitivityLevels: DataSensitivity[] = [
  {
    id: 'public',
    name: 'Public Data',
    description: 'Publicly available information with no privacy concerns',
    icon: Globe,
    riskLevel: 'low',
    regulations: [],
    testingRequirements: ['accuracy-testing', 'performance-testing'],
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'internal',
    name: 'Internal Business Data',
    description: 'Company internal data with moderate sensitivity',
    icon: Building,
    riskLevel: 'medium',
    regulations: ['Internal Policies'],
    testingRequirements: ['access-control', 'data-protection', 'audit-trails'],
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200'
  },
  {
    id: 'pii',
    name: 'Personal Identifiable Information (PII)',
    description: 'Personal data that can identify individuals',
    icon: Users,
    riskLevel: 'high',
    regulations: ['GDPR', 'CCPA', 'Privacy Laws'],
    testingRequirements: ['data-minimization', 'consent-management', 'right-to-deletion', 'encryption'],
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    id: 'phi',
    name: 'Protected Health Information (PHI)',
    description: 'Healthcare data with strict privacy requirements',
    icon: Heart,
    riskLevel: 'critical',
    regulations: ['HIPAA', 'HITECH', 'Healthcare Regulations'],
    testingRequirements: ['phi-protection', 'audit-trails', 'access-controls', 'encryption-at-rest'],
    color: 'bg-red-100 text-red-600 border-red-200'
  },
  {
    id: 'financial',
    name: 'Financial Data',
    description: 'Financial records and transaction data',
    icon: DollarSign,
    riskLevel: 'critical',
    regulations: ['SOX', 'GLBA', 'Financial Regulations'],
    testingRequirements: ['financial-compliance', 'audit-trails', 'data-integrity', 'fraud-detection'],
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  }
]

const deploymentEnvironments: DeploymentEnvironment[] = [
  {
    id: 'public-cloud',
    name: 'Public Cloud',
    description: 'AWS, Azure, Google Cloud, or other public cloud providers',
    icon: Cloud,
    securityConsiderations: ['cloud-security', 'shared-responsibility', 'data-residency', 'compliance'],
    testingApproaches: ['cloud-security-testing', 'compliance-validation', 'data-protection-testing'],
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    id: 'private-cloud',
    name: 'Private Cloud',
    description: 'On-premises cloud infrastructure with dedicated resources',
    icon: Building,
    securityConsiderations: ['network-security', 'physical-security', 'access-controls', 'data-sovereignty'],
    testingApproaches: ['network-security-testing', 'physical-security-validation', 'access-control-testing'],
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'edge-devices',
    name: 'Edge Devices',
    description: 'IoT devices, mobile applications, or edge computing nodes',
    icon: Smartphone,
    securityConsiderations: ['device-security', 'network-vulnerabilities', 'data-transmission', 'physical-access'],
    testingApproaches: ['device-security-testing', 'network-penetration-testing', 'data-transmission-security'],
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Deployment',
    description: 'Combination of multiple deployment environments',
    icon: Layers,
    securityConsiderations: ['integration-security', 'data-flow-security', 'cross-environment-attacks', 'complex-compliance'],
    testingApproaches: ['integration-security-testing', 'data-flow-validation', 'cross-environment-testing'],
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  }
]

const complianceFrameworks: ComplianceFramework[] = [
  {
    id: 'eu-ai-act',
    name: 'EU AI Act',
    description: 'European Union Artificial Intelligence Act compliance requirements',
    requirements: [
      'Risk-based classification of AI systems',
      'Transparency and documentation requirements',
      'Human oversight and control mechanisms',
      'Accuracy and robustness standards',
      'Data governance and privacy protection',
      'Post-market monitoring and reporting'
    ],
    riskLevel: 'critical',
    applicableTo: ['customer-facing', 'internal-business', 'industry-specific'],
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    id: 'nist-ai-rmf',
    name: 'NIST AI Risk Management Framework',
    description: 'National Institute of Standards and Technology AI Risk Management Framework',
    requirements: [
      'Governance and accountability structures',
      'Risk assessment and management processes',
      'Technical and operational controls',
      'Monitoring and evaluation mechanisms',
      'Documentation and reporting requirements',
      'Continuous improvement processes'
    ],
    riskLevel: 'high',
    applicableTo: ['customer-facing', 'internal-business', 'industry-specific'],
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'iso-42001',
    name: 'ISO 42001 AI Management System',
    description: 'International standard for AI management systems and governance',
    requirements: [
      'AI management system framework',
      'Risk assessment and management',
      'Data governance and quality management',
      'Human oversight and control',
      'Transparency and explainability',
      'Continuous monitoring and improvement'
    ],
    riskLevel: 'high',
    applicableTo: ['customer-facing', 'internal-business', 'industry-specific'],
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200'
  },
  {
    id: 'hipaa',
    name: 'HIPAA (Healthcare)',
    description: 'Health Insurance Portability and Accountability Act compliance',
    requirements: [
      'Protected Health Information (PHI) protection',
      'Administrative, physical, and technical safeguards',
      'Privacy rule compliance',
      'Security rule implementation',
      'Breach notification procedures',
      'Business associate agreements'
    ],
    riskLevel: 'critical',
    applicableTo: ['healthcare'],
    color: 'bg-pink-100 text-pink-600 border-pink-200'
  },
  {
    id: 'sox',
    name: 'SOX (Financial)',
    description: 'Sarbanes-Oxley Act financial reporting compliance',
    requirements: [
      'Financial data integrity and accuracy',
      'Internal control over financial reporting',
      'Audit trail and documentation',
      'Risk assessment and management',
      'Executive accountability',
      'Independent audit requirements'
    ],
    riskLevel: 'critical',
    applicableTo: ['financial-services'],
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    id: 'gdpr',
    name: 'GDPR (Data Privacy)',
    description: 'General Data Protection Regulation compliance',
    requirements: [
      'Data minimization and purpose limitation',
      'Consent management and user rights',
      'Data protection by design and default',
      'Breach notification requirements',
      'Data protection impact assessments',
      'Cross-border data transfer safeguards'
    ],
    riskLevel: 'high',
    applicableTo: ['customer-facing', 'internal-business'],
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200'
  }
]

const availableTestSuites: TestSuite[] = [
  {
    id: 'prompt-injection',
    name: 'Prompt Injection Testing',
    category: 'security',
    description: 'Comprehensive prompt injection attack testing',
    testCases: ['Direct injection', 'Indirect injection', 'Multimodal injection'],
    automated: true,
    priority: 'critical',
    specificTests: [
      { id: 'direct-injection', name: 'Direct Prompt Injection', description: 'Direct instruction override attempts', category: 'security', automated: true, priority: 'critical' },
      { id: 'indirect-injection', name: 'Indirect Prompt Injection', description: 'Document and web content injection', category: 'security', automated: true, priority: 'critical' },
      { id: 'multimodal-injection', name: 'Multimodal Injection', description: 'Image, audio, video injection attacks', category: 'security', automated: true, priority: 'high' },
      { id: 'jailbreak-attacks', name: 'Jailbreak Attacks', description: 'DAN, AIM, and custom jailbreaks', category: 'security', automated: true, priority: 'critical' }
    ]
  },
  {
    id: 'ai-red-teaming',
    name: 'AI Red Teaming',
    category: 'security',
    description: 'Advanced AI-specific security testing',
    testCases: ['Model extraction', 'Adversarial examples', 'Data poisoning'],
    automated: true,
    priority: 'critical',
    specificTests: [
      { id: 'model-extraction', name: 'Model Extraction', description: 'Attempts to steal model architecture', category: 'security', automated: true, priority: 'critical' },
      { id: 'adversarial-examples', name: 'Adversarial Examples', description: 'Crafted inputs causing incorrect outputs', category: 'security', automated: true, priority: 'high' },
      { id: 'data-poisoning', name: 'Data Poisoning', description: 'Training data manipulation testing', category: 'security', automated: true, priority: 'critical' },
      { id: 'model-inversion', name: 'Model Inversion', description: 'Training data reconstruction attempts', category: 'security', automated: true, priority: 'high' }
    ]
  },
  {
    id: 'agent-security',
    name: 'Agent Security Testing',
    category: 'security',
    description: 'AI agent framework security testing',
    testCases: ['Tool abuse', 'Workflow hijacking', 'Memory injection'],
    automated: true,
    priority: 'high',
    specificTests: [
      { id: 'tool-abuse', name: 'Tool Abuse Testing', description: 'Unauthorized tool usage attempts', category: 'security', automated: true, priority: 'high' },
      { id: 'workflow-hijacking', name: 'Workflow Hijacking', description: 'Agent workflow manipulation', category: 'security', automated: true, priority: 'high' },
      { id: 'memory-injection', name: 'Memory Injection', description: 'Conversation memory manipulation', category: 'security', automated: true, priority: 'medium' },
      { id: 'privilege-escalation', name: 'Privilege Escalation', description: 'Agent privilege escalation attempts', category: 'security', automated: true, priority: 'critical' }
    ]
  },
  {
    id: 'rag-security',
    name: 'RAG Security Testing',
    category: 'security',
    description: 'Retrieval-Augmented Generation security testing',
    testCases: ['Source attribution', 'Data leakage', 'Knowledge poisoning'],
    automated: true,
    priority: 'high',
    specificTests: [
      { id: 'source-attribution', name: 'Source Attribution', description: 'Verification of source citations', category: 'security', automated: true, priority: 'medium' },
      { id: 'data-leakage', name: 'Data Leakage', description: 'Sensitive data exposure testing', category: 'security', automated: true, priority: 'critical' },
      { id: 'knowledge-poisoning', name: 'Knowledge Poisoning', description: 'Vector database injection attacks', category: 'security', automated: true, priority: 'high' },
      { id: 'retrieval-manipulation', name: 'Retrieval Manipulation', description: 'Query manipulation and bypass', category: 'security', automated: true, priority: 'medium' }
    ]
  },
  {
    id: 'compliance-testing',
    name: 'Compliance Testing',
    category: 'compliance',
    description: 'Regulatory compliance validation',
    testCases: ['GDPR', 'HIPAA', 'SOX', 'Industry standards'],
    automated: false,
    priority: 'high',
    specificTests: [
      { id: 'gdpr-compliance', name: 'GDPR Compliance', description: 'Data protection and privacy testing', category: 'compliance', automated: false, priority: 'high' },
      { id: 'hipaa-compliance', name: 'HIPAA Compliance', description: 'Healthcare data protection testing', category: 'compliance', automated: false, priority: 'critical' },
      { id: 'sox-compliance', name: 'SOX Compliance', description: 'Financial reporting compliance', category: 'compliance', automated: false, priority: 'high' },
      { id: 'industry-standards', name: 'Industry Standards', description: 'Industry-specific compliance testing', category: 'compliance', automated: false, priority: 'medium' }
    ]
  },
  {
    id: 'performance-testing',
    name: 'Performance Testing',
    category: 'performance',
    description: 'System performance and scalability testing',
    testCases: ['Load testing', 'Stress testing', 'Latency testing'],
    automated: true,
    priority: 'medium',
    specificTests: [
      { id: 'load-testing', name: 'Load Testing', description: 'Normal load performance testing', category: 'performance', automated: true, priority: 'medium' },
      { id: 'stress-testing', name: 'Stress Testing', description: 'High load performance testing', category: 'performance', automated: true, priority: 'medium' },
      { id: 'latency-testing', name: 'Latency Testing', description: 'Response time performance testing', category: 'performance', automated: true, priority: 'low' },
      { id: 'scalability-testing', name: 'Scalability Testing', description: 'System scaling performance testing', category: 'performance', automated: true, priority: 'medium' }
    ]
  }
]

const Assessment: React.FC = () => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps] = useState(9) // Updated to 9 steps to include the final assessment
  
  // Selection state
  const [selectedSolutionType, setSelectedSolutionType] = useState<AISolutionType | null>(null)
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)
  const [selectedDataSensitivity, setSelectedDataSensitivity] = useState<DataSensitivity | null>(null)
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentEnvironment | null>(null)
  
  // New component and test suite selection state
  const [selectedSpecificComponents, setSelectedSpecificComponents] = useState<{[componentId: string]: string[]}>({})
  const [selectedTestSuites, setSelectedTestSuites] = useState<string[]>([])
  const [selectedSpecificTests, setSelectedSpecificTests] = useState<{[testSuiteId: string]: string[]}>({})
  
  // Generated test suite
  const [generatedTestSuite, setGeneratedTestSuite] = useState<TestSuite[]>([])
  const [selectedComplianceFrameworks, setSelectedComplianceFrameworks] = useState<string[]>([])
  const [assessmentReport, setAssessmentReport] = useState<AssessmentReport | null>(null)
  const [securityScanReport, setSecurityScanReport] = useState<SecurityScanReport | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isGeneratingTestSuite, setIsGeneratingTestSuite] = useState(false)
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleComponentToggle = (componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId) 
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    )
  }
  
  const handleComplianceFrameworkToggle = (frameworkId: string) => {
    setSelectedComplianceFrameworks(prev => 
      prev.includes(frameworkId) 
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    )
  }
  
  const handleSpecificComponentToggle = (componentId: string, specificComponentId: string) => {
    setSelectedSpecificComponents(prev => {
      const current = prev[componentId] || []
      const updated = current.includes(specificComponentId)
        ? current.filter(id => id !== specificComponentId)
        : [...current, specificComponentId]
      
      return {
        ...prev,
        [componentId]: updated
      }
    })
  }
  
  const handleTestSuiteToggle = (testSuiteId: string) => {
    setSelectedTestSuites(prev => 
      prev.includes(testSuiteId) 
        ? prev.filter(id => id !== testSuiteId)
        : [...prev, testSuiteId]
    )
  }
  
  const handleSpecificTestToggle = (testSuiteId: string, specificTestId: string) => {
    setSelectedSpecificTests(prev => {
      const current = prev[testSuiteId] || []
      const updated = current.includes(specificTestId)
        ? current.filter(id => id !== specificTestId)
        : [...current, specificTestId]
      
      return {
        ...prev,
        [testSuiteId]: updated
      }
    })
  }
  
  const exportAssessmentReportPDF = async () => {
    if (!assessmentReport) return
    
    // Create a temporary div to render the report content
    const reportDiv = document.createElement('div')
    reportDiv.style.width = '800px'
    reportDiv.style.padding = '20px'
    reportDiv.style.backgroundColor = 'white'
    reportDiv.style.fontFamily = 'Arial, sans-serif'
    reportDiv.style.fontSize = '12px'
    reportDiv.style.lineHeight = '1.4'
    
    reportDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1f2937; margin-bottom: 10px;">AI System Assessment Report</h1>
        <p style="color: #6b7280;">Generated on ${new Date(assessmentReport.timestamp).toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Executive Summary</h2>
        <p style="color: #374151;">${assessmentReport.executiveSummary}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Solution Overview</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #d1d5db;"><strong>Solution Type:</strong></td><td style="padding: 8px; border: 1px solid #d1d5db;">${assessmentReport.solutionType}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #d1d5db;"><strong>Use Case:</strong></td><td style="padding: 8px; border: 1px solid #d1d5db;">${assessmentReport.useCase}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #d1d5db;"><strong>Data Sensitivity:</strong></td><td style="padding: 8px; border: 1px solid #d1d5db;">${assessmentReport.dataSensitivity}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #d1d5db;"><strong>Deployment Environment:</strong></td><td style="padding: 8px; border: 1px solid #d1d5db;">${assessmentReport.deploymentEnvironment}</td></tr>
        </table>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Compliance Status</h2>
        ${assessmentReport.complianceStatus.map(compliance => `
          <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #d1d5db; border-radius: 5px;">
            <h3 style="color: #1f2937; margin-bottom: 10px;">${compliance.framework}</h3>
            <p style="margin-bottom: 10px;"><strong>Status:</strong> <span style="color: ${compliance.status === 'compliant' ? '#059669' : compliance.status === 'partial' ? '#d97706' : '#dc2626'}">${compliance.status.replace('-', ' ')}</span></p>
            ${compliance.gaps.length > 0 ? `<p style="margin-bottom: 10px;"><strong>Gaps:</strong> ${compliance.gaps.join(', ')}</p>` : ''}
            ${compliance.recommendations.length > 0 ? `<p><strong>Recommendations:</strong> ${compliance.recommendations.join(', ')}</p>` : ''}
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Key Recommendations</h2>
        <ul style="color: #374151;">
          ${assessmentReport.recommendations.map(rec => `<li style="margin-bottom: 5px;">${rec}</li>`).join('')}
        </ul>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Next Steps</h2>
        <ul style="color: #374151;">
          ${assessmentReport.nextSteps.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
        </ul>
      </div>
    `
    
    document.body.appendChild(reportDiv)
    
    try {
      const canvas = await html2canvas(reportDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(`ai-assessment-report-${assessmentReport.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      document.body.removeChild(reportDiv)
    }
  }
  
  const exportAssessmentReportDOCX = async () => {
    if (!assessmentReport) return
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "AI System Assessment Report",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: `Generated on ${new Date(assessmentReport.timestamp).toLocaleDateString()}`,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({ text: "" }),
          
          new Paragraph({
            text: "Executive Summary",
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            text: assessmentReport.executiveSummary
          }),
          new Paragraph({ text: "" }),
          
          new Paragraph({
            text: "Solution Overview",
            heading: HeadingLevel.HEADING_2
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Solution Type" })] }),
                  new TableCell({ children: [new Paragraph({ text: assessmentReport.solutionType })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Use Case" })] }),
                  new TableCell({ children: [new Paragraph({ text: assessmentReport.useCase })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Data Sensitivity" })] }),
                  new TableCell({ children: [new Paragraph({ text: assessmentReport.dataSensitivity })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Deployment Environment" })] }),
                  new TableCell({ children: [new Paragraph({ text: assessmentReport.deploymentEnvironment })] })
                ]
              })
            ]
          }),
          new Paragraph({ text: "" }),
          
          new Paragraph({
            text: "Compliance Status",
            heading: HeadingLevel.HEADING_2
          }),
          ...assessmentReport.complianceStatus.flatMap(compliance => [
            new Paragraph({
              text: compliance.framework,
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({
              text: `Status: ${compliance.status.replace('-', ' ')}`
            }),
            ...(compliance.gaps.length > 0 ? [new Paragraph({ text: `Gaps: ${compliance.gaps.join(', ')}` })] : []),
            ...(compliance.recommendations.length > 0 ? [new Paragraph({ text: `Recommendations: ${compliance.recommendations.join(', ')}` })] : []),
            new Paragraph({ text: "" })
          ]),
          
          new Paragraph({
            text: "Key Recommendations",
            heading: HeadingLevel.HEADING_2
          }),
          ...assessmentReport.recommendations.map(rec => 
            new Paragraph({ text: `• ${rec}` })
          ),
          new Paragraph({ text: "" }),
          
          new Paragraph({
            text: "Next Steps",
            heading: HeadingLevel.HEADING_2
          }),
          ...assessmentReport.nextSteps.map(step => 
            new Paragraph({ text: `• ${step}` })
          )
        ]
      }]
    })
    
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-assessment-report-${assessmentReport.id}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const performSecurityScan = async () => {
    if (!selectedSolutionType || !selectedUseCase || !selectedDataSensitivity || !selectedDeployment) {
      return
    }

    setIsScanning(true)
    setScanProgress(0)

    try {
      // Convert selected specific components to scan configuration
      const componentConfigs: ComponentScanConfig[] = []
      
      // Process each selected component category
      Object.entries(selectedSpecificComponents).forEach(([componentId, specificComponentIds]) => {
        if (specificComponentIds.length > 0) {
        const component = aiComponents.find(c => c.id === componentId)
          if (component) {
            // Create a config for each specific component
            specificComponentIds.forEach(specificId => {
              componentConfigs.push({
                componentId: specificId,
                componentType: component.category as any || 'llm',
                testSuites: selectedTestSuites.length > 0 ? selectedTestSuites : ['vulnerability', 'compliance', 'penetration']
              })
            })
          }
        }
      })

      // If no specific components selected, use the general component categories
      if (componentConfigs.length === 0) {
        selectedComponents.forEach(componentId => {
          const component = aiComponents.find(c => c.id === componentId)
          if (component) {
            componentConfigs.push({
          componentId,
              componentType: component.category as any || 'llm',
              testSuites: selectedTestSuites.length > 0 ? selectedTestSuites : ['vulnerability', 'compliance', 'penetration']
            })
        }
      })
      }

      // Create security scan request
      const scanRequest: SecurityScanRequest = {
        solutionType: selectedSolutionType.id,
        components: componentConfigs,
        complianceFrameworks: selectedComplianceFrameworks,
        scanDepth: 'comprehensive',
        timeout: 300000 // 5 minutes
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 1000)

      // Perform the security scan
      const scanReport = await aiSecurityScanner.performSecurityScan(scanRequest)
      
      clearInterval(progressInterval)
      setScanProgress(100)
      setSecurityScanReport(scanReport)

      // Update the assessment report with security scan results
      if (assessmentReport) {
        const updatedReport = {
          ...assessmentReport,
          securityScanResults: scanReport,
          executiveSummary: scanReport.executiveSummary
        }
        setAssessmentReport(updatedReport)
      }

    } catch (error) {
      console.error('Security scan failed:', error)
      alert('Security scan failed. Please try again.')
    } finally {
      setIsScanning(false)
      setScanProgress(0)
    }
  }

  const startTesting = () => {
    // Navigate to the Red Teaming page with the assessment data
    const assessmentData = {
      solutionType: selectedSolutionType?.id,
      components: selectedComponents,
      specificComponents: selectedSpecificComponents,
      useCase: selectedUseCase?.id,
      dataSensitivity: selectedDataSensitivity?.id,
      deploymentEnvironment: selectedDeployment?.id,
      complianceFrameworks: selectedComplianceFrameworks,
      testSuites: selectedTestSuites,
      specificTests: selectedSpecificTests,
      generatedTestSuite: generatedTestSuite,
      securityScanResults: securityScanReport
    }
    
    // Store the assessment data in localStorage for the Red Teaming page
    localStorage.setItem('assessmentData', JSON.stringify(assessmentData))
    
    // Navigate to Red Teaming page
    window.location.href = '/red-teaming'
  }
  
  const generateTestSuite = () => {
    console.log('Generate Test Suite button clicked')
    
    if (!selectedSolutionType || !selectedUseCase || !selectedDataSensitivity || !selectedDeployment) {
      console.log('Missing required selections:', {
        selectedSolutionType: !!selectedSolutionType,
        selectedUseCase: !!selectedUseCase,
        selectedDataSensitivity: !!selectedDataSensitivity,
        selectedDeployment: !!selectedDeployment
      })
      alert('Please complete all previous steps before generating test suite')
      return
    }
    
    setIsGeneratingTestSuite(true)
    console.log('Generating testing strategy...')
    
    // Simulate some processing time for better UX
    setTimeout(() => {
      const testingStrategy = generateTestingStrategy(
        selectedSolutionType.id,
        selectedComponents,
        selectedUseCase.id,
        selectedDataSensitivity.id,
        selectedDeployment.id
      )
      
      console.log('Testing strategy generated:', testingStrategy)
      
      // Generate compliance analysis
      const complianceAnalysis = selectedComplianceFrameworks.map(frameworkId => {
        const framework = complianceFrameworks.find(f => f.id === frameworkId)
        if (!framework) return null
        
        // Simple compliance logic - in a real implementation, this would be more sophisticated
        const isApplicable = framework.applicableTo.includes(selectedUseCase.category) || 
                            framework.applicableTo.includes(selectedUseCase.id)
        
        if (!isApplicable) {
          return {
            framework: framework.name,
            status: 'not-applicable' as const,
            gaps: [] as string[],
            recommendations: [] as string[]
          }
        }
        
        // Determine compliance status based on risk level and data sensitivity
        let status: 'compliant' | 'non-compliant' | 'partial' = 'partial'
        const gaps: string[] = []
        const recommendations: string[] = []
        
        if (framework.riskLevel === 'critical' && selectedDataSensitivity.riskLevel === 'critical') {
          status = 'non-compliant'
          gaps.push('Critical risk framework requires additional controls')
          recommendations.push('Implement comprehensive risk management framework')
          recommendations.push('Conduct regular compliance audits')
        } else if (framework.riskLevel === 'high') {
          status = 'partial'
          gaps.push('High-risk framework requires enhanced monitoring')
          recommendations.push('Implement enhanced monitoring and controls')
        } else {
          status = 'compliant'
          recommendations.push('Maintain current compliance posture')
        }
        
        return {
          framework: framework.name,
          status,
          gaps,
          recommendations
        }
      }).filter((item): item is NonNullable<typeof item> => item !== null)
      
      console.log('Compliance analysis generated:', complianceAnalysis)
      
      // Generate comprehensive assessment report
      const report: AssessmentReport = {
        id: `assessment-${Date.now()}`,
        timestamp: new Date().toISOString(),
        solutionType: selectedSolutionType.name,
        components: selectedComponents,
        useCase: selectedUseCase.name,
        dataSensitivity: selectedDataSensitivity.name,
        deploymentEnvironment: selectedDeployment.name,
        riskAssessment: testingStrategy.riskAssessment,
        testSuites: testingStrategy.testSuites,
        complianceStatus: complianceAnalysis,
        executiveSummary: `This AI system assessment reveals a ${testingStrategy.riskAssessment.overallRiskLevel} risk level with ${complianceAnalysis.filter(c => c?.status === 'non-compliant').length} compliance gaps requiring immediate attention.`,
        technicalDetails: {
          totalTestSuites: testingStrategy.testSuites.length,
          estimatedTestingTime: testingStrategy.resources.automated + testingStrategy.resources.manual + testingStrategy.resources.expert,
          complianceFrameworks: selectedComplianceFrameworks.length
        },
        recommendations: testingStrategy.riskAssessment.recommendations,
        nextSteps: [
          'Implement recommended security controls',
          'Conduct comprehensive testing using generated test suites',
          'Address identified compliance gaps',
          'Establish ongoing monitoring and assessment processes'
        ]
      }
      
      console.log('Assessment report generated:', report)
      setAssessmentReport(report)
      
      // Convert the service TestSuite format to the component format
      const convertedTestSuites: TestSuite[] = testingStrategy.testSuites.map(suite => ({
        id: suite.id,
        name: suite.name,
        category: suite.category,
        description: suite.description,
        testCases: suite.testCases.map(tc => tc.name),
        automated: suite.automatedPercentage > 50,
        priority: suite.priority
      }))
      
      console.log('Converted test suites:', convertedTestSuites)
      setGeneratedTestSuite(convertedTestSuites)
      setIsGeneratingTestSuite(false)
      
      // Show success message
      alert(`Test suite generated successfully! Generated ${convertedTestSuites.length} test suites with ${testingStrategy.testSuites.reduce((acc, suite) => acc + suite.testCases.length, 0)} total test cases.`)
    }, 1000) // 1 second delay for better UX
  }
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of AI solution are you assessing?</h2>
        <p className="text-gray-600">Select the primary type of AI system you want to assess</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiSolutionTypes.map((solution) => (
          <div
            key={solution.id}
            onClick={() => setSelectedSolutionType(solution)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedSolutionType?.id === solution.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <solution.icon className="w-6 h-6" />
              <h3 className="font-semibold text-gray-900">{solution.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{solution.components.length} components</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Which AI components does your solution use?</h2>
        <p className="text-gray-600">Select all components that are part of your AI system for assessment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiComponents.map((component) => (
          <div
            key={component.id}
            onClick={() => handleComponentToggle(component.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedComponents.includes(component.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <component.icon className="w-6 h-6" />
              <h3 className="font-semibold text-gray-900">{component.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{component.description}</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                <strong>Security Risks:</strong> {component.securityRisks.slice(0, 2).join(', ')}
                {component.securityRisks.length > 2 && '...'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your primary use case?</h2>
        <p className="text-gray-600">Select the business context for your AI solution assessment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {useCases.map((useCase) => (
          <div
            key={useCase.id}
            onClick={() => setSelectedUseCase(useCase)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedUseCase?.id === useCase.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <useCase.icon className="w-6 h-6" />
              <h3 className="font-semibold text-gray-900">{useCase.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{useCase.category}</span>
              </div>
              <div className="text-xs text-gray-500">
                <strong>Compliance:</strong> {useCase.compliance.slice(0, 2).join(', ')}
                {useCase.compliance.length > 2 && '...'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What types of data does your AI system process?</h2>
        <p className="text-gray-600">Select the highest sensitivity level of data your system handles for compliance assessment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSensitivityLevels.map((sensitivity) => (
          <div
            key={sensitivity.id}
            onClick={() => setSelectedDataSensitivity(sensitivity)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedDataSensitivity?.id === sensitivity.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <sensitivity.icon className="w-6 h-6" />
              <h3 className="font-semibold text-gray-900">{sensitivity.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{sensitivity.description}</p>
            <div className="space-y-2">

              {sensitivity.regulations.length > 0 && (
                <div className="text-xs text-gray-500">
                  <strong>Regulations:</strong> {sensitivity.regulations.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Specific Components to Test</h2>
        <p className="text-gray-600">Choose the specific AI components and technologies you want to test</p>
      </div>
      
      <div className="space-y-6">
        {selectedComponents.map(componentId => {
          const component = aiComponents.find(c => c.id === componentId)
          if (!component || !component.specificComponents) return null
          
          return (
            <div key={componentId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <component.icon className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{component.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {component.specificComponents.map(specificComponent => (
                  <div
                    key={specificComponent.id}
                    onClick={() => handleSpecificComponentToggle(componentId, specificComponent.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      (selectedSpecificComponents[componentId] || []).includes(specificComponent.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{specificComponent.name}</h4>
                      <span className="text-xs text-gray-500">{specificComponent.provider}</span>
                    </div>
                    <p className="text-xs text-gray-600">{specificComponent.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
  
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Test Suites and Specific Tests</h2>
        <p className="text-gray-600">Choose which security tests to run on your selected components</p>
      </div>
      
      <div className="space-y-6">
        {availableTestSuites.map(testSuite => (
          <div key={testSuite.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  testSuite.priority === 'critical' ? 'bg-red-500' :
                  testSuite.priority === 'high' ? 'bg-orange-500' :
                  testSuite.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></div>
                <h3 className="text-lg font-semibold text-gray-900">{testSuite.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testSuite.automated ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {testSuite.automated ? 'Automated' : 'Manual'}
                </span>
                <input
                  type="checkbox"
                  checked={selectedTestSuites.includes(testSuite.id)}
                  onChange={() => handleTestSuiteToggle(testSuite.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{testSuite.description}</p>
            
            {selectedTestSuites.includes(testSuite.id) && testSuite.specificTests && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Specific Tests:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {testSuite.specificTests.map(specificTest => (
                    <div
                      key={specificTest.id}
                      onClick={() => handleSpecificTestToggle(testSuite.id, specificTest.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        (selectedSpecificTests[testSuite.id] || []).includes(specificTest.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-gray-900 text-sm">{specificTest.name}</h5>
                        <div className="flex items-center space-x-1">
                          <span className={`w-2 h-2 rounded-full ${
                            specificTest.priority === 'critical' ? 'bg-red-500' :
                            specificTest.priority === 'high' ? 'bg-orange-500' :
                            specificTest.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            specificTest.automated ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {specificTest.automated ? 'Auto' : 'Manual'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{specificTest.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Where is your AI system deployed?</h2>
        <p className="text-gray-600">Select your primary deployment environment for security assessment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deploymentEnvironments.map((environment) => (
          <div
            key={environment.id}
            onClick={() => setSelectedDeployment(environment)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedDeployment?.id === environment.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <environment.icon className="w-6 h-6" />
              <h3 className="font-semibold text-gray-900">{environment.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{environment.description}</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                <strong>Security Focus:</strong> {environment.securityConsiderations.slice(0, 2).join(', ')}
                {environment.securityConsiderations.length > 2 && '...'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep8 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Which compliance frameworks apply to your AI system?</h2>
        <p className="text-gray-600">Select all relevant compliance frameworks for your use case and industry</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complianceFrameworks.map((framework) => (
          <div
            key={framework.id}
            onClick={() => handleComplianceFrameworkToggle(framework.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedComplianceFrameworks.includes(framework.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-6 h-6" />
              <h3 className="font-semibold text-gray-900">{framework.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{framework.requirements.length} requirements</span>
              </div>
              <div className="text-xs text-gray-500">
                <strong>Requirements:</strong> {framework.requirements.slice(0, 2).join(', ')}
                {framework.requirements.length > 2 && '...'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const renderStep9 = () => {
    if (!selectedSolutionType || !selectedUseCase || !selectedDataSensitivity || !selectedDeployment) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please complete all previous steps</h2>
          <p className="text-gray-600">All selections are required to generate your testing strategy</p>
        </div>
      )
    }
    
    const testingStrategy = generateTestingStrategy(
      selectedSolutionType.id,
      selectedComponents,
      selectedUseCase.id,
      selectedDataSensitivity.id,
      selectedDeployment.id
    )
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI System Security Assessment</h2>
          <p className="text-gray-600">Comprehensive security scanning and compliance testing</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Solution Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Solution Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Type:</strong> {selectedSolutionType?.name}</div>
                <div><strong>Use Case:</strong> {selectedUseCase?.name}</div>
                <div><strong>Data Sensitivity:</strong> {selectedDataSensitivity?.name}</div>
                <div><strong>Deployment:</strong> {selectedDeployment?.name}</div>
                <div><strong>Components:</strong> {selectedComponents.length}</div>
                <div><strong>Selected Tests:</strong> {selectedTestSuites.length} test suites</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Overall Risk Level:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    testingStrategy.riskAssessment.overallRiskLevel === 'critical' ? 'bg-red-100 text-red-600' :
                    testingStrategy.riskAssessment.overallRiskLevel === 'high' ? 'bg-orange-100 text-orange-600' :
                    testingStrategy.riskAssessment.overallRiskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {testingStrategy.riskAssessment.overallRiskLevel}
                  </span>
                </div>
                <div><strong>Compliance Requirements:</strong> {selectedUseCase?.compliance.length || 0}</div>
                <div><strong>Security Priorities:</strong> {testingStrategy.riskAssessment.securityPriorities.length}</div>
              </div>
            </div>
          </div>
          
          {/* Security Scanning Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Security Scanning</h3>
            
            {!securityScanReport && !isScanning && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Ready to Perform Security Scan</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Click "Start Security Scan" to perform comprehensive security testing on your selected components
                    </p>
                  </div>
                  <button
                    onClick={performSecurityScan}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2 inline" />
                    Start Security Scan
                  </button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                  <div>
                    <h4 className="font-medium text-yellow-900">Security Scan in Progress</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Scanning {selectedComponents.length} components for vulnerabilities...
                    </p>
                    <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">{scanProgress}% complete</p>
                  </div>
                </div>
              </div>
            )}

            {securityScanReport && (
              <div className="space-y-4">
                {/* Security Scan Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">Security Scan Complete</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Overall Risk Score: {securityScanReport.summary.overallRiskScore}/100
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {securityScanReport.summary.passed}/{securityScanReport.summary.totalTests} Tests Passed
                      </div>
                      <div className="text-sm text-green-600">
                        {securityScanReport.summary.criticalIssues} Critical Issues
                      </div>
                    </div>
                  </div>
                </div>

                {/* Component Results */}
                <div className="space-y-3">
                  {securityScanReport.results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{result.component}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.severity === 'critical' ? 'bg-red-100 text-red-600' :
                            result.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                            result.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                          {result.severity} - {result.status}
                          </span>
                        </div>
                      <div className="text-sm text-gray-600">
                        <div>{result.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{result.details}</div>
                </div>
              </div>
            ))}
          </div>
                    </div>
                  )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={generateTestSuite}
              disabled={isGeneratingTestSuite}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingTestSuite ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2 inline" />
                  Generate Test Suite
                </>
              )}
            </button>
            <button
              onClick={startTesting}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <TestTube className="w-4 h-4 mr-2 inline" />
              Start Testing
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      case 6: return renderStep6()
      case 7: return renderStep7()
      case 8: return renderStep8()
      default: return renderStep9()
    }
  }
  
  useEffect(() => {
    if (currentStep === 9) {
      generateTestSuite()
    }
  }, [currentStep])
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI System Assessment</h1>
          <p className="text-gray-600">Comprehensive security, privacy, and compliance assessment for modern AI solutions</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderCurrentStep()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2 inline" />
            Previous
          </button>
          
          {currentStep < totalSteps && (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Assessment 