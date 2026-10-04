import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getCategoryIcon } from '../utils/iconHelper.tsx';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Category } from '../types/index.ts';

export const CategorySection: React.FC = () => {
  const { categories, services, navigateToCategory } = useApp();

  const activeCategories = categories
    .filter((c) => c.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const getServiceCount = (categoryId: string) => {
    return services.filter(
      (s) => (s.categoryId === categoryId || s.categoryId === categoryId.toLowerCase()) && s.status === 'published'
    ).length;
  };

  return (
    <section id="our-services-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ক্যাটাগরি সমূহ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            OUR SERVICES
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Choose the service you need and explore our available solutions.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCategories.map((category) => {
            const count = getServiceCount(category.id);

            return (
              <div
                key={category.id}
                onClick={() => navigateToCategory(category)}
                className="ref-card p-6 flex flex-col justify-between hover:border-rose-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                      {getCategoryIcon(category.icon, 'w-6 h-6')}
                    </div>

                    <span className="text-xs font-bold text-slate-500 group-hover:text-rose-600 transition-colors">
                      {count} {count === 1 ? 'Service' : 'Services'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {category.description || 'রেডি সল্যুশন ও ইনস্ট্যান্ট হোয়াটসঅ্যাপ অর্ডারের সুবিধা।'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
