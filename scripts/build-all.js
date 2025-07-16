#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Prompt Injector for all platforms...\n');

// Clean previous builds
if (fs.existsSync('dist-electron')) {
  console.log('🧹 Cleaning previous builds...');
  fs.rmSync('dist-electron', { recursive: true });
}

// Build commands for different platforms
const builds = [
  { name: 'macOS', command: 'npm run dist:mac' },
  { name: 'Windows', command: 'npm run dist:win' },
  { name: 'Linux', command: 'npm run dist:linux' }
];

let successCount = 0;
let failCount = 0;

for (const build of builds) {
  try {
    console.log(`📦 Building ${build.name}...`);
    execSync(build.command, { stdio: 'inherit' });
    console.log(`✅ ${build.name} build completed successfully!\n`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${build.name} build failed!`);
    console.error(error.message);
    failCount++;
  }
}

console.log('\n📊 Build Summary:');
console.log(`✅ Successful builds: ${successCount}`);
console.log(`❌ Failed builds: ${failCount}`);

// List created files
if (fs.existsSync('dist-electron')) {
  console.log('\n📁 Created distribution files:');
  const files = fs.readdirSync('dist-electron')
    .filter(file => file.endsWith('.dmg') || file.endsWith('.exe') || file.endsWith('.AppImage') || file.endsWith('.deb'))
    .map(file => {
      const stats = fs.statSync(path.join('dist-electron', file));
      const size = (stats.size / (1024 * 1024)).toFixed(1);
      return `   ${file} (${size} MB)`;
    });
  
  files.forEach(file => console.log(file));
}

console.log('\n🎉 Build process completed!'); 