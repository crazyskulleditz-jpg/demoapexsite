import { supabase } from './supabase';

type Any = Record<string, any>;

function pick(o: Any, ...keys: string[]): any {
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
}

function rowsFor(kind: string, records: unknown[]): Any[] {
  const out: Any[] = [];
  for (const r of records) {
    const o = (r ?? {}) as Any;
    const refId = pick(o, 'id', 'refId', 'bookingId', 'ticketId', 'reference');
    if (!refId) continue;
    out.push({
      kind,
      ref_id: String(refId),
      payload: o,
      status: String(pick(o, 'status') ?? 'new'),
      customer_name: String(pick(o, 'customerName', 'name', 'fullName', 'clientName') ?? '') || null,
      customer_phone: String(pick(o, 'phone', 'customerPhone', 'phoneNumber', 'mobile') ?? '') || null,
      customer_email: String(pick(o, 'email', 'customerEmail') ?? '') || null,
    });
  }
  return out;
}

/** Push bookings / test drives. Idempotent: existing rows are ignored. */
export async function syncLeads(kind: string, records: unknown[]): Promise<boolean> {
  if (!Array.isArray(records) || records.length === 0) return true;
  const rows = rowsFor(kind, records);
  if (rows.length === 0) return true;
  const { error } = await supabase
    .from('leads')
    .upsert(rows, { onConflict: 'kind,ref_id', ignoreDuplicates: true });
  if (error) {
    console.warn('[leads] sync failed (' + kind + '):', error.message, error);
    return false;
  }
  console.info('[leads] ' + kind + ' synced: ' + rows.length + ' record(s) from this device.');
  return true;
}

/** Read them back. Requires an admin session - anon gets 0 rows. */
export async function fetchLeads(kind: string): Promise<Any[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('payload')
    .eq('kind', kind)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) { console.warn('[leads] fetch failed (' + kind + '):', error.message); return []; }
  const rows = (data ?? []) as Any[];
  return rows.map((r) => (r && r.payload ? (r.payload as Any) : ({} as Any)));
}