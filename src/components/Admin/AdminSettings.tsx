import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Settings,
  MessageSquare,
  Sparkles,
  Save,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  BellRing,
  ExternalLink
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [formData, setFormData] = useState({
    brandName: settings.brandName || 'DEGITAL WEB AGENCY',
    tagline: settings.tagline || 'আপনার অনলাইন বিজনেসের নির্ভরযোগ্য ডিজিটাল পার্টনার',
    announcementBar: settings.announcementBar || 'DEGITAL WEB AGENCY — প্রফেশনাল ডিজিটাল মার্কেটিং ও হাই-কনভার্টিং ওয়েবসাইট সল্যুশন',
    showAnnouncementBar: settings.showAnnouncementBar !== false,
    portfolioSectionTitle: settings.portfolioSectionTitle || 'DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা',
    brandsSectionTitle: settings.brandsSectionTitle || 'Fastmart ও DEGITAL WB AGENCY-র মাধ্যমে পরিচালিত জনপ্রিয় ব্র্যান্ডসমূহ',
    heroBadge: settings.heroBadge || 'আধুনিক ও সহজ ডিজিটাল সমাধান',
    heroTitle: settings.heroTitle || 'ডিজিটাল বিজনেসের সহজ সমাধান, গ্রোথ রাখুন নিজের হাতে',
    heroSubtitle: settings.heroSubtitle || 'DEGITAL WEB AGENCY-র সাথে আপনার অনলাইন সেলস বৃদ্ধি করুন, পরিচালনা করুন সহজে।',
    heroImage: settings.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    heroPrimaryBtnText: settings.heroPrimaryBtnText || 'শুরু করুন →',
    heroSecondaryBtnText: settings.heroSecondaryBtnText || 'লাইভ ডেমো দেখুন',
    heroRatingText: settings.heroRatingText || '৫০০+ সফল উদ্যোক্তা ও ব্যবসায়ীর প্রথম পছন্দ',
    whatsappNumber: settings.whatsappNumber || '+8801750721835',
    email: settings.email || 'contact@degitalwbagency.com',
    phone: settings.phone || '+880 1750-721835',
    address: settings.address || 'House 203, Mirpur DOHS, Dhaka',
    facebookUrl: settings.facebookUrl || '',
    instagramUrl: settings.instagramUrl || '',
    linkedinUrl: settings.linkedinUrl || '',
    youtubeUrl: settings.youtubeUrl || '',
    aboutTitle: settings.aboutTitle || '',
    aboutText: settings.aboutText || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.uploadImage(reader.result as string);
        if (res.url) {
          setFormData((prev) => ({ ...prev, heroImage: res.url }));
          showToast('Hero image uploaded successfully', 'success');
        }
      } catch {
        showToast('Image upload failed', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.whatsappNumber.trim()) {
      showToast('WhatsApp number is required', 'error');
      return;
    }

    setIsSaving(true);
    const success = await updateSettings(formData);
    setIsSaving(false);
    if (success) {
      showToast('সব সেটিংস সফলভাবে সেভ হয়েছে এবং ওয়েবসাইটে লাইভ হয়েছে!', 'success');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Website & WhatsApp Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          টপ নোটিশ বার, হোয়াটসঅ্যাপ নাম্বার, ব্র্যান্ড ইনফো ও সেকশন টাইটেল পরিচালনা করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. TOP NOTICE / ANNOUNCEMENT BAR (WITH ON/OFF TOGGLE) */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">টপ নোটিশ বার সেটিংস (Top Notice Bar)</h3>
                <p className="text-xs text-slate-400">
                  ওয়েবসাইটের একদম উপরে নোটিশ বারটি চালু (ON) বা বন্ধ (OFF) করুন
                </p>
              </div>
            </div>

            {/* ON / OFF Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold ${formData.showAnnouncementBar ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.showAnnouncementBar ? 'অবস্থা: চালু (ON)' : 'অবস্থা: বন্ধ (OFF)'}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, showAnnouncementBar: !prev.showAnnouncementBar }))}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.showAnnouncementBar ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.showAnnouncementBar ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                নোটিশ বার টেক্সট (Notice Bar Text)
              </label>
              <input
                type="text"
                value={formData.announcementBar}
                onChange={(e) => setFormData({ ...formData, announcementBar: e.target.value })}
                placeholder="DEGITAL WEB AGENCY — প্রফেশনাল ডিজিটাল মার্কেটিং ও হাই-কনভার্টিং ওয়েবসাইট সল্যুশন"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Live Preview Box */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                লাইভ প্রিভিউ (যখন চালু থাকবে):
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{formData.announcementBar || 'নোটিশ টেক্সট'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                  <span>হোয়াটসঅ্যাপ: {formData.whatsappNumber}</span>
                  <span className="text-emerald-400 font-bold">ইনস্ট্যান্ট চ্যাট →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRIMARY WHATSAPP NUMBER */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5 fill-emerald-400/20" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">অফিশিয়াল হোয়াটসঅ্যাপ নাম্বার (Primary WhatsApp Order Number)</h3>
              <p className="text-xs text-slate-400">
                ওয়েবসাইটের সকল "ORDER VIA WHATSAPP" বাটন এবং হেডার/ফুটারে সরাসরি এই নাম্বারে চ্যাট ওপেন হবে।
              </p>
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
              হোয়াটসঅ্যাপ নাম্বার (WhatsApp Number) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. +8801750721835"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/50 text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <p className="text-[11px] text-slate-400">
              ডিফল্ট নাম্বার: <span className="font-mono text-emerald-400 font-bold">+8801750721835</span>
            </p>
          </div>
        </div>

        {/* 3. SECTION TITLES CUSTOMIZATION */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>সেকশন শিরোনাম সেটিংস (Section Titles)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ক্লায়েন্ট ওয়েবসাইট সেকশন শিরোনাম
              </label>
              <input
                type="text"
                value={formData.portfolioSectionTitle}
                onChange={(e) => setFormData({ ...formData, portfolioSectionTitle: e.target.value })}
                placeholder="DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                ডিফল্ট: DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                জনপ্রিয় ব্র্যান্ড সেকশন শিরোনাম
              </label>
              <input
                type="text"
                value={formData.brandsSectionTitle}
                onChange={(e) => setFormData({ ...formData, brandsSectionTitle: e.target.value })}
                placeholder="Fastmart ও DEGITAL WB AGENCY-র মাধ্যমে পরিচালিত জনপ্রিয় ব্র্যান্ডসমূহ"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                ডিফল্ট: Fastmart ও DEGITAL WB AGENCY-র মাধ্যমে পরিচালিত জনপ্রিয় ব্র্যান্ডসমূহ
              </span>
            </div>
          </div>
        </div>

        {/* 4. BRAND & HEADER BAR */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white">ব্র্যান্ড নাম ও হেডার ইনফো (Brand Info)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ব্র্যান্ডের নাম (Brand Name) *
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ট্যাগলাইন (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* 5. HERO SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white">হিরো ব্যানার সেকশন (Hero Banner Section)</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">হিরো ব্যাজ (Hero Pill Badge)</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">রেটিং টেক্সট (Rating Text)</label>
                <input
                  type="text"
                  value={formData.heroRatingText}
                  onChange={(e) => setFormData({ ...formData, heroRatingText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">প্রধান শিরোনাম (Hero Title) *</label>
              <input
                type="text"
                required
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">উপ-শিরোনাম (Hero Subtitle)</label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">হিরো ব্যানার ইমেজ লিংক বা আপলোড</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
                <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>আপলোড</span>
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                </label>
              </div>
              {formData.heroImage && (
                <div className="mt-2 w-40 h-24 rounded-lg overflow-hidden border border-slate-800">
                  <img src={formData.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. CONTACT DETAILS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white">যোগাযোগের তথ্য (Contact Information)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ইমেইল (Email)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ফোন নাম্বার (Phone)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ঠিকানা (Address)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সেভ করুন (Save Settings)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
