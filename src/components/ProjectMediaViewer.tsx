import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types';
import { getProjectMediaCandidates } from '../utils/projectMediaResolver';

interface ProjectMediaViewerProps {
  project: ProjectItem;
  customMedia?: { url: string; mediaType: 'image' | 'video'; fileName?: string };
  isModal?: boolean;
  className?: string;
  onClick?: () => void;
  isAdminMode?: boolean;
  onTriggerUpload?: (projectId: string) => void;
}

export const ProjectMediaViewer: React.FC<ProjectMediaViewerProps> = ({
  project,
  customMedia,
  isModal = false,
  className = '',
  onClick,
  isAdminMode = false,
  onTriggerUpload
}) => {
  const { candidateUrls, isVideo } = getProjectMediaCandidates(project, customMedia);
  const [candidateIndex, setCandidateIndex] = useState<number>(0);

  // Reset candidate index if project or custom media changes
  useEffect(() => {
    setCandidateIndex(0);
  }, [project.id, customMedia?.url]);

  const currentUrl = candidateUrls[candidateIndex] || candidateUrls[0] || project.fallbackUrl || '';

  const handleMediaError = () => {
    if (candidateIndex < candidateUrls.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  if (isVideo) {
    return (
      <div
        className={`w-full ${isModal ? 'h-80 sm:h-96' : 'h-80'} bg-black flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <video
          key={currentUrl}
          src={currentUrl}
          controls
          playsInline
          autoPlay={isModal}
          preload="metadata"
          className={`w-full h-full ${isModal ? 'object-contain' : 'object-cover'}`}
          onClick={(e) => e.stopPropagation()}
          onError={handleMediaError}
        >
          Seu navegador não suporta reprodução de vídeo.
        </video>

        {/* Botão de Anexar / Trocar Mídia - APENAS MODO PROPRIETÁRIO */}
        {isAdminMode && onTriggerUpload && !isModal && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTriggerUpload(project.id);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#0b0e17]/90 hover:bg-[#00f2fe] text-[#00f2fe] hover:text-[#002022] border border-[#00f2fe]/40 font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-md transition-all active:scale-95"
              title="Substituir por arquivo de foto ou vídeo do seu computador"
            >
              <span className="material-symbols-outlined text-[15px]">
                {customMedia ? 'sync' : 'attach_file'}
              </span>
              <span>{customMedia ? 'Trocar Mídia' : 'Anexar Mídia'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${isModal ? 'h-80 sm:h-96' : 'h-80'} overflow-hidden bg-[#0b0e17] ${
        !isModal ? 'cursor-pointer' : 'flex items-center justify-center'
      } ${className}`}
      onClick={onClick}
      title={!isModal ? 'Clique para ver detalhes e foto ampliada' : undefined}
    >
      {/* Botão de Anexar / Trocar Mídia - APENAS MODO PROPRIETÁRIO */}
      {isAdminMode && onTriggerUpload && !isModal && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerUpload(project.id);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#0b0e17]/90 hover:bg-[#00f2fe] text-[#00f2fe] hover:text-[#002022] border border-[#00f2fe]/40 font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-md transition-all active:scale-95"
            title="Substituir por arquivo de foto ou vídeo do seu computador"
          >
            <span className="material-symbols-outlined text-[15px]">
              {customMedia ? 'sync' : 'attach_file'}
            </span>
            <span>{customMedia ? 'Trocar Mídia' : 'Anexar Mídia'}</span>
          </button>
        </div>
      )}

      <img
        key={currentUrl}
        className={`w-full h-full ${
          isModal ? 'object-contain' : 'object-cover transition-transform duration-500 group-hover:scale-105'
        }`}
        src={currentUrl}
        alt={project.altText}
        onError={handleMediaError}
      />
    </div>
  );
};
