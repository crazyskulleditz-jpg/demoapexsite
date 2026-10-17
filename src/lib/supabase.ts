import { createClient } from '@supabase/supabase-js';

const url = 'https://hsonauopmlehegjuknuy.supabase.co';
const key = 'sb_publishable_QGtnNE6PS-1Fb7T5Ot5qtw_jzLhJG1m';

if (!url || !key) {
  throw new Error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Add them to .env.local and restart npm run dev.'
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export async function loadSiteConfig<T = Record<string, unknown>>(): Promise<T | null> {
  const { data, error } = await supabase
    .from('site_config').select('data').eq('id', 'main').maybeSingle();
  if (error) { console.error('[supabase] loadSiteConfig', error); return null; }
  const d = data?.data as T | undefined;
  return d && Object.keys(d as object).length > 0 ? d : null;
}

export async function saveSiteConfig(data: unknown): Promise<boolean> {
  const { error } = await supabase
    .from('site_config')
    .upsert({ id: 'main', data, updated_at: new Date().toISOString() },
            { onConflict: 'id' });
  if (error) { console.error('[supabase] saveSiteConfig', error); return false; }
  return true;
}
