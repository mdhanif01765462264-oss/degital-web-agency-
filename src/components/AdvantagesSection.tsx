import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Code, MessageSquare, Zap, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdvantagesSection: React.FC = () => {
  const { settings } = useApp();

  const cards = [
    {
      icon: Code,
      title: 'সম্পূর্ণ রেডি সোর্স কোড ও সেটআপ',
      desc: 'কোনো হিডেন চার্জ ছাড়া সম্পূর্ণ রেডি ওয়েবসাইট ও সিস্টেম। সরাসরি আপনার নিজস্ব হোস্টিং ও ডোমেইনে ফুল কন্ট্রোল।'
    },
    {
      icon: MessageSquare,
      title: 'রিয়েল-টাইম হোয়াটসঅ্যাপ অর্ডার',
      desc: 'কাস্টমারদের জন্য ওয়ান-ক্লিক হোয়াটসঅ্যাপ চেকআউট, যেখানে স্বয়ংক্রিয়ভাবে প্রডাক্ট বা সার্ভিসের বিবরণসহ মেসেজ চলে যায়।'
    },
    {
      icon: Zap,
      title: 'হাই-কনভার্টিং ও মোবাইল ফার্স্ট ডিজাইন',
      desc: 'স্মার্টফোন, ট্যাব ও ল্যাপটপে চোখের পলকে লোড হওয়া আধুনিক ক্লিপ ও পরিচ্ছন্ন ইন্টারফেস যা সেলস বাড়াতে সহায়ক।'
    },
    {
      icon: ShieldCheck,
      title: '২৪/৭ ডেডিকেটেড এক্সপার্ট সাপোর্ট',
      desc: 'টেকনিক্যাল জটিলতা নিয়ে আর কোনো চিন্তা নেই। আমাদের বিশেষজ্ঞ টিম হোয়াটসঅ্যাপ ও ফোনে সার্বক্ষণিক সহায়তা দেয়।'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের বিশেষত্ব</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            দীর্ঘমেয়াদী সফল ব্যবসার নির্ভরযোগ্য সঙ্গী
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            ব্যবসায়ীদের প্রবৃদ্ধি, সেলস বৃদ্ধি এবং কাস্টমারদের আস্থা নিশ্চিত করতে {settings.brandName || 'DEGITAL WB AGENCY'} সম্পূর্ণ প্রস্তুত।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="ref-card p-6 flex flex-col justify-between space-y-4 hover:border-rose-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
