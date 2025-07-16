# Prompt Injector - Technical Architecture & System Diagrams

> **Architecture Overview:**
> This document provides comprehensive technical diagrams and architectural details for the Prompt Injector AI security testing platform. It covers system architecture, data flow, component interactions, and implementation patterns for both current and planned features.

---

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Application Architecture](#application-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Component Architecture](#component-architecture)
5. [Attack Engine Architecture](#attack-engine-architecture)
6. [AI Model Integration](#ai-model-integration)
7. [Security Architecture](#security-architecture)
8. [Development Architecture](#development-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [Future Architecture](#future-architecture)

---

## System Architecture Overview

### High-Level System Architecture

```mermaid
graph TB
    subgraph "Desktop Application Layer"
        UI["React UI Components"]
        MainProcess["Electron Main Process"]
        RendererProcess["Electron Renderer Process"]
    end

    subgraph "Core Services Layer"
        AttackEngine["Attack Engine"]
        ModelManager["Model Manager"]
        PayloadManager["Payload Manager"]
        SemanticGuardian["Semantic Guardian"]
        ConfigManager["Config Manager"]
        ActivityLogger["Activity Logger"]
    end

    subgraph "Integration Layer"
        AIProviders["AI Provider APIs"]
        AgentFrameworks["Agent Frameworks"]
        MCPProtocol["MCP Protocol"]
        LocalModels["Local Models (Ollama)"]
    end

    subgraph "Data Layer"
        SQLiteDB["SQLite Database"]
        FileSystem["File System Storage"]
        ConfigFiles["Configuration Files"]
        PayloadLibrary["Payload Library"]
    end

    UI --> MainProcess
    MainProcess --> RendererProcess
    MainProcess --> AttackEngine
    MainProcess --> ModelManager
    MainProcess --> PayloadManager
    MainProcess --> SemanticGuardian
    MainProcess --> ConfigManager
    MainProcess --> ActivityLogger

    AttackEngine --> AIProviders
    AttackEngine --> AgentFrameworks
    AttackEngine --> MCPProtocol
    AttackEngine --> LocalModels

    ModelManager --> SQLiteDB
    PayloadManager --> PayloadLibrary
    ConfigManager --> ConfigFiles
    ActivityLogger --> FileSystem

    classDef complete fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef inProgress fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef planned fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:#fff

    class UI,MainProcess,RendererProcess,AttackEngine,ModelManager,PayloadManager,ConfigManager,ActivityLogger,SQLiteDB,FileSystem,ConfigFiles,PayloadLibrary complete
    class SemanticGuardian,AIProviders,LocalModels inProgress
    class AgentFrameworks,MCPProtocol planned
```

### Technology Stack Architecture

```mermaid
graph LR
    subgraph "Frontend Stack"
        React["React 18"]
        TypeScript["TypeScript"]
        TailwindCSS["Tailwind CSS"]
        Lucide["Lucide React Icons"]
    end

    subgraph "Desktop Framework"
        Electron["Electron 25"]
        NodeJS["Node.js 18+"]
        IPC["Inter-Process Communication"]
    end

    subgraph "Build & Development"
        Vite["Vite Build Tool"]
        ESLint["ESLint"]
        Prettier["Prettier"]
        Jest["Jest Testing"]
    end

    subgraph "Backend Services"
        Express["Express.js"]
        SQLite["SQLite Database"]
        FileStorage["File System"]
        Crypto["Cryptography"]
    end

    subgraph "AI Integration"
        OpenAI["OpenAI SDK"]
        Anthropic["Anthropic SDK"]
        Google["Google AI SDK"]
        Ollama["Ollama API"]
    end

    React --> Electron
    TypeScript --> Vite
    TailwindCSS --> React
    Electron --> NodeJS
    NodeJS --> Express
    Express --> SQLite
    Express --> OpenAI
    Express --> Anthropic
    Express --> Google
    Express --> Ollama

    classDef frontend fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef desktop fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef build fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef backend fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef ai fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff

    class React,TypeScript,TailwindCSS,Lucide frontend
    class Electron,NodeJS,IPC desktop
    class Vite,ESLint,Prettier,Jest build
    class Express,SQLite,FileStorage,Crypto backend
    class OpenAI,Anthropic,Google,Ollama ai
```

## Application Architecture

### Electron Architecture Pattern

```mermaid
graph TB
    subgraph "Main Process (Node.js)"
        MainJS["main.ts"]
        PreloadJS["preload.ts"]
        MainServices["Main Process Services"]
        FileAccess["File System Access"]
        NetworkAccess["Network Access"]
    end

    subgraph "Renderer Process (Chromium)"
        ReactApp["React Application"]
        Components["UI Components"]
        Pages["Application Pages"]
        ClientServices["Client Services"]
    end

    subgraph "IPC Communication"
        IPC_Main["IPC Main"]
        IPC_Renderer["IPC Renderer"]
        ContextBridge["Context Bridge"]
    end

    MainJS --> PreloadJS
    PreloadJS --> ContextBridge
    ContextBridge --> IPC_Renderer
    IPC_Renderer --> ReactApp
    ReactApp --> Components
    Components --> Pages
    Pages --> ClientServices

    MainServices --> IPC_Main
    IPC_Main --> IPC_Renderer
    MainServices --> FileAccess
    MainServices --> NetworkAccess

    classDef main fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef renderer fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef ipc fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff

    class MainJS,PreloadJS,MainServices,FileAccess,NetworkAccess main
    class ReactApp,Components,Pages,ClientServices renderer
    class IPC_Main,IPC_Renderer,ContextBridge ipc
```

### Component Architecture

```mermaid
graph TB
    subgraph "Pages Layer"
        Dashboard["Dashboard"]
        Settings["Settings"]
        Testing["Testing"]
        Results["Results"]
        RedTeaming["Red Teaming"]
    end

    subgraph "Components Layer"
        Layout["Layout"]
        Modal["Modal"]
        PayloadBrowser["Payload Browser"]
        TestingWizard["Testing Wizard"]
        ResultsDisplay["Results Display"]
    end

    subgraph "Services Layer"
        AttackEngine["Attack Engine"]
        ModelManager["Model Manager"]
        PayloadManager["Payload Manager"]
        ConfigManager["Config Manager"]
        ActivityLogger["Activity Logger"]
    end

    subgraph "Types Layer"
        Interfaces["TypeScript Interfaces"]
        Models["Data Models"]
        Enums["Enumerations"]
    end

    Dashboard --> Layout
    Settings --> Layout
    Testing --> Layout
    Results --> Layout
    RedTeaming --> Layout

    Layout --> Modal
    Testing --> PayloadBrowser
    Testing --> TestingWizard
    Results --> ResultsDisplay

    PayloadBrowser --> PayloadManager
    TestingWizard --> AttackEngine
    ResultsDisplay --> ModelManager
    Settings --> ConfigManager
    Dashboard --> ActivityLogger

    AttackEngine --> Interfaces
    ModelManager --> Models
    PayloadManager --> Enums

    classDef pages fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef components fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef services fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef types fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class Dashboard,Settings,Testing,Results,RedTeaming pages
    class Layout,Modal,PayloadBrowser,TestingWizard,ResultsDisplay components
    class AttackEngine,ModelManager,PayloadManager,ConfigManager,ActivityLogger services
    class Interfaces,Models,Enums types
```

## Data Flow Diagrams

### Attack Testing Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as React UI
    participant Main as Main Process
    participant Engine as Attack Engine
    participant Provider as AI Provider
    participant Guardian as Semantic Guardian
    participant Logger as Activity Logger

    User->>UI: Configure test parameters
    UI->>Main: Send test configuration
    Main->>Engine: Initialize attack test
    Engine->>Provider: Send attack payload
    Provider->>Engine: Return AI response
    Engine->>Guardian: Analyze response
    Guardian->>Engine: Return detection result
    Engine->>Logger: Log test activity
    Engine->>Main: Return test results
    Main->>UI: Send results to display
    UI->>User: Display test results
```

### Model Configuration Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Settings as Settings UI
    participant Main as Main Process
    participant Manager as Model Manager
    participant DB as SQLite Database
    participant Provider as AI Provider

    User->>Settings: Add new model
    Settings->>Main: Send model configuration
    Main->>Manager: Validate configuration
    Manager->>Provider: Test connection
    Provider->>Manager: Return connection status
    Manager->>DB: Store configuration
    DB->>Manager: Confirm storage
    Manager->>Main: Return success status
    Main->>Settings: Update UI
    Settings->>User: Show success message
```

### Payload Management Data Flow

```mermaid
graph LR
    subgraph "Payload Sources"
        JSON["JSON Files"]
        UserInput["User Input"]
        Community["Community Contributions"]
    end

    subgraph "Processing"
        Validator["Schema Validator"]
        Parser["Payload Parser"]
        Categorizer["Categorizer"]
    end

    subgraph "Storage"
        Library["Payload Library"]
        Database["SQLite Database"]
        Cache["Memory Cache"]
    end

    subgraph "Usage"
        Browser["Payload Browser"]
        Engine["Attack Engine"]
        Export["Export System"]
    end

    JSON --> Validator
    UserInput --> Validator
    Community --> Validator
    Validator --> Parser
    Parser --> Categorizer
    Categorizer --> Library
    Library --> Database
    Library --> Cache
    Cache --> Browser
    Cache --> Engine
    Database --> Export

    classDef source fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef process fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef storage fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef usage fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class JSON,UserInput,Community source
    class Validator,Parser,Categorizer process
    class Library,Database,Cache storage
    class Browser,Engine,Export usage
```

## Component Architecture

### Attack Engine Architecture

```mermaid
graph TB
    subgraph "Attack Engine Core"
        Controller["Attack Controller"]
        Executor["Test Executor"]
        Scheduler["Test Scheduler"]
        Coordinator["Result Coordinator"]
    end

    subgraph "Payload Processing"
        PayloadLoader["Payload Loader"]
        PayloadMutator["Payload Mutator"]
        PayloadValidator["Payload Validator"]
    end

    subgraph "Execution Layer"
        ModelAdapter["Model Adapter"]
        ResponseHandler["Response Handler"]
        ErrorHandler["Error Handler"]
    end

    subgraph "Detection Layer"
        HeuristicDetector["Heuristic Detector"]
        MLDetector["ML Detector (Future)"]
        PatternMatcher["Pattern Matcher"]
    end

    subgraph "Result Processing"
        ResultAnalyzer["Result Analyzer"]
        EvidenceCollector["Evidence Collector"]
        ReportGenerator["Report Generator"]
    end

    Controller --> PayloadLoader
    Controller --> Executor
    Executor --> Scheduler
    Scheduler --> ModelAdapter
    ModelAdapter --> ResponseHandler
    ResponseHandler --> HeuristicDetector
    ResponseHandler --> MLDetector
    ResponseHandler --> PatternMatcher
    HeuristicDetector --> ResultAnalyzer
    MLDetector --> ResultAnalyzer
    PatternMatcher --> ResultAnalyzer
    ResultAnalyzer --> EvidenceCollector
    EvidenceCollector --> ReportGenerator
    ReportGenerator --> Coordinator

    PayloadLoader --> PayloadMutator
    PayloadMutator --> PayloadValidator
    PayloadValidator --> Executor

    ResponseHandler --> ErrorHandler
    ErrorHandler --> Coordinator

    classDef core fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef payload fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef execution fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef detection fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef result fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff

    class Controller,Executor,Scheduler,Coordinator core
    class PayloadLoader,PayloadMutator,PayloadValidator payload
    class ModelAdapter,ResponseHandler,ErrorHandler execution
    class HeuristicDetector,MLDetector,PatternMatcher detection
    class ResultAnalyzer,EvidenceCollector,ReportGenerator result
```

### Model Manager Architecture

```mermaid
graph TB
    subgraph "Model Manager Core"
        Manager["Model Manager"]
        Registry["Model Registry"]
        Factory["Model Factory"]
        Validator["Model Validator"]
    end

    subgraph "Provider Adapters"
        OpenAIAdapter["OpenAI Adapter"]
        AnthropicAdapter["Anthropic Adapter"]
        GoogleAdapter["Google Adapter"]
        OllamaAdapter["Ollama Adapter"]
        XAIAdapter["xAI Adapter"]
    end

    subgraph "Model Operations"
        ConnectionTester["Connection Tester"]
        LoadBalancer["Load Balancer"]
        RateLimiter["Rate Limiter"]
        CacheManager["Cache Manager"]
    end

    subgraph "Configuration"
        ConfigLoader["Config Loader"]
        SecretManager["Secret Manager"]
        DefaultManager["Default Manager"]
    end

    Manager --> Registry
    Registry --> Factory
    Factory --> Validator
    Validator --> OpenAIAdapter
    Validator --> AnthropicAdapter
    Validator --> GoogleAdapter
    Validator --> OllamaAdapter
    Validator --> XAIAdapter

    OpenAIAdapter --> ConnectionTester
    AnthropicAdapter --> ConnectionTester
    GoogleAdapter --> ConnectionTester
    OllamaAdapter --> ConnectionTester
    XAIAdapter --> ConnectionTester

    ConnectionTester --> LoadBalancer
    LoadBalancer --> RateLimiter
    RateLimiter --> CacheManager

    Manager --> ConfigLoader
    ConfigLoader --> SecretManager
    SecretManager --> DefaultManager

    classDef core fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef adapters fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef operations fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef config fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class Manager,Registry,Factory,Validator core
    class OpenAIAdapter,AnthropicAdapter,GoogleAdapter,OllamaAdapter,XAIAdapter adapters
    class ConnectionTester,LoadBalancer,RateLimiter,CacheManager operations
    class ConfigLoader,SecretManager,DefaultManager config
```

## AI Model Integration

### AI Provider Integration Architecture

```mermaid
graph TB
    subgraph "Provider Interface Layer"
        ProviderInterface["Provider Interface"]
        ModelInterface["Model Interface"]
        ConfigInterface["Config Interface"]
    end

    subgraph "OpenAI Integration"
        OpenAIClient["OpenAI Client"]
        GPTModels["GPT Models"]
        OpenAIAuth["OpenAI Authentication"]
    end

    subgraph "Anthropic Integration"
        AnthropicClient["Anthropic Client"]
        ClaudeModels["Claude Models"]
        AnthropicAuth["Anthropic Authentication"]
    end

    subgraph "Google Integration"
        GoogleClient["Google Client"]
        GeminiModels["Gemini Models"]
        GoogleAuth["Google Authentication"]
    end

    subgraph "Local Integration"
        OllamaClient["Ollama Client"]
        LocalModels["Local Models"]
        LocalConfig["Local Configuration"]
    end

    subgraph "Common Services"
        RequestManager["Request Manager"]
        ResponseParser["Response Parser"]
        ErrorHandler["Error Handler"]
        RetryLogic["Retry Logic"]
    end

    ProviderInterface --> OpenAIClient
    ProviderInterface --> AnthropicClient
    ProviderInterface --> GoogleClient
    ProviderInterface --> OllamaClient

    OpenAIClient --> GPTModels
    OpenAIClient --> OpenAIAuth
    AnthropicClient --> ClaudeModels
    AnthropicClient --> AnthropicAuth
    GoogleClient --> GeminiModels
    GoogleClient --> GoogleAuth
    OllamaClient --> LocalModels
    OllamaClient --> LocalConfig

    OpenAIClient --> RequestManager
    AnthropicClient --> RequestManager
    GoogleClient --> RequestManager
    OllamaClient --> RequestManager

    RequestManager --> ResponseParser
    ResponseParser --> ErrorHandler
    ErrorHandler --> RetryLogic

    classDef interface fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef openai fill:#00A67E,stroke:#007A5A,stroke-width:2px,color:#fff
    classDef anthropic fill:#D97706,stroke:#B45309,stroke-width:2px,color:#fff
    classDef google fill:#4285F4,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef local fill:#6B7280,stroke:#4B5563,stroke-width:2px,color:#fff
    classDef services fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class ProviderInterface,ModelInterface,ConfigInterface interface
    class OpenAIClient,GPTModels,OpenAIAuth openai
    class AnthropicClient,ClaudeModels,AnthropicAuth anthropic
    class GoogleClient,GeminiModels,GoogleAuth google
    class OllamaClient,LocalModels,LocalConfig local
    class RequestManager,ResponseParser,ErrorHandler,RetryLogic services
```

### Agent Framework Integration (Planned)

```mermaid
graph TB
    subgraph "Framework Interface"
        AgentInterface["Agent Interface"]
        FrameworkAdapter["Framework Adapter"]
        TestRunner["Test Runner"]
    end

    subgraph "LangChain Integration"
        LangChainAdapter["LangChain Adapter"]
        ChainRunner["Chain Runner"]
        AgentExecutor["Agent Executor"]
    end

    subgraph "AutoGen Integration"
        AutoGenAdapter["AutoGen Adapter"]
        ConversationManager["Conversation Manager"]
        AgentOrchestrator["Agent Orchestrator"]
    end

    subgraph "CrewAI Integration"
        CrewAIAdapter["CrewAI Adapter"]
        TaskManager["Task Manager"]
        RoleManager["Role Manager"]
    end

    subgraph "MCP Integration"
        MCPAdapter["MCP Adapter"]
        ServerManager["Server Manager"]
        ClientManager["Client Manager"]
    end

    subgraph "Testing Framework"
        AgentTester["Agent Tester"]
        Instrumenter["Instrumenter"]
        Monitor["Monitor"]
    end

    AgentInterface --> LangChainAdapter
    AgentInterface --> AutoGenAdapter
    AgentInterface --> CrewAIAdapter
    AgentInterface --> MCPAdapter

    LangChainAdapter --> ChainRunner
    ChainRunner --> AgentExecutor
    AutoGenAdapter --> ConversationManager
    ConversationManager --> AgentOrchestrator
    CrewAIAdapter --> TaskManager
    TaskManager --> RoleManager
    MCPAdapter --> ServerManager
    ServerManager --> ClientManager

    FrameworkAdapter --> AgentTester
    AgentTester --> Instrumenter
    Instrumenter --> Monitor
    Monitor --> TestRunner

    classDef interface fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef langchain fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef autogen fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef crewai fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef mcp fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
    classDef testing fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#fff

    class AgentInterface,FrameworkAdapter,TestRunner interface
    class LangChainAdapter,ChainRunner,AgentExecutor langchain
    class AutoGenAdapter,ConversationManager,AgentOrchestrator autogen
    class CrewAIAdapter,TaskManager,RoleManager crewai
    class MCPAdapter,ServerManager,ClientManager mcp
    class AgentTester,Instrumenter,Monitor testing
```

## Security Architecture

### Security Model

```mermaid
graph TB
    subgraph "Security Layers"
        AppSecurity["Application Security"]
        DataSecurity["Data Security"]
        NetworkSecurity["Network Security"]
        StorageSecurity["Storage Security"]
    end

    subgraph "Authentication & Authorization"
        LocalAuth["Local Authentication"]
        SessionManager["Session Manager"]
        PermissionManager["Permission Manager"]
    end

    subgraph "Data Protection"
        Encryption["AES-256 Encryption"]
        KeyManager["Key Manager"]
        SecretStorage["Secret Storage"]
        DataSanitizer["Data Sanitizer"]
    end

    subgraph "Network Security"
        TLSHandler["TLS Handler"]
        CertValidator["Certificate Validator"]
        APIKeyManager["API Key Manager"]
        RateLimiter["Rate Limiter"]
    end

    subgraph "Audit & Monitoring"
        ActivityLogger["Activity Logger"]
        SecurityMonitor["Security Monitor"]
        AuditTrail["Audit Trail"]
        AlertSystem["Alert System"]
    end

    AppSecurity --> LocalAuth
    LocalAuth --> SessionManager
    SessionManager --> PermissionManager

    DataSecurity --> Encryption
    Encryption --> KeyManager
    KeyManager --> SecretStorage
    SecretStorage --> DataSanitizer

    NetworkSecurity --> TLSHandler
    TLSHandler --> CertValidator
    CertValidator --> APIKeyManager
    APIKeyManager --> RateLimiter

    StorageSecurity --> ActivityLogger
    ActivityLogger --> SecurityMonitor
    SecurityMonitor --> AuditTrail
    AuditTrail --> AlertSystem

    classDef security fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
    classDef auth fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef data fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef network fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef audit fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class AppSecurity,DataSecurity,NetworkSecurity,StorageSecurity security
    class LocalAuth,SessionManager,PermissionManager auth
    class Encryption,KeyManager,SecretStorage,DataSanitizer data
    class TLSHandler,CertValidator,APIKeyManager,RateLimiter network
    class ActivityLogger,SecurityMonitor,AuditTrail,AlertSystem audit
```

### Threat Model

```mermaid
graph TB
    subgraph "Threat Categories"
        InputThreats["Input Threats"]
        NetworkThreats["Network Threats"]
        DataThreats["Data Threats"]
        SystemThreats["System Threats"]
    end

    subgraph "Input Threats"
        PayloadInjection["Payload Injection"]
        ScriptInjection["Script Injection"]
        CommandInjection["Command Injection"]
    end

    subgraph "Network Threats"
        MITM["Man-in-the-Middle"]
        APIAbuse["API Abuse"]
        DataExfiltration["Data Exfiltration"]
    end

    subgraph "Data Threats"
        DataCorruption["Data Corruption"]
        UnauthorizedAccess["Unauthorized Access"]
        DataLeakage["Data Leakage"]
    end

    subgraph "System Threats"
        PrivilegeEscalation["Privilege Escalation"]
        CodeExecution["Code Execution"]
        SystemCompromise["System Compromise"]
    end

    subgraph "Mitigations"
        InputValidation["Input Validation"]
        TLSEncryption["TLS Encryption"]
        DataEncryption["Data Encryption"]
        SandboxIsolation["Sandbox Isolation"]
    end

    InputThreats --> PayloadInjection
    InputThreats --> ScriptInjection
    InputThreats --> CommandInjection

    NetworkThreats --> MITM
    NetworkThreats --> APIAbuse
    NetworkThreats --> DataExfiltration

    DataThreats --> DataCorruption
    DataThreats --> UnauthorizedAccess
    DataThreats --> DataLeakage

    SystemThreats --> PrivilegeEscalation
    SystemThreats --> CodeExecution
    SystemThreats --> SystemCompromise

    PayloadInjection --> InputValidation
    ScriptInjection --> InputValidation
    CommandInjection --> InputValidation
    MITM --> TLSEncryption
    APIAbuse --> TLSEncryption
    DataExfiltration --> TLSEncryption
    DataCorruption --> DataEncryption
    UnauthorizedAccess --> DataEncryption
    DataLeakage --> DataEncryption
    PrivilegeEscalation --> SandboxIsolation
    CodeExecution --> SandboxIsolation
    SystemCompromise --> SandboxIsolation

    classDef threats fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
    classDef input fill:#FF5722,stroke:#D84315,stroke-width:2px,color:#fff
    classDef network fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef data fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef system fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef mitigations fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff

    class InputThreats,NetworkThreats,DataThreats,SystemThreats threats
    class PayloadInjection,ScriptInjection,CommandInjection input
    class MITM,APIAbuse,DataExfiltration network
    class DataCorruption,UnauthorizedAccess,DataLeakage data
    class PrivilegeEscalation,CodeExecution,SystemCompromise system
    class InputValidation,TLSEncryption,DataEncryption,SandboxIsolation mitigations
```

## Development Architecture

### Development Environment

```mermaid
graph TB
    subgraph "Development Tools"
        VSCode["VS Code"]
        Git["Git VCS"]
        NodeJS["Node.js"]
        NPM["npm"]
    end

    subgraph "Build Pipeline"
        Vite["Vite"]
        TypeScript["TypeScript"]
        ESLint["ESLint"]
        Prettier["Prettier"]
    end

    subgraph "Testing Pipeline"
        Jest["Jest"]
        RTL["React Testing Library"]
        Cypress["Cypress (E2E)"]
        Coverage["Coverage Reports"]
    end

    subgraph "Quality Assurance"
        TypeCheck["Type Checking"]
        Linting["Code Linting"]
        Formatting["Code Formatting"]
        Security["Security Scanning"]
    end

    subgraph "CI/CD Pipeline"
        GitHub["GitHub Actions"]
        Testing["Automated Testing"]
        Building["Automated Building"]
        Deployment["Deployment"]
    end

    VSCode --> Git
    Git --> NodeJS
    NodeJS --> NPM
    NPM --> Vite
    Vite --> TypeScript
    TypeScript --> ESLint
    ESLint --> Prettier

    Jest --> RTL
    RTL --> Cypress
    Cypress --> Coverage

    TypeCheck --> TypeScript
    Linting --> ESLint
    Formatting --> Prettier
    Security --> GitHub

    GitHub --> Testing
    Testing --> Building
    Building --> Deployment

    classDef tools fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef build fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef testing fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef qa fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef cicd fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff

    class VSCode,Git,NodeJS,NPM tools
    class Vite,TypeScript,ESLint,Prettier build
    class Jest,RTL,Cypress,Coverage testing
    class TypeCheck,Linting,Formatting,Security qa
    class GitHub,Testing,Building,Deployment cicd
```

### Code Organization

```mermaid
graph TB
    subgraph "Source Structure"
        src["src/"]
        components["components/"]
        pages["pages/"]
        services["services/"]
        types["types/"]
        main["main/"]
        tests["__tests__/"]
    end

    subgraph "Components"
        Layout["Layout.tsx"]
        Modal["Modal.tsx"]
        PayloadBrowser["PayloadBrowser.tsx"]
        TestingWizard["TestingWizard.tsx"]
    end

    subgraph "Pages"
        Dashboard["Dashboard.tsx"]
        Settings["Settings.tsx"]
        Testing["Testing.tsx"]
        Results["Results.tsx"]
    end

    subgraph "Services"
        AttackEngine["attack-engine.ts"]
        ModelManager["model-manager.ts"]
        PayloadManager["payload-manager.ts"]
        ConfigManager["config-manager.ts"]
    end

    subgraph "Main Process"
        MainTS["main.ts"]
        PreloadTS["preload.ts"]
        MainServices["services/"]
    end

    src --> components
    src --> pages
    src --> services
    src --> types
    src --> main
    src --> tests

    components --> Layout
    components --> Modal
    components --> PayloadBrowser
    components --> TestingWizard

    pages --> Dashboard
    pages --> Settings
    pages --> Testing
    pages --> Results

    services --> AttackEngine
    services --> ModelManager
    services --> PayloadManager
    services --> ConfigManager

    main --> MainTS
    main --> PreloadTS
    main --> MainServices

    classDef structure fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef components fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef pages fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef services fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef mainprocess fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff

    class src,components,pages,services,types,main,tests structure
    class Layout,Modal,PayloadBrowser,TestingWizard components
    class Dashboard,Settings,Testing,Results pages
    class AttackEngine,ModelManager,PayloadManager,ConfigManager services
    class MainTS,PreloadTS,MainServices mainprocess
```

## Deployment Architecture

### Build Architecture

```mermaid
graph TB
    subgraph "Source Code"
        TypeScript["TypeScript Source"]
        React["React Components"]
        Styles["Tailwind CSS"]
        Assets["Static Assets"]
    end

    subgraph "Build Process"
        ViteBuild["Vite Build"]
        TypeScriptCompile["TypeScript Compile"]
        AssetOptimization["Asset Optimization"]
        Bundling["Code Bundling"]
    end

    subgraph "Electron Build"
        MainBuild["Main Process Build"]
        RendererBuild["Renderer Build"]
        AssetCopy["Asset Copy"]
        PackageJSON["Package Configuration"]
    end

    subgraph "Distribution"
        ElectronBuilder["Electron Builder"]
        macOSBuild["macOS Build"]
        WindowsBuild["Windows Build"]
        LinuxBuild["Linux Build"]
    end

    subgraph "Outputs"
        DMG["macOS DMG"]
        EXE["Windows EXE"]
        AppImage["Linux AppImage"]
        DEB["Linux DEB"]
    end

    TypeScript --> ViteBuild
    React --> ViteBuild
    Styles --> ViteBuild
    Assets --> ViteBuild

    ViteBuild --> TypeScriptCompile
    TypeScriptCompile --> AssetOptimization
    AssetOptimization --> Bundling

    Bundling --> MainBuild
    Bundling --> RendererBuild
    Assets --> AssetCopy
    PackageJSON --> ElectronBuilder

    MainBuild --> ElectronBuilder
    RendererBuild --> ElectronBuilder
    AssetCopy --> ElectronBuilder

    ElectronBuilder --> macOSBuild
    ElectronBuilder --> WindowsBuild
    ElectronBuilder --> LinuxBuild

    macOSBuild --> DMG
    WindowsBuild --> EXE
    LinuxBuild --> AppImage
    LinuxBuild --> DEB

    classDef source fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef build fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef electron fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef distribution fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef outputs fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff

    class TypeScript,React,Styles,Assets source
    class ViteBuild,TypeScriptCompile,AssetOptimization,Bundling build
    class MainBuild,RendererBuild,AssetCopy,PackageJSON electron
    class ElectronBuilder,macOSBuild,WindowsBuild,LinuxBuild distribution
    class DMG,EXE,AppImage,DEB outputs
```

### Distribution Architecture

```mermaid
graph TB
    subgraph "Release Process"
        GitHub["GitHub Repository"]
        Actions["GitHub Actions"]
        Release["GitHub Releases"]
        Artifacts["Release Artifacts"]
    end

    subgraph "Platform Builds"
        macOSRunner["macOS Runner"]
        WindowsRunner["Windows Runner"]
        LinuxRunner["Linux Runner"]
    end

    subgraph "Build Outputs"
        macOSAssets["macOS Assets"]
        WindowsAssets["Windows Assets"]
        LinuxAssets["Linux Assets"]
    end

    subgraph "Distribution"
        DirectDownload["Direct Download"]
        PackageManagers["Package Managers"]
        UpdateSystem["Update System"]
    end

    GitHub --> Actions
    Actions --> macOSRunner
    Actions --> WindowsRunner
    Actions --> LinuxRunner

    macOSRunner --> macOSAssets
    WindowsRunner --> WindowsAssets
    LinuxRunner --> LinuxAssets

    macOSAssets --> Release
    WindowsAssets --> Release
    LinuxAssets --> Release

    Release --> Artifacts
    Artifacts --> DirectDownload
    Artifacts --> PackageManagers
    Artifacts --> UpdateSystem

    classDef process fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef platforms fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef outputs fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef distribution fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class GitHub,Actions,Release,Artifacts process
    class macOSRunner,WindowsRunner,LinuxRunner platforms
    class macOSAssets,WindowsAssets,LinuxAssets outputs
    class DirectDownload,PackageManagers,UpdateSystem distribution
```

## Future Architecture

### Planned Features Architecture

```mermaid
graph TB
    subgraph "Phase 2: Advanced Detection"
        MLDetection["ML Detection"]
        VectorDB["Vector Database"]
        AdaptivePayloads["Adaptive Payloads"]
        AdvancedAnalytics["Advanced Analytics"]
    end

    subgraph "Phase 3: Agent Framework Testing"
        AgentFrameworks["Agent Frameworks"]
        MCPTesting["MCP Testing"]
        MultiAgentSystems["Multi-Agent Systems"]
        RealTimeMonitoring["Real-Time Monitoring"]
    end

    subgraph "Phase 4: Research Integration"
        AcademicBenchmarks["Academic Benchmarks"]
        ResearchPapers["Research Papers"]
        CommunityFeatures["Community Features"]
        PluginSystem["Plugin System"]
    end

    subgraph "Phase 5: Innovation"
        AIEvolution["AI Evolution"]
        AutomousRedTeaming["Autonomous Red Teaming"]
        AdvancedML["Advanced ML"]
        ResearchLeadership["Research Leadership"]
    end

    MLDetection --> VectorDB
    VectorDB --> AdaptivePayloads
    AdaptivePayloads --> AdvancedAnalytics

    AgentFrameworks --> MCPTesting
    MCPTesting --> MultiAgentSystems
    MultiAgentSystems --> RealTimeMonitoring

    AcademicBenchmarks --> ResearchPapers
    ResearchPapers --> CommunityFeatures
    CommunityFeatures --> PluginSystem

    AIEvolution --> AutomousRedTeaming
    AutomousRedTeaming --> AdvancedML
    AdvancedML --> ResearchLeadership

    classDef phase2 fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef phase3 fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef phase4 fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef phase5 fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff

    class MLDetection,VectorDB,AdaptivePayloads,AdvancedAnalytics phase2
    class AgentFrameworks,MCPTesting,MultiAgentSystems,RealTimeMonitoring phase3
    class AcademicBenchmarks,ResearchPapers,CommunityFeatures,PluginSystem phase4
    class AIEvolution,AutomousRedTeaming,AdvancedML,ResearchLeadership phase5
```

### Evolution Architecture

```mermaid
graph LR
    subgraph "Current (v1.0)"
        BasicEngine["Basic Attack Engine"]
        SimpleUI["Simple UI"]
        LocalStorage["Local Storage"]
    end

    subgraph "Phase 2 (v2.0)"
        AdvancedEngine["Advanced Engine"]
        MLDetection["ML Detection"]
        ImprovedUI["Improved UI"]
    end

    subgraph "Phase 3 (v3.0)"
        AgentTesting["Agent Testing"]
        MCPSupport["MCP Support"]
        RealTimeMonitoring["Real-Time Monitoring"]
    end

    subgraph "Phase 4 (v4.0)"
        ResearchIntegration["Research Integration"]
        CommunityFeatures["Community Features"]
        PluginSystem["Plugin System"]
    end

    subgraph "Future (v5.0+)"
        AIEvolution["AI Evolution"]
        AutomousCapabilities["Autonomous Capabilities"]
        ResearchLeadership["Research Leadership"]
    end

    BasicEngine --> AdvancedEngine
    SimpleUI --> ImprovedUI
    LocalStorage --> MLDetection

    AdvancedEngine --> AgentTesting
    MLDetection --> MCPSupport
    ImprovedUI --> RealTimeMonitoring

    AgentTesting --> ResearchIntegration
    MCPSupport --> CommunityFeatures
    RealTimeMonitoring --> PluginSystem

    ResearchIntegration --> AIEvolution
    CommunityFeatures --> AutomousCapabilities
    PluginSystem --> ResearchLeadership

    classDef current fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef phase2 fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef phase3 fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef phase4 fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    classDef future fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff

    class BasicEngine,SimpleUI,LocalStorage current
    class AdvancedEngine,MLDetection,ImprovedUI phase2
    class AgentTesting,MCPSupport,RealTimeMonitoring phase3
    class ResearchIntegration,CommunityFeatures,PluginSystem phase4
    class AIEvolution,AutomousCapabilities,ResearchLeadership future
```

---

## 🎯 Architecture Summary

### Current Implementation Status

| Component | Status | Description |
|-----------|--------|-------------|
| **React UI** | ✅ Complete | Modern, responsive user interface |
| **Electron Framework** | ✅ Complete | Cross-platform desktop application |
| **Attack Engine** | ✅ Complete | Core testing engine with payload support |
| **Model Manager** | ✅ Complete | AI model configuration and management |
| **Payload Manager** | ✅ Complete | Payload library and management system |
| **Local Storage** | ✅ Complete | SQLite database for local data |
| **AI Integration** | 🚧 In Progress | Partial implementation across providers |
| **Semantic Guardian** | 🚧 In Progress | Heuristic detection, ML planned |
| **Agent Frameworks** | 📋 Planned | LangChain, AutoGen, CrewAI integration |
| **MCP Testing** | 📋 Planned | Model Context Protocol support |
| **Plugin System** | 📋 Planned | Community extensibility framework |

### Architecture Principles

1. **🔒 Security First**: All operations are performed locally with strong encryption
2. **🏗️ Modular Design**: Clean separation of concerns and extensible architecture
3. **🚀 Performance**: Optimized for fast response times and efficient resource usage
4. **🌐 Cross-Platform**: Consistent experience across Windows, macOS, and Linux
5. **📈 Scalable**: Architecture supports future growth and feature additions
6. **🔧 Extensible**: Plugin system and community contributions
7. **🎯 User-Centric**: Intuitive interface and excellent user experience

### Key Technical Decisions

- **Electron + React**: Best combination for cross-platform desktop applications
- **TypeScript**: Type safety and better developer experience
- **SQLite**: Reliable local storage without external dependencies
- **Modular Services**: Clean architecture with clear separation of concerns
- **Security by Design**: Local-first approach with comprehensive security measures

---

*This architecture document evolves with the project. For implementation details, refer to the source code and accompanying documentation.*

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Next Review**: March 2025  
**Architecture Status**: Phase 1 Complete, Phase 2 In Progress 