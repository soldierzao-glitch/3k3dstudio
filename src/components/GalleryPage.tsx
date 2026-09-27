import React, { useState, useEffect, useRef } from 'react';
import { GALLERY_PROJECTS, CASE_STUDY_DATA } from '../data/projectsData';
import { ProjectCategory, ProjectItem } from '../types';
import { saveUserMedia, loadUserMediaMap, deleteUserMedia } from '../utils/mediaStorage';
import { ProjectMediaViewer } from './ProjectMediaViewer';

interface GalleryPageProps {
  onOpenInstantQuote: (projectTitle?: string) => void;
  selectedCategoryFilter?: ProjectCategory;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onOpenInstantQuote,
  selectedCategoryFilter
}) => {
  const initialCategory: ProjectCategory | null = 
    selectedCategoryFilter && selectedCategoryFilter !== 'all' ? selectedCategoryFilter : null;
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | null>(initialCategory);
  const [selectedMediaProject, setSelectedMediaProject] = useState<ProjectItem | null>(null);
  const [customMediaMap, setCustomMediaMap] = useState<
    Record<string, { url: string; mediaType: 'image' | 'video'; fileName: string }>
  >({});
  const [uploadTargetProjectId, setUploadTargetProjectId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modo Proprietário: Oculto para visitantes comuns
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') return true;
      return localStorage.getItem('3k3d_admin_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Salvar estado do Modo Proprietário no navegador
  useEffect(() => {
    try {
      localStorage.setItem('3k3d_admin_mode', isAdminMode ? 'true' : 'false');
    } catch {}
  }, [isAdminMode]);

  // Atalho de teclado: Ctrl + Shift + A para ativar/desativar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const next = !prev;
          showToast(
            next
              ? 'Modo Proprietário ativado! Botões de anexar/trocar mídias visíveis.'
              : 'Modo Proprietário desativado. Visão pública de visitante.'
          );
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    loadUserMediaMap().then((savedMap) => {
      if (savedMap && Object.keys(savedMap).length > 0) {
        setCustomMediaMap(savedMap);
      }
    });
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleTriggerUpload = (projectId: string) => {
    setUploadTargetProjectId(projectId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetProjectId) return;

    try {
      const saved = await saveUserMedia(uploadTargetProjectId, file);
      setCustomMediaMap((prev) => ({
        ...prev,
        [uploadTargetProjectId]: saved
      }));
      const proj = GALLERY_PROJECTS.find((p) => p.id === uploadTargetProjectId);
      showToast(`Mídia "${file.name}" anexada com sucesso em ${proj?.title || 'peça'}!`);
    } catch {
      showToast('Erro ao anexar arquivo. Tente novamente.');
    }
  };

  const handleResetMedia = async (projectId: string) => {
    try {
      await deleteUserMedia(projectId);
      setCustomMediaMap((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
      showToast('Mídia padrão restaurada.');
    } catch {
      showToast('Erro ao restaurar mídia.');
    }
  };

  const getCategoryCount = (cat: ProjectCategory) => {
    return GALLERY_PROJECTS.filter((p) => p.category === cat).length;
  };

  const sectionCategories: { 
    value: ProjectCategory; 
    label: string; 
    icon: string; 
    description: string;
    badge: string;
  }[] = [
    { 
      value: 'sacro', 
      label: 'Arte Sacra & Fé', 
      icon: 'church', 
      description: 'Cruzes com a oração do Pai Nosso esculpida vazada, imagens minimalistas de Nossa Senhora e conjuntos sacros para altares.',
      badge: 'Acabamento Silk & Fosco'
    },
    { 
      value: 'geek-setup', 
      label: 'Setup Gamer & Canecas', 
      icon: 'sports_esports', 
      description: 'Canecas monster com garras de dragão, chaveiros de armas gamer e suportes esculpidos de bancada.',
      badge: 'Design Temático Exclusivo'
    },
    { 
      value: 'decor-utilidades', 
      label: 'Decoração & Utilidades', 
      icon: 'local_florist', 
      description: 'Vasos nórdicos canelados, quebra-nozes geométricos contemporâneos e bustos executivos de mindset.',
      badge: 'Design Paramétrico Nórdico'
    },
    { 
      value: 'articulados', 
      label: 'Fidget Tools & Stress Toys', 
      icon: 'sync_alt', 
      description: 'Camaleões flexíveis furta-cor, polvo retrátil pop-up, estrela sensorial maleável e cubo infinito com testes em vídeo.',
      badge: 'Print-in-Place Sem Montagem'
    },
    { 
      value: 'mascotes', 
      label: 'Mascotes de Clubes', 
      icon: 'sports_soccer', 
      description: 'Mascotes maromba de torcida em pose duplo bíceps com camisa personalizada e heróis de clubes de futebol.',
      badge: 'Pintura Detalhada & Base'
    },
    { 
      value: 'colecionaveis-fofos', 
      label: 'Lembranças & Fofuras', 
      icon: 'favorite', 
      description: 'Chaveiros sapatilhas de balé com laço de cetim, Funkos Homem-Aranha e Capitão, Hello Kitty, BT21 e bichinhos crochê 3D.',
      badge: 'Lembranças & Afeto'
    }
  ];

  const filteredProjects: ProjectItem[] = activeFilter
    ? GALLERY_PROJECTS.filter((p) => {
        if (p.category === activeFilter) return true;
        if (activeFilter === 'geek' && (p.category === 'geek-setup' || p.category === 'colecionaveis-fofos')) return true;
        if (activeFilter === 'decoracao' && p.category === 'decor-utilidades') return true;
        if (activeFilter === 'presentes' && (p.category === 'colecionaveis-fofos' || p.category === 'sacro')) return true;
        if (activeFilter === 'tecnicas' && p.category === 'articulados') return true;
        return false;
      })
    : [];

  const currentSection = sectionCategories.find((s) => s.value === activeFilter);

  const handleMakeSimilar = (project: ProjectItem) => {
    onOpenInstantQuote(project.title);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Banner de Modo Proprietário Ativo */}
      {isAdminMode && (
        <div className="w-full bg-[#182333] border-b border-[#00f2fe]/40 px-4 md:px-12 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-['Plus_Jakarta_Sans'] text-[#00f2fe] sticky top-0 z-40 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span className="font-bold uppercase tracking-wider text-[11px] font-['JetBrains_Mono']">Modo Proprietário Ativo</span>
            <span className="text-[#b9cacb] hidden sm:inline">— Botões de anexar e trocar mídias liberados. Visitantes comuns não veem esses botões.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#849495] text-[11px] font-['JetBrains_Mono'] hidden md:inline">Atalho: Ctrl + Shift + A</span>
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(false);
                showToast('Modo Proprietário desativado. Visão pública.');
              }}
              className="px-2.5 py-1 rounded bg-[#272a34] hover:bg-[#32343f] text-[#ff7b7b] border border-[#ff6b6b]/30 text-xs font-semibold transition-all"
            >
              Ocultar Botões (Sair)
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: HEADER & CATEGORY SELECTION CARDS */}
      <section className="relative w-full overflow-hidden pb-8 pt-4">
        {/* Ambient cyan and gold glow spots */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#00f2fe]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-[#fecf00]/10 blur-[140px] pointer-events-none"></div>

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 relative z-10 flex flex-col gap-6">
          
          {/* Top Meta Badge & Counter Stream */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#272a34] border border-[#00dce6]/25 text-[#00dce6] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
              </span>
              <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#00dce6] font-semibold">
                ENCOMENDAS REAIS ENTREGUES
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-[#181b25] border border-[#272a34] px-4 py-2 rounded-xl shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-[#fecf00]">star</span>
                <span className="font-['Space_Grotesk'] text-lg text-[#e0e2ef] font-bold">4.9</span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#849495]">
                  / 5.0 (+2500 peças despachadas em todo Brasil)
                </span>
              </div>
            </div>
          </div>

          {/* Main Headline Block */}
          <div className="max-w-4xl flex flex-col gap-2">
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl text-[#e0e2ef] font-bold tracking-tight leading-tight">
              Veja o que já saiu da imaginação dos nossos clientes.
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#b9cacb] max-w-3xl leading-relaxed">
              Escolha uma seção abaixo para ver algumas peças que já fizemos sob encomenda
            </p>
          </div>

          {/* 6 Category Section Cards directly below the headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {sectionCategories.map((section) => {
              const count = getCategoryCount(section.value);
              const isSelected = activeFilter === section.value;
              return (
                <button
                  type="button"
                  key={section.value}
                  onClick={() => {
                    setActiveFilter(section.value);
                    setTimeout(() => {
                      document.getElementById('section-pieces-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  className={`group text-left rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-[#182333] border-2 border-[#00f2fe] shadow-xl shadow-[#00f2fe]/20 -translate-y-1 ring-1 ring-[#00f2fe]/40'
                      : 'bg-[#1c1f29] border border-[#272a34] hover:border-[#00f2fe]/50 hover:bg-[#202534] hover:-translate-y-1'
                  }`}
                >
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-[#00f2fe] text-[#002022] border-[#00f2fe]'
                          : 'bg-[#272a34] group-hover:bg-[#00f2fe]/15 text-[#00f2fe] border-[#00f2fe]/20'
                      }`}>
                        <span className="material-symbols-outlined text-[26px]">{section.icon}</span>
                      </div>
                      <span className={`font-['JetBrains_Mono'] text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isSelected
                          ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/50 font-bold'
                          : 'bg-[#12151e] text-[#00dce6] border-[#272a34]'
                      }`}>
                        {count} {count === 1 ? 'peça' : 'peças'}
                      </span>
                    </div>

                    <h3 className={`font-['Space_Grotesk'] text-xl font-bold transition-colors ${
                      isSelected ? 'text-[#00f2fe]' : 'text-[#e0e2ef] group-hover:text-[#00f2fe]'
                    }`}>
                      {section.label}
                    </h3>

                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#b9cacb] leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#272a34]/60 w-full">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">
                      {section.badge}
                    </span>
                    <span className={`inline-flex items-center gap-1 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-transform ${
                      isSelected ? 'text-[#00f2fe]' : 'text-[#00dce6] group-hover:translate-x-1'
                    }`}>
                      <span>{isSelected ? 'Seção Ativa' : 'Ver Peças'}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {isSelected ? 'check_circle' : 'arrow_forward'}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: GRID DA SEÇÃO SELECIONADA */}
      {activeFilter !== null && (
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pb-16">
          <div id="section-pieces-anchor" className="scroll-mt-24"></div>
          <div>
            {/* Header da Seção Selecionada */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/15 text-[#00f2fe] flex items-center justify-center border border-[#00f2fe]/30">
                  <span className="material-symbols-outlined text-[22px]">{currentSection?.icon}</span>
                </div>
                <div>
                  <span className="font-['JetBrains_Mono'] text-xs uppercase text-[#00f2fe] font-semibold">
                    SEÇÃO ATIVA ({filteredProjects.length} {filteredProjects.length === 1 ? 'PEÇA' : 'PEÇAS'})
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#e0e2ef]">
                    {currentSection?.label}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter(null);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#272a34] hover:bg-[#32343f] text-[#b9cacb] hover:text-white font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-all border border-[#3a494b]"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Fechar Seção</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid">
              {filteredProjects.map((project) => {
                const customMedia = customMediaMap[project.id];
                const isVideo = customMedia ? customMedia.mediaType === 'video' : project.mediaType === 'video';

                return (
                  <article
                    key={project.id}
                    className={`flex flex-col rounded-xl bg-[#1c1f29] border shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-[#00f2fe]/10 hover:-translate-y-1 ${
                      customMedia ? 'border-[#00f2fe]/60 ring-1 ring-[#00f2fe]/30' : 'border-[#272a34] hover:border-[#00f2fe]/40'
                    }`}
                  >
                    {/* Media Container com busca pelo nome exato da galeria na pasta public/images/ */}
                    <ProjectMediaViewer
                      project={project}
                      customMedia={customMedia}
                      isAdminMode={isAdminMode}
                      onTriggerUpload={handleTriggerUpload}
                      onClick={() => setSelectedMediaProject(project)}
                    />

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1 justify-between gap-4 bg-[#1c1f29]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-['JetBrains_Mono'] text-xs uppercase text-[#00dce6] font-semibold">
                              {project.categoryLabel}
                            </span>
                            {isVideo && (
                              <span className="px-2 py-0.5 rounded-full bg-[#0b0e17] border border-[#00f2fe]/40 text-[#00f2fe] font-['JetBrains_Mono'] text-[11px] font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">videocam</span>
                                {project.badgeTag}
                              </span>
                            )}
                          </div>
                          <span className="font-['JetBrains_Mono'] text-xs text-[#849495]">
                            Ref: {project.refId}
                          </span>
                        </div>

                        <h3 className="font-['Space_Grotesk'] text-xl text-[#e0e2ef] font-semibold leading-snug">
                          {project.title}
                        </h3>

                        <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Depoimento do Cliente */}
                      <div className="p-3.5 rounded-lg bg-[#272a34]/80 border border-[#3a494b]/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#32343f] border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] font-bold font-['JetBrains_Mono'] text-xs">
                              {project.clientInitials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#e0e2ef]">
                                {project.clientName}
                              </span>
                              <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">
                                {project.clientLocation}
                              </span>
                            </div>
                          </div>

                          <div className="flex text-[#fecf00]">
                            {[...Array(project.rating || 5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[16px]">
                                star
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#b9cacb] italic leading-relaxed">
                          {project.clientReview}
                        </p>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex flex-col gap-2 pt-1">
                        {/* Botões de Anexar Foto / Vídeo do PC - APENAS MODO PROPRIETÁRIO */}
                        {isAdminMode && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleTriggerUpload(project.id)}
                              className={`flex-1 py-2 px-3 rounded-lg font-['Plus_Jakarta_Sans'] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                customMedia
                                  ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/50 hover:bg-[#00f2fe]/25'
                                  : 'bg-[#272a34] text-[#b9cacb] hover:text-[#e0e2ef] hover:bg-[#32343f] border border-[#3a494b]'
                              }`}
                              title="Anexar ou trocar a mídia desta peça diretamente com arquivo do computador"
                            >
                              <span className="material-symbols-outlined text-[16px] text-[#00f2fe]">
                                {customMedia ? 'check_circle' : 'upload_file'}
                              </span>
                              <span className="truncate">
                                {customMedia ? 'Trocar Arquivo Anexado' : 'Anexar Foto/Vídeo do PC'}
                              </span>
                            </button>
                            {customMedia && (
                              <button
                                type="button"
                                onClick={() => handleResetMedia(project.id)}
                                className="p-2 rounded-lg bg-[#272a34] hover:bg-[#3f2525] text-[#ff7b7b] hover:text-[#ff9999] border border-[#ff6b6b]/30 transition-all flex items-center justify-center"
                                title="Restaurar mídia original padrão"
                              >
                                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                              </button>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleMakeSimilar(project)}
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#32343f] hover:bg-[#363943] text-[#00f2fe] hover:text-[#e0fdff] border border-[#3a494b] font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-semibold transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[17px] text-[#00f2fe]">
                            chat
                          </span>
                          <span>Quero fazer um parecido</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* POPUP MODAL COM DETALHES COMPLETOS DA MÍDIA REAL */}
      {selectedMediaProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMediaProject(null)}
        >
          {(() => {
            const customSelected = customMediaMap[selectedMediaProject.id];

            return (
              <div 
                className="relative w-full max-w-2xl bg-[#1c1f29] border border-[#00f2fe]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Modal */}
                <div className="p-4 border-b border-[#272a34] flex items-center justify-between bg-[#181b25]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-[#00f2fe]/15 text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold">
                      {selectedMediaProject.refId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[#272a34] border border-[#3a494b] text-[#b9cacb] font-['JetBrains_Mono'] text-xs">
                      {selectedMediaProject.badgeTag}
                    </span>
                    <span className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-bold truncate max-w-sm">
                      {selectedMediaProject.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedMediaProject(null)}
                    className="w-8 h-8 rounded-lg bg-[#272a34] text-[#b9cacb] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Media Body com busca pelo nome da galeria em public/images/ */}
                <ProjectMediaViewer
                  project={selectedMediaProject}
                  customMedia={customSelected}
                  isModal={true}
                />

                {/* Description & Review */}
                <div className="p-5 flex flex-col gap-4 overflow-y-auto">
                  {/* Anexar Mídia no Modal - APENAS MODO PROPRIETÁRIO */}
                  {isAdminMode && (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#141720] border border-[#272a34]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#00f2fe]">
                          {customSelected ? 'check_circle' : 'upload_file'}
                        </span>
                        <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#e0e2ef] font-medium">
                          {customSelected ? `Mídia própria anexada: ${customSelected.fileName}` : 'Deseja substituir esta mídia por arquivo do seu PC?'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(selectedMediaProject.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#00f2fe]/20 hover:bg-[#00f2fe] text-[#00f2fe] hover:text-[#002022] border border-[#00f2fe]/40 font-['Plus_Jakarta_Sans'] text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[15px]">upload_file</span>
                          <span>{customSelected ? 'Trocar Arquivo' : 'Anexar Mídia do PC'}</span>
                        </button>
                        {customSelected && (
                          <button
                            type="button"
                            onClick={() => handleResetMedia(selectedMediaProject.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#272a34] hover:bg-[#3f2525] text-[#ff7b7b] border border-[#ff6b6b]/30 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-all flex items-center gap-1"
                            title="Restaurar mídia padrão"
                          >
                            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                            <span>Restaurar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed">
                    {selectedMediaProject.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#272a34]/70 border border-[#3a494b] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#e0e2ef]">
                        Avaliação de {selectedMediaProject.clientName} ({selectedMediaProject.clientLocation}):
                      </span>
                      <div className="flex text-[#fecf00]">
                        {[...Array(selectedMediaProject.rating || 5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[15px]">star</span>
                        ))}
                      </div>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#b9cacb] italic">
                      {selectedMediaProject.clientReview}
                    </p>
                  </div>

                  {/* Action in Modal */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        handleMakeSimilar(selectedMediaProject);
                        setSelectedMediaProject(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#00f2fe] text-[#002022] font-['Plus_Jakarta_Sans'] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#6ff6ff] transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>Pedir Orçamento Parecido</span>
                    </button>
                    <button
                      onClick={() => setSelectedMediaProject(null)}
                      className="px-5 py-3 rounded-xl bg-[#272a34] text-[#e0e2ef] hover:bg-[#32343f] font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-all"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECTION 3: 'DO CONCEITO À PEÇA FÍSICA' (ANTES & DEPOIS) */}
      <section className="w-full bg-[#181b25] border-y border-[#272a34] py-16 relative overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col gap-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[#00f2fe] font-['JetBrains_Mono'] text-xs uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[16px]">transform</span>
                <span>O Poder de Criar Qualquer Coisa</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-[#e0e2ef] font-bold">
                {CASE_STUDY_DATA.title}
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-base text-[#b9cacb]">
                {CASE_STUDY_DATA.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full bg-[#272a34] border border-[#3a494b] text-[#e0e2ef] font-['JetBrains_Mono'] text-xs font-semibold">
                Estudo de Caso: {CASE_STUDY_DATA.refId}
              </span>
            </div>
          </div>

          {/* 3-Step Transformation Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {CASE_STUDY_DATA.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-xl bg-[#1c1f29] border border-[#272a34] p-5 shadow-md gap-4 group hover:border-[#00f2fe]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-xs font-semibold ${
                    idx === 0
                      ? 'bg-[#32343f] text-[#849495]'
                      : idx === 1
                      ? 'bg-[#00f2fe]/15 text-[#00dce6]'
                      : 'bg-[#fecf00]/15 text-[#ffe082]'
                  }`}>
                    {step.step}
                  </span>
                  <span className={`font-['Plus_Jakarta_Sans'] text-xs font-semibold ${
                    idx === 1 ? 'text-[#00dce6]' : idx === 2 ? 'text-[#ffe082]' : 'text-[#849495]'
                  }`}>
                    {step.author}
                  </span>
                </div>

                <div className="w-full h-64 rounded-lg overflow-hidden bg-[#0b0e17] relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={step.imageUrl}
                    alt={step.altText}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-[#10131c]/15 pointer-events-none"></div>

                  {step.tag && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded bg-[#10131c]/90 border border-[#272a34] font-['JetBrains_Mono'] text-xs font-semibold text-[#00f2fe]">
                      {step.tag}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-['Space_Grotesk'] text-lg text-[#e0e2ef] font-semibold">
                    {step.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CONFIANÇA, MÉTRICAS & EMBALAGEM BLINDADA */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Trust Metrics */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-['JetBrains_Mono'] text-xs uppercase text-[#00dce6] tracking-wider font-semibold">
                Compromisso com o Resultado
              </span>
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-[#e0e2ef] font-bold leading-tight">
                Sem sustos na entrega. O que você aprova é o que chega.
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-base text-[#b9cacb] leading-relaxed">
                Sabemos que comprar manufatura sob medida pela internet dá medo de receber algo frágil, torto ou mal acabado. Por isso, na 3K 3D Studio você tem total transparência:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1c1f29] border border-[#272a34] flex flex-col gap-1.5 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#272a34] flex items-center justify-center text-[#00f2fe]">
                  <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-semibold">
                  Foto &amp; Vídeo de Aprovação
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#849495] leading-relaxed">
                  Antes de colocar na caixa, enviamos vídeo da sua peça na bancada com zoom nos detalhes para seu OK final.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1c1f29] border border-[#272a34] flex flex-col gap-1.5 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#272a34] flex items-center justify-center text-[#fecf00]">
                  <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-semibold">
                  Embalagem Blindada Anti-Impacto
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#849495] leading-relaxed">
                  Tripla camada de plástico bolha, calços de espuma densa e caixa rígida selada. Zero peças quebradas no frete.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1c1f29] border border-[#272a34] flex flex-col gap-1.5 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#272a34] flex items-center justify-center text-[#00dce6]">
                  <span className="material-symbols-outlined text-[24px]">layers</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-semibold">
                  Matéria-Prima Certificada
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#849495] leading-relaxed">
                  Não usamos filamento reciclado de baixa aderência nem resina frágil comum. Apenas polímeros de grau engenharia.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1c1f29] border border-[#272a34] flex flex-col gap-1.5 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#272a34] flex items-center justify-center text-[#ffe082]">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-semibold">
                  Suporte do Engenheiro
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#849495] leading-relaxed">
                  Fale direto com quem projeta e opera as máquinas, sem robôs de triagem confusos no WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Trust Showcase Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#272a34]/90 border border-[#3a494b] p-6 shadow-2xl flex flex-col gap-4">
              <div className="relative w-full h-72 rounded-xl overflow-hidden bg-[#0b0e17]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKoyt7LAkLSyFawjlKJMajU5Mkx3Q-3lnhhH_w8N-y5b0QPgmnT7adEmQKsa8NdN_tk70uFycFdaR4J4kCTzFWMVSJnB1fgHwDpNfq3XeZbqBc3h99s4Y3tOTgapzyt9V73-KNRhhDB0hiWgYWm3du7XSXj62dcMp2cUZgZh6nqg72QARqRU9u9ILgETyISw2GNAGI_DiNBG0JGKkRhXuHU0dx1PXCh0HObnxDEWLtfx86eUR46a6l"
                  alt="Embalagem segura e unboxing de escultura 3D com certificado de inspeção"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#10131c]/90 border border-[#272a34] backdrop-blur font-['JetBrains_Mono'] text-xs text-[#00dce6] flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>Garantia de Transporte 100%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#849495] font-semibold">
                    ÍNDICE DE APROVAÇÃO
                  </span>
                  <span className="font-['Space_Grotesk'] text-2xl text-[#e0e2ef] font-bold">
                    99.4%
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#849495] font-semibold">
                    TEMPO MÉDIO DE RESPOSTA
                  </span>
                  <span className="font-['Space_Grotesk'] text-2xl text-[#00f2fe] font-bold">
                    &lt; 45 min
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#1c1f29] border border-[#272a34] rounded-lg p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#fecf00] text-[20px]">
                  verified
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#e0e2ef]">
                  Se sua peça chegar com qualquer avaria no transporte, refazemos e reenviamos sem custo.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL MAGNETIC CTA */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pb-16">
        <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#272a34] via-[#1c1f29] to-[#272a34] border border-[#3a494b] p-8 md:p-12 shadow-2xl overflow-hidden">
          {/* Glow background accents */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#00f2fe]/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-[#fecf00]/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 self-center lg:self-start px-3 py-1 rounded-full bg-[#00f2fe]/15 border border-[#00f2fe]/30 text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>ATENDIMENTO RÁPIDO &amp; HUMANIZADO</span>
              </div>

              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-[#e0e2ef] font-bold leading-tight">
                Inspirado por algum desses projetos?
              </h2>

              <p className="font-['Plus_Jakarta_Sans'] text-base text-[#b9cacb]">
                Envie sua ideia, foto de referência ou arquivo 3D agora mesmo. Nossa equipe analisa a viabilidade e entrega um orçamento detalhado em até 2 horas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#00f2fe] hover:bg-[#6ff6ff] text-[#002022] font-['Plus_Jakarta_Sans'] text-sm font-bold transition-all shadow-lg shadow-[#00f2fe]/20 hover:scale-[1.02] active:scale-95"
                href="https://wa.me/5575991262118?text=Ol%C3%A1%2C+vi+as+encomendas+reais+no+site+da+3K+3D+e+tenho+uma+ideia+para+or%C3%A7amento!"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                <span>Enviar Ideia no WhatsApp</span>
              </a>

              <button
                onClick={() => onOpenInstantQuote()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#32343f] hover:bg-[#363943] text-[#e0e2ef] border border-[#3a494b] font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-all hover:border-[#00f2fe]/40"
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                <span>Já tem as medidas? Use nossa calculadora</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé da Galeria com cadeado discreto para Modo Proprietário */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pb-6 flex items-center justify-between text-xs text-[#849495]">
        <span className="text-[11px] font-['Plus_Jakarta_Sans']">© 3K 3D Studio • Peças e Projetos Sob Encomenda</span>
        <button
          type="button"
          onClick={() => {
            setIsAdminMode((prev) => {
              const next = !prev;
              showToast(
                next
                  ? 'Modo Proprietário ativado! Botões de anexar e trocar mídia visíveis.'
                  : 'Modo Proprietário desativado.'
              );
              return next;
            });
          }}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-[#1c1f29] text-[#55696a] hover:text-[#00f2fe] transition-colors"
          title={isAdminMode ? 'Desativar Modo Proprietário' : 'Ativar Modo Proprietário (Ctrl + Shift + A)'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isAdminMode ? 'lock_open' : 'lock'}
          </span>
          <span className="text-[11px] font-['JetBrains_Mono']">
            {isAdminMode ? 'Modo Proprietário Ativo' : 'Acesso Proprietário'}
          </span>
        </button>
      </div>

      {/* Hidden native input for attaching photo or video files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Floating feedback toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#00f2fe] text-[#002022] font-['Plus_Jakarta_Sans'] text-sm font-bold shadow-2xl shadow-[#00f2fe]/40 border border-white/30 backdrop-blur-md animate-fade-in">
          <span className="material-symbols-outlined text-[22px] text-[#002022]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
