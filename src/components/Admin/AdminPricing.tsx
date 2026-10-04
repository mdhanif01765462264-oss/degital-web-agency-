import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import { PlusCircle, Edit2, Trash2, Check, X, Tag, Sparkles } from 'lucide-react';
import type { PricingPlan } from '../../types/index.ts';

export const AdminPricing: React.FC = () => {
  const { pricingPlans, refreshPricing, showToast } = useApp();
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const [name, setName] = useState('');
  const [badge, setBadge] = useState('');
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState('এককালীন সেটআপ');
  const [shortDesc, setShortDesc] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [isPopular, setIsPopular] = useState(false);
  const [ctaText, setCtaText] = useState('হোয়াটসঅ্যাপে অর্ডার করুন');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setBadge('');
    setPrice('');
    setPeriod('এককালীন সেটআপ');
    setShortDesc('');
    setFeatures(['']);
    setIsPopular(false);
    setCtaText('হোয়াটসঅ্যাপে অর্ডার করুন');
    setEditingPlan(null);
    setMode('list');
  };

  const handleEditClick = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setBadge(plan.badge || '');
    setPrice(plan.price);
    setPeriod(plan.period);
    setShortDesc(plan.shortDesc);
    setFeatures(plan.features && plan.features.length > 0 ? plan.features : ['']);
    setIsPopular(plan.isPopular);
    setCtaText(plan.ctaText || 'হোয়াটসঅ্যাপে অর্ডার করুন');
    setMode('edit');
  };

  const handleDelete = async (id: string, planName: string) => {
    if (!window.confirm(`Delete pricing plan "${planName}"?`)) return;
    try {
      await api.deletePricing(id);
      showToast('Plan deleted', 'success');
      await refreshPricing();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete plan', 'error');
    }
  };

  const handleFeatureChange = (index: number, val: string) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddFeature = () => setFeatures((prev) => [...prev, '']);
  const handleRemoveFeature = (index: number) => setFeatures((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      showToast('Plan name and price are required', 'error');
      return;
    }

    setIsSubmitting(true);
    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);

    const payload = {
      name,
      badge,
      price,
      period,
      shortDesc,
      features: cleanFeatures,
      isPopular,
      ctaText
    };

    try {
      if (mode === 'edit' && editingPlan) {
        await api.updatePricing(editingPlan.id, payload);
        showToast('Plan updated', 'success');
      } else {
        await api.createPricing(payload);
        showToast('Pricing plan created', 'success');
      }
      await refreshPricing();
      resetForm();
    } catch (err: any) {
      showToast(err.message || 'Failed to save plan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">সঠিক প্যাকেজটি বেছে নিন (Pricing Packages)</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ওয়েবসাইটের "সঠিক প্যাকেজটি বেছে নিন" সেকশনের প্যাকেজ যোগ, পরিবর্তন ও রিমুভ করুন।
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={() => {
              resetForm();
              setMode('add');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন প্যাকেজ যোগ করুন (Add Package)</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
          >
            প্যাকেজ তালিকায় ফিরে যান
          </button>
        )}
      </div>

      {(mode === 'add' || mode === 'edit') && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700 bg-slate-900/90 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'Edit Pricing Plan' : 'Create Pricing Plan'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starter, Full E-commerce Plus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Price *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ৳৫,৫০০"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Billing Period / Note</label>
                <input
                  type="text"
                  placeholder="e.g. এককালীন সেটআপ or মাসিক"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Top Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. সবচেয়ে জনপ্রিয় or বাজেট ফ্রেন্ডলি"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Short Summary</label>
              <textarea
                rows={2}
                placeholder="Brief summary of who this plan is suitable for..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">Features Checklist</label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  + Add Feature
                </button>
              </div>

              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Feature #${idx + 1}`}
                      value={feat}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isPopularCheck"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <label htmlFor="isPopularCheck" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Highlight as Most Popular (Highlighted Border & Badge)
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-2xl glass-card border flex flex-col justify-between space-y-4 ${
              plan.isPopular ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                {plan.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-emerald-400 my-2">
                {plan.price} <span className="text-xs text-slate-400 font-normal">/ {plan.period}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{plan.shortDesc}</p>
              <div className="mt-3 text-xs text-slate-300 space-y-1">
                {plan.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="truncate">• {f}</div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleEditClick(plan)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(plan.id, plan.name)}
                className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
