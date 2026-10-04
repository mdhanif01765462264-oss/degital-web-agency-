import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Star, Quote, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, settings } = useApp();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>গ্রাহক প্রতিক্রিয়া</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            আমাদের সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            {settings.brandName || 'DEGITAL WB AGENCY'}-র মাধ্যমে পরিচালিত ব্যবসার সফল উদ্যোক্তাদের অভিমত।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="ref-card p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                  }}
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500">
                    {t.role}, <span className="font-semibold text-rose-600">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
