import React from 'react';

interface ProcessSectionProps {
  onStartOrder: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onStartOrder }) => {
  return (
    <section id="como-funciona-section" className="w-full py-16 relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12">
        
        {/* Section Title Center */}
        <div className="flex flex-col items-center text-center gap-2 mb-14">
          <span className="font-['JetBrains_Mono'] text-xs text-[#00f2fe] tracking-widest uppercase font-semibold">
            COMO FUNCIONA
          </span>
          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-[#e0e2ef] tracking-tight font-bold">
            O Processo Simples em 3 Passos
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-base text-[#b9cacb] max-w-xl leading-relaxed">
            Você não precisa ser especialista em 3D. Nossa equipe de engenharia e modelagem cuida de toda a esteira técnica.
          </p>
        </div>

        {/* Steps Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Step 1 */}
          <div className="relative flex flex-col p-7 rounded-2xl bg-[#1c1f29]/60 border border-[#272a34] shadow-lg hover:border-[#00f2fe]/30 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#00f2fe]/15 border border-[#00f2fe]/25 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00f2fe] text-[26px]">
                  upload_file
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[36px] text-[#363943] font-bold leading-none select-none">
                01
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl text-[#e0e2ef] font-semibold mb-2">
              Mande sua Ideia ou Arquivo
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed">
              Não tem modelo 3D? Sem problemas. Aceitamos desenhos manuais, referências da internet, links do Thingiverse/Printables ou modelos prontos (.STL, .OBJ, .STEP).
            </p>
            <div className="mt-6 pt-4 border-t border-[#272a34]/60 flex items-center gap-2 text-[#00f2fe] font-['JetBrains_Mono'] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Triagem em minutos</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col p-7 rounded-2xl bg-[#1c1f29]/60 border border-[#272a34] shadow-lg hover:border-[#fecf00]/30 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#fecf00]/15 border border-[#fecf00]/25 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#fecf00] text-[26px]">
                  design_services
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[36px] text-[#363943] font-bold leading-none select-none">
                02
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl text-[#e0e2ef] font-semibold mb-2">
              Modelagem &amp; Orçamento
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed">
              Avaliamos a melhor tecnologia (Resina ou Filamento FDM), densidade ideal e enviamos o orçamento detalhado transparente, com simulação de peso e prazo exato.
            </p>
            <div className="mt-6 pt-4 border-t border-[#272a34]/60 flex items-center gap-2 text-[#fecf00] font-['JetBrains_Mono'] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Aprovação visual prévia</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col p-7 rounded-2xl bg-[#1c1f29]/60 border border-[#272a34] shadow-lg hover:border-[#00dce6]/30 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#00dce6]/15 border border-[#00dce6]/25 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00dce6] text-[26px]">
                  local_shipping
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[36px] text-[#363943] font-bold leading-none select-none">
                03
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl text-[#e0e2ef] font-semibold mb-2">
              Impressão &amp; Entrega Blindada
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#b9cacb] leading-relaxed">
              Sua peça entra em linha de produção monitorada, recebe acabamento e cura profissional, e segue em embalagem ultra protegida com rastreamento até a sua porta.
            </p>
            <div className="mt-6 pt-4 border-t border-[#272a34]/60 flex items-center gap-2 text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Garantia total contra quebras</span>
            </div>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onStartOrder}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#272a34] hover:bg-[#32343f] text-[#00dce6] border border-[#00f2fe]/30 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Simular Orçamento Instantâneo Agora</span>
          </button>
        </div>
      </div>
    </section>
  );
};
