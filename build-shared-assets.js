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
    
    // Copy assets to each platform
    platforms.forEach(platform => {
        const platformDir = path.join(platformsDir, platform);
        
        if (!fs.existsSync(platformDir)) {
            console.warn(`⚠ Platform directory '${platformDir}' not found, skipping...`);
            return;
        }
        
        console.log(`📦 Building assets for ${platform}:`);
        
        assetsToCopy.forEach(({ from, to }) => {
            const srcPath = from;
            const destPath = path.join(platformDir, to);
            
            if (fs.existsSync(srcPath)) {
                copyFile(srcPath, destPath);
            } else {
                console.warn(`⚠ Source file '${srcPath}' not found, skipping...`);
            }
        });
        
        console.log('');
    });
    
    console.log('✅ Shared assets build complete!');
}

// Run the build
buildSharedAssets();
