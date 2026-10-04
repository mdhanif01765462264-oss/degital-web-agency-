import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  FolderTree,
  ArrowUp,
  ArrowDown,
  Upload,
  Image,
  Sparkles
} from 'lucide-react';
import { availableIconNames, getCategoryIcon } from '../../utils/iconHelper.tsx';
import type { Category } from '../../types/index.ts';

interface AdminCategoriesProps {
  initialMode?: 'list' | 'add';
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ initialMode = 'list' }) => {
  const { categories, refreshCategories, refreshServices, showToast } = useApp();

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>(initialMode);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Layout',
    image: '',
    order: categories.length + 1,
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Layout',
      image: '',
      order: categories.length + 1,
      isActive: true
    });
    setEditingCategory(null);
    setMode('list');
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'Layout',
      image: category.image || '',
      order: category.order || 1,
      isActive: category.isActive !== false
    });
    setMode('edit');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Services inside this category will be reassigned.`)) {
      return;
    }
    try {
      await api.deleteCategory(id);
      showToast(`Category "${name}" deleted`, 'success');
      await refreshCategories();
      await refreshServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await api.updateCategory(category.id, { isActive: !category.isActive });
      showToast(`Category "${category.name}" ${!category.isActive ? 'enabled' : 'disabled'}`, 'success');
      await refreshCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'edit' && editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        showToast('Category updated successfully', 'success');
      } else {
        await api.createCategory(formData);
        showToast('New category created successfully', 'success');
      }

      await refreshCategories();
      await refreshServices();
      resetForm();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadImage(base64);
        if (res.url) {
          setFormData((prev) => ({ ...prev, image: res.url }));
          showToast('Image uploaded', 'success');
        }
      } catch (err) {
        showToast('Failed to upload image', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Dynamic Categories Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, reorder, and configure service categories. Services dynamically bind to these categories.
          </p>
        </div>

        {mode === 'list' ? (
          <button
            onClick={() => {
              resetForm();
              setMode('add');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md shadow-emerald-950 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        ) : (
          <button
            onClick={() => setMode('list')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Back to All Categories
          </button>
        )}
      </div>

      {/* Form: Add or Edit Category */}
      {(mode === 'add' || mode === 'edit') && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700 bg-slate-900/90 shadow-xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'Edit Category' : 'Create New Category'}</span>
            </h3>
            <button
              onClick={() => setMode('list')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ready Website or Facebook Growth"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Order Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category Description
              </label>
              <textarea
                rows={2}
                placeholder="Short summary displayed on category cards and detail headers..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category Icon
              </label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto">
                {availableIconNames.map((iconName) => {
                  const isSelected = formData.icon === iconName;
                  return (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-2.5 rounded-lg flex items-center gap-2 text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {getCategoryIcon(iconName, 'w-4 h-4')}
                      <span>{iconName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload / URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category Banner Image (Optional URL or File)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />

                <label className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.image && (
                <div className="mt-2 h-20 w-36 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="catActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <label htmlFor="catActive" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Enable Category on Public Website & Filters
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table / List */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories
                .sort((a, b) => a.order - b.order)
                .map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      #{cat.order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                        {getCategoryIcon(cat.icon, 'w-4 h-4')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white text-sm">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {cat.slug || cat.id}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          cat.isActive !== false
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {cat.isActive !== false ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-400 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
