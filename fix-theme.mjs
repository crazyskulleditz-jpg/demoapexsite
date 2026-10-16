// fix-theme.mjs  ?  one file of CSS + font application. No component rewrites.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const say = (s = '') => console.log(s);
const die = (m) => { console.error('\n[FAIL] ' + m); process.exit(1); };

const TOUCHED = ['src/App.tsx', 'src/context/SiteContext.tsx'];
const bk = path.join(process.env.USERPROFILE || process.env.HOME || '.', 'Desktop', 'PRE_THEME_FIX_BACKUP');
fs.mkdirSync(bk, { recursive: true });
TOUCHED.forEach(t => fs.copyFileSync(path.join(ROOT, t), path.join(bk, t.replace(/[\\/]/g, '__'))));
say('backup -> ' + bk); say('');

function patch(rel, edits) {
  const p = path.join(ROOT, rel);
  let text = fs.readFileSync(p, 'utf8');
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const fix = (s) => (Array.isArray(s) ? s.join(nl) : s);
  edits.forEach(([find, repl], i) => {
    const f = fix(find), r = fix(repl);
    const n = text.split(f).length - 1;
    if (n === 0) die(rel + ' edit' + (i + 1) + ': anchor NOT found:\n---\n' + f + '\n---');
    text = text.split(f).join(r);
    say('  [ok] ' + rel + ' edit' + (i + 1) + ' (' + n + ' match)');
  });
  fs.writeFileSync(p, text, 'utf8');
}

// ---------- 1. the CSS bridge ----------
const css = `/* ================================================================
   theme-bridge.css  -  storefront colours, defined in ONE place
   ----------------------------------------------------------------
   WHY: ProductGrid / ShowroomGrid / ServicesSection were written with
   hardcoded LIGHT Tailwind classes (bg-slate-50, bg-white, text-slate-900).
   Admin, the navbar and the item-detail page read the live theme variables
   from SiteContext (--page-bg, --card-bg, --primary-accent). So half the
   site followed your Theme settings and half stayed white. That was the bug.

   This file maps those light literals onto the live variables, once, instead
   of editing class strings in several components (easy to miss one).
   Change a colour in admin -> every surface below follows.

   HOW TO REVERT: delete the theme-bridge import line in src/App.tsx.
   ================================================================ */

:root {
  --app-font: 'Inter', 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --surface-2: #1a2436;
}

html, body { font-family: var(--app-font) !important; }

/* 1. light page backgrounds -> your page background */
.bg-slate-50, .bg-gray-50, .bg-neutral-50, .bg-zinc-50 {
  background-color: var(--page-bg, #0f172a) !important;
}

/* 2. white / inset surfaces -> your card background */
.bg-white, .bg-slate-200, .bg-gray-200 {
  background-color: var(--card-bg, #1e293b) !important;
}
.bg-slate-100, .bg-gray-100, .bg-slate-300 {
  background-color: var(--surface-2, #1a2436) !important;
}

/* 3. borders and dividers */
[class*="border-slate-"], [class*="border-gray-"],
[class*="divide-slate-"], [class*="divide-gray-"] {
  border-color: var(--card-border-color, #334155) !important;
}

/* 4. text colours */
.text-slate-900, .text-slate-800, .text-gray-900, .text-gray-800, .text-black {
  color: var(--text-primary, #f8fafc) !important;
}
.text-slate-700, .text-slate-600, .text-gray-700, .text-gray-600 {
  color: var(--text-secondary, #cbd5e1) !important;
}
.text-slate-500, .text-slate-400, .text-gray-500 {
  color: var(--text-muted, #94a3b8) !important;
}

/* 5. hardcoded blue -> your real accent colour */
.bg-sky-600, .bg-sky-500, .bg-blue-600, .bg-blue-500 {
  background-color: var(--primary-accent, #0284c7) !important;
}
.text-sky-600, .text-sky-500, .text-blue-600, .text-blue-500 {
  color: var(--primary-accent, #0284c7) !important;
}
[class*="border-sky-"], [class*="border-blue-"] {
  border-color: var(--primary-accent, #0284c7) !important;
}

/* 6. SAFETY NET - coloured callouts (the yellow advice box, red/green badges)
      keep their own colours. MUST stay last. */
[class*="bg-amber-"] *, [class*="bg-yellow-"] *, [class*="bg-emerald-"] *,
[class*="bg-green-"] *, [class*="bg-rose-"] *, [class*="bg-red-"] *,
[class*="bg-orange-"] *, [class*="bg-lime-"] * {
  color: inherit !important;
}
`;
fs.mkdirSync(path.join(ROOT, 'src/styles'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/styles/theme-bridge.css'), css, 'utf8');
say('  [ok] created src/styles/theme-bridge.css');

// ---------- 2. load the bridge ----------
patch('src/App.tsx', [[
  "import { CatalogContext } from './context/CatalogContext';",
  "import { CatalogContext } from './context/CatalogContext';\nimport './styles/theme-bridge.css';"
]]);

// ---------- 3. text vars + FONT FAMILY (never applied before) ----------
patch('src/context/SiteContext.tsx', [[
  ["    // Apply font scale to root", "    root.style.fontSize = fontScale;"],
  [
    "    // ---- derive readable text colours from the page background ----",
    "    const toRgb = (hex: string): number[] | null => {",
    "      const m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(String(hex).trim());",
    "      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;",
    "    };",
    "    const pageRgb = toRgb(page);",
    "    const lightBg = pageRgb ? (0.299 * pageRgb[0] + 0.587 * pageRgb[1] + 0.114 * pageRgb[2]) > 150 : false;",
    "    root.style.setProperty('--text-primary', lightBg ? '#0f172a' : '#f8fafc');",
    "    root.style.setProperty('--text-secondary', lightBg ? '#334155' : '#cbd5e1');",
    "    root.style.setProperty('--text-muted', lightBg ? '#64748b' : '#94a3b8');",
    "    root.style.setProperty('--surface-2', lightBg ? '#eef2f7' : '#1a2436');",
    "",
    "    // ---- FONT FAMILY: this was stored by the admin panel but never applied ----",
    "    const DEFAULT_STACK = \"'Inter', 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif\";",
    "    const SPECIFIC_FONTS: [RegExp, string][] = [",
    "      [/orbitron|motorsport|hud/i, \"'Orbitron', 'Rajdhani', 'Inter', sans-serif\"],",
    "      [/jetbrain|mono|technical|ecu/i, \"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace\"],",
    "      [/montserrat|geometric/i, \"'Montserrat', 'Inter', sans-serif\"],",
    "      [/tajawal|cairo|arabic/i, \"'Tajawal', 'Cairo', 'Inter', sans-serif\"],",
    "      [/jakarta|crisp/i, \"'Plus Jakarta Sans', 'Inter', sans-serif\"],",
    "      [/sync|avant|luxury|garde/i, \"'Sync', 'Avant Garde', 'Poppins', 'Inter', sans-serif\"],",
    "    ];",
    "    const GENERIC_FONTS: [RegExp, string][] = [[/geist|inter|modern|sans|ui|system/i, DEFAULT_STACK]];",
    "    const fontCandidates = [config.customFontFamily, config.fontStyle]",
    "      .filter((v) => typeof v === 'string' && v.trim().length > 0) as string[];",
    "    let fontStack = '';",
    "    for (const cand of fontCandidates) {",
    "      if (/,|\"/.test(cand)) { fontStack = cand; break; }",
    "      const hit = SPECIFIC_FONTS.find(([re]) => re.test(cand));",
    "      if (hit) { fontStack = hit[1]; break; }",
    "    }",
    "    if (!fontStack) {",
    "      for (const cand of fontCandidates) {",
    "        const hit = GENERIC_FONTS.find(([re]) => re.test(cand));",
    "        if (hit) { fontStack = hit[1]; break; }",
    "      }",
    "    }",
    "    if (!fontStack) fontStack = DEFAULT_STACK;",
    "    root.style.setProperty('--app-font', fontStack);",
    "    root.style.fontFamily = fontStack;",
    "",
    "    // Apply font scale to root",
    "    root.style.fontSize = fontScale;"
  ]
]]);

// ---------- verify ----------
say('');
say('verification');
const app = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
const sc = fs.readFileSync(path.join(ROOT, 'src/context/SiteContext.tsx'), 'utf8');
say((app.includes("import './styles/theme-bridge.css';") ? '  [ok] ' : '  [WARN] ') + 'App.tsx imports the bridge');
say((sc.includes('--app-font') ? '  [ok] ' : '  [WARN] ') + 'SiteContext applies a font family');
say((sc.includes('--text-primary') ? '  [ok] ' : '  [WARN] ') + 'SiteContext derives text colours');
say((fs.existsSync(path.join(ROOT, 'src/styles/theme-bridge.css')) ? '  [ok] ' : '  [WARN] ') + 'theme-bridge.css exists');
say('');
say('DONE. Restart the dev server (Ctrl+C, then npm run dev), hard refresh Ctrl+Shift+R.');
