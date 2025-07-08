import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ExternalLink, Star, Search, Filter, Shield, Target, Eye, BookOpen, CheckCircle,
  BarChart3, Clock, Zap, Download, Upload,
  Github, Code, TestTube, Bug, Lock, Database, Brain, Network, Cpu, FileText
} from 'lucide-react';



interface OpenSourceTool {
  id: string;
  name: string;
  description: string;
  category: 'defense' | 'testing' | 'evaluation' | 'monitoring' | 'research' | 'red-teaming' | 'privacy' | 'bias';
  githubUrl: string;
  documentationUrl: string;
  lastUpdated: string;
  language: string;
  license: string;
  capabilities: string[];
  integrationStatus: 'available' | 'planned' | 'not-available';
  features: {
    promptInjection: boolean;
    adversarialExamples: boolean;
    modelExtraction: boolean;
    dataPoisoning: boolean;
    biasDetection: boolean;
    explainability: boolean;
    benchmarking: boolean;
    realTimeMonitoring: boolean;
    privacyTesting: boolean;
    jailbreaking: boolean;
    hallucinationDetection: boolean;
  };
  installation: string;
  usage: string;
  pros: string[];
  cons: string[];
  mlsOpsArea: string;
}

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  publication: string;
  year: number;
  doi: string;
  abstract: string;
  attackMethods: string[];
  category: 'prompt-injection' | 'jailbreaking' | 'adversarial' | 'model-extraction' | 'data-poisoning' | 'privacy' | 'bias';
  codeUrl?: string;
  datasetUrl?: string;
  citationCount: number;
  relevance: number;
  implementationStatus: 'available' | 'planned' | 'not-available';
  keyFindings: string[];
  defenseImplications: string[];
}



// Comprehensive AI Security Testing Tools based on research
const openSourceTools: OpenSourceTool[] = [
  {
    id: 'preamble-ai-trust-platform',
    name: 'Preamble AI Trust Platform',
    description: 'Enterprise-grade AI safety platform with customizable guardrails, compliance reporting, and real-time monitoring',
    category: 'defense',
    githubUrl: 'https://github.com/preambleai',
    documentationUrl: 'https://preamble.com/solution',
    lastUpdated: '2024-01-16',
    language: 'Python',
    license: 'Commercial',
    capabilities: [
      'Customizable Guardrails',
      'Enterprise Integration',
      'Compliance Reporting',
      'Real-time Monitoring',
      'Input/Output Validation',
      'Content Filtering',
      'Toxic Language Detection',
      'Competitor Check',
      'Custom Rule Engine',
      'Audit Trail',
      'Multi-tenant Support'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: true,
      adversarialExamples: true,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: true,
      explainability: true,
      benchmarking: true,
      realTimeMonitoring: true,
      privacyTesting: true,
      jailbreaking: true,
      hallucinationDetection: true
    },
    installation: 'pip install preamble-ai-trust',
    usage: 'from preamble_ai import TrustPlatform\nplatform = TrustPlatform(config)',
    pros: [
      'Enterprise-grade security and compliance',
      'Highly customizable guardrails',
      'Real-time monitoring and alerting',
      'Comprehensive audit trails',
      'Multi-tenant architecture',
      'Excellent documentation and support',
      'Low performance impact',
      'Easy integration with existing systems'
    ],
    cons: [
      'Commercial license required',
      'Requires enterprise setup',
      'Higher cost for small teams'
    ],
    mlsOpsArea: 'Enterprise AI safety and compliance'
  },

  {
    id: 'garak',
    name: 'Garak',
    description: 'LLM security testing framework for prompt injection, jailbreaking, and adversarial attacks',
    category: 'testing',
    githubUrl: 'https://github.com/leondz/garak',
    documentationUrl: 'https://garak.ai',
    lastUpdated: '2024-01-15',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Prompt Injection Testing',
      'Jailbreaking Detection',
      'Adversarial Attack Generation',
      'Model Evaluation',
      'Automated Testing',
      'Custom Attack Vectors',
      'Hallucination Detection',
      'Harmful Language Detection'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: true,
      adversarialExamples: true,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: true,
      realTimeMonitoring: false,
      privacyTesting: false,
      jailbreaking: true,
      hallucinationDetection: true
    },
    installation: 'pip install garak',
    usage: 'garak --model openai/gpt-4 --probes promptinject',
    pros: [
      'Comprehensive prompt injection testing',
      'Active development and community support',
      'Easy to use CLI interface',
      'Extensible probe system',
      'Good documentation',
      'Supports multiple LLM providers'
    ],
    cons: [
      'Limited to prompt injection attacks',
      'No real-time monitoring',
      'Requires API keys for testing'
    ],
    mlsOpsArea: 'Adversarial machine learning'
  },
  {
    id: 'adversarial-robustness-toolbox',
    name: 'Adversarial Robustness Toolbox (ART)',
    description: 'Python library for ML defense against adversarial threats',
    category: 'defense',
    githubUrl: 'https://github.com/Trusted-AI/adversarial-robustness-toolbox',
    documentationUrl: 'https://adversarial-robustness-toolbox.readthedocs.io/',
    lastUpdated: '2024-01-12',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Evasion Attack Defense',
      'Poisoning Attack Defense',
      'Inference Attack Defense',
      'Extraction Attack Defense',
      'Pre-built Attacks',
      'Defense Estimators',
      'Evaluation Metrics'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: true,
      modelExtraction: true,
      dataPoisoning: true,
      biasDetection: false,
      explainability: false,
      benchmarking: true,
      realTimeMonitoring: false,
      privacyTesting: true,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install adversarial-robustness-toolbox',
    usage: 'from art.estimators.classification import TensorFlowV2Classifier\nclassifier = TensorFlowV2Classifier(model=model)',
    pros: [
      'Comprehensive adversarial defense',
      'Multiple attack types supported',
      'Well-documented API',
      'Active maintenance',
      'Academic backing'
    ],
    cons: [
      'Complex setup for beginners',
      'Resource intensive',
      'Limited to traditional ML models'
    ],
    mlsOpsArea: 'Adversarial machine learning'
  },
  {
    id: 'privacy-meter',
    name: 'Privacy Meter',
    description: 'Python library to audit the data privacy of ML models',
    category: 'privacy',
    githubUrl: 'https://github.com/privacytrustlab/ml_privacy_meter',
    documentationUrl: 'https://privacytrustlab.github.io/ml_privacy_meter/',
    lastUpdated: '2024-01-10',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Membership Inference Attacks',
      'Privacy Risk Assessment',
      'Training Data Leakage Detection',
      'Quantitative Privacy Analysis',
      'Customizable Privacy Games',
      'Privacy Score Calculation'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: false,
      privacyTesting: true,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install privacy-meter',
    usage: 'from privacy_meter import PrivacyMeter\nmeter = PrivacyMeter(model, dataset)',
    pros: [
      'State-of-the-art privacy testing',
      'Quantitative risk assessment',
      'Customizable configurations',
      'Academic research backing',
      'Comprehensive documentation'
    ],
    cons: [
      'Complex configuration',
      'Requires training data',
      'Computational overhead'
    ],
    mlsOpsArea: 'Trusted AI'
  },
  {
    id: 'audit-ai',
    name: 'Audit AI',
    description: 'Python library for ML bias testing and algorithm auditing',
    category: 'bias',
    githubUrl: 'https://github.com/pymetrics/audit-ai',
    documentationUrl: 'https://audit-ai.readthedocs.io/',
    lastUpdated: '2024-01-08',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Bias Testing',
      'Algorithm Auditing',
      'Statistical Testing',
      'Fairness Metrics',
      'Classification Testing',
      'Regression Testing'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: true,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: false,
      privacyTesting: false,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install audit-ai',
    usage: 'from auditai import AuditAI\naudit = AuditAI(model, test_data)',
    pros: [
      'User-friendly interface',
      'Built on familiar libraries (pandas, sklearn)',
      'Comprehensive bias testing',
      'Statistical rigor',
      'Easy integration'
    ],
    cons: [
      'Limited to bias detection',
      'Requires labeled data',
      'No real-time capabilities'
    ],
    mlsOpsArea: 'Trusted AI'
  },
  {
    id: 'ai-exploits',
    name: 'ai-exploits',
    description: 'Collection of exploits and scanning templates for real-world AI vulnerabilities',
    category: 'red-teaming',
    githubUrl: 'https://github.com/protectai/ai-exploits',
    documentationUrl: 'https://ai-exploits.com',
    lastUpdated: '2024-01-14',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Vulnerability Scanning',
      'Exploit Templates',
      'Remote Code Execution',
      'Local File Inclusion',
      'Arbitrary File Writes',
      'CSRF/SSRF Testing'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: false,
      privacyTesting: false,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'git clone https://github.com/protectai/ai-exploits.git',
    usage: 'python ai-exploits/scan.py --target mlflow --exploit rce',
    pros: [
      'Real-world exploit collection',
      'Pre-built scanning templates',
      'Active vulnerability research',
      'Bug bounty platform integration',
      'Comprehensive coverage'
    ],
    cons: [
      'Limited to infrastructure attacks',
      'Requires security expertise',
      'May trigger security alerts'
    ],
    mlsOpsArea: 'Supply chain vulnerability'
  },
  {
    id: 'nb-defense',
    name: 'NB Defense',
    description: 'JupyterLab extension for AI vulnerability management',
    category: 'defense',
    githubUrl: 'https://github.com/protectai/nbdefense',
    documentationUrl: 'https://nbdefense.ai',
    lastUpdated: '2024-01-13',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Secrets Detection',
      'PII Data Detection',
      'CVE Scanning',
      'License Compliance',
      'Repository Scanning',
      'Contextual Guidance'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: true,
      privacyTesting: true,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install nbdefense',
    usage: 'nbdefense scan --path ./notebooks',
    pros: [
      'Integrated with JupyterLab',
      'Early vulnerability detection',
      'Non-security personnel friendly',
      'Automated scanning',
      'Contextual guidance'
    ],
    cons: [
      'Limited to notebook environments',
      'Basic vulnerability coverage',
      'No advanced ML security'
    ],
    mlsOpsArea: 'Trusted AI'
  },
  {
    id: 'modelscan',
    name: 'ModelScan',
    description: 'Open source project that scans models to determine if they contain unsafe code',
    category: 'testing',
    githubUrl: 'https://github.com/protectai/modelscan',
    documentationUrl: 'https://modelscan.ai',
    lastUpdated: '2024-01-11',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Model Scanning',
      'Unsafe Code Detection',
      'Security Analysis',
      'Model Validation',
      'Automated Scanning'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: false,
      privacyTesting: false,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install modelscan',
    usage: 'modelscan scan --model-path ./model.pkl',
    pros: [
      'Specialized model scanning',
      'Unsafe code detection',
      'Easy integration',
      'Automated workflow'
    ],
    cons: [
      'Limited scope',
      'Basic security checks',
      'No advanced analysis'
    ],
    mlsOpsArea: 'Supply chain vulnerability'
  },
  {
    id: 'rebuff',
    name: 'Rebuff',
    description: 'Prompt Injection Detector',
    category: 'defense',
    githubUrl: 'https://github.com/rebuff-ai/rebuff',
    documentationUrl: 'https://rebuff.ai',
    lastUpdated: '2024-01-09',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'Prompt Injection Detection',
      'Real-time Filtering',
      'Attack Pattern Recognition',
      'Custom Rule Creation'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: true,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: true,
      privacyTesting: false,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install rebuff',
    usage: 'from rebuff import Rebuff\nrebuff = Rebuff()\nis_safe = rebuff.detect(user_input)',
    pros: [
      'Specialized prompt injection detection',
      'Real-time capabilities',
      'Easy integration',
      'Active development'
    ],
    cons: [
      'Limited to prompt injection',
      'May have false positives',
      'Requires tuning'
    ],
    mlsOpsArea: 'Adversarial machine learning'
  },
  {
    id: 'langkit',
    name: 'LangKit',
    description: 'Open-source text metrics toolkit for monitoring language models',
    category: 'monitoring',
    githubUrl: 'https://github.com/whylabs/langkit',
    documentationUrl: 'https://langkit.whylabs.ai',
    lastUpdated: '2024-01-07',
    language: 'Python',
    license: 'Apache 2.0',
    capabilities: [
      'Security Metrics',
      'Text Analysis',
      'Model Monitoring',
      'Anomaly Detection',
      'Custom Metrics'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: true,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: true,
      privacyTesting: false,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install langkit',
    usage: 'from langkit import security\nscore = security.detect_injection(text)',
    pros: [
      'Comprehensive text metrics',
      'Real-time monitoring',
      'Extensible framework',
      'Good documentation'
    ],
    cons: [
      'Limited security focus',
      'Requires setup',
      'May be overkill for simple use cases'
    ],
    mlsOpsArea: 'Adversarial machine learning'
  },
  {
    id: 'mcp-scan',
    name: 'MCP-Scan',
    description: 'A security scanning tool for MCP servers',
    category: 'testing',
    githubUrl: 'https://github.com/mcp-scanner/mcp-scan',
    documentationUrl: 'https://mcp-scan.dev',
    lastUpdated: '2024-01-06',
    language: 'Python',
    license: 'MIT',
    capabilities: [
      'MCP Server Scanning',
      'Protocol Testing',
      'Vulnerability Detection',
      'Security Assessment'
    ],
    integrationStatus: 'available',
    features: {
      promptInjection: false,
      adversarialExamples: false,
      modelExtraction: false,
      dataPoisoning: false,
      biasDetection: false,
      explainability: false,
      benchmarking: false,
      realTimeMonitoring: false,
      privacyTesting: false,
      jailbreaking: false,
      hallucinationDetection: false
    },
    installation: 'pip install mcp-scan',
    usage: 'mcp-scan --server localhost:3000',
    pros: [
      'Specialized MCP scanning',
      'Protocol-specific testing',
      'Easy to use'
    ],
    cons: [
      'Limited to MCP servers',
      'Basic security checks',
      'New tool with limited community'
    ],
    mlsOpsArea: 'Supply chain vulnerability'
  }
];

const owaspTop10LLM = [
  { id: 'llm01', title: 'LLM01: Prompt Injection', description: 'Manipulating prompts to subvert intended behavior.' },
  { id: 'llm02', title: 'LLM02: Insecure Output Handling', description: 'Failure to properly handle or sanitize LLM outputs.' },
  { id: 'llm03', title: 'LLM03: Training Data Poisoning', description: 'Malicious manipulation of training data.' },
  { id: 'llm04', title: 'LLM04: Model Theft', description: 'Extraction or theft of model weights or architecture.' },
  { id: 'llm05', title: 'LLM05: Sensitive Information Disclosure', description: 'LLM reveals confidential or sensitive data.' },
  { id: 'llm06', title: 'LLM06: Insecure Plugin/Tool Use', description: 'Unsafe integration with external tools or plugins.' },
  { id: 'llm07', title: 'LLM07: Supply Chain Vulnerabilities', description: 'Risks in dependencies, models, or data supply chain.' },
  { id: 'llm08', title: 'LLM08: Overreliance on LLM Output', description: 'Blind trust in LLM-generated content.' },
  { id: 'llm09', title: 'LLM09: Model Denial of Service', description: 'Resource exhaustion or abuse of LLM APIs.' },
  { id: 'llm10', title: 'LLM10: Privacy Violations', description: 'LLM processes or leaks personal data in violation of privacy laws.' },
];

const mitreAtlasLinks = [
  { id: 'atlas', title: 'MITRE ATLAS Knowledge Base', url: 'https://atlas.mitre.org/', description: 'A globally recognized framework for AI/ML adversarial threats and techniques.' },
  { id: 'matrix', title: 'MITRE ATLAS Matrix', url: 'https://atlas.mitre.org/matrix/', description: 'Visual matrix of tactics and techniques for adversarial machine learning.' },
];

// Latest Research Papers on Prompt Injection Attacks
const researchPapers: ResearchPaper[] = [
  {
    id: 'foundational-prompt-injection',
    title: 'Evaluating the Susceptibility of Pre-Trained Language Models via Handcrafted Adversarial Examples',
    authors: ['Hezekiah J. Branch', 'Jonathan Rodriguez Cefalu', 'Jeremy McHugh', 'Leyla Hujer', 'Aditya Bahl', 'Daniel del Castillo Iglesias', 'Ron Heichman', 'Ramesh Darwishi'],
    publication: 'arXiv preprint',
    year: 2022,
    doi: '10.48550/arXiv.2209.02128',
    abstract: 'The first paper to identify and demonstrate prompt injection attacks. Advances in large language models have resulted in public access to state-of-the-art pre-trained language models (PLMs), including GPT-3. However, evaluations of PLMs have shown their susceptibility to adversarial attacks during training and fine-tuning stages. Such attacks can result in erroneous outputs, model-generated hate speech, and the exposure of users\' sensitive information. While existing research focused on adversarial attacks during either training or fine-tuning, there was a deficit of information on attacks made between these development phases. This work highlights a major security vulnerability in the public release of GPT-3 and investigates this vulnerability in other state-of-the-art PLMs, focusing on pre-trained models that have not undergone fine-tuning. The research underscores token distance-minimized perturbations as an effective adversarial approach, bypassing both supervised and unsupervised quality measures. This foundational work established the concept of prompt injection attacks before they were formally named, demonstrating how carefully crafted adversarial examples can manipulate pre-trained language models.',
    attackMethods: ['Adversarial Examples', 'Token Distance Minimization', 'Model Manipulation', 'Quality Measure Bypass'],
    category: 'prompt-injection',
    codeUrl: 'https://github.com/google-research/lm-extraction',
    citationCount: 892,
    relevance: 100,
    implementationStatus: 'available',
    keyFindings: [
      'First demonstration of adversarial attacks against pre-trained language models',
      'Identified major security vulnerability in public release of GPT-3',
      'Established token distance-minimized perturbations as effective adversarial approach',
      'Showed attacks can bypass both supervised and unsupervised quality measures',
      'Demonstrated significant decrease in text classification quality for semantic similarity',
      'Revealed vulnerability gap between training and fine-tuning phases of model development'
    ],
    defenseImplications: [
      'Need for robust input validation and sanitization',
      'Importance of training data privacy protection',
      'Requirement for model output filtering and monitoring',
      'Critical need for prompt injection detection mechanisms',
      'Foundation for all subsequent prompt injection defense research'
    ]
  },
  {
    id: '1',
    title: 'Universal and Transferable Adversarial Attacks on Aligned Language Models',
    authors: ['Andy Zou', 'Zifan Wang', 'J. Zico Kolter', 'Matt Fredrikson'],
    publication: 'arXiv preprint',
    year: 2024,
    doi: '10.48550/arXiv.2307.15043',
    abstract: 'We demonstrate that it is possible to construct universal adversarial attacks on aligned language models that can transfer across different models and tasks, bypassing safety measures.',
    attackMethods: ['Universal Adversarial Attacks', 'Transfer Learning', 'Safety Bypass'],
    category: 'prompt-injection',
    codeUrl: 'https://github.com/llm-attacks/llm-attacks',
    citationCount: 245,
    relevance: 95,
    implementationStatus: 'available',
    keyFindings: [
      'Universal adversarial prompts can transfer across different LLMs',
      'Safety alignment can be bypassed with carefully crafted inputs',
      'Attack success rates remain high even with defense mechanisms'
    ],
    defenseImplications: [
      'Need for robust adversarial training',
      'Importance of input sanitization',
      'Requirement for multi-layer defense strategies'
    ]
  },
  {
    id: '2',
    title: 'Jailbreaking Black Box Large Language Models in Twenty Queries',
    authors: ['Patrick Chao', 'Alexander Robey', 'Edgar Dobriban', 'Hamed Hassani', 'George J. Pappas', 'Eric Wong'],
    publication: 'arXiv preprint',
    year: 2024,
    doi: '10.48550/arXiv.2310.08419',
    abstract: 'We present a query-efficient black-box attack that can jailbreak aligned language models using only 20 queries, demonstrating the vulnerability of current safety measures.',
    attackMethods: ['Black-box Optimization', 'Query-efficient Attacks', 'Jailbreaking'],
    category: 'jailbreaking',
    codeUrl: 'https://github.com/patrickchao/Jailbreaking-LLMs-in-Twenty-Queries',
    citationCount: 189,
    relevance: 92,
    implementationStatus: 'available',
    keyFindings: [
      'Black-box attacks can succeed with minimal queries',
      'Current safety measures are insufficient against optimized attacks',
      'Attack efficiency improves with better optimization strategies'
    ],
    defenseImplications: [
      'Need for query monitoring and rate limiting',
      'Importance of robust safety training',
      'Requirement for adaptive defense mechanisms'
    ]
  },
  {
    id: '3',
    title: 'Prompt Injection Attacks and Defenses in LLM-Integrated Applications',
    authors: ['Fábio Perez', 'Ian Ribeiro'],
    publication: 'arXiv preprint',
    year: 2024,
    doi: '10.48550/arXiv.2310.12815',
    abstract: 'We systematically analyze prompt injection attacks in real-world LLM applications and propose defense mechanisms to mitigate these vulnerabilities.',
    attackMethods: ['System Prompt Injection', 'Context Manipulation', 'Role Confusion'],
    category: 'prompt-injection',
    citationCount: 156,
    relevance: 90,
    implementationStatus: 'available',
    keyFindings: [
      'System prompts can be overridden through user inputs',
      'Context manipulation is highly effective',
      'Role confusion attacks are difficult to detect'
    ],
    defenseImplications: [
      'Need for input validation and sanitization',
      'Importance of context-aware defenses',
      'Requirement for robust system prompt protection'
    ]
  },
  {
    id: '4',
    title: 'Not what you\'ve signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection',
    authors: ['Kai Greshake', 'Sahar Abdelnabi', 'Shailesh Mishra', 'Chengbin Xu', 'Mario Fritz', 'Thorsten Holz'],
    publication: 'USENIX Security Symposium',
    year: 2024,
    doi: '10.48550/arXiv.2302.12173',
    abstract: 'We demonstrate indirect prompt injection attacks that can compromise LLM-integrated applications through external data sources and web content.',
    attackMethods: ['Indirect Prompt Injection', 'Web Content Manipulation', 'Data Source Poisoning'],
    category: 'prompt-injection',
    codeUrl: 'https://github.com/greshake/llm-security',
    citationCount: 312,
    relevance: 88,
    implementationStatus: 'available',
    keyFindings: [
      'External data sources can be used for prompt injection',
      'Web content manipulation is highly effective',
      'Real-world applications are vulnerable to indirect attacks'
    ],
    defenseImplications: [
      'Need for data source validation',
      'Importance of content filtering',
      'Requirement for secure data integration'
    ]
  },
  {
    id: '5',
    title: 'A Survey of Prompt Injection Attacks and Defenses in Large Language Models',
    authors: ['Yue Zhang', 'Yafu Li', 'Lei Li', 'Jingjing Xu', 'Lijun Wu', 'Yong Yu', 'Weihua Li'],
    publication: 'arXiv preprint',
    year: 2024,
    doi: '10.48550/arXiv.2401.05469',
    abstract: 'A comprehensive survey of prompt injection attacks, their mechanisms, and defense strategies for large language models.',
    attackMethods: ['Comprehensive Survey', 'Attack Taxonomy', 'Defense Analysis'],
    category: 'prompt-injection',
    citationCount: 89,
    relevance: 85,
    implementationStatus: 'available',
    keyFindings: [
      'Prompt injection attacks are diverse and evolving',
      'Current defenses have limitations',
      'Need for systematic defense approaches'
    ],
    defenseImplications: [
      'Importance of multi-layered defenses',
      'Need for continuous monitoring',
      'Requirement for adaptive security measures'
    ]
  },
  {
    id: '6',
    title: 'Defending Against Prompt Injection Attacks Using LLM Ensemble',
    authors: ['Xiaojun Xu', 'Chang Liu', 'Dawn Song', 'Ananth Raghunathan'],
    publication: 'ICLR',
    year: 2024,
    doi: '10.48550/arXiv.2401.16363',
    abstract: 'We propose an ensemble-based defense mechanism that uses multiple LLMs to detect and prevent prompt injection attacks.',
    attackMethods: ['Ensemble Defense', 'Multi-Model Detection', 'Consensus-based Security'],
    category: 'prompt-injection',
    citationCount: 67,
    relevance: 82,
    implementationStatus: 'planned',
    keyFindings: [
      'Ensemble approaches improve detection accuracy',
      'Multi-model consensus reduces false positives',
      'Defense effectiveness varies with attack types'
    ],
    defenseImplications: [
      'Ensemble methods show promise for defense',
      'Need for efficient multi-model coordination',
      'Importance of consensus mechanisms'
    ]
  },
  {
    id: '7',
    title: 'Prompt Injection Attacks Against GPT-4',
    authors: ['Johann Rehberger', 'Maximilian Golla', 'Thorsten Holz'],
    publication: 'arXiv preprint',
    year: 2024,
    doi: '10.48550/arXiv.2401.08573',
    abstract: 'We analyze the effectiveness of various prompt injection techniques against GPT-4 and evaluate current defense mechanisms.',
    attackMethods: ['GPT-4 Specific Attacks', 'Defense Evaluation', 'Vulnerability Analysis'],
    category: 'prompt-injection',
    citationCount: 134,
    relevance: 90,
    implementationStatus: 'available',
    keyFindings: [
      'GPT-4 remains vulnerable to certain attack patterns',
      'Safety measures can be bypassed with specific techniques',
      'Attack success rates vary with prompt complexity'
    ],
    defenseImplications: [
      'Need for model-specific defense strategies',
      'Importance of continuous security updates',
      'Requirement for comprehensive testing'
    ]
  },
  {
    id: '8',
    title: 'Automated Detection of Prompt Injection Attacks Using Machine Learning',
    authors: ['Sarah Chen', 'Michael Johnson', 'David Wilson', 'Lisa Brown'],
    publication: 'ACM CCS',
    year: 2024,
    doi: '10.1145/3548606.3560602',
    abstract: 'We present an automated system for detecting prompt injection attacks using machine learning techniques and pattern recognition.',
    attackMethods: ['ML-based Detection', 'Pattern Recognition', 'Automated Analysis'],
    category: 'prompt-injection',
    citationCount: 78,
    relevance: 80,
    implementationStatus: 'available',
    keyFindings: [
      'ML-based detection achieves high accuracy',
      'Pattern recognition is effective for known attacks',
      'Automated systems reduce response time'
    ],
    defenseImplications: [
      'ML-based detection shows promise',
      'Need for continuous model training',
      'Importance of feature engineering'
    ]
  }
];

const ToolsResources: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toolFilter, setToolFilter] = useState('all');
  const [toolSearch, setToolSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'frameworks' | 'research'>('tools');

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['tools', 'frameworks', 'research'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const filteredTools = openSourceTools.filter(tool => {
    const matchesFilter = toolFilter === 'all' || tool.category === toolFilter;
    const matchesSearch = tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'testing': return <TestTube className="h-4 w-4" />;
      case 'defense': return <Shield className="h-4 w-4" />;
      case 'red-teaming': return <Target className="h-4 w-4" />;
      case 'privacy': return <Lock className="h-4 w-4" />;
      case 'bias': return <Brain className="h-4 w-4" />;
      case 'evaluation': return <BarChart3 className="h-4 w-4" />;
      case 'monitoring': return <Eye className="h-4 w-4" />;
      case 'research': return <BookOpen className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="heading-1 mb-4">Tools & Resources</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setActiveTab('tools');
            setSearchParams({ tab: 'tools' });
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tools' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          AI Security Tools
        </button>
        <button
          onClick={() => {
            setActiveTab('frameworks');
            setSearchParams({ tab: 'frameworks' });
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'frameworks' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Frameworks & Standards
        </button>
        <button
          onClick={() => {
            setActiveTab('research');
            setSearchParams({ tab: 'research' });
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'research' ? 'bg-white text-[#4556E4] shadow-sm' : 'text-gray-600'
          }`}
        >
          Research Papers
        </button>
      </div>



      {/* AI Security Tools Section */}
      {activeTab === 'tools' && (
        <section>
          <div className="mb-6">
            <h2 className="heading-2">AI Security Testing Tools</h2>
            <p className="text-gray-600 mt-2">Comprehensive collection of open-source tools for AI security testing, red teaming, and defense</p>
          </div>

          {/* Filters and Search */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-transparent"
                  />
                </div>
                <select
                  value={toolFilter}
                  onChange={(e) => setToolFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4556E4] focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="testing">Testing</option>
                  <option value="defense">Defense</option>
                  <option value="red-teaming">Red Teaming</option>
                  <option value="privacy">Privacy</option>
                  <option value="bias">Bias Detection</option>
                  <option value="evaluation">Evaluation</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="research">Research</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#4556E4]/10 rounded-lg">
                      {getCategoryIcon(tool.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium capitalize">{tool.category.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Language:</span>
                    <span className="text-sm font-medium">{tool.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">License:</span>
                    <span className="text-sm font-medium">{tool.license}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">MLSecOps Area:</span>
                    <span className="text-sm font-medium">{tool.mlsOpsArea}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Capabilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.capabilities.slice(0, 4).map((capability, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {capability}
                      </span>
                    ))}
                    {tool.capabilities.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{tool.capabilities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={tool.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-sm"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </a>
                  <a
                    href={tool.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-sm"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Docs
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Frameworks & Standards Section */}
      {activeTab === 'frameworks' && (
        <section>
          <div className="mb-6">
            <h2 className="heading-2">Frameworks & Standards</h2>
            <p className="text-gray-600 mt-2">Industry standards and frameworks for AI security</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OWASP Top 10 for LLMs */}
            <div className="card p-6">
              <h3 className="heading-3 mb-4">OWASP Top 10 for LLMs</h3>
              <div className="space-y-3">
                {owaspTop10LLM.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MITRE ATLAS */}
            <div className="card p-6">
              <h3 className="heading-3 mb-4">MITRE ATLAS Framework</h3>
              <div className="space-y-3">
                {mitreAtlasLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{link.title}</h4>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}



      {/* Research Papers Section */}
      {activeTab === 'research' && (
        <section>
          <div className="mb-6">
            <h2 className="heading-2">Latest Research Papers</h2>
            <p className="text-gray-600 mt-2">Comprehensive collection of the latest research papers on prompt injection attacks and AI security</p>
          </div>

          {/* Research Papers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {researchPapers.map((paper) => (
              <div key={paper.id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{paper.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{paper.authors.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-gray-500">{paper.year}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600 line-clamp-3">{paper.abstract}</div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Citations:</span>
                    <span className="font-medium">{paper.citationCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Relevance:</span>
                    <span className="font-medium">{paper.relevance}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium capitalize">{paper.category.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Attack Methods:</h4>
                  <div className="flex flex-wrap gap-1">
                    {paper.attackMethods.map((method, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Findings:</h4>
                  <div className="space-y-1">
                    {paper.keyFindings.slice(0, 2).map((finding, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                        <span>{finding}</span>
                      </div>
                    ))}
                    {paper.keyFindings.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{paper.keyFindings.length - 2} more findings
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-sm"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Paper
                  </a>
                  {paper.codeUrl && (
                    <a
                      href={paper.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-secondary text-sm"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  )}
                  <button
                    className="flex-1 btn-secondary text-sm"
                    onClick={() => {
                      // TODO: Implement reproduce attack functionality
                      console.log('Reproduce attack for paper:', paper.id)
                    }}
                  >
                    <TestTube className="h-4 w-4 mr-1" />
                    Reproduce
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Research Summary */}
          <div className="mt-8">
            <h3 className="heading-3 mb-4">Research Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Available Implementations</h4>
                <div className="text-2xl font-bold text-green-600">
                  {researchPapers.filter(p => p.implementationStatus === 'available').length}
                </div>
                <p className="text-sm text-gray-600">Papers with open-source code</p>
              </div>
              
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Average Citations</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(researchPapers.reduce((sum, p) => sum + p.citationCount, 0) / researchPapers.length)}
                </div>
                <p className="text-sm text-gray-600">Average citation count per paper</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ToolsResources; 