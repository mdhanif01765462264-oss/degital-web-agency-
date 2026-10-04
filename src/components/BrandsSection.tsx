import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles } from 'lucide-react';

export const BrandsSection: React.FC = () => {
  const { partnerBrands, settings } = useApp();

  if (partnerBrands.length === 0) return null;

  return (
    <section className="py-14 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Pill Kicker */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>আমাদের ক্লায়েন্ট</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          {settings.brandsSectionTitle || `Fastmart ও ${settings.brandName || 'DEGITAL WB AGENCY'}-র মাধ্যমে পরিচালিত জনপ্রিয় ব্র্যান্ডসমূহ`}
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          ছোট উদ্যোগ থেকে শুরু করে দেশের শীর্ষস্থানীয় অনলাইন স্টোর—সবাই আমাদের ডিজিটাল ওয়েবসাইট সল্যুশনে পরিচালিত
        </p>

        {/* Brands Logo Cards Grid */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {partnerBrands.map((brand) => (
            <div
              key={brand.id}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3 hover:border-rose-200 transition-all group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-7 h-7 rounded-lg object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=100&q=80';
                }}
              />
              <span className="font-extrabold text-sm text-slate-800 group-hover:text-rose-600 transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
