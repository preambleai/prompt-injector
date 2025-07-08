# Preamble Logo Assets

This directory contains Preamble branding assets for the AI Security Testing Platform.

## Required Files

### Logo Files
- `preamble-logo.svg` - Vector logo for web use (recommended)
- `preamble-logo.png` - PNG version for fallback (32x32, 64x64, 128x128, 256x256)
- `preamble-favicon.ico` - Favicon for browser tabs

### Logo Specifications
- **Primary Logo**: Should be a clean, modern design with "Preamble" text
- **Colors**: Blue (#2563eb) to Purple (#7c3aed) gradient (matching current theme)
- **Format**: SVG preferred for scalability
- **Size**: Multiple sizes for different use cases

## Current Implementation
The app currently uses a placeholder logo with a gradient "P" in a rounded square. Replace this with your actual Preamble logo by:

1. Adding the logo files to this directory
2. Updating the Layout component to use the actual logo
3. Updating the favicon in the public directory

## Usage in Code
```tsx
// Example usage in Layout.tsx
<img src="/assets/images/preamble-logo.svg" alt="Preamble" className="h-8 w-auto" />
``` 