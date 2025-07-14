# Prompt Injector - Application Architecture Diagrams

> **Legend:**
> - **Solid border**: Fully implemented (MVP)
> - **Dashed border**: UI-only/Simulated/Stubbed
> - **Gray fill**: Planned/Not implemented
> - **🟢**: MVP/Active
> - **⚪️**: Planned only

---

## 1. MVP System Architecture

```mermaid
graph TB
    subgraph "Desktop Application (Electron)"
        UI["User Interface 🟢"]
        MainProcess["Main Process 🟢"]
        RendererProcess["Renderer Process 🟢"]
    end

    subgraph "Core Services"
        AttackEngine["Attack Engine 🟢"]
        PayloadManager["Payload Manager 🟢"]
        ResultsDisplay["Results Display 🟢"]
    end

    subgraph "Planned/Stubbed Features"
        DetectionEngine["Detection Engine ⚪️":::planned]
        ReportingEngine["Reporting Engine ⚪️":::planned]
        AIModelIntegration["AI Model Integration ⚪️":::planned]
        RedTeaming["Red Teaming ⚪️":::planned]
        AgentFrameworks["Agent Frameworks ⚪️":::planned]
        Plugins["Plugin System ⚪️":::planned]
        Analytics["Analytics ⚪️":::planned]
    end

    UI --> MainProcess
    MainProcess --> AttackEngine
    MainProcess --> PayloadManager
    MainProcess --> ResultsDisplay
    MainProcess -.-> DetectionEngine
    MainProcess -.-> ReportingEngine
    MainProcess -.-> AIModelIntegration
    MainProcess -.-> RedTeaming
    MainProcess -.-> AgentFrameworks
    MainProcess -.-> Plugins
    MainProcess -.-> Analytics

    AttackEngine --> PayloadManager
    AttackEngine --> ResultsDisplay

    classDef planned fill:#e0e0e0,stroke:#bdbdbd,stroke-width:2px;
```

---

## 2. MVP Attack Testing Pipeline

```mermaid
flowchart TD
    A[Start Attack Test 🟢] --> B{Select Attack Category 🟢}
    B -->|OWASP LLM01-LLM10| C[Attack Engine 🟢]
    C --> D[Payload Manager 🟢]
    D --> E[Attack Execution 🟢]
    E --> F[Results Display 🟢]
    F --> G[End Test 🟢]
    B -.->|Other Categories| X[Planned/Not Implemented ⚪️]
    C -.-> Y[Advanced Detection ⚪️]
    D -.-> Z[Analytics/Reporting ⚪️]
    classDef planned fill:#e0e0e0,stroke:#bdbdbd,stroke-width:2px;
```

---

## 3. MVP UI Overview

```mermaid
graph TB
    subgraph "UI Components"
        Dashboard["Dashboard 🟢"]
        PayloadSelection["Payload Selection 🟢"]
        TestManagement["Test Management 🟢"]
        ResultsDisplay["Results Display 🟢"]
    end
    subgraph "Planned/Stubbed UI"
        RedTeamUI["Red Teaming UI ⚪️":::planned]
        AgentFrameworkUI["Agent Frameworks UI ⚪️":::planned]
        PluginUI["Plugin System UI ⚪️":::planned]
        AnalyticsUI["Analytics UI ⚪️":::planned]
    end
    Dashboard --> PayloadSelection
    PayloadSelection --> TestManagement
    TestManagement --> ResultsDisplay
    Dashboard -.-> RedTeamUI
    Dashboard -.-> AgentFrameworkUI
    Dashboard -.-> PluginUI
    Dashboard -.-> AnalyticsUI
    classDef planned fill:#e0e0e0,stroke:#bdbdbd,stroke-width:2px;
```

---

## 4. MVP Data Flow

```mermaid
graph LR
    UserInput[User Input 🟢] --> AttackEngine[Attack Engine 🟢]
    AttackEngine --> PayloadManager[Payload Manager 🟢]
    PayloadManager --> ResultsDisplay[Results Display 🟢]
    AttackEngine -.-> DetectionEngine[Detection Engine ⚪️]
    ResultsDisplay -.-> Analytics[Analytics ⚪️]
    classDef planned fill:#e0e0e0,stroke:#bdbdbd,stroke-width:2px;
```

---

## 5. MVP Development Workflow

```mermaid
graph LR
    subgraph "Phase 1: MVP"
        P1_Desktop[Desktop Foundation 🟢]
        P1_BasicUI[Basic UI 🟢]
        P1_AttackEngine[Attack Engine 🟢]
        P1_Payloads[OWASP LLM01-LLM10 Payloads 🟢]
        P1_Results[Results Display 🟢]
    end
    subgraph "Planned Phases"
        P2_AdvancedDetection[Advanced Detection ⚪️]
        P2_AIIntegration[AI Model Integration ⚪️]
        P2_RedTeaming[Red Teaming ⚪️]
        P2_AgentFrameworks[Agent Frameworks ⚪️]
        P2_Plugins[Plugin System ⚪️]
        P2_Analytics[Analytics ⚪️]
    end
    P1_Desktop --> P1_BasicUI
    P1_BasicUI --> P1_AttackEngine
    P1_AttackEngine --> P1_Payloads
    P1_Payloads --> P1_Results
    P1_Results -.-> P2_AdvancedDetection
    P1_Results -.-> P2_AIIntegration
    P1_Results -.-> P2_RedTeaming
    P1_Results -.-> P2_AgentFrameworks
    P1_Results -.-> P2_Plugins
    P1_Results -.-> P2_Analytics
    classDef planned fill:#e0e0e0,stroke:#bdbdbd,stroke-width:2px;
```

---

## Key Features Summary (MVP)

### Core Capabilities
- **Prompt Injection Attack Testing**: OWASP LLM01-LLM10 only (implemented)
- **Basic Desktop UI**: Electron + React (implemented)
- **Payload Management**: Select, run, and view results for core payloads (implemented)

### Planned/Not Yet Implemented
- AI model integration (OpenAI, Anthropic, Google, etc.)
- Advanced detection (ML, vector DB, Semantic Guardian)
- Red team campaign orchestration
- Agent framework support
- MCP testing
- Adaptive payloads (ML-driven)
- Plugin system
- Advanced analytics and reporting
- Community features

> **Note:** All diagrams above reflect the MVP scope. Planned features are shown as gray or dashed for future development. 