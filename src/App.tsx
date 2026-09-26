import { useState, useEffect } from 'react';
import { PageView, ProjectCategory } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ProcessSection } from './components/ProcessSection';
import { CtaBanner } from './components/CtaBanner';
import { GalleryPage } from './components/GalleryPage';
import { InstantQuoteModal } from './components/InstantQuoteModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('inicio');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<ProjectCategory>('all');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetProject, setQuoteTargetProject] = useState<string | undefined>(undefined);

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
          document.getElementById('atendimento-engenheiro-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById('atendimento-engenheiro-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (page === 'galeria') {
      setCurrentPage('galeria-de-encomendas-reais');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'como-funciona') {
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        setTimeout(() => {
          document.getElementById('como-funciona-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('como-funciona-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (page === 'categorias') {
      if (currentPage !== 'inicio') {
        setCurrentPage('inicio');
        setTimeout(() => {
          document.getElementById('categorias-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('categorias-section')?.scrollIntoView({ behavior: 'smooth' });
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
    setCurrentPage('galeria-de-encomendas-reais');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
