import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export const BottomCtaSection: React.FC = () => {
  const { settings, openDirectWhatsApp, setCurrentView } = useApp();

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white text-center">
      {/* Decorative ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>এখনই শুরু করার সেরা সময়</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          আপনার নিজের অনলাইন ব্যবসা ও স্টোর শুরু করতে প্রস্তুত?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          অনলাইন সেলস বৃদ্ধি ও হাই-কনভার্টিং ওয়েবসাইট তৈরিতে {settings.brandName || 'DEGITAL WB AGENCY'}-র সাথে সরাসরি যুক্ত হোন।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => openDirectWhatsApp('Hello DEGITAL WB AGENCY, I want to start my online business with your services.')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm btn-primary-coral flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>হোয়াটসঅ্যাপে অর্ডার দিন</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>সব সার্ভিস দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
