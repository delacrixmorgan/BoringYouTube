Here's a complete guide to building and distributing the **Boring YouTube** extension for both Firefox and Chrome, based on your project's existing scripts:

---

## 🔧 Step 1: Build Shared Assets

This syncs shared code from `shared/` into both `platform/firefox/` and `platform/chromium/`:

```bash
npm run build
# or equivalently:
node build-shared-assets.js
```

This will:
- Copy `styles.css`, `popup.css`, and icons into both platform folders
- Process manifest templates (`manifest-firefox.json`, `manifest-chromium.json`) with the current version from `package.json`
- Process the shared `popup.html` template

---

## 📦 Step 2: Package the Extensions (Create ZIPs)

This creates submission-ready `.zip` files in a `dist/` folder:

```bash
npm run package
# or for a clean build + package in one step:
npm run package:clean
```

This produces:
- `dist/boring-youtube-firefox-v1.0.1.zip`
- `dist/boring-youtube-chromium-v1.0.1.zip`

Both ZIPs are clean — no macOS metadata files (`.DS_Store`, `__MACOSX`, etc.).

---

## 🚀 Step 3: Submit to Stores

### Firefox — Mozilla Add-Ons
1. Go to [addons.mozilla.org/developers](https://addons.mozilla.org/en-US/developers/)
2. Click **Submit a New Add-on**
3. Upload `dist/boring-youtube-firefox-v1.0.1.zip`
4. Complete the listing form (description, screenshots, etc.)
5. Submit for review (Mozilla reviews manually; typically takes 1–7 days)

### Chrome — Chrome Web Store
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **Add new item**
3. Upload `dist/boring-youtube-chromium-v1.0.1.zip`
4. Fill in the store listing details
5. Submit for review (usually reviewed within a few days)

---

## 💻 Local Development / Testing (No Store)

**Firefox:**
1. Open `about:debugging` in Firefox
2. Click "This Firefox" → "Load Temporary Add-on…"
3. Select `platform/firefox/manifest.json`

**Chrome / Edge:**
1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `platform/chromium/` folder

---

## 🔄 Release Workflow Summary

```
1. Edit code in shared/ (or platform-specific files)
2. Bump version in package.json
3. npm run package:clean   ← builds + packages in one step
4. Upload ZIPs from dist/ to Firefox Add-Ons & Chrome Web Store
```

---

The `package:clean` script handles everything — it runs `build-shared-assets.js` first (to sync shared code), then `package-extension.js` (to create the ZIPs). That single command is all you need before submitting to either store.
