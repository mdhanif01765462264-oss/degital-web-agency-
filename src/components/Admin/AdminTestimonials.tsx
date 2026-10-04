import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import { PlusCircle, Edit2, Trash2, Star, Upload, X, MessageSquareQuote } from 'lucide-react';
import type { Testimonial } from '../../types/index.ts';

export const AdminTestimonials: React.FC = () => {
  const { testimonials, refreshTestimonials, showToast } = useApp();
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [avatar, setAvatar] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setRole('');
    setCompany('');
    setAvatar('');
    setContent('');
    setRating(5);
    setEditingItem(null);
    setMode('list');
  };

  const handleEditClick = (t: Testimonial) => {
    setEditingItem(t);
    setName(t.name);
    setRole(t.role);
    setCompany(t.company);
    setAvatar(t.avatar);
    setContent(t.content);
    setRating(t.rating || 5);
    setMode('edit');
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!window.confirm(`Delete review by "${clientName}"?`)) return;
    try {
      await api.deleteTestimonial(id);
      showToast('Testimonial removed', 'success');
      await refreshTestimonials();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string);
        if (res.url) {
          setAvatar(res.url);
          showToast('Avatar uploaded', 'success');
        }
      } catch {
        showToast('Upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      showToast('Name and testimonial content are required', 'error');
      return;
    }
    setIsSubmitting(true);
    const payload = {
      name,
      role: role || 'Client',
      company: company || 'Business',
      avatar: avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      content,
      rating
    };

    try {
      if (mode === 'edit' && editingItem) {
        await api.updateTestimonial(editingItem.id, payload);
        showToast('Review updated', 'success');
      } else {
        await api.createTestimonial(payload);
        showToast('New review added', 'success');
      }
      await refreshTestimonials();
      resetForm();
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Customer Reviews & Testimonials</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage client success stories and 5-star ratings displayed in the testimonial section.
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={() => { resetForm(); setMode('add'); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        ) : (
          <button onClick={resetForm} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700">
            Back to Reviews
          </button>
        )}
      </div>

      {(mode === 'add' || mode === 'edit') && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700 bg-slate-900/90 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'Edit Testimonial' : 'Add Testimonial'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sumon Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Elegance Fashion"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Review Feedback *</label>
              <textarea
                rows={3}
                required
                placeholder="What did the client say about your service and results..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Avatar (URL or Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-700">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Star Rating (1 - 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Review' : 'Save Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic line-clamp-3">"{t.content}"</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.company}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEditClick(t)} className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white">
                  <Edit2 className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(t.id, t.name)} className="p-1 rounded bg-rose-950 text-rose-400 hover:bg-rose-900">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
