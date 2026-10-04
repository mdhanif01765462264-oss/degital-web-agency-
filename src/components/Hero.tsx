import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowRight, Play, Star, Sparkles, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, setCurrentView, openDirectWhatsApp } = useApp();

  const scrollToServices = () => {
    const el = document.getElementById('services-section') || document.getElementById('our-services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('services');
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{settings.heroBadge || 'আধুনিক ও সহজ ডিজিটাল সমাধান'}</span>
            </div>

            {/* Giant Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.2]">
              {settings.heroTitle || 'ডিজিটাল বিজনেসের সহজ সমাধান, গ্রোথ রাখুন নিজের হাতে'}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {settings.heroSubtitle ||
                'DEGITAL WB AGENCY-র সাথে আপনার অনলাইন সেলস বৃদ্ধি করুন, পরিচালনা করুন সহজে। রেডি ওয়েবসাইট, ফেসবুক ও গুগল অ্যাডস এবং প্রফেশনাল ব্র্যান্ডিংয়ের নির্ভরযোগ্য এক প্ল্যাটফর্ম।'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => openDirectWhatsApp()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base btn-primary-coral flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer"
              >
                <span>{settings.heroPrimaryBtnText || 'শুরু করুন →'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToPricing}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{settings.heroSecondaryBtnText || 'লাইভ ডেমো ও প্যাকেজ'}</span>
              </button>
            </div>

            {/* Trust Rating & Stars matching reference */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-slate-800">
                {settings.heroRatingText || '৫০০+ সফল উদ্যোক্তা ও ব্যবসায়ীর প্রথম পছন্দ'}
              </span>
            </div>
          </div>

          {/* Right Column: Screen Frame / Mockup with Play Video Button */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer Shadow Card */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-2xl p-1.5 group">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950">
                  <img
                    src={settings.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'}
                    alt="DEGITAL WB AGENCY Service Showcase"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />

                  {/* Play Demo Button Overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                    <button
                      onClick={() => openDirectWhatsApp('Hello DEGITAL WB AGENCY, I want to see a live demo of your websites and marketing systems.')}
                      className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 hover:scale-110 active:scale-95 transition-all cursor-pointer group/play"
                      aria-label="Play Live Demo"
                    >
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </button>
                  </div>

                  {/* Bottom Mockup Floating Bar */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800">
                        {settings.brandName} লাইভ সিস্টেম
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600">
                      রেডি ২৪ ঘণ্টার মধ্যে
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Stats Bar matching reference */}
        <div className="mt-14 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {settings.stats?.projectsDone || '৬৫০+'}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              সফল প্রজেক্ট ডেলিভারি
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              {settings.stats?.happyClients || '৪৮০+'}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              সন্তুষ্ট বিজনেস ক্লায়েন্ট
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-orange-600 tracking-tight">
              {settings.stats?.roiIncrease || '৩২০%'}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              গড় সেলস ও ROAS বৃদ্ধি
            </div>
          </div>

          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {settings.stats?.supportHours || '২৪/৭'}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              হোয়াটসঅ্যাপ ইনস্ট্যান্ট সাপোর্ট
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
