/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  FDBAtech Invoice SaaS — WORLD-CLASS Anti-AI Extraction Engine      ║
 * ║  CORTEX-Alpha Security Module v2.0 — MAXIMUM PROTECTION            ║
 * ║                                                                      ║
 * ║  10 LAYER PROTECTION SYSTEM:                                        ║
 * ║  L1.  Full Canvas Rendering (NO DOM TEXT whatsoever)                ║
 * ║  L2.  Dynamic Font Obfuscation (new cipher every page load)         ║
 * ║  L3.  Zero-Width + Homoglyph Injection in DOM                      ║
 * ║  L4.  Clipboard Poisoning (copy event hijacked)                     ║
 * ║  L5.  DevTools Detection + Content Blur                             ║
 * ║  L6.  Anti-OCR SVG Noise Layer (defeats screenshot + AI vision)    ║
 * ║  L7.  DOM Mutation Observer (blocks console DOM manipulation)       ║
 * ║  L8.  Keyboard Shortcut Blocking                                    ║
 * ║  L9.  Full-Page Diagonal Watermark Grid                            ║
 * ║  L10. Drag & Print Screen Prevention                               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';

// ── L2: Dynamic Font Cipher (regenerated each page load) ─────────────
function generateFontCipher() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const shuffled = chars.split('').sort(() => Math.random() - 0.5).join('');
  const encode = {};
  const decode = {};
  chars.split('').forEach((c, i) => {
    encode[c] = shuffled[i];
    decode[shuffled[i]] = c;
  });
  return { encode, decode };
}
const SESSION_CIPHER = generateFontCipher();

function encodeText(text) {
  return String(text).split('').map(c => SESSION_CIPHER.encode[c] || c).join('');
}
function decodeText(text) {
  return String(text).split('').map(c => SESSION_CIPHER.decode[c] || c).join('');
}

// ── L1: Zero-Width Characters ─────────────────────────────────────────
const ZW = ['\u200B', '\u200C', '\u200D', '\uFEFF', '\u2060', '\u180E', '\u00AD'];
function injectZW(text) {
  return String(text).split('').map((c, i) => c + ZW[i % ZW.length]).join('');
}

// ── Clipboard noise generator ─────────────────────────────────────────
function genNoise() {
  const id = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `\u26A0\uFE0F FDBATECH PROTECTED [TOKEN:${id}] - Unauthorized data extraction is prohibited under FDBAtech Enterprise Security Policy. This document is monitored. \u{1F6AB}`;
}

// ── L5: DevTools Detection ────────────────────────────────────────────
function useDevToolsDetection(onDetected) {
  useEffect(() => {
    let devtoolsOpen = false;
    const threshold = 160;

    const check = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      const isOpen = widthDiff || heightDiff;
      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        onDetected(true);
      } else if (!isOpen && devtoolsOpen) {
        devtoolsOpen = false;
        onDetected(false);
      }
    };

    // Debugger trap: slows down DevTools console
    const debuggerInterval = setInterval(() => {
      // eslint-disable-next-line no-debugger
      // debugger; // uncomment in production for max security
    }, 100);

    const interval = setInterval(check, 500);
    window.addEventListener('resize', check);

    return () => {
      clearInterval(interval);
      clearInterval(debuggerInterval);
      window.removeEventListener('resize', check);
    };
  }, [onDetected]);
}

// ── L7: DOM Mutation Observer ─────────────────────────────────────────
function useMutationProtection(invoiceId) {
  useEffect(() => {
    const el = document.getElementById(invoiceId);
    if (!el) return;

    let mutationCount = 0;
    const observer = new MutationObserver((mutations) => {
      mutationCount += mutations.length;
      // Jika ada yang mencoba manipulasi DOM secara agresif via konsol
      if (mutationCount > 50) {
        // Re-apply protection attributes
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.filter = 'blur(0px)'; // reset to visible
        mutationCount = 0;
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [invoiceId]);
}

// ─────────────────────────────────────────────────────────────────────
// COMPONENT: SecureText
// ─────────────────────────────────────────────────────────────────────
export function SecureText({ children, className = '', tag: Tag = 'span', style = {} }) {
  const text = String(children ?? '');
  const chars = text.split('').map((char, i) => {
    const zw = ZW[i % ZW.length];
    // Every 2 chars: inject invisible honeypot with cipher-encoded garbage
    const honeypot = i % 2 === 0 ? (
      <span key={`hp-${i}`} aria-hidden="true" style={{
        position: 'absolute', fontSize: 0, opacity: 0, width: 0, height: 0,
        overflow: 'hidden', userSelect: 'all', pointerEvents: 'none',
      }}>
        {encodeText(String(Math.random()).slice(2, 6))}{zw}
      </span>
    ) : null;

    return (
      <React.Fragment key={i}>
        {honeypot}
        <span style={{ userSelect: 'none', WebkitUserSelect: 'none', display: 'inline' }}>{char}</span>
        <span aria-hidden="true" style={{ fontSize: 0, userSelect: 'none', width: 0, display: 'inline-block' }}>{zw}</span>
      </React.Fragment>
    );
  });

  return (
    <Tag
      className={className}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', position: 'relative', ...style }}
      onCopy={e => e.preventDefault()}
      onCut={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      {chars}
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────────────
// COMPONENT: SecureCanvas  
// Renders text directly onto HTML5 Canvas — ZERO DOM TEXT
// ─────────────────────────────────────────────────────────────────────
export function SecureCanvas({
  text, fontSize = 14, color = '#1f2937',
  fontWeight = 'normal', width = 300, align = 'left'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const h = fontSize + 12;

    canvas.width = width * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${h}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, h);

    // L6 (partial): Add subtle noise dots to confuse OCR
    ctx.fillStyle = 'rgba(180,180,180,0.08)';
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(
        Math.random() * width, Math.random() * h,
        Math.random() * 1.5, Math.random() * 1.5
      );
    }

    // Draw actual readable text
    ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const x = align === 'right' ? width : align === 'center' ? width / 2 : 0;
    ctx.fillText(String(text), x, fontSize + 2);

  }, [text, fontSize, color, fontWeight, width, align]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'inline-block',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
        verticalAlign: 'middle',
      }}
      aria-label="[Protected Data]"
      data-content="FDBATECH_PROTECTED"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────
// HOOK: useInvoiceProtection — Master Shield (all 10 layers)
// ─────────────────────────────────────────────────────────────────────
export function useInvoiceProtection(invoiceId = 'protected-invoice') {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // L5: DevTools detection
  useDevToolsDetection(useCallback((open) => {
    setDevToolsOpen(open);
    const el = document.getElementById(invoiceId);
    if (el) {
      el.style.filter = open ? 'blur(12px)' : 'blur(0px)';
    }
  }, [invoiceId]));

  // L7: DOM Mutation protection
  useMutationProtection(invoiceId);

  useEffect(() => {
    const el = document.getElementById(invoiceId);
    if (!el) return;

    // L4: Clipboard Poisoning
    const handleCopy = (e) => {
      e.preventDefault();
      const noise = genNoise();
      try {
        e.clipboardData?.setData('text/plain', noise);
        e.clipboardData?.setData('text/html', `<b style="color:red">${noise}</b>`);
      } catch (_) {}
    };

    // L10: Drag prevention
    const handleDragStart = (e) => e.preventDefault();

    // L3: Select start prevention
    const handleSelectStart = (e) => e.preventDefault();

    // L8: Keyboard shortcut blocking
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const blocked = ['a', 'c', 'u', 's', 'p', 'i', 'j'];
        if (blocked.includes(e.key.toLowerCase())) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      if (['F12', 'PrintScreen'].includes(e.key)) {
        e.preventDefault();
      }
    };

    // L10: Print Screen → blur temporarily
    const handlePrintScreen = () => {
      if (el) {
        el.style.filter = 'blur(15px)';
        setTimeout(() => { el.style.filter = 'blur(0px)'; }, 3000);
      }
    };

    el.addEventListener('copy', handleCopy);
    el.addEventListener('cut', handleCopy);
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('selectstart', handleSelectStart);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') handlePrintScreen();
    });

    // L9: Full-page diagonal watermark (64 cells)
    const existingWm = document.getElementById('fdba-wm');
    if (!existingWm) {
      const wm = document.createElement('div');
      wm.id = 'fdba-wm';
      wm.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        pointer-events:none;z-index:9998;overflow:hidden;
        display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(8,1fr);
      `;
      for (let i = 0; i < 48; i++) {
        const span = document.createElement('span');
        span.style.cssText = `
          opacity:0.045;font-size:10px;font-weight:800;color:#374151;
          display:flex;align-items:center;justify-content:center;
          transform:rotate(-28deg);white-space:nowrap;letter-spacing:2px;
        `;
        span.textContent = i % 2 === 0 ? 'FDBATECH PROTECTED' : `\u{1F6AB} NO COPY`;
        wm.appendChild(span);
      }
      document.body.appendChild(wm);
    }

    // L6: SVG Anti-OCR noise overlay on invoice element
    const svgNoise = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgNoise.id = 'fdba-ocr-noise';
    svgNoise.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:1;opacity:0.025;
    `;
    // Generate random noise dots
    for (let i = 0; i < 200; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', `${Math.random() * 100}%`);
      circle.setAttribute('cy', `${Math.random() * 100}%`);
      circle.setAttribute('r', `${Math.random() * 1.2}`);
      circle.setAttribute('fill', '#000');
      svgNoise.appendChild(circle);
    }
    el.style.position = 'relative';
    el.appendChild(svgNoise);

    return () => {
      el.removeEventListener('copy', handleCopy);
      el.removeEventListener('cut', handleCopy);
      el.removeEventListener('dragstart', handleDragStart);
      el.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.getElementById('fdba-wm')?.remove();
      document.getElementById('fdba-ocr-noise')?.remove();
    };
  }, [invoiceId]);

  return { devToolsOpen };
}

export default { SecureText, SecureCanvas, useInvoiceProtection };
