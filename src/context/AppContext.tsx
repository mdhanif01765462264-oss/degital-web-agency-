import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type {
  Category,
  Service,
  PricingPlan,
  PartnerBrand,
  Testimonial,
  FaqItem,
  PortfolioProject,
  LeadOrder,
  WebsiteSettings,
  AdminUser
} from '../types/index.ts';
import { api } from '../services/api.ts';

export type AppView =
  | 'home'
  | 'services'
  | 'category'
  | 'service-detail'
  | 'pricing'
  | 'portfolio'
  | 'about'
  | 'contact'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  settings: WebsiteSettings;
  updateSettings: (data: Partial<WebsiteSettings>) => Promise<boolean>;
  categories: Category[];
  refreshCategories: () => Promise<void>;
  services: Service[];
  refreshServices: () => Promise<void>;
  pricingPlans: PricingPlan[];
  refreshPricing: () => Promise<void>;
  partnerBrands: PartnerBrand[];
  refreshBrands: () => Promise<void>;
  testimonials: Testimonial[];
  refreshTestimonials: () => Promise<void>;
  faqs: FaqItem[];
  refreshFaqs: () => Promise<void>;
  portfolio: PortfolioProject[];
  refreshPortfolio: () => Promise<void>;
  leads: LeadOrder[];
  refreshLeads: () => Promise<void>;
  stats: any;
  refreshStats: () => Promise<void>;
  isLoading: boolean;

  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (filterId: string) => void;
  navigateToService: (service: Service) => void;
  navigateToCategory: (category: Category) => void;

  // WhatsApp Order
  openWhatsAppOrder: (service: Service) => void;
  openPlanOrder: (plan: PricingPlan) => void;
  openDirectWhatsApp: (customMessage?: string) => void;

  // Admin
  adminUser: AdminUser | null;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  loginAdmin: (token: string, user: AdminUser) => void;
  logoutAdmin: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultSettings: WebsiteSettings = {
  brandName: 'DEGITAL WEB AGENCY',
  tagline: 'আপনার অনলাইন বিজনেসের নির্ভরযোগ্য ডিজিটাল পার্টনার',
  announcementBar: 'DEGITAL WEB AGENCY — প্রফেশনাল ডিজিটাল মার্কেটিং ও হাই-কনভার্টিং ওয়েবসাইট সল্যুশন',
  showAnnouncementBar: true,
  portfolioSectionTitle: 'DEGITAL WEB AGENCY-র মাধ্যমে পরিচালিত ব্যবসা',
  brandsSectionTitle: 'Fastmart ও DEGITAL WB AGENCY-র মাধ্যমে পরিচালিত জনপ্রিয় ব্র্যান্ডসমূহ',
  heroBadge: 'আধুনিক ও সহজ ডিজিটাল সমাধান',
  heroTitle: 'ডিজিটাল বিজনেসের সহজ সমাধান, গ্রোথ রাখুন নিজের হাতে',
  heroSubtitle: 'DEGITAL WEB AGENCY-র সাথে আপনার অনলাইন সেলস বৃদ্ধি করুন, পরিচালনা করুন সহজে। রেডি ওয়েবসাইট, ফেসবুক ও গুগল অ্যাডস এবং প্রফেশনাল ব্র্যান্ডিংয়ের নির্ভরযোগ্য এক প্ল্যাটফর্ম।',
  heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  heroPrimaryBtnText: 'শুরু করুন →',
  heroSecondaryBtnText: 'লাইভ ডেমো দেখুন',
  heroRatingText: '৫০০+ সফল উদ্যোক্তা ও ব্যবসায়ীর প্রথম পছন্দ',
  whatsappNumber: '+8801750721835',
  email: 'contact@degitalwbagency.com',
  phone: '+880 1750-721835',
  address: 'House 203, Flat B7, Level 4, Road 2, Avenue 3, Mirpur DOHS, Dhaka 1216',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  youtubeUrl: 'https://youtube.com',
  aboutTitle: 'সফল ব্যবসার নির্ভরযোগ্য ডিজিটাল পার্টনার',
  aboutText: 'DEGITAL WEB AGENCY বাংলাদেশের শীর্ষস্থানীয় ফুল-স্ট্যাক ডিজিটাল সল্যুশন এজেন্সি। আমরা তৈরি করি হাই-কনভার্টিং রেডি ই-কমার্স ও করপোরেট ওয়েবসাইট, পরিচালনা করি টার্গেটেড ফেসবুক ও গুগল অ্যাডস ক্যাম্পেইন, এবং ব্র্যান্ডকে নিয়ে যাই অনন্য উচ্চতায়।',
  stats: {
    projectsDone: '৬৫০+',
    happyClients: '৪৮০+',
    roiIncrease: '৩২০%',
    supportHours: '২৪/৭'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [partnerBrands, setPartnerBrands] = useState<PartnerBrand[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check URL path: if user opens /admin directly!
  const isDirectAdminUrl = typeof window !== 'undefined' && (
    window.location.pathname.toLowerCase() === '/admin' ||
    window.location.pathname.toLowerCase().startsWith('/admin/') ||
    window.location.hash.toLowerCase() === '#admin' ||
    window.location.hash.toLowerCase().startsWith('#/admin') ||
    window.location.search.toLowerCase().includes('admin=true')
  );

  const [currentView, setCurrentViewInternal] = useState<AppView>(isDirectAdminUrl ? 'admin' : 'home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Admin Auth
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('degitalwb_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setCurrentView = useCallback((view: AppView) => {
    setCurrentViewInternal(view);
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        if (!window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/admin');
        }
      } else if (window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '/');
      }
    }
  }, []);

  // Listen to popstate and hashchange for /admin
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash.startsWith('#/admin')) {
        setCurrentViewInternal('admin');
      } else if (currentView === 'admin') {
        setCurrentViewInternal('home');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [currentView]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        fetchedSettings,
        fetchedCategories,
        fetchedServices,
        fetchedPricing,
        fetchedBrands,
        fetchedTestimonials,
        fetchedFaqs,
        fetchedPortfolio
      ] = await Promise.all([
        api.getSettings().catch(() => defaultSettings),
        api.getCategories().catch(() => []),
        api.getServices().catch(() => []),
        api.getPricing().catch(() => []),
        api.getBrands().catch(() => []),
        api.getTestimonials().catch(() => []),
        api.getFaqs().catch(() => []),
        api.getPortfolio().catch(() => [])
      ]);

      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedCategories.length) setCategories(fetchedCategories);
      if (fetchedServices.length) setServices(fetchedServices);
      if (fetchedPricing.length) setPricingPlans(fetchedPricing);
      if (fetchedBrands.length) setPartnerBrands(fetchedBrands);
      if (fetchedTestimonials.length) setTestimonials(fetchedTestimonials);
      if (fetchedFaqs.length) setFaqs(fetchedFaqs);
      if (fetchedPortfolio.length) setPortfolio(fetchedPortfolio);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const refreshCategories = useCallback(async () => {
    try {
      const fresh = await api.getCategories();
      setCategories(fresh);
      setSelectedCategory((prev) => (prev ? (fresh.find((c) => c.id === prev.id) || null) : null));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const refreshServices = useCallback(async () => {
    try {
      const fresh = await api.getServices();
      setServices(fresh);
      setSelectedService((prev) => (prev ? (fresh.find((s) => s.id === prev.id) || null) : null));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const refreshPricing = useCallback(async () => {
    try { setPricingPlans(await api.getPricing()); } catch (e) { console.error(e); }
  }, []);

  const refreshBrands = useCallback(async () => {
    try { setPartnerBrands(await api.getBrands()); } catch (e) { console.error(e); }
  }, []);

  const refreshTestimonials = useCallback(async () => {
    try { setTestimonials(await api.getTestimonials()); } catch (e) { console.error(e); }
  }, []);

  const refreshFaqs = useCallback(async () => {
    try { setFaqs(await api.getFaqs()); } catch (e) { console.error(e); }
  }, []);

  const refreshPortfolio = useCallback(async () => {
    try { setPortfolio(await api.getPortfolio()); } catch (e) { console.error(e); }
  }, []);

  const refreshLeads = useCallback(async () => {
    try { setLeads(await api.getLeads()); } catch (e) { console.error(e); }
  }, []);

  const refreshStats = useCallback(async () => {
    try { setStats(await api.getStats()); } catch (e) { console.error(e); }
  }, []);

  const updateSettings = useCallback(async (data: Partial<WebsiteSettings>): Promise<boolean> => {
    try {
      const res = await api.updateSettings(data);
      if (res.success) {
        setSettings(res.settings);
        showToast('Settings saved successfully', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
      return false;
    }
  }, [showToast]);

  const loginAdmin = useCallback((token: string, user: AdminUser) => {
    localStorage.setItem('degitalwb_admin_token', token);
    localStorage.setItem('degitalwb_admin_user', JSON.stringify(user));
    setAdminUser(user);
    setIsAdminLoginModalOpen(false);
    setCurrentView('admin');
    showToast(`Welcome back, ${user.name}!`, 'success');
  }, [setCurrentView, showToast]);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('degitalwb_admin_token');
    localStorage.removeItem('degitalwb_admin_user');
    setAdminUser(null);
    setCurrentView('home');
    showToast('Logged out', 'info');
  }, [setCurrentView, showToast]);

  const getCleanWhatsAppNumber = useCallback((rawNumber?: string) => {
    const num = rawNumber || settings.whatsappNumber;
    return num.replace(/[^0-9]/g, '');
  }, [settings.whatsappNumber]);

  // Order via WhatsApp (for service)
  const openWhatsAppOrder = useCallback((service: Service) => {
    const category = categories.find((c) => c.id === service.categoryId);
    const categoryName = category ? category.name : service.categoryId;
    const cleanNumber = getCleanWhatsAppNumber();
    if (!cleanNumber) {
      showToast('WhatsApp number not set in settings', 'error');
      return;
    }

    const currentUrl = window.location.origin;
    const message = `Hello ${settings.brandName}, I am interested in ordering this service.

Service:
${service.title}

Category:
${categoryName}

Price:
${service.price}

Service Details:
${service.shortDescription || 'Professional digital solution.'}

Website:
${currentUrl}

Please provide more information about ordering this service.`;

    api.recordLead({
      serviceId: service.id,
      serviceTitle: service.title,
      categoryName,
      price: service.price,
      message,
      source: 'whatsapp_button'
    }).catch(console.error);

    showToast('Opening WhatsApp with your order specs...', 'success');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }, [categories, getCleanWhatsAppNumber, settings.brandName, showToast]);

  // Order via WhatsApp (for pricing package)
  const openPlanOrder = useCallback((plan: PricingPlan) => {
    const cleanNumber = getCleanWhatsAppNumber();
    if (!cleanNumber) {
      showToast('WhatsApp number not set in settings', 'error');
      return;
    }

    const currentUrl = window.location.origin;
    const message = `Hello ${settings.brandName},

I am interested in ordering your "${plan.name}" package.
Price: ${plan.price} (${plan.period})
Details: ${plan.shortDesc}

Website: ${currentUrl}
Please confirm setup details and payment procedures.`;

    api.recordLead({
      serviceTitle: `Pricing Plan: ${plan.name}`,
      categoryName: 'Pricing Package',
      price: plan.price,
      message,
      source: 'pricing_plan'
    }).catch(console.error);

    showToast('Opening WhatsApp for package confirmation...', 'success');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }, [getCleanWhatsAppNumber, settings.brandName, showToast]);

  // Direct WhatsApp chat
  const openDirectWhatsApp = useCallback((customMessage?: string) => {
    const cleanNumber = getCleanWhatsAppNumber();
    if (!cleanNumber) {
      showToast('WhatsApp number not configured', 'error');
      return;
    }

    const defaultMsg = `Hello ${settings.brandName}, I would like to inquire about your website development & digital marketing services.`;
    const message = customMessage || defaultMsg;

    api.recordLead({
      serviceTitle: 'General Direct WhatsApp Inquiry',
      categoryName: 'Direct',
      price: 'Custom',
      message,
      source: 'floating_button'
    }).catch(console.error);

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }, [getCleanWhatsAppNumber, settings.brandName, showToast]);

  const navigateToService = useCallback((service: Service) => {
    setSelectedService(service);
    setCurrentView('service-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentView]);

  const navigateToCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setSelectedCategoryFilter(category.id);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentView]);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        categories,
        refreshCategories,
        services,
        refreshServices,
        pricingPlans,
        refreshPricing,
        partnerBrands,
        refreshBrands,
        testimonials,
        refreshTestimonials,
        faqs,
        refreshFaqs,
        portfolio,
        refreshPortfolio,
        leads,
        refreshLeads,
        stats,
        refreshStats,
        isLoading,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        selectedService,
        setSelectedService,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        navigateToService,
        navigateToCategory,
        openWhatsAppOrder,
        openPlanOrder,
        openDirectWhatsApp,
        adminUser,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
