// Local media storage with automatic synchronization to public/images/ disk storage

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

function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Salva a mídia enviada pelo usuário no servidor (public/images/) e em IndexedDB
 */
export async function saveUserMedia(
  projectId: string,
  file: File
): Promise<{ url: string; mediaType: 'image' | 'video'; fileName: string; isSavedToServer: boolean }> {
  const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
  
  // 1. Salvar no IndexedDB local
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
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
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[MediaStorage] Falha ao salvar no IndexedDB:', err);
  }

  // 2. Enviar para a API do servidor para salvar em public/images/
  let serverUrl = '';
  let isSavedToServer = false;
  try {
    const base64Data = await fileToBase64(file);
    const response = await fetch('/api/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        fileName: file.name,
        fileData: base64Data,
        mediaType
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.entry && data.entry.url) {
        serverUrl = data.entry.url;
        isSavedToServer = true;
      }
    }
  } catch (err) {
    console.warn('[MediaStorage] Servidor de upload indisponível, usando URL local:', err);
  }

  const finalUrl = serverUrl || URL.createObjectURL(file);
  return {
    url: finalUrl,
    mediaType,
    fileName: file.name,
    isSavedToServer
  };
}

/**
 * Sincroniza todas as mídias salvas localmente no navegador direto para public/images/
 */
export async function syncAllLocalMediaToServer(): Promise<{ total: number; synced: number }> {
  try {
    const db = await openDB();
    const records = await new Promise<StoredMediaItem[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (records.length === 0) {
      return { total: 0, synced: 0 };
    }

    let synced = 0;
    for (const record of records) {
      try {
        const base64Data = await fileToBase64(record.blob);
        const res = await fetch('/api/upload-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: record.projectId,
            fileName: record.fileName,
            fileData: base64Data,
            mediaType: record.mediaType
          })
        });
        if (res.ok) {
          synced++;
        }
      } catch (err) {
        console.warn(`[Sync] Falha ao sincronizar ${record.fileName}:`, err);
      }
    }

    return { total: records.length, synced };
  } catch (err) {
    console.error('[Sync Error]', err);
    return { total: 0, synced: 0 };
  }
}

/**
 * Carrega mapa de mídias: combina o manifesto do servidor (public/images/) e IndexedDB
 */
export async function loadUserMediaMap(): Promise<
  Record<string, { url: string; mediaType: 'image' | 'video'; fileName: string }>
> {
  const result: Record<string, { url: string; mediaType: 'image' | 'video'; fileName: string }> = {};

  // 1. Tentar ler manifesto do servidor
  try {
    const res = await fetch('/api/media-manifest');
    if (res.ok) {
      const manifest = await res.json();
      for (const [key, item] of Object.entries<any>(manifest)) {
        result[key] = {
          url: item.url,
          mediaType: item.mediaType || 'image',
          fileName: item.fileName
        };
      }
    }
  } catch {
    // Servidor offline ou estático na Vercel
  }

  // 2. Mesclar com mídias do IndexedDB
  try {
    const db = await openDB();
    const records = await new Promise<StoredMediaItem[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    for (const item of records) {
      // Se não temos a versão do servidor, usar blob local
      if (!result[item.projectId]) {
        try {
          const url = URL.createObjectURL(item.blob);
          result[item.projectId] = {
            url,
            mediaType: item.mediaType,
            fileName: item.fileName
          };
        } catch {}
      }
    }
  } catch {}

  return result;
}

export async function deleteUserMedia(projectId: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(projectId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}
}
