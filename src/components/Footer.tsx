import React, { useState } from 'react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenInstantQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenInstantQuote
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <footer className="w-full bg-[#0b0e17] text-[#b9cacb] mt-auto border-t border-[#272a34]/80 shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-14">
          
          {/* Brand Info with Logo */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="3K 3D Studio Logo"
                className="h-8 w-auto object-contain rounded-md shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/logo.png')) {
                    target.src = '/logo.png';
                  }
                }}
              />
              <span className="font-['Space_Grotesk'] text-xl text-[#e0e2ef] font-bold tracking-tight">
                3K 3D Studio
              </span>
            </div>

            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#b9cacb] leading-relaxed max-w-sm">
              A gente pega o que tá só na sua imaginação e transforma em algo real para você segurar nas mãos. Seja uma ideia num papel, um presente inesquecível ou aquele projeto dos seus sonhos — nós damos vida à sua criatividade com todo o carinho e perfeição em cada detalhe.
            </p>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181b25] border border-[#272a34] text-[#00dce6] font-['JetBrains_Mono'] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Garantia de Precisão Micron</span>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <span className="font-['Space_Grotesk'] text-sm text-[#e0e2ef] font-semibold mb-1 uppercase tracking-wider">
              Navegação
            </span>
            <button
              onClick={() => onNavigate('inicio')}
              className="text-left font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#b9cacb] hover:text-[#00f2fe] transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => onNavigate('como-funciona')}
              className="text-left font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#b9cacb] hover:text-[#00f2fe] transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => onNavigate('categorias')}
              className="text-left font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#b9cacb] hover:text-[#00f2fe] transition-colors"
            >
              Categorias
            </button>
            <button
              onClick={() => onNavigate('galeria')}
              className="text-left font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#b9cacb] hover:text-[#00f2fe] transition-colors"
            >
              Galeria
            </button>
            <button
              onClick={() => onNavigate('fazer-pedido-sob-medida')}
              className="text-left font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#00dce6] hover:text-[#00f2fe] font-semibold transition-colors"
            >
              Fazer Pedido sob Medida
            </button>
            <button
              onClick={onOpenInstantQuote}
              className="text-left font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#b9cacb] hover:text-[#00f2fe] transition-colors"
            >
              Calculadora
            </button>
          </div>

          {/* Engenharia */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="font-['Space_Grotesk'] text-sm text-[#e0e2ef] font-semibold mb-1 uppercase tracking-wider">
              Engenharia &amp; Qualidade
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#849495]">
              Filamentos Carbon &amp; SLA Resinas 8K/12K
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#849495]">
              Validação DFM e Geometria STL / STEP
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#849495]">
              Acabamento Cerâmico &amp; Pintura Artística
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#849495]">
              Entrega Blindada Brasil com Rastreamento
            </span>

            {/* Social Icons: Apenas Mensagem e Compartilhar */}
            <div className="flex items-center gap-2.5 pt-3 relative">
              <a
                href="https://wa.me/5575991262118?text=Ol%C3%A1%2C+gostaria+de+um+or%C3%A7amento+com+a+3K+3D!"
                target="_blank"
                rel="noopener noreferrer"
                title="Mensagem no WhatsApp"
                className="w-9 h-9 rounded-lg bg-[#1c1f29] border border-[#272a34] flex items-center justify-center text-[#b9cacb] hover:text-[#00f2fe] hover:bg-[#272a34] transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">chat</span>
              </a>
              <button
                onClick={handleCopyShare}
                title="Compartilhar Link"
                className="w-9 h-9 rounded-lg bg-[#1c1f29] border border-[#272a34] flex items-center justify-center text-[#b9cacb] hover:text-[#00f2fe] hover:bg-[#272a34] transition-all relative"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {copiedLink ? 'check' : 'share'}
                </span>
                {copiedLink && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#00f2fe] text-[#002022] font-['JetBrains_Mono'] text-[10px] font-bold whitespace-nowrap shadow-md">
                    Copiado!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#272a34]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['JetBrains_Mono'] text-xs text-[#849495] text-center md:text-left">
            © 2025 3K 3D Studio. Todos os direitos reservados. Manufatura de precisão digital.
          </p>

          <div className="flex items-center gap-6 font-['JetBrains_Mono'] text-xs text-[#849495]">
            <button
              onClick={() => setActiveModal('privacidade')}
              className="hover:text-[#e0e2ef] transition-colors"
            >
              Privacidade
            </button>
            <button
              onClick={() => setActiveModal('termos')}
              className="hover:text-[#e0e2ef] transition-colors"
            >
              Termos de Serviço
            </button>
            <button
              onClick={() => setActiveModal('tolerancias')}
              className="hover:text-[#00f2fe] transition-colors"
            >
              Tolerâncias Técnicas
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal for Privacy / Terms / Tolerances */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e17]/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#181b25] border border-[#3a494b] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#272a34] pb-3">
              <h3 className="font-['Space_Grotesk'] text-lg text-[#e0e2ef] font-bold capitalize">
                {activeModal === 'tolerancias' ? 'Tolerâncias Técnicas & DFM' : activeModal}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#849495] hover:text-[#e0e2ef]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-xs text-[#b9cacb] leading-relaxed flex flex-col gap-3 font-['Plus_Jakarta_Sans']">
              {activeModal === 'tolerancias' && (
                <>
                  <p>• <strong>Resina Estereolitografia (SLA 8K):</strong> Tolerância dimensional de ±0.03mm a ±0.05mm. Resolução de camada padrão: 0.05mm (50 mícrons).</p>
                  <p>• <strong>Filamento Técnico (FDM / FFF):</strong> Tolerância de ±0.1mm a ±0.15mm com compensação de encolhimento térmico calibrada por lote de polímero.</p>
                  <p>• <strong>Garantia de Encaixe:</strong> Para peças com roscas, engrenagens e gabaritos, nossa engenharia realiza simulação DFM prévia e ajuste de folga funcional.</p>
                </>
              )}
              {activeModal === 'privacidade' && (
                <p>Todos os arquivos 3D (.STL, .OBJ, .STEP) e especificações enviadas à 3K 3D Studio são protegidos por termo de confidencialidade padrão industrial (NDA). Seus dados não são compartilhados com terceiros nem usados para treinamento sem autorização expressa.</p>
              )}
              {activeModal === 'termos' && (
                <p>Nossos orçamentos contemplam validação de malha, tempo de máquina, matéria-prima e frete rastreado com seguro integral contra avarias de transporte. Peças danificadas no trajeto são reimpressas sem custos adicionais mediante envio de foto na abertura da embalagem.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-[#272a34] text-[#00f2fe] font-semibold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
