import React, { useState, useRef, useEffect } from 'react';

interface HeroSectionProps {
  onOpenInstantQuote: () => void;
  onGoToGallery: () => void;
  onOrderCustom: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToGallery,
  onOrderCustom
}) => {
  const [customImage, setCustomImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('3k_founders_photo_custom') || null;
    } catch {
      return null;
    }
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('3k3d_admin_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Escutar atalho global Ctrl + Shift + A para ativar modo proprietário
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const next = !prev;
          try {
            localStorage.setItem('3k3d_admin_mode', next ? 'true' : 'false');
          } catch {}
          setToastMessage(
            next
              ? 'Modo Proprietário ativado! Botões de troca de foto visíveis.'
              : 'Modo Proprietário desativado. Visão pública de visitante.'
          );
          setTimeout(() => setToastMessage(null), 3500);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImage(result);
          try {
            localStorage.setItem('3k_founders_photo_custom', result);
          } catch (err) {
            console.warn('LocalStorage cheio ou restrito', err);
          }
          setToastMessage('Foto dos fundadores atualizada com sucesso!');
          setTimeout(() => setToastMessage(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative w-full overflow-hidden pb-12 pt-6">
      {/* Ambient Glow Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#00f2fe]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#fecf00]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 pt-6 md:pt-10">
        
        {/* Top Badge Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272a34]/80 border border-[#00dce6]/25 text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
            </span>
            <span>UMA FÁBRICA INTEIRA NA PALMA DA SUA MÃO</span>
          </span>
        </div>

        {/* Hero Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl lg:text-[54px] text-[#e0e2ef] tracking-tight leading-[1.1] font-bold">
                Se você pode imaginar, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#00f2fe] via-[#6ff6ff] to-[#fecf00] bg-clip-text text-transparent">
                  nós podemos criar
                </span>
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#b9cacb] max-w-2xl leading-relaxed mt-2">
                Transformamos ideias, esboços e projetos em objetos 3D de alta precisão. De peças personalizadas e colecionáveis geek a protótipos industriais e presentes exclusivos — sem limites para a sua criatividade.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOrderCustom}
                className="group inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#00dce6] text-[#002022] font-['Plus_Jakarta_Sans'] text-sm font-bold shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,242,254,0.5)] active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">
                  add_task
                </span>
                <span>Pedir Encomenda Personalizada</span>
              </button>

              <button
                onClick={onGoToGallery}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#272a34]/70 hover:bg-[#272a34] text-[#e0fdff] border border-[#3a494b] font-['Plus_Jakarta_Sans'] text-sm font-semibold shadow-md transition-all hover:border-[#00dce6]/50"
              >
                <span className="material-symbols-outlined text-[20px] text-[#00dce6]">
                  view_in_ar
                </span>
                <span>Ver Peças Reais Entregues</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col p-3 rounded-xl bg-[#181b25]/80 border border-[#272a34]">
                <span className="font-['Space_Grotesk'] text-xl text-[#00f2fe] font-bold">
                  +2.500
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#b9cacb]">
                  peças impressas
                </span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-[#181b25]/80 border border-[#272a34]">
                <span className="font-['Space_Grotesk'] text-xl text-[#fecf00] font-bold">
                  0.05mm
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#b9cacb]">
                  camada ultra-fina
                </span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-[#181b25]/80 border border-[#272a34]">
                <span className="font-['Space_Grotesk'] text-xl text-[#e0e2ef] font-bold">
                  100%
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#b9cacb]">
                  personalizado
                </span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-[#181b25]/80 border border-[#272a34]">
                <span className="font-['Space_Grotesk'] text-xl text-[#6ff6ff] font-bold">
                  BR Express
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#b9cacb]">
                  envio protegido
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Imagem flutuante da 3K 3D */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center pt-4 lg:pt-0">
            {/* Ambient Backlight Glow behind image */}
            <div className="absolute w-[340px] h-[460px] sm:w-[400px] sm:h-[520px] bg-gradient-to-tr from-[#00f2fe]/20 via-[#00f2fe]/10 to-[#fecf00]/20 rounded-3xl blur-[90px] pointer-events-none -z-10 animate-pulse"></div>

            {/* Input oculto para selecionar foto original */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Toast feedback ao usar Ctrl + Shift + A */}
            {toastMessage && (
              <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#10131c]/95 border border-[#00f2fe]/60 text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Floating Container */}
            <div
              className={`relative w-full max-w-[430px] animate-float group ${isAdminMode ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => {
                if (isAdminMode) {
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                if (isAdminMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onDrop={(e) => {
                if (!isAdminMode) return;
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = event.target?.result as string;
                    if (result) {
                      setCustomImage(result);
                      try {
                        localStorage.setItem('3k_founders_photo_custom', result);
                      } catch {
                        // ignore
                      }
                      setToastMessage('Foto dos fundadores atualizada com sucesso!');
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              {/* Botão flutuante visível SOMENTE em Modo Proprietário (Ctrl + Shift + A) */}
              {isAdminMode && (
                <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                  {customImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomImage(null);
                        try {
                          localStorage.removeItem('3k_founders_photo_custom');
                        } catch {
                          // ignore
                        }
                      }}
                      title="Restaurar imagem padrão"
                      className="px-2.5 py-1 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 font-['JetBrains_Mono'] text-[10px] backdrop-blur-md shadow-md transition-all"
                    >
                      Restaurar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    title="Carregar arquivo original anexado (Editing_braces_and_eye_color_2K_20260925201157.jpg)"
                    className="px-3 py-1.5 rounded-full bg-[#10131c]/90 hover:bg-[#181b25] border border-[#00f2fe]/60 text-[#00dce6] hover:text-white backdrop-blur-md font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all active:scale-95 ring-2 ring-[#00f2fe]/30"
                  >
                    <span className="material-symbols-outlined text-[15px]">upload_file</span>
                    <span>{customImage ? 'Trocar Foto' : 'Carregar Original'}</span>
                  </button>
                </div>
              )}

              {/* Image Frame with glowing cyan/neon border */}
              <div className="relative w-full rounded-3xl overflow-hidden bg-[#181b25] border border-[#00f2fe]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(0,242,254,0.25)] transition-transform duration-500 group-hover:scale-[1.01]">
                <img
                  src={customImage || '/equipe_criativa_3k.jpg'}
                  alt="Equipe Fundadores 3K 3D - Sosô a criativa, Pepê o explorador, Vinho o inventor"
                  className="w-full h-auto object-cover rounded-3xl block select-none"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/equipe_criativa_3k.jpg';
                  }}
                />

                {/* Dica discreta visível SOMENTE em Modo Proprietário ao passar o mouse */}
                {isAdminMode && (
                  <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-[#00dce6] font-['JetBrains_Mono'] text-[11px] pointer-events-none">
                    <span className="material-symbols-outlined text-[14px]">touch_app</span>
                    <span>Clique ou arraste a imagem original aqui</span>
                  </div>
                )}
              </div>

              {/* Glowing Floor Shadow underneath the floating image */}
              <div className="w-3/4 mx-auto h-4 mt-5 bg-gradient-to-r from-transparent via-[#00f2fe]/40 to-transparent blur-md rounded-full animate-float-shadow pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
