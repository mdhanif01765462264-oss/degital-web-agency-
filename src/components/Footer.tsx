import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, MessageSquare, Shield, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    settings,
    categories,
    setCurrentView,
    navigateToCategory,
    openDirectWhatsApp,
    adminUser,
    setIsAdminLoginModalOpen
  } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 shadow-md shadow-rose-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.brandName || 'DEGITAL WB AGENCY'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline} — ছোট ও মাঝারি ব্যবসার সহজ ডিজিটাল সমাধান। রেডি ওয়েবসাইট, ফেসবুক ও গুগল অ্যাডস এবং প্রফেশনাল অনলাইন বিজনেস সল্যুশন।
            </p>

            <div className="pt-2">
              <button
                onClick={() => openDirectWhatsApp()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-emerald-400" />
                <span>হোয়াটসঅ্যাপ: {settings.whatsappNumber}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">ন্যাভিগেশন</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setCurrentView('home'); scrollToTop(); }} className="hover:text-rose-400 transition-colors">
                  হোম
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('services'); scrollToTop(); }} className="hover:text-rose-400 transition-colors">
                  সকল সার্ভিস
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('portfolio'); scrollToTop(); }} className="hover:text-rose-400 transition-colors">
                  পোর্টফোলিও
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('about'); scrollToTop(); }} className="hover:text-rose-400 transition-colors">
                  আমাদের সম্পর্কে
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('contact'); scrollToTop(); }} className="hover:text-rose-400 transition-colors">
                  যোগাযোগ
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">সার্ভিস ক্যাটাগরি</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => navigateToCategory(cat)} className="hover:text-rose-400 transition-colors text-left">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">যোগাযোগের ঠিকানা</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {settings.brandName || 'DEGITAL WB AGENCY'}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={scrollToTop} className="hover:text-white flex items-center gap-1 transition-colors">
              <span>উপরে যান</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
