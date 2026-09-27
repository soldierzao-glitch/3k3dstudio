import React from 'react';
import { ProjectCategory } from '../types';

interface CategoriesSectionProps {
  onSelectCategory?: (cat: ProjectCategory) => void;
  onOpenInstantQuote: (defaultCategory?: string) => void;
  onGoToGallery?: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onGoToGallery
}) => {
  const pillars = [
    {
      id: 'recria',
      title: 'QUEBROU? A GENTE RECRIA.',
      subtitle: 'Pare de procurar uma peça que talvez nem seja mais fabricada.',
      description: 'Perdeu uma tampa? Quebrou uma engrenagem? Sumiu aquele encaixe específico? Podemos recriar a peça sob medida, reproduzindo até componentes difíceis de encontrar.',
      imageUrl: '/images/peca_recriada.jpg',
      altText: 'Peça de reposição técnica e engrenagem de eletrodoméstico antigo recriada em 3D',
      benefit: 'Você não precisa jogar fora algo inteiro por causa de uma única peça.'
    },
    {
      id: 'presente',
      title: 'UM PRESENTE QUE NÃO EXISTE EM NENHUMA LOJA.',
      subtitle: 'Porque os melhores presentes têm uma história por trás.',
      description: 'Transforme uma pessoa, uma memória ou uma paixão em um objeto físico único.',
      imageUrl: '/images/casal_flavio_andreia.jpg',
      altText: 'Escultura personalizada colorida em 3D de casal apaixonado com placa gravada Flávio & Andreia',
      benefit: 'Em vez de escolher algo que qualquer pessoa poderia comprar, você entrega algo que só poderia ser daquela pessoa.'
    },
    {
      id: 'historia',
      title: 'TRANSFORME SUA HISTÓRIA EM UM OBJETO.',
      subtitle: 'Se é importante para você, por que não poderia existir em 3D?',
      description: 'Dê forma física a momentos decisivos, marcos de superação e vitórias que merecem ser lembrados todos os dias.',
      imageUrl: '/images/porsche_vermelha_3d.jpg',
      altText: 'Miniatura realista de uma Porsche vermelha fabricada em impressora 3D exposta em estante de escritório',
      benefit: 'Crie algo que represente quem você é, o que ama ou aquilo que conquistou.'
    }
  ];

  const handleScrollToIdeaSection = () => {
    const target = document.getElementById('atendimento-engenheiro-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categorias-section" className="w-full py-16 bg-[#0b0e17]/80 border-y border-[#272a34]/50 relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
            </span>
            <span>tudo sob medida</span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl text-[#e0e2ef] tracking-tight font-bold">
            O que você pode criar? Sem limites.
          </h2>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl bg-[#181b25] border border-[#272a34] overflow-hidden shadow-xl hover:border-[#00f2fe]/50 hover:shadow-[#00f2fe]/10 transition-all duration-300 hover:-translate-y-1 flex-1 justify-between"
            >
              {/* Card Image: Clean, sem textos ou badges sobrepostos */}
              <div className="relative h-64 w-full overflow-hidden bg-[#0d1017]">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  src={item.imageUrl}
                  alt={item.altText}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('/images/')) {
                      target.src = target.src.replace('/images/', '/');
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#e0e2ef] leading-snug">
                    {item.title}
                  </h3>
                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#00dce6]">
                    {item.subtitle}
                  </h4>
                  <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Highlighted Benefit Box */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#12151e] border border-[#00f2fe]/20 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#00f2fe] text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div className="flex flex-col">
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#00f2fe] font-semibold uppercase tracking-wider">
                        Benefício
                      </span>
                      <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#e0e2ef] leading-relaxed font-medium">
                        {item.benefit}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleScrollToIdeaSection}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#272a34] hover:bg-[#32343f] text-[#00dce6] hover:text-white border border-[#00f2fe]/30 font-['Plus_Jakarta_Sans'] text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span>Quero orçar algo assim</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão direcionando para a Galeria */}
        {onGoToGallery && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={onGoToGallery}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#00b4d8] hover:from-[#6ff6ff] hover:to-[#00f2fe] text-[#002022] font-['Plus_Jakarta_Sans'] text-base font-bold shadow-xl shadow-[#00f2fe]/25 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[22px]">photo_library</span>
              <span>Veja algumas encomendas reais que já fizemos</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
