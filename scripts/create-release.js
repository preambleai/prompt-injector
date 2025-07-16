#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log('🚀 GitHub Release Creator');
console.log(`Current version: ${currentVersion}`);
console.log('');

// Get user input
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => {
    readline.question(question, resolve);
  });
}

async function main() {
  try {
    // Ask for version
    const version = await ask(`Enter new version (current: ${currentVersion}): `) || currentVersion;
    const tag = version.startsWith('v') ? version : `v${version}`;
    
    // Ask for release notes
    const title = await ask(`Enter release title: `) || `Release ${tag}`;
    const description = await ask(`Enter release description: `) || `Release ${tag} with bug fixes and improvements`;
    
    // Ask for confirmation
    console.log('\n📋 Release Summary:');
    console.log(`   Tag: ${tag}`);
    console.log(`   Title: ${title}`);
    console.log(`   Description: ${description}`);
    console.log('');
    
    const confirm = await ask('Create this release? (y/N): ');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Release cancelled');
      process.exit(0);
    }
    
    // Update package.json version if needed
    const versionWithoutV = version.replace(/^v/, '');
    if (versionWithoutV !== currentVersion) {
      console.log(`📝 Updating package.json version to ${versionWithoutV}...`);
      packageJson.version = versionWithoutV;
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    }
    
    // Check if gh CLI is installed
    try {
      execSync('gh --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('❌ GitHub CLI (gh) is not installed');
      console.log('   Install it from: https://cli.github.com/');
      console.log('   Then run: gh auth login');
      process.exit(1);
    }
    
    // Check if user is authenticated
    try {
      execSync('gh auth status', { stdio: 'ignore' });
    } catch (error) {
      console.log('❌ You are not authenticated with GitHub CLI');
      console.log('   Run: gh auth login');
      process.exit(1);
    }
    
    // Commit changes if any
    try {
      execSync('git add package.json', { stdio: 'ignore' });
      execSync(`git commit -m "chore: bump version to ${versionWithoutV}"`, { stdio: 'ignore' });
      console.log('✅ Committed version bump');
    } catch (error) {
      // No changes to commit, that's fine
    }
    
    // Push changes
    console.log('📤 Pushing changes to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    // Create release with auto-generated notes
    console.log('🏷️  Creating GitHub release...');
    const releaseCommand = `gh release create "${tag}" --title "${title}" --notes "${description}" --generate-notes`;
    execSync(releaseCommand, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Release created successfully!');
    console.log('🔄 GitHub Actions will now build installers for all platforms');
    console.log('📦 Installers will be available in ~10-15 minutes');
    console.log('');
    console.log('🔗 View release: https://github.com/preambleai/prompt-injector/releases');
    console.log('🔗 View builds: https://github.com/preambleai/prompt-injector/actions');
    
  } catch (error) {
    console.error('❌ Error creating release:', error.message);
    process.exit(1);
  } finally {
    readline.close();
  }
}

main(); 