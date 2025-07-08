# Build Instructions - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Create install files
npm run dist
```

## 📦 Available Build Commands

| Command | Description | Output |
|---------|-------------|---------|
| `npm run build` | Build for production | `dist/` directory |
| `npm run dist` | Create install files | `dist-electron/` directory |
| `npm run dist:mac` | macOS installers | `.dmg` files |
| `npm run dist:win` | Windows installers | `.exe` files |
| `npm run dist:linux` | Linux packages | `.AppImage`, `.deb` |

## 🖥️ Platform-Specific Builds

### macOS
```bash
# Universal build (Apple Silicon + Intel)
npm run dist:mac

# Apple Silicon only
npm run dist:mac-arm64

# Intel only
npm run dist:mac-x64
```

### Windows
```bash
# 64-bit Windows
npm run dist:win
npm run dist:win-x64
```

### Linux
```bash
# 64-bit Linux
npm run dist:linux
npm run dist:linux-x64
```

## 📋 Release Process

### 1. Update Version
```bash
# Edit package.json
{
  "version": "1.0.1"
}
```

### 2. Build Install Files
```bash
npm run dist
```

### 3. Test Install Files
- Test `.dmg` on macOS
- Test `.exe` on Windows
- Verify app launches correctly

### 4. Create GitHub Release
1. Go to GitHub → Releases → "Create a new release"
2. Tag: `v1.0.1`
3. Title: `Prompt Injector v1.0.1`
4. Upload files from `dist-electron/`:
   - `Prompt Injector-1.0.1-arm64.dmg`
   - `Prompt Injector Setup 1.0.1.exe`

### 5. Update README Links
Replace placeholder URLs with actual release URLs.

## 🔧 Build Configuration

The build uses Electron Builder with this configuration:

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

## 🚨 Troubleshooting

### Common Issues

#### Permission Errors
```bash
# macOS/Linux
sudo npm run dist
```

#### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Build Fails
```bash
# Clean and rebuild
npm run clean
npm run build
npm run dist
```

### Code Signing

#### macOS Code Signing
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run dist:mac
```

#### Windows Code Signing
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run dist:win
```

## 📁 Output Files

After running `npm run dist`, you'll find:

```
dist-electron/
├── Prompt Injector-1.0.0-arm64.dmg          # macOS installer
├── Prompt Injector-1.0.0-arm64-mac.zip      # macOS zip
├── Prompt Injector Setup 1.0.0.exe          # Windows installer
├── Prompt Injector-1.0.0.AppImage           # Linux AppImage
└── prompt-injector_1.0.0_amd64.deb          # Linux deb package
```

## 🔄 Development Workflow

1. **Development**: `npm run dev`
2. **Testing**: `npm test`
3. **Build**: `npm run build`
4. **Package**: `npm run dist`
5. **Release**: Upload to GitHub Releases

## 📞 Support

- Check the main README.md for detailed instructions
- Review package.json for all available scripts
