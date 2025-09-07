#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories
const sharedDir = 'shared';
const platformsDir = 'platform';
const platforms = ['firefox', 'chromium'];

// Files to copy
const assetsToCopy = [
    { from: 'shared/assets/styles.css', to: 'styles.css' },
    { from: 'shared/assets/popup.css', to: 'popup.css' },
    { from: 'shared/assets/icons/icon-16.png', to: 'icons/icon-16.png' },
    { from: 'shared/assets/icons/icon-32.png', to: 'icons/icon-32.png' },
    { from: 'shared/assets/icons/icon-48.png', to: 'icons/icon-48.png' },
    { from: 'shared/assets/icons/icon-128.png', to: 'icons/icon-128.png' }
];

// Template files to process with version injection
const templatesToProcess = [
    { from: 'shared/templates/popup.html', to: 'popup.html' },
    { from: 'shared/templates/manifest-firefox.json', to: 'manifest.json', platforms: ['firefox'] },
    { from: 'shared/templates/manifest-chromium.json', to: 'manifest.json', platforms: ['chromium'] }
];

function getVersionFromPackageJson() {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return packageJson.version;
    } catch (error) {
        console.error('✗ Failed to read version from package.json:', error.message);
        process.exit(1);
    }
}

function processTemplate(templatePath, outputPath, version) {
    try {
        let content = fs.readFileSync(templatePath, 'utf8');
        content = content.replace(/{{VERSION}}/g, version);
        
        // Ensure destination directory exists
        const destDir = path.dirname(outputPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, content);
        console.log(`✓ Processed ${templatePath} → ${outputPath} (v${version})`);
    } catch (error) {
        console.error(`✗ Failed to process template ${templatePath} → ${outputPath}:`, error.message);
    }
}

function copyFile(src, dest) {
    try {
        // Ensure destination directory exists
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copy file
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${src} → ${dest}`);
    } catch (error) {
        console.error(`✗ Failed to copy ${src} → ${dest}:`, error.message);
    }
}

function buildSharedAssets() {
    console.log('🔧 Building shared assets for all platforms...\n');
    
    // Check if shared directory exists
    if (!fs.existsSync(sharedDir)) {
        console.error(`✗ Shared directory '${sharedDir}' not found!`);
        process.exit(1);
    }
    
    // Get version from package.json
    const version = getVersionFromPackageJson();
    console.log(`📋 Using version: ${version}\n`);
    
    // Process each platform
    platforms.forEach(platform => {
        const platformDir = path.join(platformsDir, platform);
        
        if (!fs.existsSync(platformDir)) {
            console.warn(`⚠ Platform directory '${platformDir}' not found, skipping...`);
            return;
        }
        
        console.log(`📦 Building assets for ${platform}:`);
        
        // Copy regular assets
        assetsToCopy.forEach(({ from, to }) => {
            const srcPath = from;
            const destPath = path.join(platformDir, to);
            
            if (fs.existsSync(srcPath)) {
                copyFile(srcPath, destPath);
            } else {
                console.warn(`⚠ Source file '${srcPath}' not found, skipping...`);
            }
        });
        
        // Process templates with version injection
        templatesToProcess.forEach(({ from, to, platforms: templatePlatforms }) => {
            // If specific platforms are defined, only process for those platforms
            if (templatePlatforms && !templatePlatforms.includes(platform)) {
                return;
            }
            
            const srcPath = from;
            const destPath = path.join(platformDir, to);
            
            if (fs.existsSync(srcPath)) {
                processTemplate(srcPath, destPath, version);
            } else {
                console.warn(`⚠ Template file '${srcPath}' not found, skipping...`);
            }
        });
        
        console.log('');
    });
    
    console.log('✅ Shared assets build complete!');
}

// Run the build
buildSharedAssets();
