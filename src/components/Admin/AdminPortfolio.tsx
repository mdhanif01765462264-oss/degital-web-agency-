import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import { PlusCircle, Edit2, Trash2, ExternalLink, Upload, X, FolderGit2, Check, ArrowLeft } from 'lucide-react';
import type { PortfolioProject } from '../../types/index.ts';

export const AdminPortfolio: React.FC = () => {
  const { portfolio, refreshPortfolio, showToast, settings } = useApp();

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('রেডি ওয়েবসাইট');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [techStackStr, setTechStackStr] = useState('React, Tailwind, WhatsApp Order');
  const [liveUrl, setLiveUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('রেডি ওয়েবসাইট');
    setImage('');
    setDescription('');
    setTechStackStr('React, Tailwind, WhatsApp Order');
    setLiveUrl('');
    setEditingProject(null);
    setMode('list');
  };

  const handleEditClick = (p: PortfolioProject) => {
    setEditingProject(p);
    setTitle(p.title);
    setCategory(p.category);
    setImage(p.image);
    setDescription(p.description);
    setTechStackStr(p.techStack?.join(', ') || '');
    setLiveUrl(p.liveUrl || '');
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি "${name}" প্রজেক্টটি ডিলিট করতে চান?`)) return;
    try {
      await api.deletePortfolio(id);
      showToast('প্রজেক্ট ডিলিট করা হয়েছে', 'success');
      await refreshPortfolio();
    } catch (err: any) {
      showToast(err.message || 'ডিলিট ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string);
        if (res.url) {
          setImage(res.url);
          showToast('ইমেজ আপলোড হয়েছে', 'success');
        }
      } catch {
        showToast('আপলোড ব্যর্থ হয়েছে', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Main Title (মূল নাম) আবশ্যক', 'error');
      return;
    }
    if (!image.trim()) {
      showToast('Image Link বা ছবি আবশ্যক', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Description (বিবরণ) আবশ্যক', 'error');
      return;
    }

    setIsSubmitting(true);
    const techStack = techStackStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      category: category.trim() || 'রেডি ওয়েবসাইট',
      image: image.trim(),
      description: description.trim(),
      techStack: techStack.length > 0 ? techStack : ['Website', 'Tailwind', 'WhatsApp'],
      liveUrl: liveUrl.trim()
    };

    try {
      if (mode === 'edit' && editingProject) {
        await api.updatePortfolio(editingProject.id, payload);
        showToast(`"${title}" আপডেট সফল হয়েছে!`, 'success');
      } else {
        await api.createPortfolio(payload);
        showToast(`নতুন ওয়েবসাইট "${title}" যুক্ত হয়েছে!`, 'success');
      }
      await refreshPortfolio();
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
            {settings.portfolioSectionTitle || 'DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ওয়েবসাইটের এই সেকশনে পরিচালিত ক্লায়েন্ট ওয়েবসাইট যোগ, এডিট ও রিমুভ করুন।
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={() => { resetForm(); setMode('add'); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন ওয়েবসাইট যোগ করুন (Add Website)</span>
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
              <FolderGit2 className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'ওয়েবসাইট তথ্য এডিট করুন' : 'নতুন ক্লায়েন্ট ওয়েবসাইট যোগ করুন'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Main Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Main Title (মূল নাম / টাইটেল) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: eMart Skincare - বিউটি ও স্কিনকেয়ার ওয়েবসাইট"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            {/* 2. Image Link & Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Image Link বা ছবি (Img Pic বা লিংক) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... অথবা নিচে আপলোড করুন"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                />
                <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>ফাইল আপলোড</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {image && (
                <div className="mt-3 w-48 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* 3. Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Description (বিবরণ) *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ওয়েবসাইট সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            {/* 4. Website Link */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Website Link (লাইভ ওয়েবসাইট লিংক)
              </label>
              <input
                type="text"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com বা আপনার ক্লায়েন্ট সাইটের লিংক"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            {/* 5. Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Category (ক্যাটাগরি)
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="যেমন: ফ্যাশন ওয়েবসাইট, স্কিনকেয়ার ওয়েবসাইট..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  ট্যাগ / টেকনোলজি (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  placeholder="React, Tailwind, WhatsApp Order"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
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
                <span>{isSubmitting ? 'সাবমিট হচ্ছে...' : mode === 'edit' ? 'আপডেট সম্পন্ন করুন' : 'সাবমিট করুন (Add Website)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Table / Cards View */}
      {mode === 'list' && (
        <div className="rounded-3xl glass-panel border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>মোট ওয়েবসাইট: <strong className="text-white font-mono">{portfolio.length}</strong> টি</span>
          </div>

          <div className="divide-y divide-slate-800">
            {portfolio.map((p) => (
              <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{p.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-rose-400 font-semibold shrink-0">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-lg mt-0.5">{p.description}</p>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline mt-1"
                      >
                        <span>{p.liveUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Edit Website"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/60 transition-colors cursor-pointer"
                    title="Delete Website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {portfolio.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs">
                কোনো ওয়েবসাইট এখনও যুক্ত করা হয়নি। "নতুন ওয়েবসাইট যোগ করুন" বাটনে ক্লিক করুন।
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
