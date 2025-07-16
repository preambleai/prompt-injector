# Build Instructions - Comprehensive Guide

## 🚀 Quick Start Guide

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Create install files
npm run dist
```

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: Latest version recommended
- **Python**: Version 3.8+ (for native dependencies)

### Development Environment
- **Code Editor**: VS Code recommended with TypeScript extension
- **Terminal**: Modern terminal with UTF-8 support
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 5GB free space for dependencies and build artifacts

## 🔧 Development Setup

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/preambleai/prompt-injector.git
cd prompt-injector

# Verify Node.js and npm versions
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### 2. Dependency Installation
```bash
# Install all dependencies
npm install

# Verify installation
npm ls --depth=0
```

### 3. Development Server
```bash
# Start development environment (includes Ollama startup)
npm run dev

# Start individual processes
npm run dev:renderer    # Vite dev server only
npm run dev:main       # Electron main process only
npm run dev:ollama     # Ollama server only
```

### 4. Environment Configuration
```bash
# Copy environment template (if needed)
cp .env.example .env

# Edit environment variables
# Note: API keys should be configured in the app's Settings page
```

## 📦 Build Commands Reference

### Development Commands
| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start full development environment | Main development workflow |
| `npm run dev:renderer` | Start Vite dev server only | Frontend-only development |
| `npm run dev:main` | Start Electron main process only | Backend-only development |
| `npm run dev:ollama` | Start Ollama server | Local model testing |

### Build Commands
| Command | Description | Output |
|---------|-------------|---------|
| `npm run build` | Build for production | `dist/` directory |
| `npm run build:renderer` | Build React frontend | `dist/` directory |
| `npm run build:main` | Build Electron main process | `dist/main/` directory |

### Distribution Commands
| Command | Description | Output |
|---------|-------------|---------|
| `npm run dist` | Create install files for current platform | `dist-electron/` directory |
| `npm run dist:mac` | macOS installers (universal) | `.dmg` and `.zip` files |
| `npm run dist:win` | Windows installers | `.exe` installer |
| `npm run dist:linux` | Linux packages | `.AppImage` and `.deb` files |

### Testing & Quality Commands
| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Run test suite | Automated testing |
| `npm run test:watch` | Run tests in watch mode | Test-driven development |
| `npm run lint` | Run ESLint | Code quality checking |
| `npm run lint:fix` | Fix linting issues | Code cleanup |
| `npm run type-check` | TypeScript type checking | Type validation |
| `npm run format` | Format code with Prettier | Code formatting |

## 🖥️ Platform-Specific Builds

### macOS Development
```bash
# Universal build (Apple Silicon + Intel)
npm run dist:mac

# Test on both architectures
npm run dist:mac -- --universal

# Sign for distribution (requires certificates)
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run dist:mac
```

### Windows Development
```bash
# 64-bit Windows installer
npm run dist:win

# Portable version
npm run dist:win -- --portable

# Sign for distribution (requires certificates)
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run dist:win
```

### Linux Development
```bash
# AppImage (universal Linux)
npm run dist:linux

# Debian package
npm run dist:linux -- --linux deb

# RPM package
npm run dist:linux -- --linux rpm
```

## 🔄 Development Workflow

### Daily Development Cycle
1. **Pull Latest Changes**
   ```bash
   git pull origin main
   npm install  # Update dependencies if needed
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Make Changes**
   - Edit TypeScript/React files
   - Changes auto-reload in development
   - Main process changes require restart (Ctrl+R)

4. **Test Changes**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. **Build and Test**
   ```bash
   npm run build
   npm run electron  # Test built version
   ```

### Hot Reload Development
- **Frontend Changes**: Auto-reload in browser
- **Backend Changes**: Restart with `Ctrl+R` in Electron
- **Config Changes**: Full restart required

### Debugging
```bash
# Enable debug mode
npm run electron:dev

# Use Chrome DevTools
# Menu -> View -> Toggle Developer Tools

# Debug main process
npm run dev:main -- --inspect
```

## 📱 Release Process

### 1. Version Management
```bash
# Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Pre-Release Checklist
- [ ] All tests passing (`npm test`)
- [ ] Code quality checks pass (`npm run lint`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

### 3. Build Release Artifacts
```bash
# Clean previous builds
rm -rf dist dist-electron

# Build for all platforms
npm run build
npm run dist

# Verify build outputs
ls -la dist-electron/
```

### 4. Create GitHub Release
```bash
# Tag the release
git tag v1.0.1
git push origin v1.0.1

# Upload artifacts to GitHub Releases
# - Prompt Injector-1.0.1-arm64.dmg (macOS)
# - Prompt Injector Setup 1.0.1.exe (Windows)
# - prompt-injector-1.0.1.AppImage (Linux)
```

### 5. Post-Release Tasks
- Update README.md download links
- Announce on community channels
- Monitor for issues and feedback

## 🏗️ Build Configuration

### Electron Builder Configuration
The build process uses Electron Builder with configuration in `package.json`:

```json
{
  "build": {
    "appId": "com.preamble.promptinjector",
    "productName": "Prompt Injector",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "node_modules/**/*",
      "assets/**/*"
    ],
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": ["dmg", "zip"],
      "icon": "assets/icon.icns"
    },
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "assets/icon.png"
    }
  }
}
```

### TypeScript Configuration
- **Main Process**: `tsconfig.main.json`
- **Renderer Process**: `tsconfig.json`
- **Build Process**: `tsconfig.node.json`

### Vite Configuration
Located in `vite.config.ts`:
- React plugin configuration
- TypeScript support
- Hot Module Replacement (HMR)
- Build optimization

## 🔧 Troubleshooting

### Common Issues

#### 1. Node.js Version Issues
```bash
# Check current version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Or using n
n 18
```

#### 2. npm Installation Problems
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use npm ci for clean install
npm ci
```

#### 3. Build Failures
```bash
# Clean build artifacts
rm -rf dist dist-electron

# Rebuild native dependencies
npm rebuild

# Try building step by step
npm run build:renderer
npm run build:main
npm run dist
```

#### 4. Permission Errors (macOS/Linux)
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ./node_modules

# Or use sudo for build
sudo npm run dist
```

#### 5. Windows Build Issues
```bash
# Install Windows build tools
npm install --global windows-build-tools

# Or use Visual Studio installer
# Install "C++ build tools" workload
```

#### 6. Electron Binary Issues
```bash
# Clear Electron cache
npx electron-rebuild

# Force download
npm run postinstall
```

### Platform-Specific Troubleshooting

#### macOS
- **Gatekeeper Issues**: Sign builds or disable Gatekeeper temporarily
- **Notarization**: Required for distribution outside Mac App Store
- **Universal Builds**: Ensure both architectures are supported

#### Windows
- **Antivirus**: Exclude project folder from real-time scanning
- **Permissions**: Run as administrator if needed
- **Path Length**: Use short paths to avoid Windows path limit

#### Linux
- **Dependencies**: Install build essentials
  ```bash
  sudo apt-get install build-essential
  ```
- **AppImage**: Ensure FUSE is installed
- **Permissions**: Make AppImage executable

### Performance Optimization

#### Build Performance
```bash
# Use parallel builds
npm run build -- --parallel

# Increase memory for Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Development Performance
```bash
# Disable source maps in development
export VITE_SOURCEMAP=false
npm run dev

# Use faster file watching
export CHOKIDAR_USEPOLLING=false
npm run dev
```

### Debug Information

#### Enable Debug Logging
```bash
# Electron debug
export ELECTRON_ENABLE_LOGGING=true
npm run dev

# Vite debug
export DEBUG=vite:*
npm run dev:renderer

# Build debug
export DEBUG=electron-builder
npm run dist
```

#### System Information
```bash
# Check system info
npm run env-info

# Check dependencies
npm ls --depth=0

# Check for vulnerabilities
npm audit
```

## 📊 Build Outputs

### Development Build
```
dist/
├── main/           # Main process files
├── renderer/       # Renderer process files
└── assets/         # Static assets
```

### Production Build
```
dist-electron/
├── Prompt Injector-1.0.0-arm64.dmg        # macOS Apple Silicon
├── Prompt Injector-1.0.0-x64.dmg          # macOS Intel
├── Prompt Injector Setup 1.0.0.exe         # Windows installer
├── prompt-injector-1.0.0.AppImage         # Linux AppImage
└── prompt-injector_1.0.0_amd64.deb        # Debian package
```

### File Size Expectations
- **macOS DMG**: 150-300MB
- **Windows EXE**: 120-250MB
- **Linux AppImage**: 130-270MB
- **Linux DEB**: 120-250MB

## 🔒 Security Considerations

### Code Signing
```bash
# macOS
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password

# Windows
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
```

### Build Security
- Use official Node.js distributions
- Verify npm package integrity
- Keep dependencies updated
- Use lockfiles for reproducible builds

### Distribution Security
- Sign all release builds
- Use HTTPS for distribution
- Verify checksums
- Monitor for supply chain attacks

## 📞 Support & Resources

### Getting Help
- **GitHub Issues**: Bug reports and build problems
- **GitHub Discussions**: Questions and community support
- **Documentation**: Check docs/ folder for detailed guides
- **Community**: Join our development community

### Useful Resources
- **Electron Documentation**: https://electronjs.org/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **React Documentation**: https://reactjs.org/docs/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/

### Development Tools
- **VS Code Extensions**: TypeScript, ESLint, Prettier
- **Browser DevTools**: Chrome/Edge for debugging
- **Electron DevTools**: Built-in debugging capabilities
- **Git GUI**: GitKraken, SourceTree, or VS Code Git

---

*This build guide is maintained alongside the project. For the most current information, always refer to the latest documentation and package.json scripts.*

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Next Review**: March 2025  
**Status**: Active Development
