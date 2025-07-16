# Build and Release Guide

This document explains how to build and release the Prompt Injector application using GitHub Actions for automated cross-platform builds.

## Overview

The project uses GitHub Actions to automatically build installers for all supported platforms (macOS, Windows, Linux) without requiring developers to build locally or store large binary files in the repository.

## Automated Build System

### GitHub Actions Workflows

1. **Build and Release** (`.github/workflows/build-and-release.yml`)
   - Triggered automatically when a new release is published
   - Builds installers for all platforms simultaneously
   - Attaches installers to the GitHub release

2. **Manual Build Test** (`.github/workflows/manual-build.yml`)
   - Can be triggered manually for testing
   - Allows building for specific platforms or all platforms
   - Provides artifacts for download (5-day retention)

### Supported Platforms

- **macOS**: Creates `.dmg` installer for Apple Silicon (arm64)
- **Windows**: Creates `.exe` installer and portable executable
- **Linux**: Creates `.AppImage` portable application

## Creating a Release

### Method 1: Using the Helper Script (Recommended)

```bash
npm run release
```

This interactive script will:
1. Ask for the new version number
2. Ask for release title and description
3. Update `package.json` version
4. Commit and push changes
5. Create the GitHub release
6. Trigger automatic builds

**Prerequisites:**
- GitHub CLI installed: `brew install gh` (macOS) or [download](https://cli.github.com/)
- Authenticated with GitHub: `gh auth login`

### Method 2: Manual Release Creation

1. **Update Version** (if needed)
   ```bash
   # Update version in package.json
   npm version 1.0.1
   ```

2. **Push Changes**
   ```bash
   git push origin main
   ```

3. **Create Release on GitHub**
   - Go to [GitHub Releases](https://github.com/preambleai/prompt-injector/releases)
   - Click "Create a new release"
   - Enter tag (e.g., `v1.0.1`)
   - Add title and description
   - Click "Publish release"

4. **Wait for Builds**
   - GitHub Actions will automatically build installers (~10-15 minutes)
   - Installers will be attached to the release when complete

## Manual Build Testing

### Test Builds via GitHub Actions

1. Go to [GitHub Actions](https://github.com/preambleai/prompt-injector/actions)
2. Select "Manual Build Test"
3. Click "Run workflow"
4. Choose platform:
   - `all` - Build for all platforms
   - `macos` - Build for macOS only
   - `windows` - Build for Windows only
   - `linux` - Build for Linux only
5. Download artifacts when build completes

### Local Development Builds

For development and testing:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for current platform
npm run dist

# Build for specific platform
npm run dist:mac     # macOS
npm run dist:win     # Windows
npm run dist:linux   # Linux

# Build for all platforms (requires platform-specific tools)
npm run dist:all
```

## Build Configuration

### Electron Builder Configuration

Located in `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.preambleai.prompt-injector",
    "productName": "Prompt Injector",
    "directories": {
      "output": "dist"
    },
    "files": [
      "dist-electron/**/*",
      "dist/**/*",
      "package.json"
    ],
    "mac": {
      "category": "public.app-category.developer-tools",
      "icon": "build/icons/icon.icns"
    },
    "win": {
      "target": "nsis",
      "icon": "build/icons/icon-256.png"
    },
    "linux": {
      "target": "AppImage",
      "icon": "build/icons/icon-256.png"
    }
  }
}
```

### Icon Requirements

- **macOS**: `.icns` file (created automatically from PNG)
- **Windows**: `.png` file (256x256 minimum)
- **Linux**: `.png` file (256x256 minimum)

Icons are automatically generated from `assets/images/preamble logo.png` during the build process.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check [GitHub Actions logs](https://github.com/preambleai/prompt-injector/actions)
   - Ensure all dependencies are properly specified in `package.json`
   - Check for platform-specific issues in the logs

2. **Icon Issues**
   - Verify `assets/images/preamble logo.png` exists
   - Ensure PNG is square and high resolution (512x512 or higher)

3. **Release Script Issues**
   - Install GitHub CLI: `brew install gh`
   - Authenticate: `gh auth login`
   - Ensure you have push permissions to the repository

### Build Logs

- GitHub Actions builds: [https://github.com/preambleai/prompt-injector/actions](https://github.com/preambleai/prompt-injector/actions)
- Release history: [https://github.com/preambleai/prompt-injector/releases](https://github.com/preambleai/prompt-injector/releases)

## Security Considerations

- GitHub Actions runs in isolated environments
- No secrets are required for building (only for publishing)
- Installers are signed with GitHub's build certificates
- All builds are reproducible and traceable

## Release Timeline

1. **Create Release**: Immediate
2. **Build Trigger**: Within 1 minute
3. **Build Duration**: 10-15 minutes
4. **Installer Availability**: Automatically attached to release

## Best Practices

1. **Version Numbering**: Use semantic versioning (e.g., `v1.0.1`)
2. **Release Notes**: Include detailed changelog
3. **Testing**: Use manual builds for testing before releasing
4. **Documentation**: Update README and docs before releasing
5. **Commit Messages**: Use conventional commits for clarity

## Support

For build issues or questions:
- Check GitHub Actions logs
- Review this documentation
- Open an issue in the repository
- Contact the maintainers 