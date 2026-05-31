# ⚡ FlatGrabber: Premium Flaticon SVG Extractor & Figma Bridge

[![Chrome Extension](https://img.shields.io/badge/Extension-Chrome-blue.svg?style=for-the-badge&logo=google-chrome)](https://developer.chrome.com/docs/extensions/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Vector Enabled](https://img.shields.io/badge/Vector-SVG%20Unlocking-orange.svg?style=for-the-badge&logo=adobe-illustrator)](https://www.w3.org/Graphics/SVG/)
[![Figma Compatible](https://img.shields.io/badge/Figma-Bridge%20Ready-ff69b4?style=for-the-badge&logo=figma)](https://figma.com)

A high-performance, developer-focused Google Chrome extension engineered to inspect, edit, recolor, bulk package, and extract premium high-fidelity SVGs directly from Flaticon. It features a seamless Figma clipboard bridge, enabling designers and developers to copy vector codes and paste them directly into Figma as fully editable vector shapes.

---

## 🚀 Key Features

*   **⚡ Smart Hover Grabber:** Non-intrusive hover triggers positioned intelligently above icons to avoid blocking website controls.
*   **🎨 Instant Vector Recolor:** Dynamically edit colors of single icons or your entire saved collection in real time before exporting.
*   **✨ Bulletproof Figma Bridge:** Copy vector codes with one click (`Copy` button or `C` shortcut) and paste them directly into Figma as fully editable vector layers.
*   **🔥 Figma Grid Packager:** Copies your entire saved collection as a single, beautifully structured coordinate grid. Paste it directly into Figma to populate your canvas instantly.
*   **📦 Parallel Bulk Grabber ("Grab Page"):** Grab all icons on the page concurrently with an animated, glowing progress pipeline.
*   **💾 Offline ZIP Archiver:** Instantly compress and download your entire collection as beautifully categorized, optimized vector files locally.
*   **🏁 Photoshop/Figma Checkerboard Previews:** Custom transparency checkerboard backgrounds in the preview canvas and grid items so both pure white and pure black icons stand out beautifully.
*   **🔒 Smart Vector Status Indicator:** Automatically detects if an icon is PNG-only or Vector. If vector data is unavailable, it elegantly disables the SVG tab and provides clear tooltips to prevent empty clipboard errors.

---

## 🔥 The Secret Premium SVG Unlocking Hack

Flaticon natively restricts direct access to high-fidelity vector files for free accounts on search/modal grid screens. This extension bypasses that limitation using a built-in canvas scraping technique inside Flaticon's own **Icon Editor**. 

Follow this simple trick to extract clean, unwatermarked vectors for **any** vector-compatible icon:

1.  **Open Details:** Click on any icon to open its standard detail page.
2.  **Click "Edit icon":** Click the colorful **🎨 Edit icon** pencil button above the main preview image.
3.  **Grab from Editor:** Once the canvas editor loads, hover over the icon and click the floating **"Click to grab"** button on the canvas.
4.  **Vector Unlocked:** The extension will instantly intercept the editor's active canvas data and extract the raw vector paths! The **SVG Code** tab will light up, ready for you to copy.

---

## 🛠️ Installation Guide

Follow these simple steps to load the extension locally in developer mode:

1.  **Download or Clone:** Clone this repository or download the ZIP file and extract it to a directory on your machine (e.g., `svg-ext`).
2.  **Open Chrome Extensions:** In Google Chrome, navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the **Developer mode** switch in the top-right corner.
4.  **Load Unpacked:** Click **Load unpacked** in the top-left corner.
5.  **Select Directory:** Choose the folder containing the extension's files (where the `manifest.json` is located).
6.  **Pin for Quick Access:** Pin the extension from your Chrome toolbar to begin grabbing.

---

## ⌨️ Developer Keyboard Shortcuts

Speed up your design system workflow with built-in instant hotkeys (active whenever the extractor panel is open):

| Key | Action | Description |
| :--- | :--- | :--- |
| <kbd>I</kbd> | **Toggle Inspector** | Enables instant canvas highlighter mode to click-to-grab any icon. |
| <kbd>C</kbd> | **Copy Code** | Instantly copy active SVG code or PNG Image Tag to clipboard. |
| <kbd>S</kbd> | **Save Asset** | Save active asset into your local collection. |

---

## 📂 Project Architecture

```filepath
├── manifest.json         # Extension configuration, permissions & background mappings
├── content.js            # Capture-phase click interceptors, canvas parsers & UI pipeline
├── styles.css            # Premium dark-theme glassmorphism layout & animations
├── background.js         # Port listener bypass for secure CDN vector fetching
├── jszip.min.js          # Fast offline ZIP generation library
└── icons/                # Extension branding icons
```

---

## 📡 SEO Optimizations & Keywords

This repository is optimized for discoverability across search engines and developer ecosystems:
*   **Primary Keywords:** *Flaticon SVG Downloader, Figma Vector Bridge, Chrome SVG Grabber, Inline SVG Extractor, Chrome Extension SVG Parser, Extract SVGs to Figma, Recolor SVGs Online.*
*   **Compatible Browsers:** Google Chrome, Brave Browser, Microsoft Edge, Opera, Vivaldi, and other Chromium-based platforms.
*   **Figma Integration:** Fully matches Figma's desktop and web clipboard formats for zero-friction paste operations.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
