import React from 'react';
import { HOME_RECENT_PROJECTS } from '../data/projectsData';

interface GalleryPreviewSectionProps {
  onGoToFullGallery: () => void;
  onOpenInstantQuote: (projectTitle?: string) => void;
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({
  onGoToFullGallery,
  onOpenInstantQuote
}) => {
  return (
    <section className="w-full py-16 bg-[#0b0e17]/80 border-t border-[#272a34]/50 relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12">
        
        {/* Section Header with Link to Gallery */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div className="flex flex-col gap-1.5">
            <span className="font-['JetBrains_Mono'] text-xs text-[#00f2fe] tracking-widest uppercase font-semibold">
              PRODUÇÕES RECENTES
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-[#e0e2ef] tracking-tight font-bold">
              Galeria de Encomendas Reais
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-base text-[#b9cacb] max-w-xl">
              Nada de renders fictícios inalcançáveis. Veja fotos reais de projetos concluídos e entregues para clientes de todo o país.
            </p>
          </div>

          <button
            onClick={onGoToFullGallery}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#272a34] hover:bg-[#32343f] text-[#00dce6] border border-[#00f2fe]/20 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-all hover:scale-105 shadow-sm shrink-0"
          >
            <span>Explorar Galeria Completa (+80 fotos)</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* 3 Real Order Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOME_RECENT_PROJECTS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl bg-[#1c1f29]/70 border border-[#272a34] overflow-hidden shadow-xl hover:border-[#00f2fe]/40 transition-all duration-300"
            >
              <div className="relative h-72 w-full bg-[#272a34]">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  src={item.imageUrl}
                  alt={item.altText}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute bottom-3 left-3 bg-[#10131c]/90 border border-[#272a34] backdrop-blur-md px-3 py-1 rounded-md font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00f2fe]">
                  {item.badge}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Space_Grotesk'] text-lg text-[#e0e2ef] font-semibold">
                      {item.title}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#fecf00] font-semibold px-2 py-0.5 rounded bg-[#fecf00]/10 border border-[#fecf00]/20">
                      {item.tolerance}
                    </span>
                  </div>
                  <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed italic">
                    {item.quote}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#272a34]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#00f2fe]/15 border border-[#00f2fe]/30 flex items-center justify-center font-bold text-[#00f2fe] font-['JetBrains_Mono'] text-xs">
                      {item.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#e0e2ef] font-semibold">
                        {item.client}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenInstantQuote(item.title)}
                    className="p-1.5 rounded-lg bg-[#272a34] hover:bg-[#00f2fe] text-[#00f2fe] hover:text-[#002022] transition-colors"
                    title="Orçar peça similar"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_task</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
