// src/utils/mediaStore.ts
// Uploaded media goes to IndexedDB (thousands of MB), never localStorage.
// localStorage is ~5 MB and inflates data URLs by 4/3 - that is what caused
// the QuotaExceededError. IndexedDB stores real binary.

const DB_NAME = 'apex_media';
const STORE = 'files';

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

export interface SavedMedia { url: string; type: 'image' | 'video'; }

export async function saveMediaFile(file: File): Promise<SavedMedia> {
  const type: 'image' | 'video' = file.type.startsWith('video') ? 'video' : 'image';
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
      alert('IndexedDB unavailable and this file is over 400 KB - cannot store it safely.');
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
