import { supabase } from './supabase';

// Exposed for console debugging + the one-time migration.
(window as unknown as { supabase: typeof supabase }).supabase = supabase;

const SITE_KEY = 'apex_torque_site_config_v2';
const SYNCED_AT_KEY = 'apex_torque_site_config_synced_at';
const PUSH_DEBOUNCE_MS = 800;
const POLL_MS = 30000;

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushedJson = '';
let started = false;

function readLocal(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(SITE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && typeof p === 'object' ? p : null;
  } catch { return null; }
}
const getSyncedAt = () => localStorage.getItem(SYNCED_AT_KEY) ?? '';
const setSyncedAt = (ts: string) => localStorage.setItem(SYNCED_AT_KEY, ts);

export async function pushSiteConfig(reason = 'manual'): Promise<boolean> {
  const local = readLocal();
  if (!local) { console.warn('[siteSync] nothing local to push'); return false; }
  const json = JSON.stringify(local);
  if (json === lastPushedJson) return true;

  const { data: s } = await supabase.auth.getSession();
  if (!s.session) {
    console.warn('[siteSync] not signed in - changes stay on this device only.');
    return false;
  }

  const { data, error } = await supabase
    .from('site_config')
    .upsert({ id: 'main', data: local, updated_at: new Date().toISOString() },
            { onConflict: 'id' })
    .select('updated_at')
    .maybeSingle();

  if (error) { console.error('[siteSync] push failed:', error.message, error); return false; }
  lastPushedJson = json;
  if (data?.updated_at) setSyncedAt(data.updated_at as string);
  console.info(`[siteSync] published (${reason}). ${(json.length / 1024).toFixed(1)} KB`);
  return true;
}

export async function pullSiteConfig(reload = true): Promise<void> {
  const { data, error } = await supabase
    .from('site_config').select('data, updated_at').eq('id', 'main').maybeSingle();
  if (error) { console.error('[siteSync] pull failed:', error.message); return; }

  const remote = data?.data as Record<string, unknown> | undefined;
  const remoteAt = (data?.updated_at as string) ?? '';
  if (!remote || Object.keys(remote).length === 0) return; // nothing published yet

  const local = readLocal();
  const localJson = local ? JSON.stringify(local) : '';
  const remoteJson = JSON.stringify(remote);
  if (remoteJson === localJson) { if (remoteAt) setSyncedAt(remoteAt); return; }

  // Never clobber unsaved local edits.
  const hasUnpushedLocal = lastPushedJson !== '' && localJson !== lastPushedJson;
  if (hasUnpushedLocal) { console.info('[siteSync] local edits pending - not overwriting.'); return; }

  const syncedAt = getSyncedAt();
  if (syncedAt && remoteAt <= syncedAt) return;

  localStorage.setItem(SITE_KEY, remoteJson);
  setSyncedAt(remoteAt);
  lastPushedJson = remoteJson;
  console.info('[siteSync] pulled newer config from Supabase.');
  if (reload) window.location.reload();
}

export function startSiteSync(): void {
  if (started) return;
  started = true;

  const proto = Storage.prototype;
  const originalSetItem = proto.setItem;
  proto.setItem = function (this: Storage, key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (this === localStorage && key === SITE_KEY) {
      if (pushTimer) clearTimeout(pushTimer);
      pushTimer = setTimeout(() => { void pushSiteConfig('debounced'); }, PUSH_DEBOUNCE_MS);
    }
  };

  window.addEventListener('storage', (e) => {
    if (e.key === SITE_KEY) void pullSiteConfig(true);
  });

  void pullSiteConfig(true);
  setInterval(() => { void pullSiteConfig(true); }, POLL_MS);
  console.info('[siteSync] started.');
}

// Expose for console use.
(window as unknown as Record<string, unknown>).pushSiteConfig = pushSiteConfig;
(window as unknown as Record<string, unknown>).pullSiteConfig = pullSiteConfig;

