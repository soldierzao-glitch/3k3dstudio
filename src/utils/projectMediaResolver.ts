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
    // 1. Busca pelo nome exato que está na galeria dentro de /images/
    `/images/${encodeURIComponent(title)}${defaultExt}`,
    `/images/${title}${defaultExt}`,
    ...(isVideo
      ? []
      : [
          `/images/${encodeURIComponent(title)}.jpg`,
          `/images/${title}.jpg`,
          `/images/${encodeURIComponent(title)}.png`,
          `/images/${title}.png`,
        ]),

    // 2. Busca pelo nome com caracteres reservados sanitizados (ex: barras, aspas, dois pontos)
    ...(safeTitle !== title
      ? [
          `/images/${encodeURIComponent(safeTitle)}${defaultExt}`,
          `/images/${safeTitle}${defaultExt}`,
          ...(isVideo
            ? []
            : [
                `/images/${encodeURIComponent(safeTitle)}.jpg`,
                `/images/${safeTitle}.jpg`,
              ]),
        ]
      : []),

    // 3. Busca pelo ID do projeto em /images/
    `/images/${project.id}${defaultExt}`,
    ...(isVideo
      ? []
      : [
          `/images/${project.id}.jpg`,
          `/images/${project.id}.jpeg`,
          `/images/${project.id}.png`,
        ]),

    // 4. Arquivo original se existir
    project.originalFileName ? `/images/${project.originalFileName}` : '',
    project.originalFileName ? `/${project.originalFileName}` : '',

    // 5. imageUrl padrão do projeto
    project.imageUrl,

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
