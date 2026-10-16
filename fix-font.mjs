import fs from 'fs';
import path from 'path';
const ROOT = process.cwd();
const say = (s='') => console.log(s);
const die = (m) => { console.error('\n[FAIL] '+m); process.exit(1); };

const bk = path.join(process.env.USERPROFILE||process.env.HOME||'.','Desktop','PRE_FONT_FIX_BACKUP');
fs.mkdirSync(bk,{recursive:true});
['src/context/SiteContext.tsx','index.html','src/styles/theme-bridge.css'].forEach(f=>{
  if (fs.existsSync(path.join(ROOT,f))) fs.copyFileSync(path.join(ROOT,f), path.join(bk, f.replace(/[\\/]/g,'__')));
});
say('backup -> '+bk); say('');

function patch(rel, edits) {
  const p = path.join(ROOT, rel);
  let text = fs.readFileSync(p,'utf8');
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const fix = s => Array.isArray(s) ? s.join(nl) : s;
  edits.forEach(([find,repl],i)=>{
    const f = fix(find), r = fix(repl);
    const n = text.split(f).length-1;
    if (n===0) die(rel+' edit'+(i+1)+': anchor not found:\n---\n'+f+'\n---');
    text = text.split(f).join(r);
    say('  [ok] '+rel+' edit'+(i+1)+' ('+n+' match)');
  });
  fs.writeFileSync(p,text,'utf8');
}

// 1. THE FONT BUG: the effect never re-ran, because fontStyle / customFontFamily
//    were missing from its dependency array.
patch('src/context/SiteContext.tsx', [[
  ["  }, [",
   "    config.themeColor,",
   "    config.secondaryAccent,",
   "    config.headerBg,",
   "    config.footerBg,",
   "    config.cardBg,",
   "    config.pageBg,",
   "    config.fontSizeScale,",
   "    config.cardBorderRadius,",
   "    config.cardBorderColor,",
   "    config.cardBorderWidth",
   "  ]);"],
  ["  }, [config]);   // re-run on ANY setting change (incl. fontStyle / customFontFamily)"]
]]);

// 2. actually download the fonts (picking an unloaded font = no visible change)
if (fs.existsSync(path.join(ROOT,'index.html'))) {
  patch('index.html', [[ '</head>', [
    '    <!-- Fonts offered by the admin Typography picker -->',
    '    <link rel="preconnect" href="https://fonts.googleapis.com" />',
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&family=Cairo:wght@300;400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Rajdhani:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />',
    '  </head>',
  ].join('\n') ]]);
  say('  [ok] index.html got the font <link>s');
} else {
  say('  [skip] index.html not found ? tell me your HTML entry filename');
}

// 3. light callout panels must not go white-on-white
fs.appendFileSync(path.join(ROOT,'src/styles/theme-bridge.css'), [
'',
'/* 9. Light callout panels (the amber advice box) keep a LIGHT surface and DARK',
'      text. Without this, rule 5 turned the panel text white while the panel',
'      background stayed light -> invisible text. */',
'[class*="from-amber-"], [class*="from-yellow-"], [class*="from-orange-"],',
'[class*="to-amber-"],   [class*="via-amber-"],  [class*="via-yellow-"] {',
'  background-image: none !important;',
'  background-color: #fffbeb !important;',
'  color: #0f172a !important;',
'}',
'[class*="from-amber-"] *, [class*="from-yellow-"] *, [class*="from-orange-"] * {',
'  color: #0f172a !important;',
'}',
''].join('\n'), 'utf8');
say('  [ok] theme-bridge.css: callout rule appended');

say('');
const sc = fs.readFileSync(path.join(ROOT,'src/context/SiteContext.tsx'),'utf8');
const n = sc.split('}, [config]);').length - 1;
say((n >= 2 ? '  [ok] ' : '  [WARN] ') + 'effects depending on [config]: ' + n + ' (need 2)');
say('');
say('DONE. Restart the dev server, hard refresh, then re-pick a font in admin.');
