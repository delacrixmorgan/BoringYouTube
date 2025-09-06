# Boring YouTube - Safari Extension

A Safari extension that makes YouTube thumbnails greyscale to reduce visual distractions, converted from the Firefox extension to work with Safari's WebKit extension architecture.

## Features

- 🎨 **Greyscale Thumbnails**: Converts all YouTube thumbnails to greyscale
- 🎬 **Fullscreen Aware**: Automatically disables greyscale when video player is in fullscreen mode
- 🔄 **Dynamic Content**: Works with YouTube's single-page application structure
- ⚡ **Lightweight**: Minimal performance impact
- 🎯 **Selective**: Only affects thumbnails, not the video player itself
- 🖱️ **Toggle Control**: Easy on/off toggle via Safari toolbar or popup

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

## Requirements

- **macOS**: 10.14 (Mojave) or later
- **Safari**: Version 14 or later
- **Xcode**: 14.0 or later (for building from source)
- **Apple Developer Account**: Required for distribution (not for local development)

## Installation

### Method 1: Build from Source (Recommended for Development)

1. **Clone or download** this repository
2. **Open Terminal** and navigate to the `webkit` folder:
   ```bash
   cd webkit
   ```
3. **Open the Xcode project**:
   ```bash
   open BoringYouTubeSafari.xcodeproj
   ```
4. **Set up code signing**:
   - Select the project in Xcode
   - Choose your development team in both targets
   - Update bundle identifiers if needed
5. **Build and run** the project (⌘+R)
6. **Enable the extension**:
   - The app will launch and show instructions
   - Click "Open Safari Preferences"
   - Go to Extensions tab
   - Enable "Boring YouTube Extension"
7. **Visit YouTube** to see greyscale thumbnails

### Method 2: App Store Distribution

*Note: This extension is not currently available on the App Store. You'll need to build from source.*

## Project Structure

```
webkit/
├── BoringYouTubeSafari.xcodeproj/     # Xcode project
├── BoringYouTubeSafari/               # Main macOS app
│   ├── AppDelegate.swift              # App lifecycle management
│   ├── ViewController.swift           # Main app interface
│   └── Info.plist                     # App configuration
├── BoringYouTubeSafari Extension/     # Safari extension
│   ├── SafariExtensionHandler.swift   # Extension logic & messaging
│   ├── SafariExtensionViewController.swift # Popup interface
│   ├── Resources/
│   │   ├── content.js                 # Content script (DOM manipulation)
│   │   └── styles.css                 # Greyscale CSS rules
│   ├── Info.plist                     # Extension configuration
│   └── BoringYouTubeSafari Extension.entitlements
└── README.md                          # This file
```

## How It Works

### Safari Extension Architecture
Unlike Chrome/Firefox extensions, Safari extensions require:
- **Native macOS App**: Wraps and distributes the extension
- **App Extension Target**: Contains the actual extension code
- **Swift Code**: Handles extension lifecycle and messaging
- **JavaScript Content Scripts**: Manipulates webpage content

### Core Components

1. **Content Script (`content.js`)**:
   - Detects YouTube thumbnails
   - Monitors fullscreen state
   - Handles dynamic content loading
   - Communicates with extension handler

2. **Extension Handler (`SafariExtensionHandler.swift`)**:
   - Manages extension state
   - Handles toolbar button clicks
   - Stores user preferences
   - Communicates with content scripts

3. **CSS Styles (`styles.css`)**:
   - Applies greyscale filters to thumbnails
   - Includes hover effects
   - Excludes video players and fullscreen content

## Development

### Building the Project

1. **Open in Xcode**:
   ```bash
   open BoringYouTubeSafari.xcodeproj
   ```

2. **Select target**: Choose "BoringYouTubeSafari" scheme

3. **Set development team**: Required for code signing

4. **Build**: ⌘+B or Product → Build

5. **Run**: ⌘+R or Product → Run

### Debugging

1. **Enable Safari Developer Menu**:
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"

2. **Debug extension**:
   - Develop → Web Extension Background Pages
   - Develop → [Your Extension] → Inspect Element

3. **Console logging**: Check both Safari Web Inspector and Xcode console

### Making Changes

1. **JavaScript/CSS changes**: Edit files in `Resources/` folder
2. **Swift changes**: Edit `.swift` files
3. **Rebuild**: ⌘+B in Xcode
4. **Test**: Reload extension in Safari Preferences

## Key Differences from Firefox Version

| Aspect | Firefox Extension | Safari Extension |
|--------|------------------|------------------|
| **Architecture** | Chrome extension APIs | Native app + extension |
| **Manifest** | `manifest.json` | `Info.plist` |
| **Background Script** | `background.js` | `SafariExtensionHandler.swift` |
| **Storage** | `chrome.storage` | `UserDefaults` |
| **Messaging** | `chrome.runtime` | `safari.extension` |
| **Popup** | HTML/CSS/JS | Swift/Cocoa |
| **Distribution** | Firefox Add-ons | App Store / Direct |
| **Installation** | Browser extension | macOS application |

## Customization

### Adjusting Greyscale Intensity
Edit `Resources/styles.css`:
```css
filter: grayscale(100%) !important;  /* Full greyscale */
filter: grayscale(70%) !important;   /* Partial greyscale */
```

### Adding Hover Effects
The extension includes hover effects that reduce greyscale on mouse hover for better UX.

### Modifying Selectors
If YouTube updates their HTML structure, update the CSS selectors in `styles.css`.

## Distribution

### For Personal Use
- Build and run locally (no developer account needed for personal use)

### For Public Distribution
1. **Apple Developer Account**: Required ($99/year)
2. **Code Signing**: Configure in Xcode project settings
3. **App Store Review**: Submit through App Store Connect
4. **Notarization**: Required for distribution outside App Store

### Building for Distribution
```bash
# Archive the project
Product → Archive (in Xcode)

# Export for distribution
Window → Organizer → Distribute App
```

## Troubleshooting

### Extension Not Appearing in Safari
1. Check that the app is running
2. Verify code signing is configured
3. Check Safari Preferences → Extensions
4. Restart Safari

### Thumbnails Still Colorful
1. Clear Safari cache
2. Check if extension is enabled
3. Inspect console for JavaScript errors
4. Verify CSS selectors are current

### Build Errors
1. Set development team in Xcode project settings
2. Check bundle identifier conflicts
3. Update to latest Xcode version
4. Clean build folder (Shift+⌘+K)

### Extension Not Loading Content Script
1. Check Info.plist configuration
2. Verify domain permissions
3. Test with Safari Web Inspector
4. Check extension handler messaging

## Privacy & Security

This extension:
- ✅ Only runs on YouTube domains (`youtube.com`, `www.youtube.com`)
- ✅ Does not collect any personal data
- ✅ Does not make external network requests
- ✅ Only modifies visual appearance locally
- ✅ Uses sandboxed app architecture
- ✅ Stores preferences locally only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different YouTube pages
5. Submit a pull request

## License

This project is open source. Feel free to modify and distribute according to the project license.

## Changelog

### v1.0.0
- Initial Safari extension conversion from Firefox
- Native Swift app wrapper
- Safari extension architecture
- Toolbar integration
- Popup interface
- State management with UserDefaults
- Full feature parity with Firefox version

## Support

For issues specific to the Safari version, please check:
1. Safari version compatibility
2. macOS version compatibility
3. Extension permissions in Safari Preferences
4. Console logs in Safari Web Inspector

For general functionality issues, refer to the main project repository.
