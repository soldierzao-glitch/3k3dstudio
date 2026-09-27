import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Accept up to 100MB for photos and short videos
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  const publicImagesDir = path.resolve(process.cwd(), 'public/images');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  // API: Upload and permanently save media to public/images/ on disk
  app.post('/api/upload-media', (req, res) => {
    try {
      const { projectId, fileName, fileData, mediaType } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: 'Parâmetros fileName e fileData são obrigatórios' });
      }

      const base64Data = fileData.replace(/^data:.*,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const safeOriginalName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const ext = path.extname(safeOriginalName) || (mediaType === 'video' ? '.mp4' : '.jpg');

      // 1. Save original filename in public/images/
      const originalTargetPath = path.join(publicImagesDir, safeOriginalName);
      fs.writeFileSync(originalTargetPath, buffer);

      // 2. If projectId provided, also save as clean project-id.<ext> for 100% reliable Vercel linking
      let projectAliasUrl = `/images/${safeOriginalName}`;
      if (projectId) {
        const projectAliasName = `${projectId}${ext}`;
        const projectAliasPath = path.join(publicImagesDir, projectAliasName);
        fs.writeFileSync(projectAliasPath, buffer);
        projectAliasUrl = `/images/${projectAliasName}`;
      }

      // 3. Update media-manifest.json
      const manifestPath = path.join(publicImagesDir, 'media-manifest.json');
      let manifest: Record<string, any> = {};
      if (fs.existsSync(manifestPath)) {
        try {
          manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        } catch {}
      }

      const fileEntry = {
        projectId: projectId || safeOriginalName,
        fileName: safeOriginalName,
        url: projectAliasUrl,
        originalFileUrl: `/images/${safeOriginalName}`,
        mediaType: mediaType || (safeOriginalName.endsWith('.mp4') ? 'video' : 'image'),
        size: buffer.length,
        updatedAt: Date.now()
      };

      manifest[projectId || safeOriginalName] = fileEntry;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

      console.log(`[Upload Realizado] Arquivo "${safeOriginalName}" (${(buffer.length / 1024).toFixed(1)} KB) salvo em public/images/`);

      return res.json({
        success: true,
        message: 'Mídia salva com sucesso na pasta public/images/!',
        entry: fileEntry
      });
    } catch (err: any) {
      console.error('[Upload Error]', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // API: Get manifest of all locally saved media
  app.get('/api/media-manifest', (_req, res) => {
    try {
      const manifestPath = path.join(publicImagesDir, 'media-manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        return res.json(manifest);
      }
      return res.json({});
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Serve static files in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[3K 3D Studio] Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
