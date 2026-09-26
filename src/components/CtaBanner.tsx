import React from 'react';

interface CtaBannerProps {
  onOpenInstantQuote: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenInstantQuote }) => {
  return (
    <section id="atendimento-engenheiro-section" className="w-full py-14 relative scroll-mt-24">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#272a34] via-[#1c1f29] to-[#10131c] border border-[#3a494b]/80 p-8 md:p-12 overflow-hidden shadow-2xl">
          
          {/* Ambient Glows */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#00f2fe]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#fecf00]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2.5 max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center self-center lg:self-start gap-1.5 px-3 py-1 rounded-full bg-[#fecf00]/15 border border-[#fecf00]/30 text-[#ffe082] font-['JetBrains_Mono'] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>ATENDIMENTO DIRETO COM ENGENHEIRO 3D</span>
              </span>

              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl text-[#e0e2ef] tracking-tight font-bold leading-tight">
                Tem uma ideia louca ou um projeto único?
              </h2>

              <p className="font-['Plus_Jakarta_Sans'] text-base text-[#b9cacb] leading-relaxed">
                Fale com nossos especialistas agora mesmo no WhatsApp e receba um orçamento sem compromisso em até 2 horas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#fecf00] to-[#ffe082] text-[#231b00] font-['Plus_Jakarta_Sans'] text-sm font-bold shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
                href="https://wa.me/5575991262118?text=Ol%C3%A1%2C+tenho+uma+ideia+ou+projeto+especial+e+gostaria+de+falar+com+o+engenheiro+da+3K+3D!"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                <span>Chamar no WhatsApp</span>
              </a>

              <button
                onClick={onOpenInstantQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#32343f] hover:bg-[#363943] text-[#e0e2ef] hover:text-[#00f2fe] border border-[#3a494b] hover:border-[#00f2fe]/40 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px] text-[#00f2fe]">calculate</span>
                <span>Já tem as medidas? Use nossa calculadora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
