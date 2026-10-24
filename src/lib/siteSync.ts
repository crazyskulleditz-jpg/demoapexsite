import { supabase } from './supabase';

// Exposed for console debugging + one-time migration.
(window as unknown as { supabase: typeof supabase }).supabase = supabase;

const SITE_KEY = 'apex_torque_site_config_v2';
const ADOPTED_REV_KEY = 'apex_torque_site_config_adopted_rev';
const PUSH_DEBOUNCE_MS = 800;
const POLL_MS = 30000;

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushedCanon = '';
let dirty = false;
let userActive = false;
let started = false;
let applyingRemote = false;
let signedIn = false;

/* Canonical JSON: recursively sort keys so jsonb reordering can never
   make identical data look different. */
function canon(v: unknown): string {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  try { return JSON.stringify(walk(v)); } catch { return ''; }
}

function readLocal(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(SITE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && typeof p === 'object' ? p : null;
  } catch { return null; }
}

const getAdopted = (): string => localStorage.getItem(ADOPTED_REV_KEY) ?? '';
const setAdopted = (ts: string): void => localStorage.setItem(ADOPTED_REV_KEY, ts);

function isEditing(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const t = el.tagName;
  return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || el.isContentEditable === true;
}

/* ---------- on-screen status: a silent failure can never happen again ---------- */
let banner: HTMLDivElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function say(text: string, sticky = false): void {
  try {
    if (!banner) {
      banner = document.createElement('div');
      banner.style.cssText =
        'position:fixed;left:12px;bottom:12px;z-index:2147483647;' +
        'font:12px/1.45 ui-monospace,Menlo,monospace;color:#fff;' +
        'background:rgba(17,17,17,.92);padding:7px 11px;border-radius:8px;' +
        'max-width:70vw;pointer-events:none;white-space:pre-wrap';
      document.body.appendChild(banner);
    }
    banner.textContent = text;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (!sticky) {
      hideTimer = setTimeout(() => {
        try { banner?.remove(); } catch { /* ignore */ }
        banner = null;
      }, 4000);
    }
  } catch { /* no DOM yet - not fatal */ }
}

/* ---------- push (requires a signed-in session) ---------- */
export async function pushSiteConfig(reason = 'manual'): Promise<boolean> {
  const local = readLocal();
  if (!local) { console.warn('[siteSync] nothing local to push'); return false; }
  const c = canon(local);
  if (c === lastPushedCanon && !dirty) return true;

  const { data: s } = await supabase.auth.getSession();
  if (!s.session) {
    signedIn = false;
    console.warn('[siteSync] not signed in - changes stay on this device only.');
    say('NOT SIGNED IN\nChanges are local only.', true);
    return false;
  }
  signedIn = true;

  const { data, error } = await supabase
    .from('site_config')
    .upsert(
      { id: 'main', data: local, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select('updated_at')
    .maybeSingle();

  if (error) {
    console.error('[siteSync] push failed:', error.message, error);
    say('PUSH FAILED\n' + error.message, true);
    return false;
  }
  if (!data?.updated_at) {
    // PostgREST answers 200 with zero rows when RLS filters them out - no error.
    console.error('[siteSync] push wrote nothing - a row-level-security policy refused it');
    say('PUSH REFUSED BY POLICY\nSigned in, but the write was rejected.', true);
    return false;
  }

  lastPushedCanon = c;
  dirty = false;
  setAdopted(data.updated_at as string);
  console.info(`[siteSync] published (${reason}). ${(JSON.stringify(local).length / 1024).toFixed(1)} KB`);
  say(`SAVED TO CLOUD (${reason})`);
  return true;
}

/* ---------- pull (no sign-in needed - reads are public) ---------- */
export async function pullSiteConfig(reload = true): Promise<void> {
  const { data, error } = await supabase
    .from('site_config')
    .select('data, updated_at')
    .eq('id', 'main')
    .maybeSingle();

  if (error) { console.error('[siteSync] pull failed:', error.message); return; }

  const remote = data?.data as Record<string, unknown> | undefined;
  const remoteAt = (data?.updated_at as string) ?? '';
  if (!remote || Object.keys(remote).length === 0) {
    console.info('[siteSync] nothing published yet');
    return;
  }

  const remoteCanon = canon(remote);
  const local = readLocal();
  const localCanon = local ? canon(local) : '';

  // Same content - just record the revision we are holding.
  if (remoteCanon === localCanon) {
    lastPushedCanon = remoteCanon;
    if (remoteAt && remoteAt !== getAdopted()) setAdopted(remoteAt);
    return;
  }

  // Genuine unsaved local edits - never clobber them.
  if (dirty) {
    console.info('[siteSync] local edits pending - not overwriting.');
    say('LOCAL EDITS PENDING\nNot overwriting the cloud copy.', true);
    return;
  }

  // We already adopted this exact revision, so the local difference is just the
  // app re-serialising its own state. Adopting again would reload forever.
  if (remoteAt && remoteAt === getAdopted()) {
    console.info('[siteSync] revision already adopted - local difference is app normalisation.');
    return;
  }

  // Don't yank the page out from under someone mid-keystroke; the poll retries.
  if (isEditing()) {
    console.info('[siteSync] newer config available - waiting until typing stops.');
    return;
  }

  applyingRemote = true;
  try {
    localStorage.setItem(SITE_KEY, JSON.stringify(remote));
  } finally {
    applyingRemote = false;
  }
  lastPushedCanon = remoteCanon;
  setAdopted(remoteAt);
  console.info('[siteSync] pulled newer config from Supabase.');
  if (reload) window.location.reload();
}

/* ---------- boot ---------- */
export function startSiteSync(): void {
  if (started) return;
  started = true;

  // A real user gesture is the only thing that can mark state as an unsaved edit.
  const markActive = (): void => { userActive = true; };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => {
    window.addEventListener(ev, markActive, { passive: true });
  });

  const proto = Storage.prototype;
  const originalSetItem = proto.setItem;
  proto.setItem = function (this: Storage, key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (this !== localStorage || key !== SITE_KEY) return;
    if (applyingRemote) return;          // we wrote this ourselves
    if (!userActive) {                   // app boot/normalisation, not a human
      console.info('[siteSync] ignoring a non-user write to the config key.');
      return;
    }
    dirty = true;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { void pushSiteConfig('debounced'); }, PUSH_DEBOUNCE_MS);
  };

  window.addEventListener('storage', (e) => {
    if (e.key === SITE_KEY && !applyingRemote) void pullSiteConfig(true);
  });

  void supabase.auth.getSession().then(({ data }) => {
    signedIn = !!data.session;
    const who = data.session?.user?.email ?? '';
    console.info('[siteSync] auth:', signedIn ? `signed in (${who})` : 'not signed in');
    if (signedIn) say(`CONNECTED\n${who}`);
    else say('NOT SIGNED IN\nChanges are local only.', true);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    signedIn = !!session;
    console.info('[siteSync] auth changed:', signedIn ? 'signed in' : 'signed out');
  });

  void pullSiteConfig(true);
  setInterval(() => { void pullSiteConfig(true); }, POLL_MS);
  console.info('[siteSync] started.');
}

/* ---------- manual controls ---------- */
export async function syncNow(): Promise<void> {
  dirty = false;
  localStorage.removeItem(ADOPTED_REV_KEY);
  await pullSiteConfig(true);
}

(window as unknown as Record<string, unknown>).pushSiteConfig = pushSiteConfig;
(window as unknown as Record<string, unknown>).pullSiteConfig = pullSiteConfig;
(window as unknown as Record<string, unknown>).syncNow = syncNow;
(window as unknown as Record<string, unknown>).siteSyncStatus = () => ({ signedIn, dirty, adopted: getAdopted() });