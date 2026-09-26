import { useState, useEffect } from 'react';
import { PageView, ProjectCategory } from './types';
import { Header, NavItem } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ProcessSection } from './components/ProcessSection';
import { CtaBanner } from './components/CtaBanner';
import { GalleryPage } from './components/GalleryPage';
import { InstantQuoteModal } from './components/InstantQuoteModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('inicio');
  const [activeNav, setActiveNav] = useState<NavItem>('inicio');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<ProjectCategory>('all');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetProject, setQuoteTargetProject] = useState<string | undefined>(undefined);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY - 85;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Handle page navigation
  const handleNavigate = (page: PageView) => {
    if (page === 'orcamento-personalizado') {
      setIsQuoteModalOpen(true);
      return;
    }

    if (page === 'fazer-pedido-sob-medida') {
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        setTimeout(() => {
          scrollToSection('atendimento-engenheiro-section');
        }, 120);
      } else {
        scrollToSection('atendimento-engenheiro-section');
      }
      return;
    }

    if (page === 'inicio') {
      setActiveNav('inicio');
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'galeria') {
      setActiveNav('galeria');
      setCurrentPage('galeria-de-encomendas-reais');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'como-funciona') {
      setActiveNav('como-funciona');
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        setTimeout(() => {
          scrollToSection('como-funciona-section');
        }, 120);
      } else {
        scrollToSection('como-funciona-section');
      }
      return;
    }

    if (page === 'categorias') {
      setActiveNav('categorias');
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        setTimeout(() => {
          scrollToSection('categorias-section');
        }, 120);
      } else {
        scrollToSection('categorias-section');
      }
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInstantQuote = (projectTitle?: string) => {
    setQuoteTargetProject(projectTitle);
    setIsQuoteModalOpen(true);
  };

  const handleSelectCategoryFromHome = (category: ProjectCategory) => {
    setSelectedGalleryCategory(category);
    setActiveNav('galeria');
    setCurrentPage('galeria-de-encomendas-reais');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll spy para manter o item do menu ativo conforme a rolagem
  useEffect(() => {
    if (currentPage === 'galeria-de-encomendas-reais') {
      setActiveNav('galeria');
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const comoFuncionaEl = document.getElementById('como-funciona-section');
      const categoriasEl = document.getElementById('categorias-section');

      if (comoFuncionaEl) {
        const rect = comoFuncionaEl.getBoundingClientRect();
        if (rect.top <= 220 && rect.bottom >= 150) {
          setActiveNav('como-funciona');
          return;
        }
      }

      if (categoriasEl) {
        const rect = categoriasEl.getBoundingClientRect();
        if (rect.top <= 220 && rect.bottom >= 150) {
          setActiveNav('categorias');
          return;
        }
      }

      if (scrollY < 400) {
        setActiveNav('inicio');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  useEffect(() => {
    // Sync title based on active view
    if (currentPage === 'galeria-de-encomendas-reais') {
      document.title = 'Galeria de Encomendas Reais | 3K 3D Studio';
    } else {
      document.title = '3K 3D Studio - Manufatura Aditiva & Prototipagem de Precisão';
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#10131c] text-[#e0e2ef] flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Fixed Sticky Header */}
      <Header
        currentPage={currentPage}
        activeNav={activeNav}
        onNavigate={handleNavigate}
        onOpenInstantQuote={() => handleOpenInstantQuote()}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-[#10131c] relative min-h-screen flex-1">
        {currentPage === 'inicio' ? (
          <div className="flex flex-col w-full">
            {/* Screen 1: Hero with 3D HUD inspection */}
            <HeroSection
              onOpenInstantQuote={() => handleOpenInstantQuote()}
              onGoToGallery={() => {
                setSelectedGalleryCategory('all');
                setCurrentPage('galeria-de-encomendas-reais');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOrderCustom={() => handleNavigate('fazer-pedido-sob-medida')}
            />

            {/* Screen 1: Section 2 - O que você pode criar? Sem limites */}
            <CategoriesSection
              onSelectCategory={handleSelectCategoryFromHome}
              onOpenInstantQuote={handleOpenInstantQuote}
              onGoToGallery={() => {
                setSelectedGalleryCategory('all');
                setCurrentPage('galeria-de-encomendas-reais');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Screen 1: Section 3 - O Processo Simples em 3 Passos */}
            <ProcessSection
              onStartOrder={() => handleOpenInstantQuote()}
            />

            {/* Screen 1: Section 4 - Final CTA Banner */}
            <CtaBanner
              onOpenInstantQuote={() => handleOpenInstantQuote()}
            />
          </div>
        ) : (
          /* Screen 2: Galeria de Encomendas Reais */
          <GalleryPage
            onOpenInstantQuote={handleOpenInstantQuote}
            selectedCategoryFilter={selectedGalleryCategory}
          />
        )}
      </main>

      {/* Global Interactive Instant Quote Modal */}
      <InstantQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setQuoteTargetProject(undefined);
        }}
        initialProjectTitle={quoteTargetProject}
      />

      {/* Technical Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenInstantQuote={() => handleOpenInstantQuote()}
      />
    </div>
  );
}
