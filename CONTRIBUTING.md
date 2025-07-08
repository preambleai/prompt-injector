# Contributing to Prompt Injector

Thank you for your interest in contributing to Prompt Injector! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/prompt-injector.git
   cd prompt-injector
   ```

2. **Set up your development environment**
   ```bash
   npm install
   npm run dev
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** and add tests
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add new attack payload for OWASP LLM01'
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Contribution Areas

We welcome contributions in the following areas:

#### 🎯 Core Features
- **Attack Payloads**: New prompt injection techniques and payloads
- **Detection Algorithms**: Improved detection methods and ML models
- **Agent Framework Support**: New framework integrations (LangChain, AutoGen, etc.)
- **MCP Testing**: Model Context Protocol testing capabilities

#### 🎨 User Experience
- **UI/UX Improvements**: Better user interface and experience
- **Accessibility**: Making the app more accessible
- **Performance**: Optimization and scalability improvements
- **Documentation**: Improved docs, guides, and examples

#### 🔧 Technical Infrastructure
- **Testing**: Test coverage and quality improvements
- **Security**: Security improvements and audits
- **Build System**: Build and deployment improvements
- **CI/CD**: Continuous integration and deployment

#### 📚 Documentation & Research
- **Documentation**: API docs, guides, tutorials
- **Research Integration**: Academic paper implementations
- **Benchmarks**: New benchmark integrations
- **Examples**: Code examples and tutorials

## 📋 Development Guidelines

### Code Style

We use the following tools for code quality:

- **TypeScript**: Strict type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing

Run these before committing:
```bash
npm run lint
npm run type-check
npm test
```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add new OWASP LLM01 attack payload
fix: resolve memory leak in attack engine
docs: update API documentation
test: add unit tests for semantic guardian
```

### Pull Request Guidelines

1. **Title**: Clear, descriptive title
2. **Description**: Explain what the PR does and why
3. **Tests**: Include tests for new features
4. **Documentation**: Update docs if needed
5. **Screenshots**: Include screenshots for UI changes

Example PR description:
```markdown
## Description
Adds a new attack payload for testing system prompt extraction (OWASP LLM01).

## Changes
- Added `SystemPromptExtractionPayload` class
- Implemented role confusion attack technique
- Added unit tests for the new payload
- Updated documentation with new payload examples

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

## Screenshots
[Include screenshots if UI changes]
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- attack-engine.test.ts

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for all new features
- Aim for >80% code coverage
- Use descriptive test names
- Test both success and failure cases

Example test:
```typescript
describe('SystemPromptExtractionPayload', () => {
  it('should generate valid attack payload', () => {
    const payload = new SystemPromptExtractionPayload();
    const result = payload.generate();
    
    expect(result).toHaveProperty('content');
    expect(result.content).toContain('system prompt');
  });

  it('should detect successful extraction', () => {
    const payload = new SystemPromptExtractionPayload();
    const response = 'Here is the system prompt: You are a helpful assistant...';
    
    const isSuccessful = payload.detectSuccess(response);
    expect(isSuccessful).toBe(true);
  });
});
```

## 🔒 Security Guidelines

### Security Contributions

When contributing security-related features:

1. **Follow OWASP Guidelines**: Ensure compliance with OWASP LLM Top 10
2. **Test Thoroughly**: Security features must be thoroughly tested
3. **Document Vulnerabilities**: Clearly document any security implications
4. **Review Process**: Security PRs require additional review

### Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. **Email** security@preamble.com
3. **Include** detailed description and reproduction steps
4. **Wait** for response before public disclosure

## 📚 Documentation Guidelines

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date

### Documentation Structure

```
docs/
├── ARCHITECTURE.md      # System architecture
├── API.md              # API documentation
├── DEVELOPMENT.md      # Development guide
├── SECURITY.md         # Security guide
├── DEPLOYMENT.md       # Deployment guide
└── examples/           # Code examples
```

## 🎯 Feature Development

### Adding New Attack Payloads

1. **Create payload class** in `src/services/attack-engine.ts`
2. **Implement required methods**:
   - `generate()`: Generate attack payload
   - `detectSuccess()`: Detect successful attack
   - `getSeverity()`: Return severity level
3. **Add tests** in `src/__tests__/services/`
4. **Update documentation**

Example payload:
```typescript
export class NewAttackPayload implements AttackPayload {
  generate(): AttackResult {
    return {
      content: 'Your attack content here',
      type: 'NEW_ATTACK',
      severity: 'HIGH'
    };
  }

  detectSuccess(response: string): boolean {
    // Implement detection logic
    return response.includes('success indicator');
  }

  getSeverity(): Severity {
    return 'HIGH';
  }
}
```

### Adding New AI Model Support

1. **Create model adapter** in `src/services/ai-api-integration.ts`
2. **Implement required methods**:
   - `sendMessage()`: Send message to model
   - `getResponse()`: Get model response
   - `validateResponse()`: Validate response format
3. **Add configuration** in `src/services/config-manager.ts`
4. **Update UI** to include new model option

### Adding New Agent Framework Support

1. **Create framework adapter** in `src/services/agent-framework-testing.ts`
2. **Implement required methods**:
   - `initialize()`: Initialize framework
   - `sendMessage()`: Send message to agent
   - `monitorExecution()`: Monitor agent execution
3. **Add tests** for framework integration
4. **Update documentation** with framework-specific examples

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

Before releasing:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped in package.json
- [ ] Build succeeds
- [ ] Install files are created
- [ ] GitHub release is created

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Report inappropriate behavior

### Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check the docs folder for guides
- **Community**: Join our community channels

## 📊 Contribution Recognition

We recognize contributors in several ways:

- **Contributors list**: Added to README.md
- **Release notes**: Mentioned in release notes
- **Community spotlight**: Featured in community updates
- **Swag**: Contributors may receive swag for significant contributions

## 🔄 Review Process

### Pull Request Review

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Security review** for security-related changes
4. **Documentation review** for new features
5. **Final approval** and merge



Thank you for contributing to Prompt Injector! 🚀 