import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Check, Sparkles, MessageSquare } from 'lucide-react';
import type { PricingPlan } from '../types/index.ts';

export const PricingSection: React.FC = () => {
  const { pricingPlans, openPlanOrder, settings } = useApp();

  if (pricingPlans.length === 0) return null;

  return (
    <section id="pricing-section" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রাইজ প্ল্যান</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            সঠিক প্যাকেজটি বেছে নিন
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            নতুন করে শুরু করার জন্য সবচেয়ে নির্ভরযোগ্য প্যাকেজ—আপনার প্রয়োজন ও বাজেট অনুযায়ী বেছে নিন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-white border-2 border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.02]'
                    : 'bg-white border border-slate-200 shadow-sm hover:border-rose-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isPopular
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.shortDesc}</p>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ {plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <button
                  onClick={() => openPlanOrder(plan)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPopular
                      ? 'btn-primary-coral shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{plan.ctaText || 'হোয়াটসঅ্যাপে অর্ডার করুন'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
