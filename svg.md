# 🧩 Flaticon SVG Code Extractor — Chrome Extension

## 📁 Full Extension — 4 Files Only

---

## 📄 File 1: `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Flaticon SVG Grabber",
  "version": "1.0",
  "description": "Click any icon on Flaticon to instantly copy its SVG/PNG code",
  "permissions": [
    "activeTab",
    "clipboardWrite",
    "scripting"
  ],
  "host_permissions": [
    "https://www.flaticon.com/*"
  ],
  "content_scripts": [
    {
      "matches": ["https://www.flaticon.com/*"],
      "js": ["content.js"],
      "css": ["styles.css"],
      "run_at": "document_end"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  }
}
```

---

## 📄 File 2: `content.js` ⚡ (Main Logic)

```javascript
// ============================================
// FLATICON SVG GRABBER - CONTENT SCRIPT
// Runs directly on flaticon.com
// ============================================

(function () {

  // ---------- CREATE FLOATING PANEL ----------
  let panel = document.createElement("div");
  panel.id = "svg-grabber-panel";
  panel.innerHTML = `
    <div id="sgp-header">
      <span id="sgp-title">🎨 SVG Grabber</span>
      <button id="sgp-close">✕</button>
    </div>
    <div id="sgp-preview-box">
      <img id="sgp-preview-img" src="" alt="Icon Preview" />
    </div>
    <div id="sgp-tabs">
      <button class="sgp-tab active" data-tab="svg">SVG Code</button>
      <button class="sgp-tab" data-tab="url">Image URL</button>
    </div>
    <div id="sgp-code-box">
      <textarea id="sgp-code-area" readonly placeholder="Click any icon on Flaticon..."></textarea>
    </div>
    <div id="sgp-actions">
      <button id="sgp-copy-btn">📋 Copy Code</button>
      <span id="sgp-copied-msg">✅ Copied!</span>
    </div>
    <div id="sgp-status"></div>
  `;
  document.body.appendChild(panel);

  // ---------- PANEL DRAG SUPPORT ----------
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const header = document.getElementById("sgp-header");

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
    dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      panel.style.left = (e.clientX - dragOffsetX) + "px";
      panel.style.top  = (e.clientY - dragOffsetY) + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", () => { isDragging = false; });

  // ---------- CLOSE PANEL ----------
  document.getElementById("sgp-close").addEventListener("click", () => {
    panel.style.display = "none";
  });

  // ---------- TAB SWITCHER ----------
  let currentTab = "svg";
  let currentSVGCode = "";
  let currentImgURL  = "";

  document.querySelectorAll(".sgp-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".sgp-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.dataset.tab;
      if (currentTab === "svg") {
        document.getElementById("sgp-code-area").value = currentSVGCode;
      } else {
        document.getElementById("sgp-code-area").value = currentImgURL;
      }
    });
  });

  // ---------- COPY BUTTON ----------
  document.getElementById("sgp-copy-btn").addEventListener("click", () => {
    const code = document.getElementById("sgp-code-area").value;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      const msg = document.getElementById("sgp-copied-msg");
      msg.style.display = "inline";
      setTimeout(() => { msg.style.display = "none"; }, 2000);
    });
  });

  // ---------- SET STATUS ----------
  function setStatus(msg, isError = false) {
    const status = document.getElementById("sgp-status");
    status.textContent = msg;
    status.style.color = isError ? "#ff6b6b" : "#00d084";
  }

  // ---------- SHOW PANEL WITH DATA ----------
  function showPanel(svgCode, imgURL, previewSrc) {
    panel.style.display = "flex";
    currentSVGCode = svgCode;
    currentImgURL  = imgURL;

    // Show preview image
    const previewImg = document.getElementById("sgp-preview-img");
    previewImg.src = previewSrc || imgURL;

    // Show SVG tab by default
    document.getElementById("sgp-code-area").value = currentTab === "svg" ? svgCode : imgURL;
    setStatus(svgCode ? "✅ SVG Grabbed!" : "⚠️ Only URL found (PNG)", !svgCode);
  }

  // ---------- FETCH SVG CODE FROM URL ----------
  async function fetchSVGCode(svgUrl) {
    try {
      const res = await fetch(svgUrl);
      if (!res.ok) return null;
      const text = await res.text();
      if (text.includes("<svg")) return text;
      return null;
    } catch (e) {
      return null;
    }
  }

  // ---------- EXTRACT SVG URL FROM PNG URL ----------
  // Flaticon PNG urls pattern:
  // https://cdn-icons-png.flaticon.com/512/123/123456.png
  // SVG pattern:
  // https://www.flaticon.com/free-icon/NAME_ID.htm  (detail page)
  // We try to construct SVG download URL
  function pngToSvgUrl(pngUrl) {
    // Try replacing cdn-icons-png with cdn-icons
    // Pattern: https://cdn-icons-png.flaticon.com/SIZE/CAT/ID.png
    const match = pngUrl.match(/cdn-icons-png\.flaticon\.com\/\d+\/(\d+)\/(\d+)\.png/);
    if (match) {
      const catId = match[1];
      const iconId = match[2];
      // Flaticon SVG direct URL format
      return `https://cdn-icons.flaticon.com/svg/${catId}/${iconId}.svg`;
    }
    return null;
  }

  // ---------- MAIN CLICK HANDLER ----------
  document.addEventListener("click", async (e) => {

    // Find the closest icon element
    const iconEl = e.target.closest(
      `img[src*="flaticon"], 
       img[src*="cdn-icons"], 
       img[src*="cdn-icons-png"],
       .icon-thumbnail img,
       .icons-media img,
       .icon--holder img,
       figure img,
       [class*="icon"] img,
       img[src*=".svg"],
       img[src*=".png"]`
    );

    if (!iconEl) return;
    if (panel.contains(e.target)) return; // Ignore clicks inside panel

    // Only capture flaticon images
    const src = iconEl.src || iconEl.getAttribute("src") || "";
    if (!src.includes("flaticon") && !src.includes("cdn-icons")) return;

    // Stop default navigation
    e.preventDefault();
    e.stopPropagation();

    // Show panel loading state
    panel.style.display = "flex";
    document.getElementById("sgp-code-area").value = "⏳ Fetching SVG code...";
    setStatus("Fetching...");

    let svgCode = "";
    let imgURL  = src;

    // Step 1: If src is already SVG
    if (src.endsWith(".svg") || src.includes(".svg?")) {
      svgCode = await fetchSVGCode(src);
    }

    // Step 2: If PNG, try to find SVG version
    if (!svgCode && src.includes(".png")) {
      const svgUrl = pngToSvgUrl(src);
      if (svgUrl) {
        svgCode = await fetchSVGCode(svgUrl);
        if (svgCode) imgURL = svgUrl;
      }
    }

    // Step 3: Check inline SVG in parent
    if (!svgCode) {
      const parentSVG = iconEl.closest("figure")?.querySelector("svg")
                     || iconEl.parentElement?.querySelector("svg");
      if (parentSVG) {
        svgCode = parentSVG.outerHTML;
      }
    }

    // Step 4: Check data-src / data-url attributes
    if (!svgCode) {
      const dataSrc = iconEl.getAttribute("data-src")
                   || iconEl.getAttribute("data-url")
                   || iconEl.getAttribute("data-original");
      if (dataSrc && dataSrc.includes(".svg")) {
        svgCode = await fetchSVGCode(dataSrc);
      }
    }

    showPanel(svgCode || "", imgURL, src);

  }, true); // Use capture to intercept before site handlers

  // ---------- ALSO WATCH FOR MODAL OPENS ----------
  // Flaticon opens a quick-view modal — we grab SVG from there too
  const observer = new MutationObserver(() => {
    const modalSVG = document.querySelector(
      ".modal svg, .icon-detail svg, .detail-icon svg, [class*='modal'] svg"
    );
    if (modalSVG) {
      const svgCode = modalSVG.outerHTML;
      if (svgCode && svgCode !== currentSVGCode) {
        currentSVGCode = svgCode;
        document.getElementById("sgp-code-area").value =
          currentTab === "svg" ? svgCode : currentImgURL;
        setStatus("✅ SVG from Modal Grabbed!");
        panel.style.display = "flex";
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("✅ Flaticon SVG Grabber Loaded!");

})();
```

---

## 📄 File 3: `styles.css` 🎨

```css
/* ===== FLATICON SVG GRABBER PANEL ===== */

#svg-grabber-panel {
  position: fixed !important;
  top: 80px !important;
  right: 20px !important;
  width: 340px !important;
  background: #1a1a2e !important;
  border: 1px solid #2d2d5e !important;
  border-radius: 14px !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
  z-index: 999999 !important;
  display: none;
  flex-direction: column !important;
  font-family: 'Segoe UI', sans-serif !important;
  overflow: hidden !important;
  color: #fff !important;
}

/* Header */
#sgp-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 12px 16px !important;
  background: #16213e !important;
  cursor: grab !important;
  border-bottom: 1px solid #2d2d5e !important;
}

#sgp-title {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #e94560 !important;
  letter-spacing: 0.5px !important;
}

#sgp-close {
  background: #e94560 !important;
  border: none !important;
  color: #fff !important;
  width: 22px !important;
  height: 22px !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  font-size: 11px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Preview Box */
#sgp-preview-box {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 14px !important;
  background: #0f3460 !important;
  min-height: 80px !important;
}

#sgp-preview-img {
  max-width: 64px !important;
  max-height: 64px !important;
  object-fit: contain !important;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)) !important;
}

/* Tabs */
#sgp-tabs {
  display: flex !important;
  border-bottom: 1px solid #2d2d5e !important;
}

.sgp-tab {
  flex: 1 !important;
  padding: 8px !important;
  background: transparent !important;
  border: none !important;
  color: #aaa !important;
  cursor: pointer !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
}

.sgp-tab.active {
  color: #e94560 !important;
  border-bottom: 2px solid #e94560 !important;
  background: #16213e !important;
}

/* Code Area */
#sgp-code-box {
  padding: 10px !important;
}

#sgp-code-area {
  width: 100% !important;
  height: 120px !important;
  background: #0d0d1a !important;
  color: #00d084 !important;
  border: 1px solid #2d2d5e !important;
  border-radius: 8px !important;
  padding: 8px !important;
  font-family: 'Courier New', monospace !important;
  font-size: 11px !important;
  resize: none !important;
  outline: none !important;
  box-sizing: border-box !important;
}

/* Actions */
#sgp-actions {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 0 10px 10px !important;
}

#sgp-copy-btn {
  flex: 1 !important;
  padding: 9px !important;
  background: #e94560 !important;
  color: #fff !important;
  border: none !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  transition: background 0.2s !important;
}

#sgp-copy-btn:hover {
  background: #c73652 !important;
}

#sgp-copied-msg {
  display: none;
  font-size: 12px !important;
  color: #00d084 !important;
  font-weight: 700 !important;
}

/* Status */
#sgp-status {
  text-align: center !important;
  font-size: 11px !important;
  padding: 0 10px 10px !important;
  color: #00d084 !important;
  font-weight: 600 !important;
}
```

---

## 📄 File 4: `popup.html` (Toolbar Icon Popup)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 220px;
      padding: 16px;
      background: #1a1a2e;
      color: #fff;
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
    }
    h3 { color: #e94560; margin: 0 0 8px; font-size: 14px; }
    p  { font-size: 11px; color: #aaa; margin: 0 0 10px; line-height: 1.5; }
    .badge {
      background: #00d084;
      color: #000;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 20px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <h3>🎨 SVG Grabber</h3>
  <p>Go to <strong>flaticon.com</strong> and click any icon to instantly grab its SVG code!</p>
  <span class="badge">✅ Active on Flaticon</span>
</body>
</html>
```

---

## 📁 Folder Structure

```
flaticon-svg-grabber/
│
├── 📄 manifest.json
├── 📄 content.js
├── 📄 styles.css
├── 📄 popup.html
└── 🖼️ icon.png  ← (any small 48x48 icon)
```

---

## 🚀 How to Install (Chrome)

```
1. Open Chrome → chrome://extensions/
2. Enable "Developer Mode" (top right toggle)
3. Click "Load Unpacked"
4. Select your folder → flaticon-svg-grabber/
5. Done! ✅ Go to flaticon.com
6. Click ANY icon → Panel opens with SVG Code!
7. Hit "Copy Code" → Paste anywhere!
```

---

## 🔄 How It Works — Flow

```
You Click Icon on Flaticon
        ↓
Extension intercepts click
        ↓
Checks: Is it SVG? → Fetches SVG code directly
Checks: Is it PNG? → Converts to SVG URL → Fetches
Checks: Modal opened? → Grabs inline SVG
        ↓
Shows floating panel with:
  • Icon Preview
  • SVG Code Tab
  • Image URL Tab
  • Copy Button
        ↓
You click COPY → Paste in Figma / Code ✅
```