import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  MessageSquare,
  Layers,
  Tag,
  Building2,
  FolderGit2,
  Settings,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Shield,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  BellRing
} from 'lucide-react';
import { AdminOrders } from './AdminOrders.tsx';
import { AdminServices } from './AdminServices.tsx';
import { AdminPricing } from './AdminPricing.tsx';
import { AdminBrands } from './AdminBrands.tsx';
import { AdminPortfolio } from './AdminPortfolio.tsx';
import { AdminSettings } from './AdminSettings.tsx';
import { AdminProfile } from './AdminProfile.tsx';

type AdminTab = 'orders' | 'services' | 'pricing' | 'portfolio' | 'brands' | 'settings' | 'profile';

export const AdminPanel: React.FC = () => {
  const {
    adminUser,
    loginAdmin,
    logoutAdmin,
    setCurrentView,
    settings,
    leads,
    services,
    pricingPlans,
    partnerBrands,
    portfolio,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state for direct /admin URL access
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await api.loginAdmin({ username: loginUsername, password: loginPassword });
      if (res.success) {
        loginAdmin(res.token, res.user);
        showToast('অ্যাডমিন প্যানেলে স্বাগতম!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await api.loginAdmin({ username: 'admin', password: 'admin123' });
      if (res.success) {
        loginAdmin(res.token, res.user);
        showToast('অ্যাডমিন প্যানেলে স্বাগতম!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'লগইন ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If not logged in, show dedicated Admin Login Screen at /admin
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Back to website button */}
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </button>

          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 mx-auto shadow-lg shadow-rose-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-rose-500" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {settings.brandName || 'DEGITAL WEB AGENCY'}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>অ্যাডমিন ম্যানেজমেন্ট কনসোল</span>
              </div>
              <p className="text-xs text-slate-400">
                সার্ভিস, প্যাকেজ, ওয়েবসাইট শোকেস, ব্র্যান্ড ও হোয়াটসঅ্যাপ সেটিংস পরিচালনা করতে লগইন করুন
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  ইউজারনেম (Username)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span>লগইন হচ্ছে...</span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>১-ক্লিক ডেমো লগইন (Default: admin / admin123)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigateTo = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            DW
          </div>
          <span className="font-bold text-white text-sm">{settings.brandName || 'DEGITAL WEB AGENCY'} Admin</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900/95 border-r border-slate-800 shrink-0 md:min-h-screen p-4 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-rose-500 font-extrabold text-xs">
                  DW
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{settings.brandName || 'DEGITAL WEB AGENCY'}</div>
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                  Admin Console
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 text-xs">
            {/* 1. WhatsApp Orders */}
            <button
              onClick={() => navigateTo('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>WhatsApp Orders</span>
              </div>
              {leads.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
                  {leads.length}
                </span>
              )}
            </button>

            {/* 2. OUR SERVICES & সার্ভিস সমূহ */}
            <button
              onClick={() => navigateTo('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>OUR SERVICES ও সার্ভিস সমূহ</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{services.length}</span>
            </button>

            {/* 3. সঠিক প্যাকেজটি বেছে নিন */}
            <button
              onClick={() => navigateTo('pricing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>সঠিক প্যাকেজটি বেছে নিন</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{pricingPlans.length}</span>
            </button>

            {/* 4. DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা */}
            <button
              onClick={() => navigateTo('portfolio')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>পরিচালিত ক্লায়েন্ট ওয়েবসাইট</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{portfolio.length}</span>
            </button>

            {/* 5. জনপ্রিয় ব্র্যান্ডসমূহ */}
            <button
              onClick={() => navigateTo('brands')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'brands'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>জনপ্রিয় ব্র্যান্ডসমূহ</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{partnerBrands.length}</span>
            </button>

            {/* 6. নোটিশ বার ও হোয়াটসঅ্যাপ সেটিংস */}
            <button
              onClick={() => navigateTo('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>নোটিশ বার ও হোয়াটসঅ্যাপ</span>
            </button>

            {/* 7. Admin Profile */}
            <button
              onClick={() => navigateTo('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>অ্যাডমিন প্রোফাইল</span>
            </button>
          </nav>
        </div>

        {/* 8. View Live Website & Sign Out */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
          >
            <span className="font-semibold">View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'services' && <AdminServices initialMode="list" />}
        {activeTab === 'pricing' && <AdminPricing />}
        {activeTab === 'portfolio' && <AdminPortfolio />}
        {activeTab === 'brands' && <AdminBrands />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'profile' && <AdminProfile />}
      </main>
    </div>
  );
};
