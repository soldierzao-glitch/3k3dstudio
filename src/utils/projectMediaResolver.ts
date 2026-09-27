import { ProjectItem } from '../types';

function sanitizeForFileName(name: string): string {
  return name.replace(/[\/\\?%*:|"<>]/g, '-').trim();
}

/**
 * Retorna a lista ordenada de caminhos na pasta public/images/ para um projeto da galeria.
 * A busca prioriza o NOME EXATO que está na galeria (ex: "Cruz Pai Nosso com Oração em Relevo Vazado.jpeg"),
 * garantindo compatibilidade total com a Vercel e o sistema de arquivos local.
 */
export function getProjectMediaCandidates(
  project: ProjectItem,
  customMedia?: { url: string; mediaType: 'image' | 'video'; fileName?: string }
): { primaryUrl: string; candidateUrls: string[]; isVideo: boolean } {
  if (customMedia && customMedia.url) {
    return {
      primaryUrl: customMedia.url,
      candidateUrls: [customMedia.url, project.fallbackUrl || ''],
      isVideo: customMedia.mediaType === 'video'
    };
  }

  const isVideo = project.mediaType === 'video';
  const title = project.title;
  const safeTitle = sanitizeForFileName(title);
  const defaultExt = isVideo ? '.mp4' : '.jpeg';

  const candidates: string[] = [
    // 1. URL mapeada diretamente no projeto
    project.imageUrl,

    // 2. Busca pelo nome seguro/sanitizado (sem caracteres proibidos em sistemas de arquivos)
    `/images/${encodeURIComponent(safeTitle)}${defaultExt}`,
    `/images/${safeTitle}${defaultExt}`,
    ...(isVideo
      ? []
      : [
          `/images/${encodeURIComponent(safeTitle)}.jpg`,
          `/images/${safeTitle}.jpg`,
          `/images/${encodeURIComponent(safeTitle)}.png`,
          `/images/${safeTitle}.png`,
        ]),

    // 3. Busca pelo nome exato com caracteres originais
    ...(title !== safeTitle
      ? [
          `/images/${encodeURIComponent(title)}${defaultExt}`,
          `/images/${title}${defaultExt}`,
          ...(isVideo
            ? []
            : [
                `/images/${encodeURIComponent(title)}.jpg`,
                `/images/${title}.jpg`,
              ]),
        ]
      : []),

    // 4. Arquivo fonte original do WhatsApp
    project.originalFileName ? `/images/${project.originalFileName}` : '',
    project.originalFileName ? `/${project.originalFileName}` : '',

    // 5. Busca pelo ID do projeto em /images/
    `/images/${project.id}${defaultExt}`,
    ...(isVideo
      ? []
      : [
          `/images/${project.id}.jpg`,
          `/images/${project.id}.jpeg`,
        ]),

    // 6. Fallback final garantido
    project.fallbackUrl ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  ].filter(Boolean);

  const uniqueCandidates = Array.from(new Set(candidates));

  return {
    primaryUrl: uniqueCandidates[0],
    candidateUrls: uniqueCandidates,
    isVideo,
  };
}
