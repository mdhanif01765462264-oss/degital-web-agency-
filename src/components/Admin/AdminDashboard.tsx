import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Package,
  FolderTree,
  CheckCircle,
  FileEdit,
  MessageSquare,
  PlusCircle,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye,
  Tag,
  Building2,
  MessageSquareQuote,
  HelpCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    services,
    categories,
    pricingPlans,
    partnerBrands,
    testimonials,
    faqs,
    leads,
    settings
  } = useApp();

  const totalServices = services.length;
  const totalCategories = categories.length;
  const publishedServices = services.filter((s) => s.status === 'published').length;
  const draftServices = services.filter((s) => s.status === 'draft').length;
  const totalOrdersTracked = services.reduce((acc, s) => acc + (s.ordersCount || 0), 0);
  const totalLeads = leads.length;

  const statCards = [
    {
      label: 'Total Services',
      value: totalServices,
      sub: `${publishedServices} Published · ${draftServices} Draft`,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      action: () => onNavigate('services-all')
    },
    {
      label: 'Service Categories',
      value: totalCategories,
      sub: 'Dynamic Category System',
      icon: FolderTree,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      action: () => onNavigate('categories-all')
    },
    {
      label: 'Pricing Packages',
      value: pricingPlans.length,
      sub: 'Starter, Plus & Enterprise',
      icon: Tag,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      action: () => onNavigate('pricing')
    },
    {
      label: 'Partner Brands',
      value: partnerBrands.length,
      sub: 'Client Trust Logos',
      icon: Building2,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      action: () => onNavigate('brands')
    },
    {
      label: 'WhatsApp Orders Tracked',
      value: totalOrdersTracked || totalLeads,
      sub: `Routing to: ${settings.whatsappNumber}`,
      icon: MessageSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20 border-emerald-500/40',
      action: () => onNavigate('orders')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{settings.brandName || 'DEGITAL WB AGENCY'} Overview</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time catalog metrics, active WhatsApp ordering channels, and complete website content controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('services-add')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Service</span>
          </button>

          <button
            onClick={() => onNavigate('categories-add')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Matrix */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          All Editable Sections & Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('settings')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 text-rose-400" />
            <span>Website & WhatsApp</span>
          </button>

          <button
            onClick={() => onNavigate('services-all')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Package className="w-5 h-5 text-blue-400" />
            <span>Services ({services.length})</span>
          </button>

          <button
            onClick={() => onNavigate('categories-all')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <FolderTree className="w-5 h-5 text-emerald-400" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => onNavigate('pricing')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Tag className="w-5 h-5 text-purple-400" />
            <span>Pricing Plans ({pricingPlans.length})</span>
          </button>

          <button
            onClick={() => onNavigate('brands')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Brands ({partnerBrands.length})</span>
          </button>

          <button
            onClick={() => onNavigate('testimonials')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquareQuote className="w-5 h-5 text-cyan-400" />
            <span>Reviews ({testimonials.length})</span>
          </button>

          <button
            onClick={() => onNavigate('faqs')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>FAQs ({faqs.length})</span>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>Orders ({leads.length})</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Status & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              WhatsApp Integration
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">Current Order Destination:</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {settings.whatsappNumber || '+8801823456789'}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            All "ORDER VIA WHATSAPP" buttons dynamically target this number with customized pre-filled message specifications.
          </p>

          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Change WhatsApp Number</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Recent WhatsApp Orders & Customer Inquiries
            </span>
            <button onClick={() => onNavigate('orders')} className="text-xs text-emerald-400 hover:underline">
              View All ({leads.length})
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No WhatsApp orders recorded yet. Customer clicks will automatically appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{lead.serviceTitle}</div>
                    <div className="text-xs text-slate-400">
                      {lead.customerName || 'WhatsApp Customer'} · <strong className="text-emerald-400">{lead.price}</strong>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
