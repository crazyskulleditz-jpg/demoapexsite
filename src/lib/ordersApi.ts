import { supabase } from './supabase';

type Any = Record<string, any>;

function pick(o: Any, ...keys: string[]): any {
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
}

/** Insert one order into Postgres. Never chain .select() - anon has INSERT only. */
export async function pushOrder(order: unknown): Promise<boolean> {
  const o = (order ?? {}) as Any;
  const totalNum = Number(pick(o, 'total', 'totalAmount', 'amount', 'grandTotal'));
  const { error } = await supabase.from('orders').insert({
    payload: o,
    customer_name: String(pick(o, 'customerName', 'customer_name', 'name', 'fullName') ?? '') || null,
    customer_phone: String(pick(o, 'phone', 'customerPhone', 'phoneNumber', 'mobile') ?? '') || null,
    customer_email: String(pick(o, 'email', 'customerEmail', 'customer_email') ?? '') || null,
    total: Number.isFinite(totalNum) ? totalNum : null,
    status: String(pick(o, 'status') ?? 'new'),
  });
  if (error) { console.error('[orders] cloud insert failed:', error.message, error); return false; }
  console.info('[orders] saved to cloud.');
  return true;
}

/** Every order, newest first. Requires an admin session - anon gets 0 rows. */
export async function fetchOrders(): Promise<Any[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('payload')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) { console.warn('[orders] fetch failed:', error.message); return []; }
  const rows = (data ?? []) as Any[];
  return rows.map((r) => (r && r.payload ? (r.payload as Any) : ({} as Any)));
}

/** Admin changed an order - mirror it into the cloud row. */
export async function updateOrderCloud(id: string, patch: unknown): Promise<void> {
  const { data, error } = await supabase
    .from('orders').select('id, payload').eq('payload->>id', String(id)).maybeSingle();
  if (error || !data) {
    console.warn('[orders] cloud update skipped:', error ? error.message : 'no cloud row');
    return;
  }
  const merged: Any = { ...((data.payload ?? {}) as Any), ...(patch as Any) };
  const { error: e2 } = await supabase
    .from('orders').update({ payload: merged, status: String(merged.status ?? 'new') }).eq('id', data.id);
  if (e2) console.warn('[orders] cloud update failed:', e2.message);
}

/** Admin deleted an order - remove the cloud row too. */
export async function deleteOrderCloud(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('payload->>id', String(id));
  if (error) console.warn('[orders] cloud delete failed:', error.message);
}