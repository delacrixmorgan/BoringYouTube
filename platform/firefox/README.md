# Boring YouTube - Firefox Extension

A Firefox extension that makes YouTube thumbnails greyscale to reduce visual distractions, inspired by Arc's Boring YouTube boost.

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

### Method 1: Load as Temporary Extension (Development)

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to the `boring-youtube` folder and select `manifest.json`
6. The extension will be loaded and active on YouTube

### Method 2: Generate Icons First (Recommended)

1. Open `icons/generate-icons.html` in your browser
2. Right-click on each canvas and save as:
   - `icon-16.png`
   - `icon-48.png` 
   - `icon-128.png`
3. Save these files in the `icons/` directory
4. Follow Method 1 above

### Method 3: Package for Distribution

1. Ensure all icon files are generated (see Method 2)
2. Zip the entire `boring-youtube` folder contents (not the folder itself)
3. Submit to Firefox Add-ons store or distribute the .xpi file

## File Structure

```
boring-youtube/
├── manifest.json              # Extension configuration
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

### Performance Optimization
- Minimal DOM queries
- Efficient CSS selectors
- Debounced event handling
- Selective mutation observation

## Customization

### Adjusting Greyscale Intensity
In `styles.css`, change the `grayscale()` value:
```css
filter: grayscale(100%) !important;  /* Full greyscale */
filter: grayscale(70%) !important;   /* Partial greyscale */
```

### Adding Hover Effects
The extension includes a hover effect that reduces greyscale to 70% on hover for better user experience.

### Excluding Additional Elements
To exclude specific elements from greyscale, add them to the CSS exclusion rules:
```css
.your-element img {
  filter: none !important;
}
```

## Troubleshooting

### Extension Not Working
1. Check that it's enabled in `about:addons`
2. Refresh YouTube pages after installation
3. Check browser console for errors

### Thumbnails Still Colorful
1. YouTube may have updated their HTML structure
2. Check if CSS selectors need updating in `styles.css`
3. Clear browser cache and reload

### Fullscreen Detection Issues
1. Try different fullscreen methods (F11, video player button)
2. Check console for JavaScript errors
3. Ensure content script is loading properly

## Development

### Testing Changes
1. Make changes to the files
2. Go to `about:debugging`
3. Click "Reload" next to the extension
4. Refresh YouTube to see changes

### Adding New Selectors
If YouTube updates their structure, add new selectors to `styles.css`:
```css
.new-youtube-element img {
  filter: grayscale(100%) !important;
  transition: filter 0.2s ease !important;
}
```

## Browser Compatibility

- **Firefox**: Primary target (Manifest V2)
- **Chrome/Edge**: Would need conversion to Manifest V3

## Privacy

This extension:
- ✅ Only runs on YouTube domains
- ✅ Does not collect any data
- ✅ Does not make network requests
- ✅ Only modifies visual appearance locally

## License

This project is open source. Feel free to modify and distribute.

## Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly on different YouTube pages
4. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Basic greyscale functionality
- Fullscreen detection
- Dynamic content support
- Hover effects
