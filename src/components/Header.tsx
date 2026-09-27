import React from 'react';
import { PageView } from '../types';

export type NavItem = 'inicio' | 'como-funciona' | 'categorias' | 'galeria';

interface HeaderProps {
  currentPage: PageView;
  activeNav?: NavItem;
  onNavigate: (page: PageView) => void;
  onOpenInstantQuote: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  activeNav,
  onNavigate
}) => {
  const handleNavClick = (page: PageView, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  // Determinar qual item do menu está ativo
  const currentActive: NavItem = activeNav || (
    currentPage === 'galeria' || currentPage === 'galeria-de-encomendas-reais'
      ? 'galeria'
      : currentPage === 'como-funciona'
      ? 'como-funciona'
      : currentPage === 'categorias'
      ? 'categorias'
      : 'inicio'
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#10131c]/95 backdrop-blur-2xl border-b border-[#272a34]/70 shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-2 py-2 md:h-20 md:py-0">
        
        {/* Top/Left Row: Brand Logo & on mobile also direct action */}
        <div className="flex items-center justify-between w-full md:w-auto shrink-0">
          <button
            onClick={(e) => handleNavClick('inicio', e)}
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f2fe] group"
          >
            <img
              src="/images/logo.png"
              alt="3K 3D Studio Logo"
              className="h-8 sm:h-9 w-auto object-contain rounded-md shadow-[0_0_12px_rgba(0,242,254,0.2)] group-hover:scale-105 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/logo.png')) {
                  target.src = '/logo.png';
                }
              }}
            />
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-lg sm:text-xl text-[#e0e2ef] tracking-tight font-bold group-hover:text-[#00f2fe] transition-colors">
                3K 3D
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#00dce6] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#272a34] font-semibold border border-[#00dce6]/25">
                Studio
              </span>
            </div>
          </button>

          {/* On mobile only: Show "Fazer Pedido sob Medida" button right in the top bar so everything is fully visible without side-scrolling */}
          <div className="md:hidden">
            <button
              onClick={(e) => handleNavClick('fazer-pedido-sob-medida', e)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#272a34] hover:bg-[#32343f] text-[#00dce6] border border-[#00f2fe]/35 font-['Plus_Jakarta_Sans'] text-xs font-semibold shadow-[0_0_15px_rgba(0,242,254,0.18)]"
            >
              <span className="material-symbols-outlined text-[15px] text-[#00f2fe]">chat</span>
              <span>Pedido sob Medida</span>
            </button>
          </div>
        </div>

        {/* Central Navigation Bar: Início, Como Funciona, Categorias, Galeria */}
        <nav className="flex items-center justify-center gap-1 sm:gap-2 py-1 px-1.5 sm:px-2 rounded-xl bg-[#0b0e17]/80 border border-[#272a34]/80 backdrop-blur-md w-full md:w-auto">
          <button
            onClick={(e) => handleNavClick('inicio', e)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm tracking-wide transition-all rounded-lg shrink-0 border ${
              currentActive === 'inicio'
                ? 'bg-[#272a34] text-[#00f2fe] font-bold shadow-[0_0_14px_rgba(0,242,254,0.22)] border-[#00f2fe]/45 ring-1 ring-[#00f2fe]/20'
                : 'text-[#b9cacb] hover:text-[#e0e2ef] hover:bg-[#272a34]/50 border-transparent'
            }`}
          >
            Início
          </button>

          <button
            onClick={(e) => handleNavClick('como-funciona', e)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm tracking-wide transition-all rounded-lg shrink-0 border ${
              currentActive === 'como-funciona'
                ? 'bg-[#272a34] text-[#00f2fe] font-bold shadow-[0_0_14px_rgba(0,242,254,0.22)] border-[#00f2fe]/45 ring-1 ring-[#00f2fe]/20'
                : 'text-[#b9cacb] hover:text-[#e0e2ef] hover:bg-[#272a34]/50 border-transparent'
            }`}
          >
            Como Funciona
          </button>

          <button
            onClick={(e) => handleNavClick('categorias', e)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm tracking-wide transition-all rounded-lg shrink-0 border ${
              currentActive === 'categorias'
                ? 'bg-[#272a34] text-[#00f2fe] font-bold shadow-[0_0_14px_rgba(0,242,254,0.22)] border-[#00f2fe]/45 ring-1 ring-[#00f2fe]/20'
                : 'text-[#b9cacb] hover:text-[#e0e2ef] hover:bg-[#272a34]/50 border-transparent'
            }`}
          >
            Categorias
          </button>

          <button
            onClick={(e) => handleNavClick('galeria', e)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm tracking-wide transition-all rounded-lg shrink-0 border ${
              currentActive === 'galeria'
                ? 'bg-[#272a34] text-[#00f2fe] font-bold shadow-[0_0_14px_rgba(0,242,254,0.22)] border-[#00f2fe]/45 ring-1 ring-[#00f2fe]/20'
                : 'text-[#b9cacb] hover:text-[#e0e2ef] hover:bg-[#272a34]/50 border-transparent'
            }`}
          >
            Galeria
          </button>
        </nav>

        {/* Desktop Fazer Pedido sob Medida Button */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => handleNavClick('fazer-pedido-sob-medida', e)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#272a34] hover:bg-[#32343f] text-[#00dce6] hover:text-[#e0fdff] border border-[#00f2fe]/30 font-['Plus_Jakarta_Sans'] text-sm font-semibold shadow-[0_0_20px_rgba(0,242,254,0.18)] hover:shadow-[0_0_28px_rgba(0,242,254,0.32)] transition-all active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00f2fe]">chat</span>
            <span>Fazer Pedido sob Medida</span>
          </button>
        </div>
      </div>
    </header>
  );
};
