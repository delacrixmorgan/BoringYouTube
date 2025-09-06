# Boring YouTube - Chrome Extension

A Chrome extension that makes YouTube thumbnails greyscale to reduce visual distractions, inspired by Arc's Boring YouTube boost.

## Features

- 🎨 **Greyscale Thumbnails**: Converts all YouTube thumbnails to greyscale
- 🎬 **Fullscreen Aware**: Automatically disables greyscale when video player is in fullscreen mode
- 🔄 **Dynamic Content**: Works with YouTube's single-page application structure
- ⚡ **Lightweight**: Minimal performance impact
- 🎯 **Selective**: Only affects thumbnails, not the video player itself

## What Gets Greyscaled

- Video thumbnails on homepage
- Search result thumbnails
- Recommended video thumbnails
- Playlist thumbnails
- Channel thumbnails
- YouTube Shorts thumbnails
- Sidebar video thumbnails

## What Stays Normal

- The main video player
- Videos in fullscreen mode
- YouTube's interface elements
- Non-thumbnail images

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Navigate to and select the `boring-youtube-chrome` folder
6. The extension will be loaded and active on YouTube

### Method 2: Generate Icons First (Recommended)

1. Open `icons/generate-icons.html` in your browser
2. Right-click on each canvas and save as:
   - `icon-16.png`
   - `icon-48.png` 
   - `icon-128.png`
3. Save these files in the `icons/` directory
4. Follow Method 1 above

### Method 3: Package for Chrome Web Store

1. Ensure all icon files are generated (see Method 2)
2. Zip the entire `boring-youtube-chrome` folder contents (not the folder itself)
3. Upload to Chrome Web Store Developer Dashboard

## File Structure

```
boring-youtube-chrome/
├── manifest.json              # Extension configuration (Manifest V3)
├── content-script.js          # Main logic and fullscreen detection
├── styles.css                 # Greyscale CSS rules
├── icons/
│   ├── generate-icons.html    # Tool to generate icon files
│   ├── icon.svg              # Source SVG icon
│   ├── icon-16.png           # 16x16 icon (generate from HTML)
│   ├── icon-48.png           # 48x48 icon (generate from HTML)
│   └── icon-128.png          # 128x128 icon (generate from HTML)
└── README.md                 # This file
```

## Chrome-Specific Features

### Manifest V3 Compatibility
- Uses `host_permissions` instead of `permissions`
- Compatible with Chrome's latest extension standards
- Future-proof for Chrome updates

### Chrome Extension Store Ready
- Follows Chrome Web Store guidelines
- Proper icon sizes and formats
- Clean manifest structure

## How It Works

### CSS Approach
The extension uses CSS `filter: grayscale(100%)` to convert thumbnails to greyscale. It targets specific YouTube elements and image sources.

### Dynamic Content Handling
YouTube is a single-page application that loads content dynamically. The extension uses:
- `MutationObserver` to detect new content
- Event listeners for navigation changes
- Periodic checks as backup

### Fullscreen Detection
The extension monitors for:
- Standard fullscreen API events
- YouTube-specific fullscreen classes
- DOM changes that indicate fullscreen state

## Differences from Firefox Version

- **Manifest V3**: Uses the latest Chrome extension format
- **Host Permissions**: Uses `host_permissions` instead of `permissions`
- **Same Functionality**: All core features work identically

## Installation Instructions for Chrome

1. **Download/Clone** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"**
5. **Select** the `boring-youtube-chrome` folder
6. **Visit YouTube** - thumbnails should now be greyscale!

## Testing

After installation:
1. Go to YouTube.com
2. All thumbnails should appear in greyscale
3. Play a video and enter fullscreen - thumbnails return to color
4. Exit fullscreen - greyscale returns

## Troubleshooting

### Extension Not Loading
1. Make sure Developer Mode is enabled
2. Check for errors in `chrome://extensions/`
3. Try reloading the extension

### Thumbnails Still Colorful
1. Refresh YouTube pages after installation
2. Check browser console for errors
3. Ensure content script is loading

### Fullscreen Issues
1. Try different fullscreen methods
2. Check console for JavaScript errors
3. Reload the extension if needed

## Development

### Making Changes
1. Edit the files in the extension folder
2. Go to `chrome://extensions/`
3. Click the reload button for the extension
4. Refresh YouTube to see changes

## Privacy

This extension:
- ✅ Only runs on YouTube domains
- ✅ Does not collect any data
- ✅ Does not make network requests
- ✅ Only modifies visual appearance locally

## Browser Compatibility

- **Chrome**: Primary target (Manifest V3)
- **Edge**: Should work (Chromium-based)
- **Firefox**: Use the separate Firefox version

## License

This project is open source. Feel free to modify and distribute.

## Changelog

### v1.0.0
- Initial Chrome release
- Manifest V3 compatibility
- Same functionality as Firefox version
- Chrome Web Store ready
