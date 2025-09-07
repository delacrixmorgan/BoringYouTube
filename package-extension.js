#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const platforms = ['firefox', 'chromium'];
const outputDir = 'dist';

// Files and patterns to exclude from packaging
const excludePatterns = [
    '.DS_Store',
    '__MACOSX/*',
    '._*',
    '*.zip',
    'Thumbs.db',
    'desktop.ini'
];

function ensureOutputDir() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`✓ Created output directory: ${outputDir}`);
    }
}

function getManifestVersion(platformDir) {
    try {
        const manifestPath = path.join(platformDir, 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return manifest.version || '1.0.0';
    } catch (error) {
        console.warn(`⚠ Could not read manifest version for ${platformDir}, using 1.0.0`);
        return '1.0.0';
    }
}

function packagePlatform(platform) {
    const platformDir = path.join('platform', platform);
    
    if (!fs.existsSync(platformDir)) {
        console.error(`✗ Platform directory '${platformDir}' not found!`);
        return false;
    }
    
    console.log(`📦 Packaging ${platform}...`);
    
    // Get version from manifest
    const version = getManifestVersion(platformDir);
    const outputFile = path.join(outputDir, `boring-youtube-${platform}-v${version}.zip`);
    
    try {
        // Create exclude pattern for zip command
        const excludeArgs = excludePatterns.map(pattern => `-x "${pattern}"`).join(' ');
        
        // Create zip file using command line (excludes macOS metadata automatically)
        const zipCommand = `cd "${platformDir}" && zip -r "../../${outputFile}" . ${excludeArgs}`;
        
        console.log(`   Creating: ${outputFile}`);
        execSync(zipCommand, { stdio: 'pipe' });
        
        // Verify the zip was created and get its size
        if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            const sizeKB = Math.round(stats.size / 1024);
            console.log(`   ✓ Created ${outputFile} (${sizeKB} KB)`);
            return true;
        } else {
            console.error(`   ✗ Failed to create ${outputFile}`);
            return false;
        }
        
    } catch (error) {
        console.error(`   ✗ Error packaging ${platform}:`, error.message);
        return false;
    }
}

function listZipContents(platform) {
    const version = getManifestVersion(path.join('platform', platform));
    const zipFile = path.join(outputDir, `boring-youtube-${platform}-v${version}.zip`);
    
    if (!fs.existsSync(zipFile)) {
        return;
    }
    
    try {
        console.log(`\n📋 Contents of ${platform} package:`);
        const listCommand = `unzip -l "${zipFile}"`;
        const output = execSync(listCommand, { encoding: 'utf8', stdio: 'pipe' });
        
        // Filter out the zip utility header/footer and show just the files
        const lines = output.split('\n');
        const fileLines = lines.filter(line => 
            line.includes('/') || 
            (line.includes('.') && !line.includes('Archive:') && !line.includes('Length'))
        );
        
        fileLines.forEach(line => {
            if (line.trim()) {
                // Extract just the filename from the zip listing
                const parts = line.trim().split(/\s+/);
                const filename = parts[parts.length - 1];
                if (filename && filename !== 'Name' && !filename.includes('----')) {
                    console.log(`   ${filename}`);
                }
            }
        });
        
    } catch (error) {
        console.log(`   Could not list contents: ${error.message}`);
    }
}

function main() {
    console.log('🔧 Packaging browser extensions...\n');
    
    // Ensure output directory exists
    ensureOutputDir();
    
    let success = true;
    
    // Package each platform
    platforms.forEach(platform => {
        const result = packagePlatform(platform);
        if (!result) {
            success = false;
        }
    });
    
    if (success) {
        console.log('\n✅ All packages created successfully!');
        console.log(`\nPackages saved to: ${outputDir}/`);
        
        // List contents of each package for verification
        platforms.forEach(platform => {
            if (fs.existsSync(path.join('platform', platform))) {
                listZipContents(platform);
            }
        });
        
        console.log('\n💡 Tips:');
        console.log('   • These packages are clean and ready for store submission');
        console.log('   • No macOS metadata files (.DS_Store, __MACOSX, ._*) included');
        console.log('   • Upload the Firefox package to Mozilla Add-ons');
        console.log('   • Upload the Chromium package to Chrome Web Store');
        
    } else {
        console.error('\n❌ Some packages failed to create!');
        process.exit(1);
    }
}

// Run the packaging
main();
