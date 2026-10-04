import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MessageSquare, Menu, X, Shield, ArrowRight, Sparkles, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    currentView,
    setCurrentView,
    openDirectWhatsApp,
    adminUser,
    setIsAdminLoginModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'হোম', view: 'home' as const, id: 'home' },
    { label: 'সার্ভিস সমূহ', view: 'services' as const, id: 'services' },
    { label: 'প্যাকেজ', view: 'home' as const, id: 'pricing-section' },
    { label: 'পোর্টফোলিও', view: 'portfolio' as const, id: 'portfolio' },
    { label: 'আমাদের সম্পর্কে', view: 'about' as const, id: 'about' },
    { label: 'যোগাযোগ', view: 'contact' as const, id: 'contact' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.id === 'pricing-section') {
      setCurrentView('home');
      setTimeout(() => {
        document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentView(link.view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-100 shadow-xs relative">
      {/* Top Announcement Bar (can be toggled ON/OFF from Admin Panel) */}
      {settings.showAnnouncementBar !== false && settings.announcementBar && (
        <div className="bg-slate-900 text-white text-xs sm:text-sm py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium tracking-wide mx-auto sm:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{settings.announcementBar}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
              <span className="text-slate-300">হোয়াটসঅ্যাপ: {settings.whatsappNumber}</span>
              <button
                onClick={() => openDirectWhatsApp()}
                className="hover:underline flex items-center gap-1 text-emerald-400 font-bold"
              >
                ইনস্ট্যান্ট চ্যাট <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Clean Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {settings.brandName || 'DEGITAL WB AGENCY'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wider">
              {settings.tagline || 'Build. Market. Grow.'}
            </p>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct WhatsApp Call/Chat */}
          <button
            onClick={() => openDirectWhatsApp()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-primary-coral shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>হোয়াটসঅ্যাপ অর্ডার</span>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition-colors"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                openDirectWhatsApp();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl font-bold text-sm text-white btn-primary-coral flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              হোয়াটসঅ্যাপে যোগাযোগ ({settings.whatsappNumber})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
