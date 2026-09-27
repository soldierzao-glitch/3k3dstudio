// Local IndexedDB persistence for user-uploaded media (photos & videos)

const DB_NAME = '3k_gallery_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'user_project_media';

interface StoredMediaItem {
  projectId: string;
  blob: Blob;
  mediaType: 'image' | 'video';
  fileName: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'projectId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveUserMedia(
  projectId: string,
  file: File
): Promise<{ url: string; mediaType: 'image' | 'video'; fileName: string }> {
  const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record: StoredMediaItem = {
      projectId,
      blob: file,
      mediaType,
      fileName: file.name,
      updatedAt: Date.now()
    };
    const req = store.put(record);
    req.onsuccess = () => {
      const url = URL.createObjectURL(file);
      resolve({ url, mediaType, fileName: file.name });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function loadUserMediaMap(): Promise<
  Record<string, { url: string; mediaType: 'image' | 'video'; fileName: string }>
> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: StoredMediaItem[] = req.result || [];
        const result: Record<string, { url: string; mediaType: 'image' | 'video'; fileName: string }> = {};
        for (const item of records) {
          try {
            const url = URL.createObjectURL(item.blob);
            result[item.projectId] = {
              url,
              mediaType: item.mediaType,
              fileName: item.fileName
            };
          } catch {
            // Ignore blob errors
          }
        }
        resolve(result);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

export async function deleteUserMedia(projectId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(projectId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}
