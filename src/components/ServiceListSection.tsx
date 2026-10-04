import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Search, MessageSquare, ExternalLink, Clock, Check, Sparkles, Filter, ChevronRight } from 'lucide-react';
import type { Service } from '../types/index.ts';

export const ServiceListSection: React.FC = () => {
  const {
    services,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    navigateToService,
    openWhatsAppOrder
  } = useApp();

  const [sortOption, setSortOption] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const activeCategories = useMemo(() => {
    return categories
      .filter((c) => c.isActive !== false)
      .sort((a, b) => a.order - b.order);
  }, [categories]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (service.status !== 'published') return false;

      if (selectedCategoryFilter !== 'all') {
        const matchesCat =
          service.categoryId === selectedCategoryFilter ||
          service.categoryId.toLowerCase() === selectedCategoryFilter.toLowerCase();
        if (!matchesCat) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cat = categories.find((c) => c.id === service.categoryId);
        const matchesTitle = service.title.toLowerCase().includes(q);
        const matchesShort = service.shortDescription.toLowerCase().includes(q);
        const matchesFull = service.fullDescription.toLowerCase().includes(q);
        const matchesCatName = cat ? cat.name.toLowerCase().includes(q) : false;
        const matchesFeatures = service.features?.some((f) => f.toLowerCase().includes(q));

        if (!matchesTitle && !matchesShort && !matchesFull && !matchesCatName && !matchesFeatures) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortOption === 'price-low' || sortOption === 'price-high') {
        const getNum = (str: string) => {
          const match = str.replace(/[^0-9]/g, '');
          return match ? parseInt(match, 10) : 0;
        };
        const pA = getNum(a.price);
        const pB = getNum(b.price);
        return sortOption === 'price-low' ? pA - pB : pB - pA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [services, selectedCategoryFilter, searchQuery, categories, sortOption]);

  const displayedServices = filteredServices.slice(0, visibleCount);
  const hasMore = filteredServices.length > visibleCount;

  const getCategoryName = (catId: string) => {
    const found = categories.find((c) => c.id === catId || c.slug === catId);
    return found ? found.name : catId;
  };

  return (
    <section id="services-section" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>মার্কেটপ্লেস ক্যাটালগ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              সার্ভিস ও রেডি সল্যুশন সমূহ
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              যেকোনো সার্ভিস বেছে নিন, বিস্তারিত দেখুন এবং সরাসরি হোয়াটসঅ্যাপে অর্ডার করুন।
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="সার্ভিস বা কিওয়ার্ড খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-rose-500 shadow-xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            All Services ({services.filter((s) => s.status === 'published').length})
          </button>

          {activeCategories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.id;
            const count = services.filter(
              (s) => (s.categoryId === cat.id || s.categoryId === cat.slug) && s.status === 'published'
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl border border-slate-200 bg-white">
            <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">কোনো সার্ভিস পাওয়া যায়নি</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              "{searchQuery}" কিওয়ার্ডে কোনো সার্ভিস নেই। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service) => {
            const categoryName = getCategoryName(service.categoryId);
            const mainImage =
              service.images && service.images.length > 0
                ? service.images[0]
                : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={service.id}
                className="ref-card overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div
                    onClick={() => navigateToService(service)}
                    className="relative h-56 overflow-hidden cursor-pointer bg-slate-100"
                  >
                    <img
                      src={mainImage}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {service.deliveryTime && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span>{service.deliveryTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <span className="text-rose-600">{categoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Verified Solution</span>
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
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
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
                    <span>View Service Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
            >
              Load More Services ({filteredServices.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
