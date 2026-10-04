import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import { MessageSquare, CheckCircle, Clock, XCircle, Search, RefreshCw } from 'lucide-react';
import type { LeadOrder } from '../../types/index.ts';

export const AdminOrders: React.FC = () => {
  const { leads, refreshLeads, showToast, settings } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      await api.updateLeadStatus(leadId, status);
      showToast('Lead status updated', 'success');
      await refreshLeads();
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead status', 'error');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLeads();
    setIsRefreshing(false);
  };

  const openWhatsAppReply = (lead: LeadOrder) => {
    if (!lead.customerPhone) {
      showToast('No customer phone number recorded for this lead', 'error');
      return;
    }
    const cleanPhone = lead.customerPhone.replace(/[^0-9]/g, '');
    const replyText = `Hello ${lead.customerName || 'there'}, thank you for contacting ${settings.brandName} regarding "${lead.serviceTitle}". How can we assist you today?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyText)}`, '_blank');
  };

  const filteredLeads = leads.filter((lead) => {
    if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        lead.serviceTitle.toLowerCase().includes(q) ||
        lead.categoryName.toLowerCase().includes(q) ||
        (lead.customerName && lead.customerName.toLowerCase().includes(q)) ||
        (lead.customerPhone && lead.customerPhone.includes(q)) ||
        lead.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">WhatsApp Orders & Customer Leads</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track inquiries and orders initiated by visitors on WhatsApp or through contact inquiries.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'new', 'contacted', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st} ({st === 'all' ? leads.length : leads.filter((l) => l.status === st).length})
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date / Source</th>
                <th className="py-3 px-4">Service Requested</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Pre-filled Order Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No leads recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{lead.serviceTitle}</div>
                      <div className="text-[11px] text-emerald-400">{lead.categoryName}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                      {lead.price}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{lead.customerName || 'WhatsApp User'}</div>
                      {lead.customerPhone && (
                        <div className="text-slate-400 font-mono text-[11px]">{lead.customerPhone}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-300 line-clamp-2 leading-relaxed">
                        {lead.message}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded text-[11px] font-bold uppercase border cursor-pointer ${
                          lead.status === 'new'
                            ? 'bg-blue-950 text-blue-400 border-blue-800'
                            : lead.status === 'contacted'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : lead.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border-rose-800'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {lead.customerPhone ? (
                        <button
                          onClick={() => openWhatsAppReply(lead)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                          title="Reply on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-white" />
                          <span>Reply</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Logged</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
