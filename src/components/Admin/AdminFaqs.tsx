import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import { PlusCircle, Edit2, Trash2, HelpCircle, X } from 'lucide-react';
import type { FaqItem } from '../../types/index.ts';

export const AdminFaqs: React.FC = () => {
  const { faqs, refreshFaqs, showToast } = useApp();
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState(faqs.length + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setOrder(faqs.length + 1);
    setEditingFaq(null);
    setMode('list');
  };

  const handleEditClick = (f: FaqItem) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setOrder(f.order || 1);
    setMode('edit');
  };

  const handleDelete = async (id: string, q: string) => {
    if (!window.confirm(`Delete question "${q}"?`)) return;
    try {
      await api.deleteFaq(id);
      showToast('FAQ deleted', 'success');
      await refreshFaqs();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete FAQ', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }
    setIsSubmitting(true);
    const payload = { question, answer, order };

    try {
      if (mode === 'edit' && editingFaq) {
        await api.updateFaq(editingFaq.id, payload);
        showToast('FAQ updated', 'success');
      } else {
        await api.createFaq(payload);
        showToast('FAQ added', 'success');
      }
      await refreshFaqs();
      resetForm();
    } catch (err: any) {
      showToast(err.message || 'Failed to save FAQ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Frequently Asked Questions (FAQ)</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage the accordion questions and answers displayed in the FAQ section.
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={() => { resetForm(); setMode('add'); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        ) : (
          <button onClick={resetForm} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700">
            Back to FAQs
          </button>
        )}
      </div>

      {(mode === 'add' || mode === 'edit') && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700 bg-slate-900/90 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'Edit FAQ' : 'Add FAQ'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Question *</label>
              <input
                type="text"
                required
                placeholder="e.g. DEGITAL WB AGENCY কী এবং কীভাবে কাজ করে?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Answer *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide a clear, detailed answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Display Order</label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                className="w-32 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update FAQ' : 'Save FAQ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">#{f.order} {f.question}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleEditClick(f)} className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(f.id, f.question)} className="p-1.5 rounded bg-rose-950 text-rose-400 hover:bg-rose-900">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
