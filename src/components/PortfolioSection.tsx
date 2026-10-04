import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ExternalLink, Sparkles, MessageSquare } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { portfolio, openDirectWhatsApp, settings } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(portfolio.map((p) => p.category)))];

  const filteredPortfolio = selectedTag === 'all'
    ? portfolio
    : portfolio.filter((p) => p.category === selectedTag);

  return (
    <section id="portfolio-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সফল ক্লায়েন্ট ওয়েবসাইট</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {settings.portfolioSectionTitle || 'DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা'}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            আমাদের প্ল্যাটফর্ম ও ডিজিটাল সল্যুশনের মাধ্যমে পরিচালিত সফল বিভিন্ন ই-কমার্স ও করপোরেট ওয়েবসাইট সমূহ
          </p>
        </div>

        {categories.length > 2 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all cursor-pointer ${
                  selectedTag === cat
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPortfolio.map((project) => (
            <div
              key={project.id}
              className="ref-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="text-rose-600">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Live Client Store</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {project.description}
                  </p>

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between gap-4 border-t border-slate-100 mt-4">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors"
                  >
                    <span>ওয়েবসাইট দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => openDirectWhatsApp(`Hello, I saw your project "${project.title}" on DEGITAL WB AGENCY and want to build a similar website.`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold btn-primary-coral flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>এমন সাইট তৈরি করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
