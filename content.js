// ============================================
// FLATICON EXTRACTOR - CONTENT SCRIPT
// ============================================

(function () {
  if (window.sgpInitialized) return;
  window.sgpInitialized = true;

  // ---------- ICONS ----------
  const ICON_COPY = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/></svg>`;
  const ICON_SAVE = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/></svg>`;
  const ICON_CHECK = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`;
  const ICON_TRASH = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`;
  const ICON_X = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;
  const ICON_WARN = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
  const ICON_LOGO = `<svg class="sgp-logo" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`;
  const ICON_PALETTE = `<svg class="sgp-icon" style="color:#94a3b8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 15.9l-3.3 3.3a2.12 2.12 0 01-3 0l-3.9-3.9a2.12 2.12 0 010-3l3.3-3.3m1.5-1.5l3.9-3.9a2.12 2.12 0 013 0l3.9 3.9a2.12 2.12 0 010 3l-3.3 3.3M9 15h.01M15 9h.01"/></svg>`;
  const ICON_DOWNLOAD = `<svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>`;

  // ---------- STATE ----------
  let currentSVGCode = "";
  let currentBeautifiedCode = "";
  let currentImgTag = "";
  let currentPreviewSrc = "";
  let savedCollection = JSON.parse(localStorage.getItem("flaticon_svg_collection") || "[]");
  let isInspectorActive = false;
  let activeHoveredIcon = null;
  let hideTimeout = null;
  let activeFormat = "beautify"; // beautify | minify
  let activeSubTab = "svg";
  let recentColors = JSON.parse(localStorage.getItem("flaticon_recent_colors") || '["#171717","#007cf0","#00dfd8","#7928ca","#ff0080"]');
  let activeScale = 512;
  let previewBgState = 0; // 0=checker, 1=dark, 2=light

  // ---------- ALGORITHMS ----------

  // Clean, sanitize, and optimize raw SVG elements to ensure pure vector paths
  function optimizeSVG(svgString) {
    if (!svgString) return "";
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString.trim(), "image/svg+xml");
      const svgEl = doc.documentElement;

      if (doc.querySelector("parsererror")) {
        return svgString; 
      }

      // 1. Clean editor metadata, descriptions, and comments
      const tagsToRemove = ["metadata", "sodipodi", "inkscape", "title", "desc"];
      tagsToRemove.forEach(tag => {
        doc.querySelectorAll(tag).forEach(el => el.remove());
      });

      // Remove XML comment nodes
      const iterator = doc.createNodeIterator(doc, NodeFilter.SHOW_COMMENT);
      let commentNode;
      const comments = [];
      while (commentNode = iterator.nextNode()) {
        comments.push(commentNode);
      }
      comments.forEach(c => c.remove());

      // 2. Remove redundant and bloated editor-specific attributes
      const attrsToRemove = [
        "version", "id", "x", "y", "xml:space", "xmlns:xlink", 
        "enable-background", "data-name", "class"
      ];
      attrsToRemove.forEach(attr => svgEl.removeAttribute(attr));

      // Ensure proper viewBox is assigned
      let viewBox = svgEl.getAttribute("viewBox");
      if (!viewBox) {
        const w = svgEl.getAttribute("width") || "512";
        const h = svgEl.getAttribute("height") || "512";
        viewBox = `0 0 ${parseFloat(w)} ${parseFloat(h)}`;
        svgEl.setAttribute("viewBox", viewBox);
      }

      // Enforce standard SVG namespace
      svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      let out = svgEl.outerHTML;
      if (activeFormat === "minify") {
          out = out.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ");
      }
      return out;
    } catch (e) {
      return svgString;
    }
  }

  function applyScaleToSVG(svgString, size) {
    if(!svgString) return "";
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");
      if (doc.querySelector("parsererror")) return svgString;
      const svg = doc.documentElement;
      const w = svg.getAttribute("width");
      const h = svg.getAttribute("height");
      const vb = svg.getAttribute("viewBox");
      if (!vb && w && h) {
          svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      }
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      return svg.outerHTML;
    } catch(e) { return svgString; }
  }

  // Native high-fidelity SVG/XML formatting algorithm
  function beautifySVG(svgString) {
    if (!svgString) return "";
    try {
      let formatted = '';
      let indent = '';
      const tab = '  ';
      let xml = svgString.replace(/>\s*</g, '><').trim();
      
      if (xml.charAt(0) !== '<') xml = '<' + xml;
      
      const reg = /(<[^>]+>)/g;
      const nodes = xml.split(reg).filter(Boolean);
      
      nodes.forEach(node => {
        if (node.startsWith('</')) {
          indent = indent.substring(tab.length);
          formatted += indent + node + '\n';
        } else if (node.endsWith('/>') || node.startsWith('<?') || node.startsWith('<!')) {
          formatted += indent + node + '\n';
        } else if (node.startsWith('<') && !node.startsWith('</')) {
          formatted += indent + node + '\n';
          indent += tab;
        } else {
          formatted += indent + node.trim() + '\n';
        }
      });
      return formatted.trim();
    } catch (e) {
      return svgString; 
    }
  }

  // Packs a collection of individual SVGs inside a single structured parent SVG
  // positioning each cleanly in a grid to enable seamless paste-to-Figma vector groups
  function generateCombinedSVG(collection) {
    if (!collection || collection.length === 0) return "";
    
    const columns = Math.min(5, Math.ceil(Math.sqrt(collection.length)));
    const cellSize = 128;
    const iconSize = 80;
    const padding = (cellSize - iconSize) / 2;
    
    const rows = Math.ceil(collection.length / columns);
    const totalWidth = columns * cellSize;
    const totalHeight = rows * cellSize;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">\n`;
    
    collection.forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = col * cellSize;
      const y = row * cellSize;
      
      let iconCode = item.code.trim();
      if (!iconCode.includes("<svg")) return;
      
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(iconCode, "image/svg+xml");
        const svgEl = doc.documentElement;
        
        if (doc.querySelector("parsererror")) return;
        
        let viewBox = svgEl.getAttribute("viewBox");
        let w = parseFloat(svgEl.getAttribute("width"));
        let h = parseFloat(svgEl.getAttribute("height"));
        
        if (!viewBox) {
          if (!isNaN(w) && !isNaN(h)) {
            viewBox = `0 0 ${w} ${h}`;
          } else {
            viewBox = "0 0 512 512";
          }
        }
        
        const parts = viewBox.split(/\s+/).map(parseFloat);
        const vbW = parts[2] || 512;
        const vbH = parts[3] || 512;
        
        const scale = Math.min(iconSize / vbW, iconSize / vbH);
        const newW = vbW * scale;
        const newH = vbH * scale;
        
        const dx = x + padding + (iconSize - newW) / 2;
        const dy = y + padding + (iconSize - newH) / 2;
        
        svgEl.removeAttribute("x");
        svgEl.removeAttribute("y");
        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        svgEl.setAttribute("width", newW.toFixed(2));
        svgEl.setAttribute("height", newH.toFixed(2));
        
        const name = `Icon_${index + 1}`;
        svgContent += `  <g id="${name}" transform="translate(${dx.toFixed(2)}, ${dy.toFixed(2)})">\n`;
        svgContent += `    <!-- ${name} -->\n`;
        
        const innerContent = svgEl.outerHTML;
        const indented = innerContent.split('\n').map(line => '    ' + line).join('\n');
        svgContent += indented + '\n';
        svgContent += `  </g>\n`;
      } catch (e) {
        console.error("Figma combined grid error:", e);
      }
    });
    
    svgContent += `</svg>`;
    return svgContent;
  }

  function encodeSVG(svgCode) {
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgCode)));
  }

  // ---------- PANEL INJECTION ----------
  const panel = document.createElement("div");
  panel.id = "svg-grabber-panel";
  panel.innerHTML = `
    <div id="sgp-header">
      <span id="sgp-title">${ICON_LOGO} FlatGrabber</span>
      <div class="sgp-header-btn-wrap">
        <button id="sgp-inspect-toggle" class="sgp-header-btn" title="Toggle Inspector Mode [I]">
          <svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </button>
        <button id="sgp-info-btn" class="sgp-header-btn" title="How to copy SVGs">
          <svg class="sgp-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </button>
        <button id="sgp-close" class="sgp-header-btn" title="Close Panel">${ICON_X}</button>
      </div>
    </div>

    <div id="sgp-tabs">
      <button class="sgp-tab active" data-tab="single">Current Icon</button>
      <button class="sgp-tab" data-tab="collection">Collection (<span id="sgp-coll-count">${savedCollection.length}</span>)</button>
    </div>

    <div id="sgp-view-single" class="sgp-view active-view">
      <div id="sgp-preview-box" class="sgp-bg-checker">
        <button id="sgp-bg-toggle" class="sgp-btn-small" title="Toggle Canvas Mode" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 4px; font-size: 14px; cursor: pointer; z-index: 10;">🌗</button>
        <img id="sgp-preview-img" src="" alt="Preview..." />
      </div>
      
      <div class="sgp-sub-tabs">
        <button class="sgp-sub-tab active" data-sub="svg">SVG Code</button>
        <button class="sgp-sub-tab" data-sub="url">Image Tag</button>
      </div>

      <div class="sgp-format-toggle-wrap" id="sgp-format-tabs" style="display:none; justify-content: space-between;">
        <div class="sgp-scale-toggles" style="display: flex; gap: 4px;">
          <button class="sgp-scale-btn" data-scale="24">24</button>
          <button class="sgp-scale-btn" data-scale="32">32</button>
          <button class="sgp-scale-btn" data-scale="48">48</button>
          <button class="sgp-scale-btn active" data-scale="512">512</button>
        </div>
        <div style="display: flex; gap: 4px;">
          <button class="sgp-format-btn active" data-fmt="beautify">Beautified</button>
          <button class="sgp-format-btn" data-fmt="minify">Minified</button>
        </div>
      </div>

      <div id="sgp-code-box">
        <textarea id="sgp-code-area" readonly placeholder="Select an icon on the page..."></textarea>
      </div>

      <div class="sgp-action-row">
        <button id="sgp-copy-btn" class="sgp-btn sgp-btn-primary">${ICON_COPY} Copy <span class="sgp-kbd-hint">C</span></button>
        <button id="sgp-save-btn" class="sgp-btn sgp-btn-secondary">${ICON_SAVE} Save <span class="sgp-kbd-hint">S</span></button>
      </div>
      <div id="sgp-status">Waiting for click...</div>
    </div>

    <div id="sgp-view-collection" class="sgp-view">
      <div class="sgp-collection-search-wrap">
        <div class="sgp-search-input-box">
          <svg class="sgp-icon sgp-search-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="sgp-coll-search" placeholder="Search collection..." spellcheck="false" />
        </div>
        <button id="sgp-grab-page-btn" class="sgp-btn-small" title="Grab all icons on this page in one click!">⚡ Grab Page</button>
      </div>

      <div id="sgp-collection-list"></div>
      
      <div id="sgp-collection-toolbar" style="display:none; flex-direction: column; gap: 8px; align-items: stretch;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="sgp-toolbar-label">${ICON_PALETTE} Recolor:</span>
          <div class="sgp-color-wrap">
             <input type="color" id="sgp-color-picker" value="#000000" title="Pick a color">
             <input type="text" id="sgp-color-hex" value="#000000" maxlength="7" spellcheck="false">
          </div>
          <button id="sgp-apply-color-btn" class="sgp-btn-small">Apply</button>
        </div>
        <div id="sgp-recent-swatches" class="sgp-recent-swatches"></div>
      </div>

      <div class="sgp-action-row" id="sgp-collection-actions">
        <button id="sgp-copy-figma-btn" class="sgp-btn sgp-btn-primary" title="Copy all icons as a single structured grid to paste into Figma directly!">${ICON_COPY} Figma Grid</button>
        <button id="sgp-zip-btn" class="sgp-btn sgp-btn-secondary" title="Download all items in a beautifully packaged ZIP folder!">${ICON_SAVE} ZIP Archive</button>
        <button id="sgp-clear-coll-btn" class="sgp-btn sgp-btn-danger" title="Clear all saved assets">${ICON_TRASH}</button>
      </div>
    </div>

    <!-- Instructions Guide Overlay Modal -->
    <div id="sgp-info-overlay" style="display:none;">
      <div class="sgp-info-content">
        <div class="sgp-info-header">
          <h3>⚡ DOM Vector Extraction Guide</h3>
          <button id="sgp-info-close-btn">&times;</button>
        </div>
        <ul class="sgp-info-steps">
          <li style="border-left: 3px solid #f59e0b; padding-left: 8px; margin-bottom: 6px; background: rgba(245, 158, 11, 0.08); border-radius: 4px; padding-top: 4px; padding-bottom: 4px;">
            <strong style="color: #f59e0b;">💡 Vector Extraction Mechanics</strong><br/>
            Vector assets are processed dynamically inside active canvas nodes when loading the editor layout. To inspect underlying paths:
          </li>
          <li>
            <strong>1. Click "Edit icon"</strong><br/>
            Open the icon's detail modal/page and click the <strong style="color: #60a5fa;">🎨 Edit icon</strong> pencil button above the main preview.
          </li>
          <li>
            <strong>2. Grab from Editor</strong><br/>
            When Flaticon's built-in editor loads, click the floating <strong style="color: #60a5fa;">"Click to grab"</strong> button right above the editor canvas.
          </li>
          <li>
            <strong>3. Extraction Successful!</strong><br/>
            The extension will extract the raw vector paths directly from the editor's live canvas DOM and enable the SVG Code tab.
          </li>
          <li style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 8px; margin-top: 4px;">
            <strong>Figma Tip:</strong> Copy the code by pressing <kbd>C</kbd>, then paste it directly into Figma as fully editable vector shapes!
          </li>
        </ul>
      </div>
    </div>
  `;

  // Create active floating overlays
  const floatingGrabBtn = document.createElement("button");
  floatingGrabBtn.id = "sgp-floating-grab-btn";
  floatingGrabBtn.innerHTML = `${ICON_SAVE} <span>Click to grab</span>`;

  const inspectorOverlay = document.createElement("div");
  inspectorOverlay.id = "sgp-inspector-overlay";

  const toast = document.createElement("div");
  toast.id = "sgp-toast";
  
  const hotkeyBadge = document.createElement("div");
  hotkeyBadge.className = "sgp-floating-kbd-badge";
  document.body.appendChild(hotkeyBadge);

  function attachHotkeyBadge(selector, label) {
    const el = panel.querySelector(selector);
    if (!el) return;
    el.addEventListener("mouseenter", () => {
       hotkeyBadge.innerHTML = label;
       hotkeyBadge.style.opacity = "1";
       hotkeyBadge.style.visibility = "visible";
    });
    el.addEventListener("mousemove", (e) => {
       hotkeyBadge.style.left = (e.clientX + 14) + "px";
       hotkeyBadge.style.top = (e.clientY + 14) + "px";
    });
    el.addEventListener("mouseleave", () => {
       hotkeyBadge.style.opacity = "0";
       setTimeout(() => {
           if (hotkeyBadge.style.opacity === "0") hotkeyBadge.style.visibility = "hidden";
       }, 200);
    });
  }

  function showToast(message) {
    toast.innerHTML = `<span>✅</span> <span>${message}</span>`;
    toast.classList.add("sgp-toast-active");
    setTimeout(() => {
      toast.classList.remove("sgp-toast-active");
    }, 2200);
  }

  function ensureElementsInDOM() {
    if (!document.documentElement.contains(panel)) {
      const container = document.body || document.documentElement;
      container.appendChild(panel);
      container.appendChild(floatingGrabBtn);
      container.appendChild(inspectorOverlay);
      panel.appendChild(toast);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureElementsInDOM);
  } else {
    ensureElementsInDOM();
  }

  // ---------- PANEL DRAG SUPPORT ----------
  let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
  panel.querySelector("#sgp-header").addEventListener("mousedown", (e) => {
    if (e.target.closest('.sgp-header-btn')) return;
    isDragging = true;
    dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
    dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.transition = "none"; 
  });
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      panel.style.left = (e.clientX - dragOffsetX) + "px";
      panel.style.top = (e.clientY - dragOffsetY) + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }
  });
  document.addEventListener("mouseup", () => { 
    isDragging = false; 
    panel.style.transition = "transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.2s ease"; 
  });

  panel.querySelector("#sgp-close").addEventListener("click", () => {
    panel.style.transform = "scale(0.8) translateY(20px)";
    panel.style.opacity = "0";
    setTimeout(() => panel.style.display = "none", 200);
  });

  // Info Guide Overlay Controls
  const infoBtn = panel.querySelector("#sgp-info-btn");
  const infoOverlay = panel.querySelector("#sgp-info-overlay");
  const infoCloseBtn = panel.querySelector("#sgp-info-close-btn");

  if (infoBtn && infoOverlay && infoCloseBtn) {
    infoBtn.addEventListener("click", () => {
      infoOverlay.style.display = "flex";
      requestAnimationFrame(() => {
        infoOverlay.classList.add("active");
      });
    });
    infoCloseBtn.addEventListener("click", () => {
      infoOverlay.classList.remove("active");
      setTimeout(() => {
        infoOverlay.style.display = "none";
      }, 220);
    });
  }

  // ---------- INSPECTOR TOGGLE ----------
  const inspectToggle = panel.querySelector("#sgp-inspect-toggle");
  function toggleInspector(forceState) {
    isInspectorActive = typeof forceState === 'boolean' ? forceState : !isInspectorActive;
    if (isInspectorActive) {
      inspectToggle.classList.add("active");
      document.documentElement.classList.add("sgp-inspecting-active");
      setStatus("Inspector Active! Click any icon.", "warning");
    } else {
      inspectToggle.classList.remove("active");
      document.documentElement.classList.remove("sgp-inspecting-active");
      inspectorOverlay.style.display = "none";
      setStatus("Waiting for click...", "normal");
    }
  }
  inspectToggle.addEventListener("click", () => toggleInspector());

  // ---------- COLOR PALETTE LOGIC ----------
  const colorPicker = panel.querySelector("#sgp-color-picker");
  const colorHex = panel.querySelector("#sgp-color-hex");

  colorPicker.addEventListener("input", (e) => {
    colorHex.value = e.target.value.toUpperCase();
  });

  colorHex.addEventListener("input", (e) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
      colorPicker.value = val;
    }
  });

  panel.querySelector("#sgp-apply-color-btn").addEventListener("click", (e) => {
    let newColor = colorHex.value;
    if (!newColor.startsWith("#")) newColor = "#" + newColor;
    
    let modified = false;

    savedCollection = savedCollection.map(item => {
      if (item.code.includes("<svg")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.code, "image/svg+xml");
        const elements = doc.querySelectorAll("*");
        
        elements.forEach(el => {
          if (el.hasAttribute("fill") && el.getAttribute("fill") !== "none") el.setAttribute("fill", newColor);
          if (el.hasAttribute("stroke") && el.getAttribute("stroke") !== "none") el.setAttribute("stroke", newColor);
          if (el.style.fill && el.style.fill !== "none") el.style.fill = newColor;
          if (el.style.stroke && el.style.stroke !== "none") el.style.stroke = newColor;
        });

        const paths = doc.querySelectorAll("path, polygon, circle, rect");
        paths.forEach(p => {
          if (!p.hasAttribute("fill") && !p.hasAttribute("stroke") && !p.style.fill && !p.style.stroke) {
              p.setAttribute("fill", newColor);
          }
        });

        item.code = doc.documentElement.outerHTML;
        modified = true;
      }
      return item;
    });

    if (modified) {
      updateStorage();
      renderCollection();
      setStatus(`✨ Applied ${newColor.toUpperCase()} to collection!`, "success");
      
      const btn = e.currentTarget;
      const orig = btn.innerText;
      btn.innerText = "Done!";
      setTimeout(() => btn.innerText = orig, 1500);

      // Add to recent swatches
      recentColors = recentColors.filter(c => c !== newColor);
      recentColors.unshift(newColor);
      if (recentColors.length > 5) recentColors.pop();
      localStorage.setItem("flaticon_recent_colors", JSON.stringify(recentColors));
      renderRecentSwatches();
    }
  });
  
  function renderRecentSwatches() {
      const container = panel.querySelector("#sgp-recent-swatches");
      if (!container) return;
      container.innerHTML = "";
      recentColors.forEach(c => {
          const btn = document.createElement("button");
          btn.className = "sgp-recent-swatch";
          btn.style.backgroundColor = c;
          btn.title = c;
          btn.addEventListener("click", () => {
              colorPicker.value = c;
              colorHex.value = c.toUpperCase();
              panel.querySelector("#sgp-apply-color-btn").click();
          });
          container.appendChild(btn);
      });
  }

  // ---------- TAB CONTROL ----------
  panel.querySelectorAll(".sgp-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      panel.querySelectorAll(".sgp-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const targetView = tab.dataset.tab;
      panel.querySelectorAll(".sgp-view").forEach(v => v.classList.remove("active-view"));
      panel.querySelector(`#sgp-view-${targetView}`).classList.add("active-view");
      if (targetView === "collection") renderCollection();
    });
  });

  panel.querySelectorAll(".sgp-sub-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      panel.querySelectorAll(".sgp-sub-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeSubTab = tab.dataset.sub;
      updateCodeArea();
    });
  });

  // Format selection listener
  panel.querySelectorAll(".sgp-format-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      panel.querySelectorAll(".sgp-format-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFormat = btn.dataset.fmt;
      updateCodeArea();
    });
  });

  panel.querySelectorAll(".sgp-scale-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      panel.querySelectorAll(".sgp-scale-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeScale = parseInt(btn.dataset.scale);
      updateCodeArea();
    });
  });

  panel.querySelector("#sgp-bg-toggle").addEventListener("click", () => {
    previewBgState = (previewBgState + 1) % 3;
    const box = panel.querySelector("#sgp-preview-box");
    box.className = ""; // clear all
    if (previewBgState === 0) box.classList.add("sgp-bg-checker");
    else if (previewBgState === 1) box.classList.add("sgp-bg-dark");
    else box.classList.add("sgp-bg-light");
  });

  // Attach tooltips
  attachHotkeyBadge("#sgp-copy-btn", "<kbd>C</kbd> copy");
  attachHotkeyBadge("#sgp-save-btn", "<kbd>S</kbd> save");
  attachHotkeyBadge("#sgp-inspect-toggle", "<kbd>I</kbd> inspect");
  attachHotkeyBadge("#sgp-copy-figma-btn", "Figma Grid");
  renderRecentSwatches();

  function updateCodeArea() {
    const area = panel.querySelector("#sgp-code-area");
    const formatTabs = panel.querySelector("#sgp-format-tabs");
    if (area) {
      if (activeSubTab === "svg") {
        if (formatTabs) formatTabs.style.display = "flex";
        let baseCode = applyScaleToSVG(currentSVGCode, activeScale);
        if (activeFormat === "beautify") {
            baseCode = beautifySVG(baseCode);
        } else if (activeFormat === "minify") {
            baseCode = baseCode.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ");
        }
        area.value = baseCode || (currentImgTag ? "No SVG found. Switch to Image Tag." : "");
      } else {
        if (formatTabs) formatTabs.style.display = "none";
        area.value = currentImgTag || "No image url found.";
      }
    }
  }

  // ---------- CLIPBOARD LOGIC ADVANCED ----------
  async function copyToClipboard(plainText, htmlText, btnElement, origHTML, successHTML) {
    if (!plainText || plainText.startsWith("No SVG")) {
        if (currentImgTag && activeSubTab !== "svg") {
            const wrapperHtml = `<meta charset="utf-8"><body><!--StartFragment-->${currentImgTag}<!--EndFragment--></body>`;
            plainText = currentImgTag;
            htmlText = wrapperHtml;
        } else if (currentImgTag && activeSubTab === "svg") {
            showToast("No SVG available, copying PNG image instead!");
            const wrapperHtml = `<meta charset="utf-8"><body><!--StartFragment-->${currentImgTag}<!--EndFragment--></body>`;
            plainText = currentImgTag;
            htmlText = wrapperHtml;
        } else {
            return;
        }
    }
    
    const spawnGhostPath = () => {
       const previewImg = panel.querySelector("#sgp-preview-img");
       if (!previewImg || !previewImg.src) return;
       const rect = previewImg.getBoundingClientRect();
       const ghost = document.createElement("img");
       ghost.src = previewImg.src;
       ghost.className = "sgp-ghost-path";
       ghost.style.left = rect.left + "px";
       ghost.style.top = rect.top + "px";
       ghost.style.width = rect.width + "px";
       ghost.style.height = rect.height + "px";
       document.body.appendChild(ghost);
       // trigger reflow
       void ghost.offsetWidth;
       ghost.classList.add("animate");
       setTimeout(() => ghost.remove(), 1200);
    };

    const showSuccess = () => {
      spawnGhostPath();
      btnElement.innerHTML = successHTML;
      btnElement.classList.add("sgp-btn-success");
      setTimeout(() => {
        btnElement.innerHTML = origHTML;
        btnElement.classList.remove("sgp-btn-success");
      }, 2000);
      showToast("Copied code to clipboard!");
    };

    try {
      if (window.ClipboardItem) {
        const items = {};
        items["text/plain"] = new Blob([plainText], { type: "text/plain" });
        if (htmlText) {
          items["text/html"] = new Blob([htmlText], { type: "text/html" });
        }
        await navigator.clipboard.write([new ClipboardItem(items)]);
        showSuccess();
      } else {
        await navigator.clipboard.writeText(plainText);
        showSuccess();
      }
    } catch (err) {
      navigator.clipboard.writeText(plainText).then(showSuccess);
    }
  }

  panel.querySelector("#sgp-copy-btn").addEventListener("click", (e) => {
    const code = panel.querySelector("#sgp-code-area").value;
    copyToClipboard(code, code, e.currentTarget, `${ICON_COPY} Copy <span class="sgp-kbd-hint">C</span>`, `${ICON_CHECK} Copied!`);
  });

  // Combined grid copy for Figma
  panel.querySelector("#sgp-copy-figma-btn").addEventListener("click", (e) => {
    if (savedCollection.length === 0) return;
    const combinedSVG = generateCombinedSVG(savedCollection);
    if (!combinedSVG) {
      showToast("No SVGs to copy!");
      return;
    }
    copyToClipboard(combinedSVG, combinedSVG, e.currentTarget, `${ICON_COPY} Figma Grid`, `${ICON_CHECK} Grid Copied!`);
  });

  // ZIP Batch Downloader
  panel.querySelector("#sgp-zip-btn").addEventListener("click", () => {
    downloadCollectionAsZip();
  });

  // Bulk Page Grabber
  panel.querySelector("#sgp-grab-page-btn").addEventListener("click", () => {
    grabAllIconsOnPage();
  });

  // Search input filter
  const searchInput = panel.querySelector("#sgp-coll-search");
  searchInput.addEventListener("input", () => {
    renderCollection();
  });

  // ---------- KEYBOARD SHORTCUTS ----------
  document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
    
    const key = e.key.toLowerCase();
    if (key === 'c' && panel.style.display === "flex") {
      e.preventDefault();
      const btn = panel.querySelector("#sgp-copy-btn");
      if (btn) btn.click();
    } else if (key === 's' && panel.style.display === "flex") {
      e.preventDefault();
      const btn = panel.querySelector("#sgp-save-btn");
      if (btn) btn.click();
    } else if (key === 'i') {
      e.preventDefault();
      toggleInspector();
    }
  });

  // ---------- COLLECTION ----------
  function updateStorage() {
    localStorage.setItem("flaticon_svg_collection", JSON.stringify(savedCollection));
    const countEl = panel.querySelector("#sgp-coll-count");
    if(countEl) countEl.textContent = savedCollection.length;
  }

  panel.querySelector("#sgp-save-btn").addEventListener("click", (e) => {
    const codeToSave = (activeSubTab === "svg" && currentSVGCode) ? optimizeSVG(currentSVGCode) : currentImgTag;
    if (!codeToSave) return;
    
    const btn = e.currentTarget;
    if (savedCollection.some(i => i.code === codeToSave)) {
       btn.innerHTML = `${ICON_WARN} Already Saved`;
       btn.classList.add("sgp-btn-warning");
       setTimeout(() => {
         btn.innerHTML = `${ICON_SAVE} Save <span class="sgp-kbd-hint">S</span>`;
         btn.classList.remove("sgp-btn-warning");
       }, 2000);
       return;
     }
     
     savedCollection.push({ code: codeToSave, preview: currentPreviewSrc });
     updateStorage();
     renderCollection(); 
     
     btn.innerHTML = `${ICON_CHECK} Saved!`;
     btn.classList.add("sgp-btn-success");
     setTimeout(() => {
       btn.innerHTML = `${ICON_SAVE} Save <span class="sgp-kbd-hint">S</span>`;
       btn.classList.remove("sgp-btn-success");
     }, 1500);
     showToast("Asset saved to collection!");
  });

  // Native offline zip batch downloader
  async function downloadCollectionAsZip() {
    if (savedCollection.length === 0) return;
    
    const zipBtn = panel.querySelector("#sgp-zip-btn");
    const origHTML = zipBtn.innerHTML;
    zipBtn.disabled = true;
    zipBtn.innerHTML = `<span class="sgp-spinner"></span> Packing...`;
    
    try {
      const zip = new JSZip();
      const count = savedCollection.length;
      
      for (let i = 0; i < count; i++) {
        const item = savedCollection[i];
        const filename = `flaticon-icon-${i + 1}`;
        
        if (item.code.includes("<svg")) {
          const cleanSVG = optimizeSVG(item.code);
          zip.file(`${filename}.svg`, cleanSVG);
        } else if (item.code.startsWith("http")) {
          try {
            const res = await fetch(item.code);
            const blob = await res.blob();
            const ext = blob.type.split("/")[1] || "png";
            zip.file(`${filename}.${ext}`, blob);
          } catch (err) {
            zip.file(`${filename}-url.txt`, item.code);
          }
        } else if (item.code.startsWith("<img")) {
          const srcMatch = item.code.match(/src="([^"]+)"/);
          if (srcMatch) {
            try {
              const res = await fetch(srcMatch[1]);
              const blob = await res.blob();
              const ext = blob.type.split("/")[1] || "png";
              zip.file(`${filename}.${ext}`, blob);
            } catch (err) {
              zip.file(`${filename}-tag.txt`, item.code);
            }
          } else {
            zip.file(`${filename}-tag.txt`, item.code);
          }
        } else {
          zip.file(`${filename}.txt`, item.code);
        }
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `flaticon-svg-collection-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      zipBtn.innerHTML = `${ICON_CHECK} Downloaded!`;
      zipBtn.classList.add("sgp-btn-success");
    } catch (err) {
      console.error("ZIP Generation Failed:", err);
      zipBtn.innerHTML = `${ICON_WARN} Failed`;
      zipBtn.classList.add("sgp-btn-warning");
    } finally {
      setTimeout(() => {
        zipBtn.disabled = false;
        zipBtn.innerHTML = origHTML;
        zipBtn.classList.remove("sgp-btn-success", "sgp-btn-warning");
      }, 2000);
    }
  }

  // Concurrent bulk page grabber pipeline with glowing progress overlay
  async function grabAllIconsOnPage() {
    const iconElements = Array.from(document.querySelectorAll(
      `img[src*="flaticon.com"], img[src*="cdn-icons"], 
       .icon-thumbnail img, .detail__editor__icon-holder,
       [class*="icon"] img, img[src*=".svg"], img[src*=".png"], svg`
    )).filter(el => {
      if (panel.contains(el)) return false;
      const src = el.src || el.getAttribute("src") || "";
      return el.tagName.toLowerCase() === "svg" || src.includes("flaticon") || src.includes("cdn-icons") || src.includes("flaticon.com");
    });

    const seenSrcs = new Set();
    const uniqueIcons = [];
    iconElements.forEach(el => {
      const src = el.src || el.getAttribute("src") || (el.tagName.toLowerCase() === "svg" ? el.outerHTML : "");
      if (src && !seenSrcs.has(src)) {
        seenSrcs.add(src);
        uniqueIcons.push(el);
      }
    });

    if (uniqueIcons.length === 0) {
      setStatus("❌ No grabable icons found on this page.", "error");
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "sgp-progress-overlay";
    overlay.innerHTML = `
      <div class="sgp-progress-container">
        <div class="sgp-progress-title">⚡ Grabbing Page Icons</div>
        <div class="sgp-progress-subtitle">Extracting high-fidelity SVGs in parallel...</div>
        <div class="sgp-progress-bar-wrap">
          <div class="sgp-progress-bar-fill" style="width: 0%"></div>
        </div>
        <div class="sgp-progress-text">Preparing assets...</div>
      </div>
    `;
    panel.appendChild(overlay);
    
    panel.querySelectorAll(".sgp-view, #sgp-tabs").forEach(el => el.style.pointerEvents = "none");

    const batchSize = 4;
    let finishedCount = 0;
    let newAddedCount = 0;

    const barFill = overlay.querySelector(".sgp-progress-bar-fill");
    const progressText = overlay.querySelector(".sgp-progress-text");

    async function processIcon(el) {
      try {
        const data = await findIconData(el);
        if (data && (data.svg || data.imgUrl)) {
          const codeToSave = data.svg ? optimizeSVG(data.svg) : data.imgUrl;
          if (!savedCollection.some(item => item.code === codeToSave)) {
            savedCollection.push({ code: codeToSave, preview: data.preview });
            newAddedCount++;
          }
        }
      } catch (err) {
        console.error("Grab item failed:", err);
      } finally {
        finishedCount++;
        const pct = Math.round((finishedCount / uniqueIcons.length) * 100);
        if (barFill) barFill.style.width = `${pct}%`;
        if (progressText) progressText.textContent = `Extracted ${finishedCount} of ${uniqueIcons.length} assets (${newAddedCount} new)...`;
      }
    }

    for (let i = 0; i < uniqueIcons.length; i += batchSize) {
      const batch = uniqueIcons.slice(i, i + batchSize);
      await Promise.all(batch.map(processIcon));
    }

    setTimeout(() => {
      overlay.remove();
      panel.querySelectorAll(".sgp-view, #sgp-tabs").forEach(el => el.style.pointerEvents = "auto");
      updateStorage();
      renderCollection();
      showToast(`⚡ Grabbed ${newAddedCount} new assets successfully!`);
      setStatus(`✨ Successfully added ${newAddedCount} assets to your collection!`, "success");
    }, 1000);
  }

  // Recolor an individual SVG inside the collection
  function recolorIndividualIcon(index, newColor) {
    const item = savedCollection[index];
    if (!item || !item.code.includes("<svg")) {
      showToast("Cannot recolor non-SVG elements!");
      return;
    }
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.code, "image/svg+xml");
      const elements = doc.querySelectorAll("*");
      
      elements.forEach(el => {
        if (el.hasAttribute("fill") && el.getAttribute("fill") !== "none") el.setAttribute("fill", newColor);
        if (el.hasAttribute("stroke") && el.getAttribute("stroke") !== "none") el.setAttribute("stroke", newColor);
        if (el.style.fill && el.style.fill !== "none") el.style.fill = newColor;
        if (el.style.stroke && el.style.stroke !== "none") el.style.stroke = newColor;
      });

      const paths = doc.querySelectorAll("path, polygon, circle, rect");
      paths.forEach(p => {
        if (!p.hasAttribute("fill") && !p.hasAttribute("stroke") && !p.style.fill && !p.style.stroke) {
            p.setAttribute("fill", newColor);
        }
      });

      item.code = doc.documentElement.outerHTML;
      updateStorage();
      renderCollection();
      showToast(`Recolored icon to ${newColor.toUpperCase()}!`);
    } catch (err) {
      console.error("Individual recolor failed:", err);
    }
  }

  // Download a single icon file directly
  function downloadIndividualIcon(index) {
    const item = savedCollection[index];
    if (!item) return;
    const filename = `flaticon-icon-${index + 1}`;
    
    if (item.code.includes("<svg")) {
      const blob = new Blob([optimizeSVG(item.code)], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const src = item.code.startsWith("<img") 
        ? item.code.match(/src="([^"]+)"/)?.[1] 
        : item.code;
      if (src) {
        const a = document.createElement("a");
        a.href = src;
        a.download = `${filename}.png`;
        a.target = "_blank";
        a.click();
      }
    }
    showToast("Downloaded icon file!");
  }

  panel.querySelector("#sgp-clear-coll-btn").addEventListener("click", () => {
    if (confirm("Clear all saved assets?")) {
      savedCollection = [];
      updateStorage();
      renderCollection();
    }
  });

  function renderCollection() {
    const list = panel.querySelector("#sgp-collection-list");
    const toolbar = panel.querySelector("#sgp-collection-toolbar");
    const actions = panel.querySelector("#sgp-collection-actions");
    if (!list) return;

    if (savedCollection.length === 0) {
      list.innerHTML = `<div class="sgp-empty">No assets saved yet.<br/>Click 'Save' on an item to add it here.</div>`;
      if(toolbar) toolbar.style.display = "none";
      if(actions) actions.style.display = "none";
      return;
    }

    const searchQuery = (panel.querySelector("#sgp-coll-search")?.value || "").trim().toLowerCase();
    
    // Map items with original index to keep integrity for actions
    let itemsToRender = savedCollection.map((item, index) => ({ item, index }));
    
    if (searchQuery) {
      itemsToRender = itemsToRender.filter(entry => {
        const indexStr = `${entry.index + 1}`;
        const label = `icon-${indexStr}`;
        const matchesIndex = label.includes(searchQuery) || indexStr === searchQuery;
        const matchesCode = entry.item.code.toLowerCase().includes(searchQuery);
        return matchesIndex || matchesCode;
      });
    }

    if (itemsToRender.length === 0) {
      list.innerHTML = `<div class="sgp-empty">No matching icons found.<br/>Try adjusting your query.</div>`;
      if(toolbar) toolbar.style.display = "none";
      if(actions) actions.style.display = "none";
      return;
    }

    if(toolbar) toolbar.style.display = "flex";
    if(actions) actions.style.display = "flex";
    list.innerHTML = "";

    itemsToRender.forEach(entry => {
      const { item, index } = entry;
      const el = document.createElement("div");
      el.className = "sgp-coll-item";
      
      const img = document.createElement("img");
      if (item.code.includes("<svg")) {
         img.src = encodeSVG(item.code);
      } else if (item.preview && (item.preview.startsWith("http") || item.preview.startsWith("data:"))) {
         img.src = item.preview;
      } else {
         img.src = "";
      }

      // Add a small index indicator badge
      const badge = document.createElement("span");
      badge.className = "sgp-card-badge";
      badge.textContent = index + 1;
      el.appendChild(badge);

      // Create action grid buttons
      const copyBtn = document.createElement("button");
      copyBtn.className = "sgp-item-btn sgp-item-copy";
      copyBtn.innerHTML = ICON_COPY;
      copyBtn.title = "Copy Code";
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(item.code, item.code, copyBtn, ICON_COPY, ICON_CHECK);
      };

      const recolorBtn = document.createElement("button");
      recolorBtn.className = "sgp-item-btn sgp-item-recolor";
      recolorBtn.innerHTML = ICON_PALETTE;
      recolorBtn.title = "Recolor Icon";
      
      const individualColorInput = document.createElement("input");
      individualColorInput.type = "color";
      individualColorInput.style.display = "none";
      individualColorInput.value = "#000000";
      individualColorInput.onchange = (e) => {
        recolorIndividualIcon(index, e.target.value);
      };
      recolorBtn.appendChild(individualColorInput);
      recolorBtn.onclick = (e) => {
        e.stopPropagation();
        individualColorInput.click();
      };

      const downloadBtn = document.createElement("button");
      downloadBtn.className = "sgp-item-btn sgp-item-download";
      downloadBtn.innerHTML = ICON_DOWNLOAD;
      downloadBtn.title = "Download File";
      downloadBtn.onclick = (e) => {
        e.stopPropagation();
        downloadIndividualIcon(index);
      };

      const delBtn = document.createElement("button");
      delBtn.className = "sgp-item-btn sgp-item-delete";
      delBtn.innerHTML = ICON_TRASH;
      delBtn.title = "Remove";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        savedCollection.splice(index, 1);
        updateStorage();
        renderCollection();
        showToast("Icon removed from collection.");
      };

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "sgp-item-actions";
      actionsDiv.append(copyBtn, recolorBtn, downloadBtn, delBtn);

      el.append(img, actionsDiv);
      list.appendChild(el);
    });
  }

  function setStatus(msg, type = "normal") {
    const status = panel.querySelector("#sgp-status");
    if(status) {
        status.innerHTML = msg;
        status.className = `sgp-status-${type}`;
    }
  }

  function showPanel(svgCode, imgTag, previewSrc) {
    ensureElementsInDOM();

    if (panel.style.display !== "flex") {
        panel.style.display = "flex";
        requestAnimationFrame(() => {
           panel.style.opacity = "1";
           panel.style.transform = "scale(1) translateY(0)";
         });
    }

    currentSVGCode = svgCode ? svgCode.replace(/>\s*</g, '><').trim() : "";
    currentBeautifiedCode = svgCode ? beautifySVG(svgCode) : "";
    currentImgTag = imgTag || "";
    currentPreviewSrc = previewSrc || "";

    const previewImg = panel.querySelector("#sgp-preview-img");
    if (previewImg) {
        previewImg.src = previewSrc ? previewSrc 
          : svgCode ? encodeSVG(svgCode) 
          : "";
    }

    const svgSubTab = panel.querySelector('.sgp-sub-tab[data-sub="svg"]');
    if (currentSVGCode) {
        if (svgSubTab) {
            svgSubTab.disabled = false;
            svgSubTab.title = "Standard vector SVG code is ready!";
        }
        panel.querySelector('.sgp-sub-tab[data-sub="svg"]')?.click();
        setStatus("Ready to copy SVG!", "success");
    } else if (currentImgTag) {
        if (svgSubTab) {
            svgSubTab.disabled = true;
            svgSubTab.title = "This asset is PNG-only. Vector SVG is not available.";
        }
        panel.querySelector('.sgp-sub-tab[data-sub="url"]')?.click();
        setStatus("No SVG available. Image Tag ready.", "warning");
    }

    updateCodeArea();
    renderCollection(); 
  }

  // ---------- BACKGROUND PORT FOR FETCHING ----------
  async function fetchSVGCode(url) {
    return new Promise((resolve) => {
      if (typeof chrome === "undefined" || !chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
        console.warn("FlatGrabber: Extension runtime is disconnected or unavailable.");
        resolve(null);
        return;
      }
      try {
        chrome.runtime.sendMessage({ action: "fetchSVG", url: url }, (response) => {
          if (typeof chrome !== "undefined" && chrome && chrome.runtime && chrome.runtime.lastError) {
            console.error("Extension runtime error:", chrome.runtime.lastError);
            resolve(null);
          } else if (response && response.success) {
            resolve(response.data);
          } else {
            resolve(null);
          }
        });
      } catch (err) {
        console.error("Failed to send extension background message:", err);
        resolve(null);
      }
    });
  }

  // ---------- RESILIENT DEEP TRAVERSAL EXTRACTOR ----------
  async function findIconData(iconEl) {
    let finalSVG = null;
    let finalImgUrl = "";
    let previewSrc = "";

    // 1. Resolve preview images
    if (iconEl.tagName.toLowerCase() === "svg") {
      finalSVG = iconEl.outerHTML;
      previewSrc = encodeSVG(finalSVG);
    } else {
      previewSrc = iconEl.src || iconEl.getAttribute("src") || "";
    }

    // 2. Deep DOM Traversal up to 5 parent elements to scan for details links
    let detailUrl = "";
    let current = iconEl;
    for (let i = 0; i < 5 && current; i++) {
      if (current.tagName.toLowerCase() === "a" && (
        current.href.includes("/free-icon/") || 
        current.href.includes("/premium-icon/") || 
        current.href.includes("/packs/")
      )) {
        detailUrl = current.href;
        break;
      }
      current = current.parentElement;
    }

    // 3. Extract unique category and icon IDs
    let iconId = "";
    let categoryId = "";

    if (detailUrl) {
      const idMatch = detailUrl.match(/_(\d+)(?:\?|$)/);
      if (idMatch) iconId = idMatch[1];
    }

    const src = iconEl.src || iconEl.getAttribute("src") || "";
    if (src) {
      const srcMatch = src.match(/cdn-icons-png\.flaticon\.com\/\d+\/(\d+)\/(\d+)\.png/);
      if (srcMatch) {
        if (!categoryId) categoryId = srcMatch[1];
        if (!iconId) iconId = srcMatch[2];
      } else {
        const idFallback = src.match(/\/(\d+)\.(?:png|svg)/);
        if (idFallback && !iconId) iconId = idFallback[1];
      }
    }

    // 4. Multi-Tier Resolution Pipeline
    
    // Tier 1: If we have details URL, fetch HTML page in background and extract inline SVG (Bulletproof against site restructures!)
    if (iconId && detailUrl) {
      try {
        const pageHTML = await fetchSVGCode(detailUrl);
        if (pageHTML) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(pageHTML, "text/html");
          
          const inlineSVG = doc.querySelector(".detail__editor__icon-holder svg, #icon svg, svg#icon, .modal svg, .icon-detail svg");
          if (inlineSVG) {
            finalSVG = inlineSVG.outerHTML;
          } else {
            const detailImg = doc.querySelector("img[src*='.svg'], img[data-src*='.svg']");
            if (detailImg) {
              const dSrc = detailImg.src || detailImg.getAttribute("data-src") || "";
              if (dSrc) finalSVG = await fetchSVGCode(dSrc);
            }
          }
        }
      } catch (err) {
        console.error("HTML parse fetch failed:", err);
      }
    }

    // Tier 2: Direct CDN SVG link construction
    if (!finalSVG && iconId && categoryId) {
      const possibleSvg = `https://cdn-icons.flaticon.com/svg/${categoryId}/${iconId}.svg`;
      finalSVG = await fetchSVGCode(possibleSvg);
      if (finalSVG) finalImgUrl = possibleSvg;
    }

    // Tier 3: Skip local DOM fallbacks to prevent grabbing website UI/logo SVGs

    // Tier 4: Fallback PNG URL
    if (!finalImgUrl && src) {
      finalImgUrl = src;
    }

    // Safety check: If the fetched SVG is actually the Flaticon company logo, reject it
    if (finalSVG) {
      const cleanSVG = finalSVG.replace(/\s+/g, "");
      if ((cleanSVG.includes("width=\"147\"") && cleanSVG.includes("height=\"22\"")) ||
          cleanSVG.includes("M13.4627.626") || 
          cleanSVG.includes("M24.4731.354")) {
        finalSVG = null;
      }
    }

    return { svg: finalSVG, imgUrl: finalImgUrl, preview: previewSrc };
  }

  // ---------- NON-INTRUSIVE HOVER MANAGER ----------
  function showFloatingButton(iconEl) {
    if (hideTimeout) clearTimeout(hideTimeout);
    activeHoveredIcon = iconEl;
    
    const rect = iconEl.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Position button at the top-right corner of the icon
    // This prevents it from overlapping icons in the previous row, and doesn't block the center!
    floatingGrabBtn.style.left = (rect.right + scrollX - 6) + "px";
    floatingGrabBtn.style.top = (rect.top + scrollY + 6) + "px";
    
    floatingGrabBtn.style.display = "flex";
  }

  function showInspectorOverlay(iconEl) {
    if (hideTimeout) clearTimeout(hideTimeout);
    activeHoveredIcon = iconEl;
    
    const rect = iconEl.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    inspectorOverlay.style.width = (rect.width + 8) + "px";
    inspectorOverlay.style.height = (rect.height + 8) + "px";
    inspectorOverlay.style.left = (rect.left + scrollX - 4) + "px";
    inspectorOverlay.style.top = (rect.top + scrollY - 4) + "px";
    inspectorOverlay.style.display = "block";
  }

  function hideIndicators() {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      floatingGrabBtn.style.display = "none";
      inspectorOverlay.style.display = "none";
    }, 250);
  }

  // Track hovers across the document dynamically
  document.addEventListener("mouseover", (e) => {
    if (panel.contains(e.target)) return;
    
    const iconEl = e.target.closest(
      `img[src*="flaticon.com"], img[src*="cdn-icons"], 
       .icon-thumbnail img, .detail__editor__icon-holder,
       [class*="icon"] img, img[src*=".svg"], img[src*=".png"], svg`
    );
    
    if (e.target.closest("#sgp-floating-grab-btn")) {
      if (hideTimeout) clearTimeout(hideTimeout);
      return;
    }
    
    if (iconEl && !panel.contains(iconEl)) {
      if (isInspectorActive) {
        showInspectorOverlay(iconEl);
      } else {
        showFloatingButton(iconEl);
      }
    } else {
      hideIndicators();
    }
  });

  document.addEventListener("mouseout", (e) => {
    hideIndicators();
  });

  // Handle click on floating grab button
  floatingGrabBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeHoveredIcon) {
      floatingGrabBtn.style.display = "none";
      inspectorOverlay.style.display = "none";
      
      // Auto-open panel
      panel.style.display = "flex";
      requestAnimationFrame(() => {
        panel.style.opacity = "1";
        panel.style.transform = "scale(1) translateY(0)";
      });
      
      const { svg, imgUrl, preview } = await findIconData(activeHoveredIcon);
      showPanel(svg, imgUrl, preview);
    }
  });

  // Handle clicks directly on elements to trigger grab immediately (Highly convenient!)
  document.addEventListener("click", async (e) => {
    if (panel.contains(e.target) || e.target.closest("#sgp-floating-grab-btn") || e.target.closest("#sgp-inspector-overlay") || e.target.closest("#sgp-toast")) return;

    const iconEl = e.target.closest(
      `img[src*="flaticon.com"], img[src*="cdn-icons"], 
       .icon-thumbnail img, .detail__editor__icon-holder,
       [class*="icon"] img, img[src*=".svg"], img[src*=".png"], svg`
    );

    if (iconEl && !panel.contains(iconEl)) {
      // Only trigger direct click grab if we are on a single icon detail page.
      // On grid pages (home/search results), clicking the icon should navigate to its detail page normally.
      const isDetailPage = window.location.pathname.includes("/free-icon/") || 
                           window.location.pathname.includes("/premium-icon/") ||
                           window.location.pathname.includes("/free-animated-icon/") ||
                           iconEl.closest(".detail__editor__icon-holder") !== null ||
                           iconEl.closest(".main-icon-wrapper") !== null ||
                           iconEl.closest("#detail_editor_icon") !== null;

      if (!isDetailPage) {
        // Let normal browser click-to-navigate work on grid pages
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      floatingGrabBtn.style.display = "none";
      inspectorOverlay.style.display = "none";
      
      // Auto-open panel
      panel.style.display = "flex";
      requestAnimationFrame(() => {
        panel.style.opacity = "1";
        panel.style.transform = "scale(1) translateY(0)";
      });
      
      const { svg, imgUrl, preview } = await findIconData(iconEl);
      showPanel(svg, imgUrl, preview);
      
      if (isInspectorActive) {
        showInspectorOverlay(iconEl);
      }
    }
  }, { capture: true }); // Capture phase to intercept navigation clicks
})();
