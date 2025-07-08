# Prompt Injector

[![Download for macOS (Apple Silicon)](https://img.shields.io/badge/Download-macOS%20(Apple%20Silicon)-blue?logo=apple)](https://github.com/your-org/your-repo/releases/latest/download/Prompt%20Injector-1.0.0-arm64.dmg)
[![Download for Windows](https://img.shields.io/badge/Download-Windows-green?logo=windows)](https://github.com/your-org/your-repo/releases/latest/download/Prompt%20Injector%20Setup%201.0.0.exe)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

**Copyright (c) 2025 Preamble, Inc. All rights reserved.**

A cutting-edge AI security testing platform for detecting and mitigating prompt injection vulnerabilities in AI agent solutions. This open-source project provides comprehensive vulnerability assessment and advanced attack simulation capabilities for all AI agent platforms as a localized desktop tool.

## 🎯 Project Vision

To become the premier AI red teaming platform for the AI security community, providing comprehensive vulnerability assessment and advanced attack simulation capabilities while maintaining the highest standards of security and ease of use as a localized tool.

## 🚀 Features

### Phase 1: Core Security Testing (Current)
- **Attack Engine**: Core attack testing engine with 100+ payloads
- **Desktop Application**: Electron-based desktop app with React frontend
- **Real-time Testing**: Create and run attack tests with live results
- **Payload Management**: Browse and select from categorized attack payloads
- **Test Results**: View detailed test results with success/failure indicators

### Phase 2: Advanced Detection (In Development)
- **Semantic Guardian**: ML-based detection stack with 98% recall target
- **AI Red Teaming**: Model extraction, adversarial examples, data poisoning testing
- **Adaptive Payloads**: AI-driven attack generation and evolution
- **Multi-Model Support**: OpenAI, Anthropic, Google, Meta, and local models

### Phase 3: Agent Framework Testing (Planned)
- **MCP Testing**: Model Context Protocol server and client testing
- **Multi-Agent Testing**: Prompt infection simulation in agent networks
- **Live Instrumentation**: Real-time agent monitoring and detection
- **Framework Support**: LangChain, AutoGen, CrewAI, LangGraph integration

### Phase 4: Research Integration (Planned)
- **Academic Benchmarks**: AgentDojo, AdvBench, INJECAGENT integration
- **Research Reproduction**: Latest academic paper implementations
- **Multi-Agent Systems**: Advanced agent network testing
- **Continuous Innovation**: Stay ahead of emerging threats

### Phase 5: Advanced Local Features (Planned)
- **Plugin System**: Extensible architecture for community plugins
- **Advanced Analytics**: Local data analysis and reporting
- **Community Features**: User-contributed payloads and templates
- **Research Tools**: Academic research support capabilities

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron 25
- **Backend**: Node.js with Express
- **Build Tools**: Vite, TypeScript
- **UI Components**: Heroicons, React Hot Toast
- **AI Integration**: OpenAI, Anthropic, Google Gemini APIs
- **Database**: SQLite (local storage)
- **Security**: JWT, bcrypt, helmet, rate limiting

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/prompt-injector.git
   cd prompt-injector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run dist
   ```

## 🎯 Usage

### Creating a Test
1. Enter a test name and description
2. Select target model (GPT-4, Claude 3, etc.)
3. Choose attack payloads from the available categories
4. Click "Create Test" to generate the test

### Running Tests
1. View created tests in the "Test Results" section
2. Click the play button to run pending tests
3. Monitor real-time results and attack outcomes
4. Review success/failure indicators for each payload

### Available Attack Categories
- **OWASP LLM01**: System prompt extraction and role confusion
- **OWASP LLM02**: Prompt injection via input manipulation
- **OWASP LLM03**: Training data extraction attempts
- **OWASP LLM04**: Model denial of service attacks
- **OWASP LLM05**: Supply chain and code execution attacks
- **OWASP LLM06**: Sensitive information disclosure
- **OWASP LLM07**: Insecure plugin design exploitation
- **OWASP LLM08**: Excessive agency and permissions
- **OWASP LLM09**: Overreliance and trust manipulation
- **OWASP LLM10**: Insecure output handling

## 🗺️ Roadmap

### Q3 2025: Foundation & Core Features
- [x] Basic attack engine implementation
- [x] Desktop application framework
- [x] Core payload management
- [ ] OpenAI/Anthropic/Google API integration
- [ ] Basic detection capabilities
- [ ] Test result visualization

### Q4 2025: Advanced Detection & AI Red Teaming
- [ ] Semantic Guardian detector stack
- [ ] AI red teaming capabilities
- [ ] Adaptive payload generation
- [ ] Multi-model support expansion
- [ ] Performance optimization

### Q1 2026: Agent Framework Testing
- [ ] Complete MCP testing environment
- [ ] Live agent instrumentation
- [ ] Agent framework support (8+ frameworks)
- [ ] Real-time monitoring capabilities
- [ ] Multi-agent system testing

### Q2 2026: Research Integration
- [ ] Academic benchmark integration
- [ ] Research-based attack simulation
- [ ] Multi-agent system testing
- [ ] Academic paper reproduction
- [ ] University partnerships

### Q3 2026: Advanced Local Features
- [ ] Plugin system for extensibility
- [ ] Advanced local analytics
- [ ] Community features and sharing
- [ ] Research tools integration

### Q4 2026: Innovation & Research Leadership
- [ ] Research leadership position
- [ ] Advanced local ML capabilities
- [ ] Community research platform
- [ ] Academic partnerships

## 🤝 Contributing

We welcome contributions from the AI security community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Areas

- **Attack Payloads**: New prompt injection techniques
- **Detection Algorithms**: Improved detection methods
- **Agent Framework Support**: New framework integrations
- **UI/UX Improvements**: Better user experience
- **Documentation**: Improved docs and guides
- **Testing**: Test coverage and quality
- **Performance**: Optimization and scalability
- **Security**: Security improvements and audits

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## 📚 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)**: System architecture and design
- **[API Reference](docs/API.md)**: API documentation and examples
- **[Development Guide](docs/DEVELOPMENT.md)**: Development setup and guidelines
- **[Security Guide](docs/SECURITY.md)**: Security best practices
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Production deployment instructions
- **[Contributing Guidelines](CONTRIBUTING.md)**: How to contribute

## 🔒 Security

### Security Features
- **Attack Simulation**: Simulates various prompt injection attacks
- **Result Tracking**: Monitors attack success/failure rates
- **Severity Classification**: Categorizes attacks by severity level
- **Real-time Monitoring**: Live updates during test execution


## 📊 Project Status

**Current Phase**: Phase 1 - Foundation & Core Infrastructure
**Next Milestone**: Red Teaming 


### Completed Features ✅
- Core attack engine implemented
- Desktop application running
- Basic UI with test creation and execution
- 100+ payloads available

### In Progress 🚧
- AI model API integration
- Advanced detection capabilities
- Performance optimization

### Planned Features 📋
- MCP testing environment
- Multi-agent system testing
- Advanced local features
- Research integration

## 🏗️ Project Structure

```
src/
├── main/                 # Electron main process
│   ├── services/        # Backend services
│   │   └── attack-engine.ts  # Core attack testing engine
│   ├── main.ts          # Main process entry point
│   └── preload.ts       # Preload script for IPC
├── pages/               # React pages
│   ├── Dashboard.tsx    # Main dashboard interface
│   ├── Testing.tsx      # Testing interface
│   ├── Results.tsx      # Results display
│   ├── Defenses.tsx     # Defense configuration
│   └── Settings.tsx     # Application settings
├── components/          # Reusable React components
├── services/            # Core services
│   ├── attack-engine.ts # Attack generation and execution
│   ├── semantic-guardian.ts # ML-based detection
│   ├── ai-red-teaming.ts # AI red teaming capabilities
│   └── mcp-testing.ts   # MCP testing environment
└── App.tsx             # Main React application
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development environment
- `npm run dev:renderer` - Start Vite dev server only
- `npm run dev:main` - Start Electron main process only
- `npm run build` - Build for production
- `npm run build:renderer` - Build React app
- `npm run build:main` - Build Electron main process
- `npm run dist` - Create distributable packages
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Development Workflow
1. The Vite dev server runs on `http://localhost:3000`
2. Electron loads the React app from the dev server
3. Changes to React code hot-reload automatically
4. Changes to main process require restart (`Ctrl+R` in Electron)

## 📦 Building Install Files

### Prerequisites
- Node.js 18+ and npm
- Git
- For macOS builds: macOS 10.15+ (for universal builds)
- For Windows builds: Windows 10+ (cross-platform builds supported)

### Quick Build Commands

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Build for Development
```bash
npm run build
```

#### 3. Create Install Files
```bash
npm run dist
```

This will generate install files in the `dist-electron/` directory:
- **macOS**: `.dmg` file for Apple Silicon and Intel
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` and `.deb` packages

### Platform-Specific Builds

#### macOS
```bash
# Build for current platform
npm run dist:mac

# Build for specific architecture
npm run dist:mac-arm64  # Apple Silicon
npm run dist:mac-x64    # Intel Mac
```

#### Windows
```bash
# Build for Windows
npm run dist:win

# Build for specific architecture
npm run dist:win-x64    # 64-bit Windows
```

#### Linux
```bash
# Build for Linux
npm run dist:linux

# Build for specific architecture
npm run dist:linux-x64  # 64-bit Linux
```

### Publishing to GitHub Releases

1. **Update Version** in `package.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Build Install Files**:
   ```bash
   npm run dist
   ```

3. **Create GitHub Release**:
   - Go to GitHub repository → Releases
   - Click "Create a new release"
   - Tag: `v1.0.1`
   - Title: `Prompt Injector v1.0.1`
   - Upload files from `dist-electron/`:
     - `Prompt Injector-1.0.1-arm64.dmg` (macOS)
     - `Prompt Injector Setup 1.0.1.exe` (Windows)

4. **Update README Links**:
   Replace placeholder URLs in README with actual release URLs:
   ```markdown
   [![Download for macOS](https://img.shields.io/badge/Download-macOS-blue?logo=apple)](https://github.com/your-org/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.1-arm64.dmg)
   ```

### Build Configuration

The build process uses Electron Builder with configuration in `package.json`:

```json
{
  "build": {
    "appId": "com.preamble.prompt-injector",
    "productName": "Prompt Injector",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

### Troubleshooting Build Issues

#### Common Issues:
1. **Permission Errors**: Run with `sudo` on macOS/Linux
2. **Missing Dependencies**: Ensure all dev dependencies are installed
3. **Code Signing**: Required for macOS distribution (see below)

#### Code Signing (macOS)
For distribution outside the Mac App Store:
```bash
# Set up code signing certificate
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run dist:mac
```

#### Windows Code Signing
```bash
# Set up code signing certificate
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run dist:win
```

## 🎨 UI Components

The application uses a modern, clean interface with:
- **Dashboard**: Overview with stats and test creation
- **Payload Selection**: Categorized attack payloads with severity indicators
- **Test Management**: Create, run, and monitor attack tests
- **Results Display**: Real-time test results with success/failure indicators

## 🔒 Security Features

### Current Implementation
- **Attack Simulation**: Simulates various prompt injection attacks
- **Result Tracking**: Monitors attack success/failure rates
- **Severity Classification**: Categorizes attacks by severity level
- **Real-time Monitoring**: Live updates during test execution

### Planned Security Features
- **ML-based Detection**: Advanced detection using judge models
- **Defense Validation**: Test effectiveness of security measures
- **Local Analytics**: Comprehensive local reporting
- **Plugin Security**: Secure plugin architecture

## 📊 Current Status

**Phase 1 Complete** ✅
- Core attack engine implemented
- Desktop application running
- Basic UI with test creation and execution
- 10+ OWASP LLM01-LLM10 payloads available

**Next Steps**
- Implement actual AI model integration
- Add advanced detection capabilities
- Develop MCP testing environment
- Create advanced local features

## 🤝 Contributing

This is an active development project. Contributions are welcome!

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

---

**Prompt Injector** - Advanced AI Security Testing Platform by Preamble, Inc.

## ⬇️ Download & Install

**Quick Start:**
- [Download for macOS (Apple Silicon)](https://github.com/your-org/your-repo/releases/latest/download/Prompt%20Injector-1.0.0-arm64.dmg)
- [Download for Windows](https://github.com/your-org/your-repo/releases/latest/download/Prompt%20Injector%20Setup%201.0.0.exe)

Or, to run from source:

```bash
git clone https://github.com/your-org/your-repo.git
cd prompt-injector
npm install
npm run dev
``` 

## Implementation Status & Integration Map

See the [Product Requirements Document](PRD.md) for a detailed, regularly updated table of feature status, including which modules are UI-only, simulated, stubbed, or fully integrated.

**Summary:**
- Many core features are partially implemented or simulated (see PRD.md for details).
- UI wizards and management components are present but not fully wired to backend logic.
- Detection and defense engines are primarily heuristic or simulated; ML/vector DB integration is planned.
- Red team attack libraries, MCP, and agent framework support are present in the UI but lack backend logic.

Refer to the PRD.md for the full ASCII table and guidance for contributors. 