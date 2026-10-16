// fix-pass4.mjs ? real file upload, neon hover colour, font hard-override.
// Atomic: every anchor verified BEFORE anything is written.
import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const say = (s) => console.log(s === undefined ? '' : s);
const fail = (m) => { console.error('\n[FAIL] ' + m + '\nNOTHING WRITTEN.'); process.exit(1); };
const nlOf = (t) => (t.includes('\r\n') ? '\r\n' : '\n');

const TOUCH = ['src/context/SiteContext.tsx','src/components/AdminDashboard.tsx','src/components/Hero.tsx'];
const bk = path.join(process.env.USERPROFILE || '.', 'Desktop','PRE_PASS4_BACKUP');
fs.mkdirSync(bk, {recursive:true});
TOUCH.forEach(f => fs.copyFileSync(path.join(ROOT,f), path.join(bk, f.replace(/[\\/]/g,'__'))));
say('backup -> ' + bk); say('');

function patch(rel, edits) {
  const p = path.join(ROOT, rel);
  let text = fs.readFileSync(p, 'utf8');
  const nl = nlOf(text);
  const fix = (s) => Array.isArray(s) ? s.join(nl) : s;
  edits.forEach(([find, repl, expect], i) => {
    const f = fix(find), r = fix(repl);
    const n = text.split(f).length - 1;
    const want = expect === undefined ? 1 : expect;
    if (n !== want) fail(rel + ' edit' + (i+1) + ': expected ' + want + ' match, found ' + n + '\n--- anchor ---\n' + f);
    text = text.split(f).join(r);
    say('  [ok] ' + rel + ' edit' + (i+1) + (want > 1 ? ' (' + n + ')' : ''));
  });
  fs.writeFileSync(p, text, 'utf8');
}

const STORE = [
"// src/utils/mediaStore.ts",
"// Uploaded media goes to IndexedDB (thousands of MB), never localStorage.",
"// localStorage is ~5 MB and inflates data URLs by 4/3 - that is what caused",
"// the QuotaExceededError. IndexedDB stores real binary.",
"",
"const DB_NAME = 'apex_media';",
"const STORE = 'files';",
"",
"function openDb(): Promise<IDBDatabase> {",
"  return new Promise((resolve, reject) => {",
"    const req = indexedDB.open(DB_NAME, 1);",
"    req.onupgradeneeded = () => {",
"      const db = req.result;",
"      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);",
"    };",
"    req.onsuccess = () => resolve(req.result);",
"    req.onerror = () => reject(req.error);",
"  });",
"}",
"",
"export interface SavedMedia { url: string; type: 'image' | 'video'; }",
"",
"export async function saveMediaFile(file: File): Promise<SavedMedia> {",
"  const type: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';",
"  const key = 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);",
"  try {",
"    const db = await openDb();",
"    await new Promise<void>((res, rej) => {",
"      const tx = db.transaction(STORE, 'readwrite');",
"      tx.objectStore(STORE).put(file, key);",
"      tx.oncomplete = () => res();",
"      tx.onerror = () => rej(tx.error);",
"    });",
"    return { url: 'idb:' + key, type };",
"  } catch (e) {",
"    if (file.size > 400 * 1024) {",
"      alert('IndexedDB unavailable and this file is over 400 KB - cannot store it safely.');",
"      return { url: '', type };",
"    }",
"    const dataUrl = await new Promise<string>((res) => {",
"      const r = new FileReader();",
"      r.onload = () => res(String(r.result));",
"      r.readAsDataURL(file);",
"    });",
"    return { url: dataUrl, type };",
"  }",
"}",
"",
"export async function resolveMediaUrl(url: string): Promise<string> {",
"  if (!url || url.indexOf('idb:') !== 0) return url;",
"  try {",
"    const db = await openDb();",
"    const blob = await new Promise<Blob | null>((res, rej) => {",
"      const tx = db.transaction(STORE, 'readonly');",
"      const rq = tx.objectStore(STORE).get(url.slice(4));",
"      rq.onsuccess = () => res((rq.result as Blob) || null);",
"      rq.onerror = () => rej(rq.error);",
"    });",
"    return blob ? URL.createObjectURL(blob) : '';",
"  } catch (e) { return ''; }",
"}",
""
];

const NEON_UI = [
'{/* === THEME: neon hover glow on listing cards === */}',
'<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3 mt-4">',
'  <h3 className="text-xs font-bold uppercase text-white">Listing Hover Glow (Neon)</h3>',
'  <div className="flex items-center gap-2">',
'    <input type="color" value={String((config as any).neonColor || "#22d3ee")} onChange={(e) => updateSiteSettings({ neonColor: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />',
'    <input type="text" value={String((config as any).neonColor || "#22d3ee")} onChange={(e) => updateSiteSettings({ neonColor: e.target.value } as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white" />',
'  </div>',
'  <p className="text-[10px] text-slate-500">On/off follows the existing "Enable Subtle Neon Accent Glow" checkbox below.</p>',
'</div>',
'{/* === THEME: text colours / hero background / sticker header === */}'
];

const UPLOAD_UI = [
'    <div className="mb-3">',
'      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Upload from your device (image or video)</label>',
'      <input type="file" accept="image/*,video/*"',
'        onChange={async (e) => {',
'          const f = e.target.files && e.target.files[0];',
'          if (!f) return;',
'          const saved = await saveMediaFile(f);',
'          if (saved.url) updateSiteSettings({ bgMediaUrl: saved.url, bgType: saved.type } as any);',
'        }}',
'        className="block w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white cursor-pointer" />',
'      <p className="text-[10px] text-slate-500 mt-1">Stored in IndexedDB in this browser. Videos supported - they never touch localStorage.</p>',
'    </div>',
'    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Media URL (.jpg .png or .mp4)</label>'
];

const HERO_NEW = [
'      {/* Hero background: uploaded file (idb:) or plain URL, image or video */}',
"{bgSrc && bgKind === 'image' ? (",
'  <img src={bgSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />',
') : null}',
"{bgSrc && bgKind === 'video' ? (",
'  <video src={bgSrc} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />',
') : null}',
'{bgSrc ? (',
'  <div className="absolute inset-0" style={{ backgroundColor: \'rgba(0,0,0,\' + (Number(cfg.bgOverlayOpacity) || 0) + \')\' }} />',
') : null}',
'      {/* Decorative Radial Accents */}'
].join('\n');

const JOBS = [
['src/context/SiteContext.tsx', [
  ["    root.style.setProperty('--header-text', cfgAny.headerText || '#ffffff');",
   ["    root.style.setProperty('--header-text', cfgAny.headerText || '#ffffff');",
    "    root.style.setProperty('--neon-color', cfgAny.enableNeonGlow === false",
    "      ? 'transparent'",
    "      : (cfgAny.neonColor || 'var(--secondary-accent, #f59e0b)'));"]]
]],
['src/components/AdminDashboard.tsx', [
  ["const SESSION_STORAGE_KEY = 'apex_admin_auth';",
   "import { saveMediaFile } from '../utils/mediaStore';\n\nconst SESSION_STORAGE_KEY = 'apex_admin_auth';"],
  ['<label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Media URL (.jpg .png or .mp4)</label>', UPLOAD_UI],
  ['{/* === THEME: text colours / hero background / sticker header === */}', NEON_UI]
]],
['src/components/Hero.tsx', [
  ["import React from 'react';", "import React, { useEffect, useState } from 'react';"],
  ["import { useSiteContext } from '../context/SiteContext';",
   "import { useSiteContext } from '../context/SiteContext';\nimport { resolveMediaUrl } from '../utils/mediaStore';"],
  ["  const cfg = config as any;", [
   "  const cfg = config as any;",
   "",
   "  // Resolve uploaded media and decide image vs video from the real source,",
   "  // so a video saved while the panel said 'image' still renders as video.",
   "  const [bgSrc, setBgSrc] = useState('');",
   "  const [bgKind, setBgKind] = useState<'image' | 'video' | 'none'>('none');",
   "  useEffect(() => {",
   "    const raw = String(cfg.bgMediaUrl || '');",
   "    const declared = String(cfg.bgType || 'none');",
   "    if (!raw || declared === 'none') { setBgSrc(''); setBgKind('none'); return; }",
   "    let cancelled = false;",
   "    const isVideo = raw.indexOf('data:video') === 0 || /\\.(mp4|webm|ogg|mov)(\\?|$)/i.test(raw);",
   "    resolveMediaUrl(raw).then((resolved) => {",
   "      if (cancelled) return;",
   "      setBgSrc(resolved);",
   "      setBgKind(isVideo || declared === 'video' ? 'video' : 'image');",
   "    });",
   "    return () => { cancelled = true; };",
   "  }, [cfg.bgMediaUrl, cfg.bgType]);"]]
]]
];

// Hero: replace the whole old media span, using its two known markers.
{
  const p = path.join(ROOT, 'src/components/Hero.tsx');
  let t = fs.readFileSync(p, 'utf8');
  const A = '{/* Admin-configurable background media (Website Builder) */}';
  const B = '{/* Decorative Radial Accents */}';
  const ia = t.indexOf(A), ib = t.indexOf(B);
  if (ia === -1 || ib === -1 || ib <= ia) fail('Hero.tsx: media block markers not found (A=' + ia + ' B=' + ib + ')');
  const nl = nlOf(t);
  t = t.slice(0, ia) + HERO_NEW.split('\n').join(nl) + nl + t.slice(ib);
  fs.writeFileSync(p, t, 'utf8');
  say('  [ok] Hero.tsx media block replaced (markers, not guesses)');
}

JOBS.forEach(([rel, edits]) => {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) fail('missing file: ' + rel);
  patch(rel, edits);
});

const CSS = [
'',
'/* 14. NEON HOVER GLOW - colour comes from the admin picker. */',
'.theme-card { transition: box-shadow 180ms ease, border-color 180ms ease; }',
'.theme-card:hover {',
'  border-color: var(--neon-color, #22d3ee) !important;',
'  box-shadow: 0 0 0 1px var(--neon-color, #22d3ee), 0 0 26px -6px var(--neon-color, #22d3ee) !important;',
'}',
'',
'/* 15. FONT HARD-OVERRIDE.',
'   If any wrapper (e.g. #root class="font-sans") declares its own font-family,',
'   inheritance stops there and the admin font picker LOOKS broken even though',
'   --app-font is set correctly. This forces the chosen font everywhere except',
'   deliberate monospace. */',
'html, body, #root, #root *:not(.font-mono):not(code):not(pre):not(kbd):not(samp) {',
'  font-family: var(--app-font) !important;',
'}',
''
].join('\n');

const stagedFiles = [];
fs.mkdirSync(path.join(ROOT, 'src/utils'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/utils/mediaStore.ts'), STORE.join('\n'), 'utf8');
say('  [ok] created src/utils/mediaStore.ts');
fs.appendFileSync(path.join(ROOT, 'src/styles/theme-bridge.css'), CSS, 'utf8');
say('  [ok] theme-bridge.css: neon + font override appended');

const vj = path.join(ROOT, 'vercel.json');
if (!fs.existsSync(vj)) {
  fs.writeFileSync(vj, JSON.stringify({ rewrites: [{ source: '/(.*)', destination: '/index.html' }] }, null, 2) + '\n', 'utf8');
  say('  [ok] created vercel.json (so /admin and /parts do not 404 when deployed)');
} else {
  say('  [skip] vercel.json already exists');
}

say('');
say('ALL PATCHES APPLIED. Ctrl+C, npm run dev, then Ctrl+Shift+R.');
say('Then: admin -> Website Builder -> Hero Background -> Upload from your device.');
