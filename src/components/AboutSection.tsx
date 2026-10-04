import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  CheckCircle,
  TrendingUp,
  Globe,
  Target,
  Palette,
  Code,
  Share2,
  ShieldCheck,
  Zap,
  MessageSquare
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings, openDirectWhatsApp } = useApp();

  const servicesList = [
    { title: 'ডিজিটাল মার্কেটিং ও গ্রোথ', desc: 'মাল্টি-চ্যানেল স্ট্র্যাটেজি যা সাধারণ ভিজিটরকে স্থায়ী ক্রেতায় রূপান্তর করে।', icon: TrendingUp },
    { title: 'ফেসবুক পেজ ও গ্রুপ গ্রোথ', desc: 'অরিজিনাল ফলোয়ার বৃদ্ধি, ভাইরাল কনটেন্ট ব্লুপ্রিন্ট ও হাই এনগেজমেন্ট।', icon: Zap },
    { title: 'হাই-কনভার্টিং মেটা অ্যাডস', desc: 'লেজার টার্গেটেড পিক্সেল ট্র্যাকিং, রি-টার্গেটিং ফানেল ও সর্বোচ্চ ROAS অপ্টিমাইজেশন।', icon: Target },
    { title: 'গুগল সার্চ ও পিপিসি অ্যাডস', desc: 'হাই-ইনটেন্ট সার্চ কিওয়ার্ড ক্যাম্পেইন ও পারফরম্যান্স ম্যাক্স অ্যাডস।', icon: Globe },
    { title: 'রেডি ই-কমার্স ওয়েবসাইট', desc: 'বিকাশ, নগদ ও সিওডি চেকআউট সহ স্বয়ংক্রিয় অনলাইন স্টোর প্ল্যাটফর্ম।', icon: Code },
    { title: 'কাস্টম ওয়েবসাইট ও সফটওয়্যার সল্যুশন', desc: 'আপনার নির্দিষ্ট ব্যবসার প্রয়োজনীয়তা অনুযায়ী তৈরি বিশেষায়িত ওয়েবসাইট ও সিস্টেম।', icon: ShieldCheck },
    { title: 'ব্র্যান্ডিং ও ক্রিয়েটিভ ডিজাইন', desc: 'লোগো ডিজাইন, সোশ্যাল মিডিয়া ব্যানার ও প্রিমিয়াম ভিজ্যুয়াল ব্র্যান্ডিং।', icon: Palette },
    { title: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট', desc: 'নিয়মিত কনটেন্ট তৈরি, ক্যাপশন কপিরাইটিং ও সক্রিয় অডিয়েন্স কমিউনিকেশন।', icon: Share2 }
  ];

  return (
    <section id="about-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>আমাদের পরিচয়</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {settings.aboutTitle || 'সফল ব্যবসার নির্ভরযোগ্য ডিজিটাল পার্টনার'}
            </h2>

            <div className="text-base text-slate-600 leading-relaxed space-y-4">
              <p>
                {settings.aboutText ||
                  'DEGITAL WB AGENCY বাংলাদেশের শীর্ষস্থানীয় ফুল-স্ট্যাক ডিজিটাল সল্যুশন এজেন্সি। আমরা তৈরি করি হাই-কনভার্টিং রেডি ই-কমার্স ও করপোরেট ওয়েবসাইট, পরিচালনা করি টার্গেটেড ফেসবুক ও গুগল অ্যাডস ক্যাম্পেইন, এবং ব্র্যান্ডকে নিয়ে যাই অনন্য উচ্চতায়।'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ওয়ান-স্টপ ডিজিটাল সেবা</h4>
                  <p className="text-xs text-slate-500">ডিজাইন, ডেভেলপমেন্ট, ফেসবুক অ্যাডস এবং সেলস গ্রোথ সব এক ছাদের নিচে।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ডিরেক্ট হোয়াটসঅ্যাপ অর্ডার সুবিধা</h4>
                  <p className="text-xs text-slate-500">জটিল ফরমালিটি ছাড়া সরাসরি হোয়াটসঅ্যাপে যোগাযোগ ও তাৎক্ষণিক সাপোর্ট।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">গ্যারান্টিযুক্ত দ্রুত ডেলিভারি</h4>
                  <p className="text-xs text-slate-500">অন-টাইম প্রতিশ্রুতি রক্ষা করে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সাইট লাইভ।</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openDirectWhatsApp('Hello DEGITAL WB AGENCY, I want to discuss a project with you.')}
                className="px-6 py-3 rounded-xl btn-primary-coral font-bold text-sm shadow-md cursor-pointer flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>হোয়াটসঅ্যাপে আমাদের সাথে কথা বলুন</span>
              </button>
            </div>
          </div>

          {/* Right Column: Capabilities Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {servicesList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="ref-card p-5 space-y-2 hover:border-rose-200 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
