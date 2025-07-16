# GitHub Releases Guide for Prompt Injector

This guide explains how to use GitHub Releases to distribute your Prompt Injector application installers.

## 🚀 Quick Start

### Create a Release (Automated)

```bash
# Create a new release with automated workflow
npm run release
```

This will:
1. ✅ Prompt for version number and release details
2. ✅ Update `package.json` version
3. ✅ Commit and push changes
4. ✅ Create GitHub release
5. ✅ Trigger GitHub Actions to build installers
6. ✅ Upload installers to the release automatically

### Manual Release Creation

```bash
# Update version
npm version patch  # or minor/major

# Create release using GitHub CLI
gh release create v1.0.1 --title "Release v1.0.1" --notes "Bug fixes and improvements" --generate-notes
```

## 📦 What Gets Built

Your GitHub Actions workflow automatically builds installers for all platforms:

### macOS
- **DMG**: `Prompt Injector-1.0.0-arm64.dmg` (installer)
- **ZIP**: `Prompt Injector-1.0.0-arm64.zip` (portable)

### Windows
- **EXE**: `Prompt Injector Setup 1.0.0.exe` (installer)
- **Portable**: `Prompt Injector 1.0.0.exe` (portable)

### Linux
- **AppImage**: `Prompt Injector-1.0.0-arm64.AppImage` (portable)
- **DEB**: `Prompt Injector_1.0.0_amd64.deb` (package)

## 🔗 Download Links

### Main Download Buttons (README)
Your README now includes professional download buttons that link to the latest release page:

- **Main buttons**: Link to `/releases/latest` (users choose their file)
- **Quick downloads**: Direct links to specific installer files

### Direct Download URLs

For direct downloads, use these URL patterns:

```
https://github.com/preambleai/prompt-injector/releases/latest/download/[FILENAME]
```

Examples:
- macOS: `https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.0-arm64.dmg`
- Windows: `https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector%20Setup%201.0.0.exe`
- Linux: `https://github.com/preambleai/prompt-injector/releases/latest/download/Prompt%20Injector-1.0.0-arm64.AppImage`

## 🔄 Complete Release Workflow

### 1. Development Phase
```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin main
```

### 2. Release Phase
```bash
# Create release (this triggers everything)
npm run release
```

### 3. Automated Build Phase (GitHub Actions)
- ✅ Builds for macOS, Windows, Linux
- ✅ Creates installers for each platform
- ✅ Uploads installers to GitHub release
- ✅ Takes ~10-15 minutes to complete

### 4. User Download Phase
- ✅ Users visit your GitHub repository
- ✅ Click download buttons in README
- ✅ Download appropriate installer
- ✅ Install and run the application

## 📊 Release Analytics

GitHub automatically tracks:
- **Download counts** for each installer
- **Release popularity** over time
- **Platform preferences** of your users
- **Geographic distribution** of downloads

View analytics at: `https://github.com/preambleai/prompt-injector/releases`

## 🛠️ Troubleshooting

### Common Issues

**1. Build Fails**
```bash
# Check GitHub Actions logs
gh run list --limit 5
gh run view [RUN_ID]
```

**2. Wrong File Names**
- Check your `package.json` build configuration
- Verify `productName` and `version` fields
- Update direct download links if needed

**3. Missing Icons**
- Ensure `assets/icon-256.png` exists
- Or update icon paths in GitHub Actions workflow

**4. Release Not Triggering Build**
- Ensure release is "published" not "draft"
- Check GitHub Actions is enabled
- Verify workflow file syntax

### Manual Build Testing

Test builds without creating a release:

```bash
# Test local build
npm run dist

# Test specific platform
npm run dist:mac
npm run dist:win
npm run dist:linux

# Test GitHub Actions manually
# Go to: https://github.com/preambleai/prompt-injector/actions
# Click "Manual Build Test" → "Run workflow"
```

## 🎯 Best Practices

### Version Numbering
- Use semantic versioning: `1.0.0`, `1.0.1`, `1.1.0`
- Patch: Bug fixes (`1.0.0` → `1.0.1`)
- Minor: New features (`1.0.0` → `1.1.0`)
- Major: Breaking changes (`1.0.0` → `2.0.0`)

### Release Notes
- Use `--generate-notes` for automatic changelog
- Include breaking changes prominently
- List new features and bug fixes
- Thank contributors

### Testing
- Test on all platforms before release
- Verify download links work
- Check installer behavior
- Test auto-updates (if implemented)

## 📈 Advanced Features

### Pre-releases
```bash
# Create a pre-release
gh release create v1.0.0-beta.1 --title "Beta Release" --notes "Preview version" --prerelease
```

### Release Assets
Your workflow automatically uploads:
- All installer files
- Source code archives (ZIP/TAR)
- Checksums (if configured)

### Auto-updates
Consider implementing auto-updates using:
- [electron-updater](https://github.com/electron-userland/electron-updater)
- [update-electron-app](https://github.com/electron/update-electron-app)

## 🔗 Useful Commands

```bash
# List releases
gh release list

# View specific release
gh release view v1.0.0

# Delete release
gh release delete v1.0.0

# Edit release
gh release edit v1.0.0 --notes "Updated notes"

# Download release assets
gh release download v1.0.0
```

## 🎉 Success Metrics

Your GitHub Releases setup is successful when:
- ✅ Releases are created automatically
- ✅ All platforms build successfully
- ✅ Download buttons work correctly
- ✅ Users can easily install your app
- ✅ Download counts are tracked
- ✅ Release notes are informative

---

**Next Steps**: Once you've tested the release process, consider setting up:
1. **Auto-updates** for seamless user experience
2. **Homebrew cask** for macOS users
3. **Chocolatey package** for Windows users
4. **Snap package** for Linux users 