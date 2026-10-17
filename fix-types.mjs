// fix-types.mjs - copy the sibling 'specs' type onto GarageService,
// add the 'dateAr' twin of 'date' to OrderRecord. Anchors read from the file.
import fs from 'fs';
const P = 'src/types.ts';
const say = (s) => console.log(s === undefined ? '' : s);
const fail = (m) => { console.error('\n[FAIL] ' + m + '\nNOTHING WRITTEN.'); process.exit(1); };
if (!fs.existsSync(P)) fail(P + ' not found - check src/types/index.ts');

let src = fs.readFileSync(P, 'utf8');
const nl = src.includes('\r\n') ? '\r\n' : '\n';

function findIface(t, name) {
  const m = new RegExp('(?:export\\s+)?interface\\s+' + name + '\\b[^{]*\\{').exec(t);
  if (!m) return null;
  const open = m.index + m[0].length;
  let d = 1, i = open;
  while (i < t.length && d > 0) { if (t[i] === '{') d++; else if (t[i] === '}') d--; i++; }
  return d === 0 ? { open, close: i - 1, body: t.slice(open, i - 1) } : null;
}
const HAS = (b, p) => new RegExp('(^|\\n)\\s*' + p + '\\s*\\??\\s*:').test(b);

const gs = findIface(src, 'GarageService');
const or = findIface(src, 'OrderRecord');
if (!gs) fail('GarageService not found in ' + P);
if (!or) fail('OrderRecord not found in ' + P);

say('=== GarageService (current) ==='); say(gs.body.trim());
say(''); say('=== OrderRecord (current) ==='); say(or.body.trim()); say('');

const hasSpecs = HAS(gs.body, 'specs'), hasDateAr = HAS(or.body, 'dateAr');
let specsLine = null;
for (const n of ['Product', 'Vehicle']) {
  const b = findIface(src, n);
  if (!b) continue;
  const m = b.body.match(/(^|\n)\s*specs\s*\??\s*:[^\n]*/);
  if (m) { specsLine = m[0].trim(); say('specs copied from ' + n + ':  ' + specsLine); break; }
}
if (hasSpecs)  say('GarageService already has specs.');
if (hasDateAr) say('OrderRecord already has dateAr.');
if (!hasSpecs && !specsLine) fail('no existing specs declaration on Product/Vehicle to copy');

const edits = [];
if (!hasSpecs)  edits.push({ at: gs.close, text: '  ' + specsLine.replace(/^specs\s*\??\s*:/, 'specs?:') + nl });
if (!hasDateAr) edits.push({ at: or.close, text: '  dateAr?: string;' + nl });
edits.sort((a, b) => b.at - a.at);

let out = src;
for (const e of edits) out = out.slice(0, e.at) + e.text + out.slice(e.at);
if (!HAS(findIface(out, 'GarageService').body, 'specs'))  fail('post-check: specs missing');
if (!HAS(findIface(out, 'OrderRecord').body, 'dateAr'))   fail('post-check: dateAr missing');
fs.writeFileSync(P, out, 'utf8');
say(''); say('WROTE ' + P);
