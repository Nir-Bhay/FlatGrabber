# 🎨 FlatGrabber User Guide & DOM Extraction Workflow

Welcome to the comprehensive FlatGrabber guide! This document explains the underlying logic of the extension and provides detailed instructions on how to leverage DOM extraction workflows to analyze and format vector SVGs directly from the browser viewport.

---

## 📈 SVG DOM Extraction at a Glance

Below is a visual diagram of the vector extraction workflow:

![DOM Extraction Flow](docs/assets/unlocking_hack_flow.svg)

---

## 🔒 Editor DOM Rendering Mechanics

### The DOM Layout
When page components load, vector icons are rendered dynamically within active canvas layout nodes. If a user aims to inspect or interact with SVG markup directly, the underlying coordinate points must exist within the viewport.

### Why DOM Extraction is Highly Reliable
When you click **"🎨 Edit icon"**, Flaticon loads a custom canvas editor tool to let users paint, rotate, or mirror the icon. To let you modify parts of the icon, **Flaticon must load the raw, editable vector `<path>` structures directly into the browser's active Document Object Model (DOM)**. 

FlatGrabber intercepts this exact moment! The extension detects when the vector editor loads, extracts the clean, unwatermarked path layers directly from the editor's canvas, and compiles them into a perfectly formatted, standard XML SVG file.

---

## 🚀 SVG Extraction: Detailed Walkthrough

Follow these 4 simple steps to extract clean vectors for any icon:

### Step 1: Browse to the Icon Detail Page
1. Search for any icon pack or keyword on Flaticon.
2. Click on the icon you want to download. This will open the side-panel drawer or full-detail page showing the standard preview image.

---

### Step 2: Launch the Vector Canvas Editor
1. Locate the colorful **🎨 Edit icon** pencil button positioned directly above the main preview icon.
2. Click the **Edit icon** button.
3. The Flaticon canvas editor interface will load inside the page, displaying the editable layers of the icon.

---

### Step 3: Trigger the Floating Grab Badge
1. Once the editor canvas fully loads, move your mouse cursor over the canvas element.
2. An elegant, expanding **"Click to Grab SVG"** badge will dynamically slide into view at the top-right corner of the canvas boundary.
3. Click the **"Click to Grab SVG"** button.
4. FlatGrabber's main panel will slide open on the right side of your browser tab, and the active icon preview (with checkered grid background) will populate.

---

### Step 4: Paste Directly into Figma
1. In the FlatGrabber sidebar, make sure the **SVG Code** tab is active.
2. Click the green **Copy Code** button (or simply press <kbd>C</kbd> on your keyboard).
3. Open any active Figma canvas, select a frame, and press **Ctrl+V** (or **Cmd+V** on macOS).
4. **Extraction Complete!** The icon will instantly spawn as a fully editable vector layer in your layers panel. You can modify paths, resize without distortion, and color individual segments natively.

---

## ⚡ Advanced Feature Set & How to Use Them

FlatGrabber contains a suite of premium utility panels built directly into the sidebar interface:

### 1. Dynamic Asset Recoloring
Before copying your vector to Figma, you can edit its color directly in FlatGrabber:
*   Locate the active Color Palette blocks in the **Current Icon** tab.
*   Click the color block to open your system's color picker or paste a custom hex code (e.g., `#3B82F6`).
*   The SVG preview and vector path will update in real time.

### 2. The Bulk ZIP Archiver
*   To save icons for offline use, click the **"Save Asset"** button (or press <kbd>S</kbd>) on any grabbed icon.
*   This places the active asset into your local FlatGrabber library collection.
*   Switch to the **Saved Collection** tab.
*   Click **Download ZIP** to instantly package your entire library into an optimized, clean ZIP archive containing numbered SVGs.

### 3. The Figma Grid Compiler
Instead of copying and pasting SVGs one by one:
*   Add multiple icons to your local library collection in the **Saved Collection** tab.
*   Click **Copy Figma Grid**.
*   FlatGrabber compiles the coordinates of all your saved assets into a matrix grid array.
*   Paste into Figma; your entire library of icons will spawn in a beautifully structured, evenly-spaced design grid instantly!

---

## ⌨️ Hotkeys Cheat Sheet

Increase your efficiency with keyboard-only controls when FlatGrabber is open:

| Key Shortcut | Action | Core Function |
| :--- | :--- | :--- |
| <kbd>I</kbd> | **Toggle Inspector** | Highlighter mode to select any visible SVG element on the page. |
| <kbd>C</kbd> | **Copy Code** | Copies the clean vector path or image tag to the system clipboard. |
| <kbd>S</kbd> | **Save Asset** | Adds the active vector to your local library. |

---

## 💡 Best Practices for Clean Vectors
*   **Vector Check:** Make sure the icon is not PNG-only before entering the editor. Some old icons do not have vector files (the extension will disable the SVG tab and show a warning tooltip if this is the case).
*   **Recolor First:** It is highly recommended to set your target design system hex color inside FlatGrabber before pasting into Figma to maintain visual consistency.
