import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  FileEdit,
  Upload,
  X,
  ExternalLink,
  Plus,
  Eye,
  Filter,
  Search,
  Sparkles,
  Clock,
  Layers,
  Image as ImageIcon,
  FolderTree
} from 'lucide-react';
import type { Service } from '../../types/index.ts';
import { AdminCategories } from './AdminCategories.tsx';

interface AdminServicesProps {
  initialMode?: 'list' | 'add';
  filterStatus?: 'all' | 'published' | 'draft';
}

export const AdminServices: React.FC<AdminServicesProps> = ({
  initialMode = 'list',
  filterStatus = 'all'
}) => {
  const { services, categories, refreshServices, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'services' | 'categories'>('services');
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>(initialMode);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Filters for services list table
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>(filterStatus);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [demoUrl, setDemoUrl] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default category when categories change
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const resetForm = () => {
    setTitle('');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setShortDescription('');
    setFullDescription('');
    setImages([]);
    setDemoUrl('');
    setDeliveryTime('');
    setFeatures(['']);
    setStatus('published');
    setEditingService(null);
    setMode('list');
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setCategoryId(service.categoryId);
    setPrice(service.price);
    setShortDescription(service.shortDescription || '');
    setFullDescription(service.fullDescription || '');
    setImages(service.images || []);
    setDemoUrl(service.demoUrl || '');
    setDeliveryTime(service.deliveryTime || '');
    setFeatures(service.features && service.features.length > 0 ? service.features : ['']);
    setStatus(service.status);
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, serviceTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${serviceTitle}"?`)) {
      return;
    }
    try {
      await api.deleteService(id);
      showToast(`Service "${serviceTitle}" removed`, 'success');
      await refreshServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicateService(id);
      showToast('Service duplicated as draft', 'success');
      await refreshServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate service', 'error');
    }
  };

  const handleToggleStatus = async (service: Service) => {
    const nextStatus = service.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateService(service.id, { status: nextStatus });
      showToast(`Service marked as ${nextStatus}`, 'success');
      await refreshServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Up to 3 Image uploads handler
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadImage(base64);
        if (res.url) {
          setImages((prev) => {
            const next = [...prev];
            next[index] = res.url;
            return next.slice(0, 3);
          });
          showToast(`Image ${index + 1} uploaded`, 'success');
        }
      } catch (err) {
        showToast('Image upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, val: string) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId || !price.trim()) {
      showToast('Title, Category, and Price are required', 'error');
      return;
    }

    setIsSubmitting(true);
    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);

    const payload = {
      title,
      categoryId,
      price,
      shortDescription,
      fullDescription,
      images: images.filter(Boolean).slice(0, 3),
      demoUrl,
      deliveryTime,
      features: cleanFeatures,
      status
    };

    try {
      if (mode === 'edit' && editingService) {
        await api.updateService(editingService.id, payload);
        showToast(`Service "${title}" updated successfully`, 'success');
      } else {
        await api.createService(payload);
        showToast(`Service "${title}" published inside category`, 'success');
      }

      await refreshServices();
      resetForm();
    } catch (err: any) {
      showToast(err.message || 'Failed to save service', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Services for Table
  const filteredServices = services.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && s.categoryId !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      return s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Subtab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'services'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>সার্ভিস ও রেডি সল্যুশন সমূহ (Services & Posts)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'categories'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>OUR SERVICES ক্যাটাগরি ম্যানেজমেন্ট (Category Manager)</span>
        </button>
      </div>

      {activeSubTab === 'categories' ? (
        <AdminCategories />
      ) : (
        <div className="space-y-8">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">সার্ভিস ও রেডি সল্যুশন সমূহ</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                বিভিন্ন ক্যাটাগরির অধীনে নতুন সার্ভিস ও প্যাকেজ পোস্ট যোগ, এডিট ও রিমুভ করুন।
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
                <span>নতুন সার্ভিস পোস্ট যোগ করুন (Add Service)</span>
              </button>
            ) : (
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                সার্ভিস তালিকায় ফিরে যান
              </button>
            )}
          </div>

      {/* FORM: Add / Edit Service */}
      {(mode === 'add' || mode === 'edit') && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700 bg-slate-900/90 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{mode === 'edit' ? 'Edit Service Post' : 'Add New Service / Sell Post'}</span>
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Title, Category, Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Professional E-commerce Website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Price (e.g. ৳5,500) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ৳5,500 or $99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Short Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Short Description (Visible on Service Cards & WhatsApp Message) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Ready-to-use modern e-commerce website with payment gateways and mobile responsive UI..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* Row 3: Full Service Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Service Details (Displayed on Service Detail Page)
              </label>
              <textarea
                rows={5}
                placeholder="Add complete service specifications, process, terms, and what the customer receives..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-y"
              />
            </div>

            {/* CRITICAL: Up to 3 Image Uploads */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Service Images (Up to 3 Images per Post - Upload or URL)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((slotIdx) => {
                  const imgUrl = images[slotIdx];

                  return (
                    <div
                      key={slotIdx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                        <span>Image Slot #{slotIdx + 1} {slotIdx === 0 ? '(Cover Image)' : ''}</span>
                        {imgUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(slotIdx)}
                            className="text-rose-400 hover:text-rose-300"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {imgUrl ? (
                        <div className="relative h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                          <img
                            src={imgUrl}
                            alt={`Preview ${slotIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-32 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 space-y-1">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-[11px]">No image selected</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Image URL..."
                          value={imgUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setImages((prev) => {
                              const next = [...prev];
                              next[slotIdx] = val;
                              return next;
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
                        />

                        <label className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{imgUrl ? 'Replace Image' : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(slotIdx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 4: Optional Demo URL & Delivery Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Live Preview / Demo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://preview-demo.example.com"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Delivery Time (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24-48 Hours or 3-5 Days"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Row 5: Features Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Included Features (Bullet Checklist)
                </label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature Bullet</span>
                </button>
              </div>

              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Feature #${idx + 1}, e.g. bKash/Nagad Payment Ready`}
                      value={feat}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
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

            {/* Row 6: Status Toggle (Publish vs Draft) */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-slate-300">Publication Status:</span>
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    status === 'published'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Publish Immediately
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    status === 'draft'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Save as Draft
                </button>
              </div>
            </div>

            {/* Form Submit & Cancel Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black shadow-lg shadow-emerald-950 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? 'Saving Service...'
                  : mode === 'edit'
                  ? 'Update Service Post'
                  : 'PUBLISH SERVICE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER BAR & ALL SERVICES TABLE */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({services.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'published' ? 'bg-emerald-950 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Published ({services.filter((s) => s.status === 'published').length})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'draft' ? 'bg-amber-950 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Draft ({services.filter((s) => s.status === 'draft').length})
              </button>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Images</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No services found matching filters.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const cat = categories.find((c) => c.id === service.categoryId);
                  const firstImg =
                    service.images && service.images[0]
                      ? service.images[0]
                      : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80';

                  return (
                    <tr key={service.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={firstImg}
                            alt={service.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-white truncate text-sm">
                              {service.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {service.shortDescription}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {cat ? cat.name : service.categoryId}
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                        {service.price}
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {service.images?.length || 0} / 3 images
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {service.deliveryTime || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(service)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            service.status === 'published'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {service.status}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleDuplicate(service.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Duplicate Service"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleEditClick(service)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(service.id, service.title)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-400 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
