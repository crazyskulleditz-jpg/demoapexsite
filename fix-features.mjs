// fix-features.mjs ? hero background, text-colour pickers, sticker bar, card parity
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const say = (s) => console.log(s === undefined ? '' : s);
const fail = (m) => { console.error('\n[FAIL] ' + m + '\nNOTHING WAS WRITTEN.'); process.exit(1); };

const TOUCH = ['src/App.tsx','src/context/SiteContext.tsx','src/components/AdminDashboard.tsx','src/components/Hero.tsx','src/components/ProductGrid.tsx'];
const bk = path.join(process.env.USERPROFILE || '.', 'Desktop', 'PRE_FEATURES_BACKUP');
fs.mkdirSync(bk, { recursive: true });
TOUCH.forEach(f => { if (fs.existsSync(path.join(ROOT,f))) fs.copyFileSync(path.join(ROOT,f), path.join(bk, f.replace(/[\\/]/g,'__'))); });
say('backup -> ' + bk); say('');

// ---------- the AdminDashboard panels ----------
const UI = [
'{/* === THEME: text colours / hero background / sticker header === */}',
'<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-4">',
'  <h3 className="text-xs font-bold uppercase text-white">Text Colours</h3>',
'  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">',
'    {[{k:"bodyText",l:"Body Text",d:"#f8fafc"},{k:"headerText",l:"Header Text",d:"#ffffff"},{k:"listingText",l:"Listing Text",d:"#f8fafc"}].map((f) => (',
'      <div key={f.k}>',
'        <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">{f.l}</label>',
'        <div className="flex items-center gap-2">',
'          <input type="color" value={String((config as any)[f.k] || f.d)} onChange={(e) => updateSiteSettings({ [f.k]: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />',
'          <input type="text" value={String((config as any)[f.k] || f.d)} onChange={(e) => updateSiteSettings({ [f.k]: e.target.value } as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white" />',
'        </div>',
'      </div>',
'    ))}',
'  </div>',
'</div>',
'<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-4">',
'  <h3 className="text-xs font-bold uppercase text-white">Hero Background (Image or Video)</h3>',
'  <div className="flex flex-wrap gap-2">',
'    {["none","image","video"].map((t) => (',
'      <button key={t} type="button" onClick={() => updateSiteSettings({ bgType: t } as any)}',
'        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${((config as any).bgType || "none") === t ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-950 border-slate-800 text-slate-300"}`}>{t}</button>',
'    ))}',
'  </div>',
'  <div>',
'    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Media URL (.jpg .png or .mp4)</label>',
'    <input type="text" value={String((config as any).bgMediaUrl || "")} onChange={(e) => updateSiteSettings({ bgMediaUrl: e.target.value } as any)} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white" />',
'  </div>',
'  <div>',
'    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Dark Overlay: {Math.round(Number((config as any).bgOverlayOpacity ?? 0.15) * 100)}%</label>',
'    <input type="range" min="0" max="0.9" step="0.05" value={Number((config as any).bgOverlayOpacity ?? 0.15)} onChange={(e) => updateSiteSettings({ bgOverlayOpacity: Number(e.target.value) } as any)} className="w-full" />',
'  </div>',
'</div>',
'<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-4">',
'  <h3 className="text-xs font-bold uppercase text-white">Sticker Header (scrolling bar)</h3>',
'  <input type="text" value={String((config as any).stickerText || "")} onChange={(e) => updateSiteSettings({ stickerText: e.target.value } as any)} placeholder="Type anything here. Leave empty to hide the bar." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />',
'  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">',
'    <div>',
'      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Scroll speed (sec)</label>',
'      <input type="number" min="5" max="120" value={Number((config as any).stickerSpeed || 30)} onChange={(e) => updateSiteSettings({ stickerSpeed: Number(e.target.value) } as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white" />',
'    </div>',
'    <div>',
'      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Bar colour</label>',
'      <input type="color" value={String((config as any).stickerBg || "#f59e0b")} onChange={(e) => updateSiteSettings({ stickerBg: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />',
'    </div>',
'    <div>',
'      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Sticker text colour</label>',
'      <input type="color" value={String((config as any).stickerTextColor || "#0f172a")} onChange={(e) => updateSiteSettings({ stickerTextColor: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />',
'    </div>',
'  </div>',
'</div>',
'{/* Text Size Scaler */}'
];

// ---------- new component ----------
const STICKER = [
"import React from 'react';",
"import { useSiteContext } from '../context/SiteContext';",
"",
"/** Scrolling sticker bar. Text comes from the admin panel. Hidden when empty. */",
"export const StickerBar: React.FC = () => {",
"  const { config } = useSiteContext();",
"  const cfg = config as any;",
"  const text = String(cfg.stickerText || '').trim();",
"  if (!text) return null;",
"  const speed = Number(cfg.stickerSpeed) > 0 ? Number(cfg.stickerSpeed) : 30;",
"  return (",
"    <div className=\"sticker-bar relative w-full\"",
"      style={{",
"        backgroundColor: cfg.stickerBg || 'var(--secondary-accent, #f59e0b)',",
"        color: cfg.stickerTextColor || '#0f172a',",
"      }}>",
"      <div className=\"sticker-track py-2\" style={{ animationDuration: speed + 's' }}>",
"        {Array.from({ length: 8 }).map((_, i) => (",
"          <span key={i} className=\"px-8 text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap\">{text}</span>",
"        ))}",
"      </div>",
"    </div>",
"  );",
"};",
""
];

// ---------- css addendum ----------
const CSS = [
"",
"/* 10. Header text (admin: Header Text). No-op if the navbar is not a <header>. */",
"header .text-white, header .text-slate-200, header .text-slate-300, header .text-slate-400 {",
"  color: var(--header-text, #ffffff) !important;",
"}",
"",
"/* 11. Listing cards: admin Card Background / Border / Corner Curvature */",
".theme-card {",
"  background-color: var(--card-bg, #1e293b) !important;",
"  border-color: var(--card-border-color, #334155) !important;",
"  border-radius: var(--card-radius, 1.5rem) !important;",
"}",
".theme-card .text-slate-900, .theme-card .text-slate-800, .theme-card h3 {",
"  color: var(--listing-text, #f8fafc) !important;",
"}",
"",
"/* 12. Sticker bar marquee */",
".sticker-bar { overflow: hidden; }",
".sticker-track { display: flex; white-space: nowrap; width: max-content;",
"  animation-name: sticker-scroll; animation-timing-function: linear; animation-iteration-count: infinite; }",
"@keyframes sticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }",
".sticker-bar:hover .sticker-track { animation-play-state: paused; }",
""
];

const JOBS = [
['src/context/SiteContext.tsx', [
  ["root.style.setProperty('--surface-2', lightBg ? '#eef2f7' : '#1a2436');",
   ["root.style.setProperty('--surface-2', lightBg ? '#eef2f7' : '#1a2436');",
    "",
    "    // ---- explicit overrides from the admin Theme panel ----",
    "    const cfgAny = config as any;",
    "    if (cfgAny.bodyText) root.style.setProperty('--text-primary', cfgAny.bodyText);",
    "    root.style.setProperty('--header-text', cfgAny.headerText || '#ffffff');",
    "    if (cfgAny.listingText) root.style.setProperty('--listing-text', cfgAny.listingText);"]]
]],
['src/components/Hero.tsx', [
  ["import { Language, PageView } from '../types';",
   "import { Language, PageView } from '../types';\nimport { useSiteContext } from '../context/SiteContext';"],
  ["  const isAr = language === 'ar';",
   "  const { config } = useSiteContext();\n  const cfg = config as any;\n  const isAr = language === 'ar';"],
  ["{/* Decorative Radial Accents */}", [
   "{/* Admin-configurable background media (Website Builder) */}",
   "{cfg.bgMediaUrl && cfg.bgType === 'image' ? (",
   "  <img src={cfg.bgMediaUrl} alt=\"\" className=\"absolute inset-0 w-full h-full object-cover\" />",
   ") : null}",
   "{cfg.bgMediaUrl && cfg.bgType === 'video' ? (",
   "  <video src={cfg.bgMediaUrl} autoPlay muted loop playsInline className=\"absolute inset-0 w-full h-full object-cover\" />",
   ") : null}",
   "{cfg.bgMediaUrl && cfg.bgType && cfg.bgType !== 'none' ? (",
   "  <div className=\"absolute inset-0\" style={{ backgroundColor: 'rgba(0,0,0,' + (Number(cfg.bgOverlayOpacity) || 0) + ')' }} />",
   ") : null}",
   "{/* Decorative Radial Accents */}"]]
]],
['src/App.tsx', [
  ["import './styles/theme-bridge.css';",
   "import './styles/theme-bridge.css';\nimport { StickerBar } from './components/StickerBar';"],
  [["              <Hero",
    "                language={language}",
    "                onOpenBooking={() => triggerBayBookingModal()}",
    "                onNavigatePage={handleNavigatePage}",
    "              />"],
   ["              <StickerBar />",
    "",
    "              <Hero",
    "                language={language}",
    "                onOpenBooking={() => triggerBayBookingModal()}",
    "                onNavigatePage={handleNavigatePage}",
    "              />"]]
]],
['src/components/AdminDashboard.tsx', [
  ["{/* Text Size Scaler */}", UI]
]],
['src/components/ProductGrid.tsx', [
  ["className=\"bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer\"",
   "className=\"theme-card bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer\""],
  ["bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-slate-700",
   "bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"],
  ["{product.partNumber}", "{product.category || 'PARTS'}"],
  ["{product.gallery.length} Photos",
   "{product.gallery.length} Photos\n                        </div>\n                        <div className=\"absolute bottom-2.5 right-2.5 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-black\">\n                          {product.price} KWD"],
  ["<h3 className=\"text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2\">",
   "<div className=\"text-[10px] font-mono font-bold text-slate-500 mb-1\">{product.partNumber}</div>\n                        <h3 className=\"text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2\">"]
]]
];

// ---------- phase 1: verify everything in memory ----------
const staged = [];
JOBS.forEach(([rel, edits]) => {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) fail('missing file: ' + rel);
  let text = fs.readFileSync(p, 'utf8');
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const fix = (s) => Array.isArray(s) ? s.join(nl) : s;
  edits.forEach(([find, repl], i) => {
    const f = fix(find), r = fix(repl);
    const n = text.split(f).length - 1;
    if (n !== 1) fail(rel + ' edit' + (i+1) + ': expected exactly 1 match, found ' + n + '\n--- anchor ---\n' + f);
    text = text.split(f).join(r);
    say('  [ok] ' + rel + ' edit' + (i+1));
  });
  staged.push({ abs: p, text });
});

// ---------- phase 2: write ----------
say('');
staged.forEach(s => fs.writeFileSync(s.abs, s.text, 'utf8'));
fs.writeFileSync(path.join(ROOT, 'src/components/StickerBar.tsx'), STICKER.join('\n'), 'utf8');
fs.appendFileSync(path.join(ROOT, 'src/styles/theme-bridge.css'), CSS.join('\n'), 'utf8');
say('  [ok] created src/components/StickerBar.tsx');
say('  [ok] appended theme-bridge.css rules 10-12');
say('');
say('ALL PATCHES APPLIED. Restart the dev server, then Ctrl+Shift+R.');
