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

### Currently Implemented
- **Attack Engine**: Core attack testing engine with 100+ OWASP LLM01-LLM10 payloads
- **Desktop Application**: Electron-based desktop app with React frontend
- **Real-time Testing**: Create and run attack tests with live results
- **Payload Management**: Browse and select from categorized attack payloads
- **Test Results**: View detailed test results with success/failure indicators

### Partially Implemented / UI-Only / Simulated
- **AI Model API Integration**: OpenAI partially wired; Anthropic and Google Gemini present in UI but not fully integrated; local model support present
- **Advanced Detection (Semantic Guardian)**: Simulated/heuristic only; ML/vector DB not yet implemented
- **Red Team Campaigns**: UI and campaign builder exist; backend logic is stubbed
- **Agent Framework Testing**: UI and some simulated backend logic; deeper integration planned
- **MCP Testing**: UI present, backend logic not yet implemented
- **Adaptive Payloads**: Heuristic only; not ML-driven
- **Reporting Engine**: Some reporting features exist, but advanced analytics and export are not complete
- **Evidence Collection**: Some evidence storage and display, but not full-featured

> **Note:** Many features are UI-only, simulated, or stubbed. See [PRD.md](PRD.md) for a detailed, regularly updated table of feature status.

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
   git clone https://github.com/preambleai/prompt-injector
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

### Phase 1: Foundation & Core Infrastructure
- [x] Core attack engine implementation
- [x] Desktop application framework (Electron + React)
- [x] Basic UI with test creation and execution
- [x] 100+ payloads available
- [ ] AI Model API Integration (OpenAI, Anthropic, Google APIs)
- [ ] Basic Detection (simple success/failure detection)
- [ ] Test Result Visualization (detailed result display)
- [ ] User Authentication (basic user management)

### Phase 2: Advanced Detection & AI Red Teaming
- [ ] Semantic Guardian (ML-based detection stack)
- [ ] AI Red Teaming (model extraction, adversarial examples)
- [ ] Adaptive Payloads (AI-driven attack generation)
- [ ] Multi-Model Support (OpenAI, Anthropic, Google, Meta, local models)
- [ ] Performance Optimization (sub-15 second response times)
- [ ] Advanced Analytics (detailed attack analysis)

### Phase 3: Agent Framework Testing
- [ ] MCP Testing Environment (complete MCP server/client testing)
- [ ] Live Agent Instrumentation (real-time agent monitoring)
- [ ] Agent Framework Support (8+ framework integrations)
- [ ] Multi-Agent Testing (agent network simulation)
- [ ] Prompt Infection (self-replicating prompt spread)
- [ ] Real-time Monitoring (live agent interaction tracking)
- [ ] System Impact Assessment (measuring disruption and data leakage)
- [ ] Recovery Time Testing (time to detect and mitigate infections)

### Phase 4: Research Integration
- [ ] Academic benchmark integration
- [ ] Research-based attack simulation
- [ ] Multi-agent system testing
- [ ] Academic paper reproduction
- [ ] University partnerships

### Phase 5: Advanced Local Features
- [ ] Advanced Analytics (local data analysis and reporting)
- [ ] Custom Payload Creation (user-defined attack payloads)
- [ ] Plugin System (extensible architecture for community plugins)
- [ ] Advanced Reporting (comprehensive security reports)
- [ ] Local ML Models (on-device machine learning capabilities)
- [ ] Community Features (payload sharing, template library, documentation hub, tutorial system)

### Phase 6: Innovation & Research Leadership
- [ ] Generative Adversarial Attack Engine (AI-driven attack evolution)
- [ ] Research Leadership (academic research contributions)
- [ ] Research Institute Partnerships (academic partnerships)
- [ ] Industry Standards Contribution (standards development)
- [ ] Open Source Leadership (leading the AI security community)
- [ ] Latest Research Models (cutting-edge model integration)
- [ ] Advanced Local ML (sophisticated on-device AI)
- [ ] Research Tools (academic research support tools)
- [ ] Community Research (community-driven research platform)

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
- **[Contributing Guidelines](CONTRIBUTING.md)**: How to contribute
- **[Product Requirements Document](docs/PRD.md)**: Feature status and implementation map
- **[Build Instructions](docs/BUILD_INSTRUCTIONS.md)**: Build and release process
- **[Quick Reference](docs/QUICK_REFERENCE.md)**: Links to all key docs

## 🔒 Security

### Security Features
- **Attack Simulation**: Simulates various prompt injection attacks
- **Result Tracking**: Monitors attack success/failure rates
- **Severity Classification**: Categorizes attacks by severity level
- **Real-time Monitoring**: Live updates during test execution


## 📊 Current Status

**Phase 1 - Foundation & Core Infrastructure**
- Core attack engine implemented
- Desktop application running
- Basic UI with test creation and execution
- 100+ OWASP LLM01-LLM10 payloads available

**In Progress**
- AI Model API integration (OpenAI partial, others UI only)
- Advanced detection capabilities (simulated/heuristic)
- Test result visualization (basic only)
- Red Team Campaigns (UI + stub backend)
- Agent Framework Testing (UI + partial backend)
- MCP Testing (UI only)
- Adaptive Payloads (heuristic only)
- Reporting Engine (partial)
- Evidence Collection (partial)

**Planned**
- Plugin system
- Advanced local features
- Research integration

> For a detailed, regularly updated table of feature status, including which modules are UI-only, simulated, stubbed, or fully integrated, see [PRD.md](PRD.md).

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
- 100+ OWASP LLM01-LLM10 payloads available

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