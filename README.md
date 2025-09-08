# 🎨 Boring YouTube — Browser Extension Greyscale YouTube Thumbnails

![walkthrough](screenshots/walkthrough.gif)

[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=flat&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/en-GB/firefox/addon/boring-youtube/)
[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=flat&logo=Google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/boring-youtube/apblcdimnigcdbnabbdigacidcaepkgj)
[![Safari](https://img.shields.io/badge/Safari-000000?style=flat&logo=Safari&logoColor=white)](https://github.com/delacrixmorgan/BoringYouTube/releases)

> Still getting sucked into YouTube rabbit holes by flashy thumbnails? We've all been there. Boring YouTube is here to help you focus.

## ✨ What Is This?

![Icon](shared/assets/icons/icon-128.png)

Boring YouTube is a lightweight browser extension that turns all YouTube thumbnails **greyscale**, inspired by Arc browser's beloved [Boring YouTube](https://arc.net/boost/85806C86-A13B-4577-BD4D-05F03C95CE72) Boost by Simon Beel. 

Think about it: those bright, eye-catching thumbnails are *designed* to grab your attention and keep you scrolling. By removing the visual noise, you can focus on the content that actually matters to you — not what the algorithm thinks will get the most clicks.

It's that simple. Greyscale thumbnails = less distraction = more intentional viewing.

## 🧰 Features

- ✅ **Instant Greyscale**: Converts all YouTube thumbnails to greyscale automatically
- ✅ **Smart Fullscreen Detection**: Automatically disables when you're watching videos fullscreen
- ✅ **Dynamic Content Ready**: Works seamlessly with YouTube's single-page application
- ✅ **Cross-Platform**: Available for **Firefox**, **Chrome**, **Edge**, and **Safari**
- ✅ **Lightweight & Fast**: Minimal performance impact, maximum focus
- ✅ **Toggle Control**: Easy on/off switch
- ✅ **Developer Friendly**: Clean, shared codebase architecture
- ✅ **Zero Tracking**: No data collection, no analytics, just pure functionality

## 🚀 Installation

### Browser Extension Stores 📦
- [Firefox Add-Ons](https://addons.mozilla.org/en-GB/firefox/addon/boring-youtube/)
- [Chrome Web Store](https://chromewebstore.google.com/detail/boring-youtube/apblcdimnigcdbnabbdigacidcaepkgj)
- [GitHub Releases](https://github.com/delacrixmorgan/BoringYouTube/releases)

### Local Installation 💻

**Firefox**
1. Visit `about:debugging` in Firefox
2. Click "This Firefox" → "Load Temporary Add-on..."
3. Select `platform/firefox/manifest.json`
4. Done! Use the toolbar button to toggle on/off

**Chrome / Edge / Chromium**
1. Navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `platform/chromium/` folder
5. Enjoy your distraction-free YouTube!

**Safari**
1. Open the `platform/webkit/BoringYouTubeSafari.xcodeproj` in Xcode
2. Build and run the project
3. Enable the extension in Safari preferences

## 🛠 How It Works

1. **Detects YouTube**: The extension activates when you visit YouTube
2. **Applies Greyscale**: CSS filters turn all thumbnails grey in real-time
3. **Stays Smart**: Automatically disables during fullscreen video playback
4. **Updates Dynamically**: Works with YouTube's infinite scroll and navigation

The magic happens through carefully crafted CSS that targets YouTube's thumbnail elements without affecting the video player itself. Clean, simple, effective.

## 🏗 Architecture

This project uses a **shared asset architecture** to eliminate code duplication:

```
├── shared/                    # Single source of truth
│   ├── assets/styles.css     # Shared styling
│   └── scripts/content.js    # Core functionality
├── platform/
│   ├── firefox/              # Manifest V2 + popup UI
│   ├── chromium/             # Manifest V3, always-on
│   └── webkit/               # Safari extension
└── build-shared-assets.js    # Distribution script
```

**Benefits:**
- ✅ Write once, deploy everywhere
- ✅ Consistent behavior across browsers
- ✅ Easy maintenance and updates
- ✅ Clear separation of concerns

## 🧪 Development

**Quick Start:**
```bash
# Install dependencies (if any)
npm install

# Build shared assets to all platforms
npm run build
# or
node build-shared-assets.js
```

**Making Changes:**
1. Edit shared assets in `shared/`
2. Run the build script to distribute changes
3. Test across platforms
4. Commit and push

**Platform-Specific Features:**
- **Firefox**: Full popup UI with toggle functionality
- **Chrome/Edge**: Always-on, minimal manifest
- **Safari**: Native macOS app with extension

## ⚡ Tip

![tip](screenshots/tip.gif)

If you want to supercharge your minimal YouTube experience, you should consider [Unhook: Remove YouTube](https://unhook.app/) as an add-on to Boring YouTube. It allows you to toggle off features on YouTube that you don't need.

May it be Shorts, Mixes, comments and whole load of YouTube bloatware.

## 💡 Contributing

Pull requests are welcome! If you find a bug or have a feature request, please open an issue on GitHub.

## 📝 License

This project is **open source** and available under the [GPLv3 License](LICENSE.md).

## ♥️ Acknowledgments

- [Boring YouTube Boost by Simon Beel](https://arc.net/boost/85806C86-A13B-4577-BD4D-05F03C95CE72) 
