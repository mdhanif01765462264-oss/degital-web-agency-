import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowLeft, MessageSquare, Clock, Check, ChevronRight, Layers } from 'lucide-react';
import { getCategoryIcon } from '../utils/iconHelper.tsx';

export const CategoryPage: React.FC = () => {
  const {
    selectedCategory,
    categories,
    services,
    setCurrentView,
    navigateToService,
    openWhatsAppOrder,
    setSelectedCategory
  } = useApp();

  const [visibleCount, setVisibleCount] = useState<number>(9);

  const category = selectedCategory || categories[0];

  if (!category) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  const categoryServices = services.filter(
    (s) =>
      (s.categoryId === category.id || s.categoryId.toLowerCase() === category.slug.toLowerCase()) &&
      s.status === 'published'
  );

  const displayedServices = categoryServices.slice(0, visibleCount);
  const hasMore = categoryServices.length > visibleCount;

  return (
    <div className="py-12 sm:py-16 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Switcher */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল ক্যাটাগরিতে ফিরে যান</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto">
            {categories.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  c.id === category.id
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Header Banner */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 mb-12 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              {getCategoryIcon(category.icon, 'w-7 h-7')}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
              {category.name}
            </h1>

            <p className="text-base text-slate-500 leading-relaxed">
              {category.description || 'Browse professional packages and ready solutions with direct WhatsApp fulfillment.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center shrink-0 min-w-[140px]">
            <div className="text-3xl font-black text-rose-600">
              {categoryServices.length}
            </div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Active Listings
            </div>
          </div>
        </div>

        {/* Services Listings */}
        {categoryServices.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-slate-200 bg-white">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-800">এই ক্যাটাগরিতে এখনো কোনো সার্ভিস যোগ করা হয়নি</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              কাস্টম রিকোয়ারমেন্টের জন্য আমাদের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলতে পারেন।
            </p>
            <button
              onClick={() => setCurrentView('services')}
              className="mt-5 px-6 py-2.5 rounded-xl btn-primary-coral text-white text-sm font-bold shadow"
            >
              Browse All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((service) => {
              const mainImg =
                service.images && service.images.length > 0
                  ? service.images[0]
                  : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={service.id}
                  className="ref-card overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div
                      onClick={() => navigateToService(service)}
                      className="relative h-56 overflow-hidden cursor-pointer bg-slate-100"
                    >
                      <img
                        src={mainImg}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {service.deliveryTime && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-rose-500" />
                          <span>{service.deliveryTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="text-rose-600">{category.name}</span>
                        <span aria-hidden="true">·</span>
                        <span>Instant Delivery</span>
                      </div>

                      <h3
                        onClick={() => navigateToService(service)}
                        className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {service.title}
                      </h3>

                      <div className="flex items-baseline gap-2 pt-1 pb-1">
                        <span className="text-2xl font-black text-rose-600 tracking-tight">
                          {service.price}
                        </span>
                        <span className="text-xs text-slate-500">/ starting from</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>

                      {service.features && service.features.length > 0 && (
                        <div className="pt-3 space-y-1.5 border-t border-slate-100">
                          {service.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2.5">
                    <button
                      onClick={() => openWhatsAppOrder(service)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm btn-primary-coral flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>ORDER VIA WHATSAPP</span>
                    </button>

                    <button
                      onClick={() => navigateToService(service)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 shadow-sm"
            >
              Load More ({categoryServices.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
