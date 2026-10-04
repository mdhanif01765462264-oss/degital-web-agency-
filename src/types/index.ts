export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  price: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  demoUrl?: string;
  deliveryTime?: string;
  features: string[];
  status: 'published' | 'draft';
  views: number;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  shortDesc: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  order: number;
}

export interface PartnerBrand {
  id: string;
  name: string;
  logo: string;
  category?: string;
  order: number;
}

export interface AdvantageCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  createdAt: string;
}

export interface LeadOrder {
  id: string;
  serviceId?: string;
  serviceTitle: string;
  categoryName: string;
  price: string;
  customerName?: string;
  customerPhone?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  source: 'whatsapp_button' | 'service_detail' | 'floating_button' | 'inquiry_form' | 'pricing_plan';
  createdAt: string;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  announcementBar: string;
  showAnnouncementBar?: boolean;
  portfolioSectionTitle?: string;
  brandsSectionTitle?: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  heroRatingText: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl?: string;
  aboutTitle: string;
  aboutText: string;
  stats: {
    projectsDone: string;
    happyClients: string;
    roiIncrease: string;
    supportHours: string;
  };
}

export interface AdminUser {
  username: string;
  name: string;
  email: string;
  role: string;
}
