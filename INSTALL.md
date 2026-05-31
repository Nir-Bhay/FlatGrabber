# 🛠️ FlatGrabber Installation & Setup Guide

This guide provides a comprehensive, step-by-step walkthrough to install FlatGrabber on any Chromium-based browser in developer mode.

---

## 📈 Installation Flow at a Glance

Below is a visual overview of the setup workflow:

![Installation Flow](docs/assets/installation_flow.svg)

---

## 📋 Comprehensive Step-by-Step Instructions

### Step 1: Download or Clone the Extension Source
Choose one of the following methods to fetch the latest FlatGrabber production-ready codebase:

*   **Option A: Git Clone (Recommended for Developers)**
    Open your terminal or command prompt and run the following command in your preferred projects directory:
    ```bash
    git clone https://github.com/Nir-Bhay/FlatGrabber.git
    ```
*   **Option B: Direct ZIP Download**
    1. Go to the main repository page at `https://github.com/Nir-Bhay/FlatGrabber`.
    2. Click the green **Code** button and select **Download ZIP**.
    3. Extract the downloaded ZIP file to a convenient local folder on your computer (e.g., `C:\Projects\FlatGrabber` or `/Users/username/Projects/FlatGrabber`).

---

### Step 2: Open Chrome Extension Management Canvas
FlatGrabber is loaded locally using Chrome's Developer Mode.
1. Open Google Chrome.
2. In the address bar, type `chrome://extensions/` and press **Enter**.
3. Alternatively, you can click the three dots in the top-right corner of Chrome -> **Extensions** -> **Manage Extensions**.

---

### Step 3: Enable Developer Mode Switch
To load unpacked local extensions, Chrome requires Developer Mode to be active.
1. Locate the **Developer mode** toggle switch in the top-right corner of the `chrome://extensions` page.
2. Toggle the switch to **ON** (active).
3. Once active, a secondary top-bar will slide down containing three new buttons: **Load unpacked**, **Pack extension**, and **Update**.

---

### Step 4: Load the Unpacked FlatGrabber Directory
1. Click the **Load unpacked** button in the top-left corner.
2. A system file directory picker window will open.
3. Browse to and select the extracted folder containing FlatGrabber. 
   > [!IMPORTANT]
   > Select the folder that directly contains the `manifest.json` file. Do not select the outer parent directory if your extractor nested it.

4. Click **Select Folder** (or **Open**).
5. The FlatGrabber card will instantly populate your Extensions page, showing Version 1.1, the active description, and verified permissions.

---

### Step 5: Pin the Extension for One-Click Access
To easily trigger and monitor FlatGrabber's active status, pin it to your toolbar:
1. Click the **Puzzle Piece** icon (Extensions menu) in the top-right corner of Chrome's header.
2. Scroll down until you find **FlatGrabber**.
3. Click the gray **Pin** icon next to it (it will turn blue).
4. The custom FlatGrabber logo icon is now pinned directly next to your address bar for immediate workspace activation.

---

## 🔍 How to Verify the Installation is Successful

To verify that the extension is fully functional and successfully loaded:
1. Go to [Flaticon](https://www.flaticon.com).
2. Right-click anywhere on the page and select **Inspect** to open Developer Tools.
3. Click the **Console** tab.
4. If loaded successfully, you will see FlatGrabber's initialization check logs running in the background.
5. Click the pinned toolbar icon; the premium glassmorphic FlatGrabber guide popup should load instantly with a green **Ready on Flaticon** glow badge.

---

## ⚠️ Troubleshooting Common Errors

### 1. Error: "Manifest file is missing or unreadable"
*   **Cause:** You selected the outer parent directory instead of the specific directory containing `manifest.json`.
*   **Solution:** Click "Load unpacked" again, navigate inside the folder until you see `manifest.json` listed, and then select that exact directory.

### 2. Error: "Extension context invalidated" or "Runtime disconnected"
*   **Cause:** FlatGrabber files were updated in the background or Chrome closed the extension port.
*   **Solution:** Simply refresh the active Flaticon tab in your browser. If that doesn't solve it, go to `chrome://extensions/` and click the circular **Reload** arrow icon on the FlatGrabber card.

### 3. Emojis and Symbols rendering as garbage text
*   **Cause:** Character encoding mismatch in legacy browser versions.
*   **Solution:** We have hard-coded `<meta charset="UTF-8">` into `popup.html` and `content.js`. Make sure you are using the latest version of FlatGrabber from our branch.

---

## 🔄 Updating FlatGrabber to the Latest Release

When changes or optimizations are pushed to the GitHub repository:
1. Open your terminal in the directory and run:
   ```bash
   git pull origin main
   ```
2. Navigate to `chrome://extensions/`.
3. Locate the **FlatGrabber** card.
4. Click the circular **Reload** arrow icon at the bottom-right of the card to load the updated scripts.
