import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { api } from '../services/api.ts';

export const ContactSection: React.FC = () => {
  const { settings, openDirectWhatsApp, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceInterest: 'Ready Website',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('অনুগ্রহ করে আপনার নাম ও ফোন নম্বর দিন', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.recordLead({
        customerName: formData.name,
        customerPhone: formData.phone,
        serviceTitle: `ইনকোয়ারি: ${formData.serviceInterest}`,
        categoryName: 'Contact Inquiry',
        price: 'Custom Quote',
        message: formData.message || 'কাস্টমার কনট্যাক্ট ফর্মের মাধ্যমে যোগাযোগ করেছেন।',
        source: 'inquiry_form'
      });

      showToast('ধন্যবাদ! আপনার তথ্য নিয়ে হোয়াটসঅ্যাপে রিডাইরেক্ট হচ্ছে...', 'success');

      const whatsappMsg = `Hello ${settings.brandName},

আমার নাম: ${formData.name}
ফোন: ${formData.phone}
আগ্রহী সার্ভিস: ${formData.serviceInterest}
মেসেজ: ${formData.message || 'আমি আপনাদের সার্ভিস সম্পর্কে বিস্তারিত জানতে আগ্রহী।'}

দয়া করে যোগাযোগ করুন।`;

      openDirectWhatsApp(whatsappMsg);

      setFormData({
        name: '',
        phone: '',
        serviceInterest: 'Ready Website',
        message: ''
      });
    } catch (err: any) {
      showToast(err.message || 'ফর্ম জমা দেওয়া যায়নি', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সরাসরি যোগাযোগ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            আমাদের টিমের সাথে কথা বলুন
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            যেকোনো কাস্টম প্রজেক্ট, ফেসবুক অ্যাডস বা রেডি ওয়েবসাইট নিয়ে সরাসরি হোয়াটসঅ্যাপে বা ফর্মে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-rose-600 text-white space-y-4 shadow-lg shadow-rose-600/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">ইনস্ট্যান্ট হোয়াটসঅ্যাপ চ্যাট</h3>
                  <p className="text-xs text-rose-100">দ্রুততম রেসপন্স (৫ মিনিটের মধ্যে)</p>
                </div>
              </div>

              <div className="text-xl font-black font-mono tracking-wide">
                {settings.whatsappNumber || '+8801823456789'}
              </div>

              <button
                onClick={() => openDirectWhatsApp()}
                className="w-full py-3 px-4 rounded-xl bg-white text-rose-600 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors cursor-pointer shadow"
              >
                <MessageSquare className="w-4 h-4 fill-rose-600" />
                <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
              </button>
            </div>

            <div className="ref-card p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">ইমেইল ঠিকানা</div>
                  <a href={`mailto:${settings.email}`} className="text-sm font-bold text-slate-800 hover:text-rose-600 transition-colors">
                    {settings.email || 'contact@degitalwbagency.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <Phone className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">হটলাইন নম্বর</div>
                  <a href={`tel:${settings.phone}`} className="text-sm font-bold text-slate-800 hover:text-rose-600 transition-colors font-mono">
                    {settings.phone || '+880 1823-456789'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">অফিস লোকেশন</div>
                  <p className="text-sm text-slate-700">
                    {settings.address || 'House 203, Mirpur DOHS, Dhaka'}
                  </p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="ref-card p-6 space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                সোশ্যাল মিডিয়ায় ফলো করুন
              </div>
              <div className="flex items-center gap-3">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Form */}
          <div className="lg:col-span-7">
            <div className="ref-card p-8 sm:p-10 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">ইনকোয়ারি মেসেজ পাঠান</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  নিচের ফর্মটি পূরণ করলে বিস্তারিত প্রজেক্ট কোটেশন সরাসরি হোয়াটসঅ্যাপে পেয়ে যাবেন।
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. তানভীর আহমেদ"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">হোয়াটসঅ্যাপ / ফোন নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 018XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">আগ্রহী সার্ভিস</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-rose-500 shadow-xs cursor-pointer"
                  >
                    <option value="Ready Website">Ready Website (রেডি ওয়েবসাইট)</option>
                    <option value="Facebook Growth">Facebook Growth (পেজ গ্রোথ)</option>
                    <option value="Custom Website">Custom Website (কাস্টম ওয়েবসাইট)</option>
                    <option value="Facebook Ads">Facebook Ads (মেটা অ্যাডস)</option>
                    <option value="Google Ads">Google Ads (গুগল অ্যাডস)</option>
                    <option value="Social Media Management">Social Media Management</option>
                    <option value="Branding & Design">Branding & Logo Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">প্রজেক্ট সম্পর্কে বিবরণ</label>
                  <textarea
                    rows={4}
                    placeholder="আপনার বিজনেস টাইপ, বাজেট অথবা কোনো নির্দিষ্ট রিকোয়ারমেন্ট থাকলে জানান..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 shadow-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm btn-primary-coral flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'প্রসেসিং...' : 'হোয়াটসঅ্যাপে মেসেজ পাঠান'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
