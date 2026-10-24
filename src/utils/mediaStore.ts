// src/utils/mediaStore.ts
// Media goes to Supabase Storage so every device and every visitor can see it.
// IndexedDB is kept only as an offline / not-signed-in fallback.

import { supabase } from '../lib/supabase';

const BUCKET = 'media';
const DB_NAME = 'apex_media';
const STORE = 'files';

export interface SavedMedia { url: string; type: 'image' | 'video'; }

/* ---------- local fallback (IndexedDB) ---------- */
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* ---------- cloud upload ---------- */
async function uploadToCloud(file: File): Promise<string | null> {
  try {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) {
      console.warn('[media] not signed in - storing locally only.');
      return null;
    }
    const rawExt = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const ext = rawExt || (file.type.indexOf('video') === 0 ? 'mp4' : 'jpg');
    const key = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) {
      console.error('[media] upload failed:', error.message, error);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
    console.info('[media] uploaded to cloud (' + Math.round(file.size / 1024) + ' KB):', data.publicUrl);
    return data.publicUrl;
  } catch (e) {
    console.error('[media] upload threw:', e);
    return null;
  }
}

/* ---------- public API ---------- */
export async function saveMediaFile(file: File): Promise<SavedMedia> {
  const type: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';

  // 1) Cloud first - this is what makes the file visible on every device.
  const cloudUrl = await uploadToCloud(file);
  if (cloudUrl) return { url: cloudUrl, type };

  // 2) Fallback: this browser only.
  const key = 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  try {
    const db = await openDb();
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(file, key);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    return { url: 'idb:' + key, type };
  } catch (e) {
    if (file.size > 400 * 1024) {
      alert('Upload failed and this file is too large to store locally.');
      return { url: '', type };
    }
    const dataUrl = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(file);
    });
    return { url: dataUrl, type };
  }
}

export async function resolveMediaUrl(url: string): Promise<string> {
  // https URLs (Supabase Storage, or any normal link) pass straight through.
  if (!url || url.indexOf('idb:') !== 0) return url;
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | null>((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      const rq = tx.objectStore(STORE).get(url.slice(4));
      rq.onsuccess = () => res((rq.result as Blob) || null);
      rq.onerror = () => rej(rq.error);
    });
    return blob ? URL.createObjectURL(blob) : '';
  } catch (e) { return ''; }
}