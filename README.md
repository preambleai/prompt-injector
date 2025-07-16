# Prompt Injector

## 📥 Download

[![Download for macOS](https://img.shields.io/badge/Download-macOS-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/preambleai/prompt-injector/releases/latest)
[![Download for Windows](https://img.shields.io/badge/Download-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/preambleai/prompt-injector/releases/latest)
[![Download for Linux](https://img.shields.io/badge/Download-Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/preambleai/prompt-injector/releases/latest)

> **Quick Downloads**: [macOS DMG](https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.0-arm64.dmg) | [Windows EXE](https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector%20Setup%201.0.0.exe) | [Linux AppImage](https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.0-arm64.AppImage)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

**Copyright (c) 2025 Preamble, Inc. All rights reserved.**

An AI security testing platform for detecting and mitigating prompt injection vulnerabilities in AI agent solutions. This open-source desktop application provides comprehensive vulnerability assessment and advanced attack simulation capabilities for AI security researchers and developers.

## 🎯 About Prompt Injector

Prompt Injector is an open-source desktop application for AI security testing, designed specifically for security researchers, penetration testers, and AI developers. The platform provides comprehensive prompt injection detection, jailbreak testing, and vulnerability assessment capabilities for popular LLMs.

## 🚀 Key Features

### ✅ Currently Implemented
- **Advanced Attack Engine**: Core testing engine with 100+ OWASP LLM01-LLM10 attack payloads
- **Professional Desktop UI**: Modern Electron-based application with React frontend
- **Real-time Testing**: Create and execute security tests with live results
- **Comprehensive Payload Library**: Browse and select from categorized attack payloads
- **Detailed Results Analysis**: View comprehensive test results with success/failure indicators
- **Multi-Provider Support**: Configure multiple AI model providers (OpenAI, Anthropic, Google, Ollama)
- **Payload Creation Model**: Set default models specifically for payload generation and mutation

### 🚧 In Development
- **Complete AI Model Integration**: Full integration with all major AI providers
- **Advanced ML Detection**: Machine learning-based attack detection (Semantic Guardian)
- **Agent Framework Testing**: Deep integration with LangChain, AutoGen, CrewAI, and other frameworks
- **MCP Testing Environment**: Model Context Protocol testing capabilities
- **Red Team Campaign Orchestration**: Advanced campaign management and automation

### 📋 Planned Features
- **Adaptive Payload Generation**: AI-driven attack payload creation and mutation
- **Advanced Analytics**: Comprehensive security reporting and analysis
- **Plugin System**: Extensible architecture for community contributions
- **Research Integration**: Academic benchmark integration and research paper implementations
- **Community Features**: Payload sharing, template library, and collaborative testing

> **Note:** For detailed implementation status of all features, see the [Product Requirements Document](docs/PRD.md).

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop Framework**: Electron 25
- **Backend**: Node.js with Express
- **Build System**: Vite + TypeScript
- **UI Components**: Lucide React Icons, React Hot Toast
- **AI Integration**: OpenAI, Anthropic, Google Gemini, Ollama APIs
- **Database**: SQLite for local storage
- **Security**: JWT authentication, bcrypt encryption, helmet security headers

## 🚀 Quick Start

> **Prerequisites**: To run security tests, you need either [Ollama](https://ollama.com/) installed for local models, or valid API keys for supported providers (OpenAI, Anthropic, Google Gemini, or xAI Grok). Configure providers in the app's Settings page.

### Installation

#### Option 1: Download Pre-built Binaries (Recommended)
- **macOS**: [Download DMG](https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.0-arm64.dmg)
- **Windows**: [Download EXE](https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector%20Setup%201.0.0.exe)
- **Linux**: [Download AppImage](https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.0-arm64.AppImage)

#### Option 2: Build from Source
1. **Clone the repository**
   ```bash
   git clone https://github.com/preambleai/prompt-injector.git
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

4. **Build for distribution**
   ```bash
   # Build for all platforms
   npm run dist:all

   # Or build for specific platform
   npm run dist:mac     # macOS
   npm run dist:win     # Windows
   npm run dist:linux   # Linux
   ```

### Automated Builds with GitHub Actions

This project uses GitHub Actions to automatically build installers for all platforms:

- **🚀 Automatic Release Builds**: When you create a new release on GitHub, installers are automatically built and attached to the release
- **🧪 Manual Test Builds**: You can manually trigger builds from the Actions tab to test specific platforms
- **🌐 Multi-platform Support**: Builds simultaneously for macOS, Windows, and Linux

#### Creating a Release
1. Push your changes to the main branch
2. Go to the GitHub repository
3. Click "Releases" → "Create a new release"
4. Tag the release (e.g., `v1.0.0`)
5. Add release notes
6. Click "Publish release"

GitHub Actions will automatically build installers for all platforms and attach them to the release within ~10-15 minutes.

#### Manual Build Testing
From the GitHub repository:
1. Go to the "Actions" tab
2. Select "Manual Build Test"
3. Click "Run workflow"
4. Choose the platform to build for (or "all" for all platforms)
5. Download the artifacts when the build completes

## 🎯 Usage Guide

### Initial Setup
1. **Configure AI Models**: Navigate to Settings and add your AI model providers
2. **Set Default Payload Model**: Choose which model to use for payload generation by clicking the star icon
3. **Verify Connection**: Test your model connections to ensure proper setup

### Running Security Tests
1. **Create Test Campaign**: Use the Testing interface to create a new security test
2. **Select Attack Payloads**: Choose from OWASP LLM01-LLM10 categories or create custom payloads
3. **Execute Tests**: Run tests against your configured AI models
4. **Analyze Results**: Review detailed results with success/failure indicators and security recommendations

### Attack Categories

Our comprehensive payload library includes:

- **OWASP LLM01 - Prompt Injection**: System prompt extraction and role confusion attacks
- **OWASP LLM02 - Insecure Output Handling**: Output manipulation and injection techniques
- **OWASP LLM03 - Training Data Poisoning**: Training data extraction and poisoning attempts
- **OWASP LLM04 - Model Denial of Service**: Resource exhaustion and performance degradation
- **OWASP LLM05 - Supply Chain Vulnerabilities**: Third-party integration and dependency attacks
- **OWASP LLM06 - Sensitive Information Disclosure**: Data extraction and privacy violations
- **OWASP LLM07 - Insecure Plugin Design**: Plugin and extension security testing
- **OWASP LLM08 - Excessive Agency**: Permission escalation and unauthorized actions
- **OWASP LLM09 - Overreliance**: Trust manipulation and decision-making attacks
- **OWASP LLM10 - Model Theft**: Model extraction and intellectual property theft

## 📦 Payload Schema

All attack payloads follow a standardized schema to ensure consistency and extensibility:

```typescript
interface AttackPayload {
  id: string
  name: string
  nameUrl?: string
  description: string
  category?: string
  payload: string
  tags: string[]
  source: string
  severity?: string
  owasp?: string[]           // OWASP LLM categories
  mitreAtlas?: string[]      // MITRE ATLAS framework
  aiSystem?: string[]        // AI system components
  technique?: string
  successRate?: number
  bypassMethods?: string[]
  successIndicators?: string[]  // Success detection keywords
  failureIndicators?: string[]  // Failure detection keywords
  // ... additional metadata fields
}
```

> **Contributing Payloads**: All payloads are stored in `public/assets/payloads/all-attack-payloads.json` and must conform to this schema.

## 🗺️ Development Roadmap

### Phase 1: Foundation & Core Infrastructure ✅
- [x] Core attack engine implementation
- [x] Desktop application framework
- [x] Professional UI with modern design
- [x] Comprehensive payload library (100+ payloads)
- [x] Basic model configuration and management
- [x] Real-time test execution and results

### Phase 2: Advanced Detection & AI Integration 🚧
- [ ] Complete AI model API integration
- [ ] Machine learning-based detection (Semantic Guardian)
- [ ] Advanced payload mutation and generation
- [ ] Performance optimization (<15 second response times)
- [ ] Enhanced analytics and reporting

### Phase 3: Agent Framework & MCP Testing 📋
- [ ] LangChain, AutoGen, CrewAI framework integration
- [ ] Model Context Protocol (MCP) testing environment
- [ ] Multi-agent system testing capabilities
- [ ] Real-time monitoring and instrumentation
- [ ] Advanced campaign orchestration

### Phase 4: Research & Innovation 🔬
- [ ] Academic benchmark integration (INJECAGENT, AdvBench)
- [ ] Research paper reproduction capabilities
- [ ] Community plugin system
- [ ] Advanced local ML capabilities
- [ ] Industry standard contributions

For detailed roadmap information, see [ROADMAP.md](docs/ROADMAP.md).

## 🤝 Contributing

We welcome contributions from the AI security community! Whether you're interested in adding new attack payloads, improving detection algorithms, or enhancing the user experience, there are many ways to contribute.

### Quick Contribution Guide

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and add tests
4. **Follow our coding standards**: Run `npm run lint` and `npm test`
5. **Commit with conventional format**: `git commit -m 'feat: add new attack payload'`
6. **Push and create a Pull Request**

### Areas for Contribution

- **🎯 Attack Payloads**: New prompt injection techniques and zero-day attacks
- **🤖 AI Model Integration**: Support for new AI providers and models
- **🔧 Agent Framework Support**: Integration with additional agent frameworks
- **🎨 UI/UX Improvements**: Enhanced user interface and experience
- **📚 Documentation**: Improved guides, examples, and API documentation
- **🧪 Testing**: Test coverage and quality improvements
- **🔒 Security**: Security audits and vulnerability assessments

See our [Contributing Guidelines](CONTRIBUTING.md) for detailed information.

## 📚 Documentation

### Core Documentation
- **[Product Requirements Document](docs/PRD.md)**: Comprehensive feature requirements and implementation status
- **[Technical Architecture](docs/PROMPT_INJECTOR_DIAGRAMS.md)**: System architecture and design diagrams
- **[Development Roadmap](docs/ROADMAP.md)**: Detailed development phases and milestones
- **[Build Instructions](docs/BUILD_INSTRUCTIONS.md)**: Build and release process documentation
- **[Contributing Guidelines](CONTRIBUTING.md)**: How to contribute to the project

### Development Resources
- **API Documentation**: Generated from code comments
- **Code Examples**: Located in `/examples` directory
- **Testing Guide**: Unit and integration testing best practices
- **Security Guidelines**: Security-focused development practices

## 🔒 Security & Privacy

### Security Features
- **Local-First Architecture**: All data processing happens locally
- **Encrypted Storage**: AES-256 encryption for sensitive data
- **No Telemetry**: No data collection without explicit consent
- **Secure Communication**: HTTPS for all external API calls
- **Regular Security Audits**: Community-driven security reviews

### Reporting Security Issues
If you discover a security vulnerability, please:
1. **Do not** create a public GitHub issue
2. **Email** security@preamble.com with details
3. **Include** reproduction steps and impact assessment
4. **Allow** reasonable time for response before public disclosure

## 🏗️ Project Structure

```
prompt-injector/
├── assets/                    # Brand assets and images
├── docs/                      # Documentation files
├── public/
│   └── assets/
│       └── payloads/          # Attack payload definitions
├── src/
│   ├── components/            # React UI components
│   ├── pages/                 # Application pages/routes
│   ├── services/              # Core business logic
│   ├── main/                  # Electron main process
│   ├── types/                 # TypeScript type definitions
│   └── __tests__/             # Test files
├── scripts/                   # Build and utility scripts
├── package.json               # Project configuration
└── README.md                  # This file
```

## 🔧 Development Commands

```bash
# Development
npm run dev                    # Start development environment
npm run dev:renderer          # Start Vite dev server only
npm run dev:main              # Start Electron main process only

# Building
npm run build                 # Build for production
npm run build:renderer        # Build React application
npm run build:main            # Build Electron main process

# Distribution
npm run dist                  # Create installable packages
npm run dist:mac              # Build for macOS
npm run dist:win              # Build for Windows
npm run dist:linux            # Build for Linux

# Testing & Quality
npm test                      # Run test suite
npm run test:watch            # Run tests in watch mode
npm run lint                  # Run ESLint
npm run lint:fix              # Fix linting issues
npm run type-check            # TypeScript type checking
```

## 📊 Current Status

**Development Phase**: Phase 1 (Foundation & Core Infrastructure) - ✅ Complete
**Next Phase**: Phase 2 (Advanced Detection & AI Integration) - 🚧 In Progress
**Current Focus**: Complete AI model integration and advanced detection capabilities

### Recent Accomplishments
- ✅ Modern, professional UI with improved user experience
- ✅ Comprehensive model configuration with default payload model selection
- ✅ Enhanced attack payload library with standardized schema
- ✅ Real-time test execution and results visualization
- ✅ Multi-provider AI model support infrastructure

### Upcoming Milestones
- 🎯 Complete AI model API integration
- 🎯 Implement machine learning-based detection
- 🎯 Add agent framework testing capabilities
- 🎯 Launch community plugin system

## 🌟 Community & Support

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community discussions
- **Documentation**: Comprehensive guides and examples
- **Contributing**: Join our development community

### Community Recognition
We recognize contributors through:
- **Contributors List**: Featured in README and releases
- **Community Spotlight**: Highlighted in project updates
- **Swag Program**: Rewards for significant contributions
- **Mentorship**: Guidance for new contributors

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to:
- The AI security research community for their invaluable insights
- Contributors who have helped improve the platform
- Academic institutions supporting AI security research
- Open source projects that make this work possible

---

**Prompt Injector** - Advanced AI Security Testing Platform by Preamble, Inc.

*Building the future of AI security, one test at a time.* 