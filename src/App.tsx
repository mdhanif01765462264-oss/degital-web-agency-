import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { BrandsSection } from './components/BrandsSection.tsx';
import { AdvantagesSection } from './components/AdvantagesSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { CategorySection } from './components/CategorySection.tsx';
import { ServiceListSection } from './components/ServiceListSection.tsx';
import { CategoryPage } from './components/CategoryPage.tsx';
import { ServiceDetailPage } from './components/ServiceDetailPage.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { PortfolioSection } from './components/PortfolioSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { BottomCtaSection } from './components/BottomCtaSection.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { Footer } from './components/Footer.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { AdminLoginModal } from './components/Admin/AdminLoginModal.tsx';
import { AdminPanel } from './components/Admin/AdminPanel.tsx';

function MainLayout() {
  const {
    currentView,
    selectedService,
    selectedCategory,
    settings
  } = useApp();

  // Dynamic SEO & Title sync
  useEffect(() => {
    const brand = settings.brandName || 'DEGITAL WB AGENCY';
    if (currentView === 'service-detail' && selectedService) {
      document.title = `${selectedService.title} - ${brand}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', selectedService.shortDescription || selectedService.title);
      }
    } else if (currentView === 'category' && selectedCategory) {
      document.title = `${selectedCategory.name} - ${brand}`;
    } else if (currentView === 'admin') {
      document.title = `Admin Management Console - ${brand}`;
    } else {
      document.title = `${brand} - ডিজিটাল বিজনেসের সহজ সমাধান`;
    }
  }, [currentView, selectedService, selectedCategory, settings]);

  // If in Admin Panel View (accessed via /admin or admin button)
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        <ToastContainer />
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <ToastContainer />
      <AdminLoginModal />
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <BrandsSection />
            <AdvantagesSection />
            <PricingSection />
            <CategorySection />
            <ServiceListSection />
            <TestimonialsSection />
            <PortfolioSection />
            <FaqSection />
            <AboutSection />
            <ContactSection />
            <BottomCtaSection />
          </>
        )}

        {currentView === 'services' && (
          <div className="pt-4">
            <CategorySection />
            <ServiceListSection />
          </div>
        )}

        {currentView === 'category' && <CategoryPage />}

        {currentView === 'service-detail' && <ServiceDetailPage />}

        {currentView === 'portfolio' && (
          <div className="pt-4">
            <PortfolioSection />
          </div>
        )}

        {currentView === 'about' && (
          <div className="pt-4">
            <AboutSection />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="pt-4">
            <ContactSection />
          </div>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
