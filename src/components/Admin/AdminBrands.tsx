import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import { PlusCircle, Edit2, Trash2, Upload, X, Building2, Check, ArrowLeft } from 'lucide-react';
import type { PartnerBrand } from '../../types/index.ts';

export const AdminBrands: React.FC = () => {
  const { partnerBrands, refreshBrands, showToast, settings } = useApp();
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingBrand, setEditingBrand] = useState<PartnerBrand | null>(null);

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setLogo('');
    setCategory('');
    setEditingBrand(null);
    setMode('list');
  };

  const handleEditClick = (b: PartnerBrand) => {
    setEditingBrand(b);
    setName(b.name);
    setLogo(b.logo);
    setCategory(b.category || '');
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (!window.confirm(`আপনি কি "${brandName}" ব্র্যান্ডটি ডিলিট করতে চান?`)) return;
    try {
      await api.deleteBrand(id);
      showToast('ব্র্যান্ড ডিলিট করা হয়েছে', 'success');
      await refreshBrands();
    } catch (err: any) {
      showToast(err.message || 'ডিলিট ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string);
        if (res.url) {
          setLogo(res.url);
          showToast('লোগো/ইমেজ আপলোড হয়েছে', 'success');
        }
      } catch {
        showToast('আপলোড ব্যর্থ হয়েছে', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Title (ব্র্যান্ডের নাম) আবশ্যক', 'error');
      return;
    }
    if (!logo.trim()) {
      showToast('Image Link বা ছবি আবশ্যক', 'error');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      logo: logo.trim(),
      category: category.trim() || 'জনপ্রিয় ব্র্যান্ড'
    };

    try {
      if (mode === 'edit' && editingBrand) {
        await api.updateBrand(editingBrand.id, payload);
        showToast(`"${name}" ব্র্যান্ড আপডেট সম্পন্ন হয়েছে!`, 'success');
      } else {
        await api.createBrand(payload);
        showToast(`নতুন ব্র্যান্ড "${name}" সফলভাবে যুক্ত হয়েছে!`, 'success');
      }
      await refreshBrands();
      resetForm();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {settings.brandsSectionTitle || 'Fastmart ও DEGITAL WB AGENCY-র মাধ্যমে পরিচালিত জনপ্রিয় ব্র্যান্ডসমূহ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            হোমপেজে প্রদর্শিত ক্লায়েন্ট পার্টনার ব্র্যান্ড লোগো ও টাইটেল যোগ, পরিবর্তন বা ডিলিট করুন।
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={() => { resetForm(); setMode('add'); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন ব্র্যান্ড যোগ করুন (Add Brand)</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>তালিকায় ফিরে যান</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(mode === 'add' || mode === 'edit') && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700 bg-slate-900/90 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'ব্র্যান্ড এডিট করুন' : 'নতুন ব্র্যান্ড যোগ করুন'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Brand Title (ব্র্যান্ডের নাম / টাইটেল) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: eMart Skincare বা Elegance Fashion"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            {/* 2. Image Link & Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Image Link বা ছবি (ইমেজ লিংক বা লোগো আপলোড) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://images.unsplash.com/... অথবা ফাইল আপলোড করুন"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                />
                <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>ফাইল আপলোড</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              {logo && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 w-fit">
                  <img src={logo} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-xs text-slate-400">লোগো প্রিভিউ</span>
                </div>
              )}
            </div>

            {/* 3. Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Category (ক্যাটাগরি / বিজনেস টাইপ)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="যেমন: Skincare ওয়েবসাইট, Fashion ওয়েবসাইট..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : mode === 'edit' ? 'আপডেট সম্পন্ন করুন' : 'ব্র্যান্ড যুক্ত করুন (Add Brand)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Table View */}
      {mode === 'list' && (
        <div className="rounded-3xl glass-panel border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>মোট ব্র্যান্ড: <strong className="text-white font-mono">{partnerBrands.length}</strong> টি</span>
          </div>

          <div className="divide-y divide-slate-800">
            {partnerBrands.map((b) => (
              <div key={b.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shrink-0">
                    <img src={b.logo} alt={b.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{b.name}</h4>
                    <span className="text-xs text-rose-400">{b.category || 'জনপ্রিয় ব্র্যান্ড'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditClick(b)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.name)}
                    className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/60 transition-colors cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {partnerBrands.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs">
                কোনো ব্র্যান্ড এখনও যুক্ত করা হয়নি। "নতুন ব্র্যান্ড যোগ করুন" বাটনে ক্লিক করুন।
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
