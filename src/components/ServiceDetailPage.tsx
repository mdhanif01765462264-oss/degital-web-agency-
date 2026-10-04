import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowLeft,
  MessageSquare,
  ExternalLink,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Sparkles,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import type { Service } from '../types/index.ts';

export const ServiceDetailPage: React.FC = () => {
  const {
    selectedService,
    categories,
    services,
    setCurrentView,
    navigateToService,
    openWhatsAppOrder,
    showToast,
    settings
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const service = selectedService || services[0];

  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [service]);

  if (!service) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">সার্ভিস পাওয়া যায়নি</h2>
        <button
          onClick={() => setCurrentView('services')}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm"
        >
          সব সার্ভিস দেখুন
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === service.categoryId);
  const categoryName = category ? category.name : service.categoryId;

  const images = service.images && service.images.length > 0
    ? service.images
    : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80'];

  const currentImage = images[activeImageIndex] || images[0];

  const relatedServices = services
    .filter((s) => s.id !== service.id && s.categoryId === service.categoryId && s.status === 'published')
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('লিংক কপি করা হয়েছে!', 'success');
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setCurrentView('home')} className="hover:text-rose-600 transition-colors">
            হোম
          </button>
          <span>/</span>
          <button onClick={() => setCurrentView('services')} className="hover:text-rose-600 transition-colors">
            সার্ভিস সমূহ
          </button>
          <span>/</span>
          <span className="text-rose-600 font-semibold">{categoryName}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px]">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery (Up to 3 images) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md group">
              <img
                src={currentImage}
                alt={service.title}
                className="w-full h-[320px] sm:h-[440px] md:h-[480px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80';
                }}
              />

              {service.deliveryTime && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-100 text-xs font-bold text-rose-600 flex items-center gap-1.5 shadow-md">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ডেলিভারি: {service.deliveryTime}</span>
                </div>
              )}

              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-100 text-xs text-slate-700 flex items-center gap-1.5 shadow-md font-semibold">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{service.views || 1} views</span>
              </div>
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden border-2 h-24 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-rose-500 scale-[1.02] shadow-md ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-900/80 text-white font-mono">
                      0{idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-6">
              <div className="flex flex-col items-center gap-1.5 p-2">
                <ShieldCheck className="w-5 h-5 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">ডিরেক্ট হোয়াটসঅ্যাপ</span>
                <span className="text-[11px] text-slate-500">তাৎক্ষণিক সমাধান ও সাপোর্ট</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 border-y sm:border-y-0 sm:border-x border-slate-200">
                <Clock className="w-5 h-5 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">দ্রুত ডেলিভারি</span>
                <span className="text-[11px] text-slate-500">অন-টাইম হ্যান্ডওভার</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">পোস্ট-লঞ্চ সাপোর্ট</span>
                <span className="text-[11px] text-slate-500">ফ্রি সেটআপ ও রিভিশন</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Ordering */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="text-rose-600">{categoryName}</span>
                <span aria-hidden="true">·</span>
                <span>Active Solution</span>
              </div>

              <button
                onClick={handleShare}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>শেয়ার করুন</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {service.title}
            </h1>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-150 space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">প্যাকেজ শুরু মূল্য</div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
                  {service.price}
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  কমপ্লিট সেটআপ সহ
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {service.shortDescription}
            </p>

            {/* CRITICAL: WhatsApp Order Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => openWhatsAppOrder(service)}
                className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg btn-primary-coral flex items-center justify-center gap-3 shadow-xl shadow-rose-500/25 cursor-pointer"
              >
                <MessageSquare className="w-6 h-6 fill-white shrink-0" />
                <span>ORDER VIA WHATSAPP</span>
              </button>

              <div className="text-center text-xs text-slate-500">
                হোয়াটসঅ্যাপ <strong className="text-slate-800 font-mono">{settings.whatsappNumber}</strong> নম্বরে বিস্তারিত বিবরণসহ সরাসরি অর্ডার চলে যাবে।
              </div>

              {service.demoUrl && (
                <a
                  href={service.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-rose-500" />
                  <span>লাইভ ডেমো / প্রিভিউ দেখুন</span>
                </a>
              )}
            </div>

            {/* Features Checklist */}
            {service.features && service.features.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  যা যা থাকছে এই সার্ভিসে:
                </h3>
                <div className="space-y-2">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Service Details */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                বিস্তারিত বিবরণ:
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {service.fullDescription || service.shortDescription}
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {categoryName} ক্যাটাগরির অন্যান্য সার্ভিস
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">আপনার ব্যবসার জন্য প্রয়োজনীয় প্যাকেজ</p>
              </div>

              <button
                onClick={() => {
                  if (category) setCurrentView('category');
                  else setCurrentView('services');
                }}
                className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>সব দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigateToService(rel)}
                  className="ref-card p-5 cursor-pointer group"
                >
                  <div className="h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={rel.images && rel.images[0] ? rel.images[0] : currentImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-600 line-clamp-1">
                    {rel.title}
                  </h4>
                  <div className="text-base font-black text-rose-600 mt-2">
                    {rel.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
