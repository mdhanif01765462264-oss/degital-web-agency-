import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import type {
  Category,
  Service,
  PricingPlan,
  PartnerBrand,
  AdvantageCard,
  Testimonial,
  FaqItem,
  BlogArticle,
  PortfolioProject,
  LeadOrder,
  WebsiteSettings
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface DatabaseSchema {
  settings: WebsiteSettings;
  categories: Category[];
  services: Service[];
  pricingPlans: PricingPlan[];
  partnerBrands: PartnerBrand[];
  advantages: AdvantageCard[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  blogs: BlogArticle[];
  portfolio: PortfolioProject[];
  leads: LeadOrder[];
  admin: {
    username: string;
    passwordHash: string;
    name: string;
    email: string;
  };
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

const defaultPartnerBrands: PartnerBrand[] = [
  { id: 'pb-1', name: 'eMart Skincare', logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80', category: 'Skincare ওয়েবসাইট', order: 1 },
  { id: 'pb-2', name: 'Elegance Fashion', logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80', category: 'Fashion ওয়েবসাইট', order: 2 },
  { id: 'pb-3', name: 'Tekka Gadgets BD', logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80', category: 'Gadgets ওয়েবসাইট', order: 3 },
  { id: 'pb-4', name: 'Modhudhara Organics', logo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80', category: 'Organic Foods ওয়েবসাইট', order: 4 },
  { id: 'pb-5', name: 'DermaBD Clinic', logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80', category: 'Healthcare ওয়েবসাইট', order: 5 },
  { id: 'pb-6', name: 'Daily Bazar Express', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80', category: 'Grocery ওয়েবসাইট', order: 6 },
  { id: 'pb-7', name: 'BabyLand BD', logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=200&q=80', category: 'Kids Store ওয়েবসাইট', order: 7 },
  { id: 'pb-8', name: 'Leather Crafts BD', logo: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80', category: 'Leather Goods ওয়েবসাইট', order: 8 },
  { id: 'pb-9', name: 'Royal Perfume House', logo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80', category: 'Perfume ওয়েবসাইট', order: 9 },
  { id: 'pb-10', name: 'HomeDecor BD', logo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80', category: 'Home Decor ওয়েবসাইট', order: 10 }
];

const defaultAdvantages: AdvantageCard[] = [
  {
    id: 'adv-1',
    title: 'সম্পূর্ণ রেডি সোর্স কোড ও সেটআপ',
    description: 'কোনো হিডেন চার্জ ছাড়া সম্পূর্ণ রেডি ওয়েবসাইট ও সিস্টেম। সরাসরি আপনার নিজস্ব হোস্টিং ও ডোমেইনে ফুল কন্ট্রোল।',
    icon: 'Code',
    order: 1
  },
  {
    id: 'adv-2',
    title: 'রিয়েল-টাইম হোয়াটসঅ্যাপ অর্ডার',
    description: 'কাস্টমারদের জন্য ওয়ান-ক্লিক হোয়াটসঅ্যাপ চেকআউট, যেখানে স্বয়ংক্রিয়ভাবে প্রডাক্ট বা সার্ভিসের বিবরণসহ মেসেজ চলে যায়।',
    icon: 'MessageSquare',
    order: 2
  },
  {
    id: 'adv-3',
    title: 'হাই-কনভার্টিং ও মোবাইল ফার্স্ট ডিজাইন',
    description: 'স্মার্টফোন, ট্যাব ও ল্যাপটপে চোখের পলকে লোড হওয়া আধুনিক ক্লিপ ও পরিচ্ছন্ন ইন্টারফেস যা সেলস বাড়াতে সহায়ক।',
    icon: 'Zap',
    order: 3
  },
  {
    id: 'adv-4',
    title: '২৪/৭ ডেডিকেটেড এক্সপার্ট সাপোর্ট',
    description: 'টেকনিক্যাল জটিলতা নিয়ে আর কোনো চিন্তা নেই। আমাদের বিশেষজ্ঞ টিম হোয়াটসঅ্যাপ ও ফোনে সার্বক্ষণিক সহায়তা দেয়।',
    icon: 'ShieldCheck',
    order: 4
  }
];

const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'plan-basic',
    name: 'Starter Ready Website',
    badge: 'বাজেট ফ্রেন্ডলি',
    price: '৳৩,৫00',
    period: 'এককালীন সেটআপ',
    shortDesc: 'নতুন উদ্যোক্তা ও ছোট বিজনেসের দ্রুত অনলাইন শুরু করার সেরা প্যাকেজ।',
    features: [
      'সম্পূর্ণ রেসপনসিভ হোম ও ল্যান্ডিং পেজ',
      'প্রডাক্ট শোকেস ও ইনকোয়ারি ফর্ম',
      'ওয়ান-ক্লিক হোয়াটসঅ্যাপ অর্ডার বাটন',
      'ফ্রি ক্লাউড সেটআপ ও এসএসএল সিকিউরিটি',
      '২৪ ঘণ্টার মধ্যে লাইভ ডেলিভারি'
    ],
    isPopular: false,
    ctaText: 'হোয়াটসঅ্যাপে অর্ডার করুন',
    order: 1
  },
  {
    id: 'plan-plus',
    name: 'Full E-commerce Plus',
    badge: 'সবচেয়ে জনপ্রিয়',
    price: '৳৫,৫00',
    period: 'এককালীন সেটআপ',
    shortDesc: 'প্রফেশনাল অনলাইন স্টোর, ফেসবুক পিক্সেল ও পেমেন্ট গেটওয়ে রেডি প্যাকেজ।',
    features: [
      'সম্পূর্ণ ডায়নামিক প্রডাক্ট ও ক্যাটাগরি ম্যানেজমেন্ট',
      'বিকাশ, নগদ ও ক্যাশ অন ডেলিভারি (COD) চেকআউট',
      'মেটা পিক্সেল ও কনভার্শন ট্র্যাকিং সেটআপ',
      'অটোমেটেড ইনভয়েস ও সেলস ড্যাশবোর্ড',
      'হোয়াটসঅ্যাপ অর্ডার অটো-মেসেজিং ইন্টিগ্রেশন',
      '৩০ দিনের ফ্রি টেকনিক্যাল সাপোর্ট'
    ],
    isPopular: true,
    ctaText: 'হোয়াটসঅ্যাপে অর্ডার করুন',
    order: 2
  },
  {
    id: 'plan-growth',
    name: 'Growth Ads & Agency Pro',
    badge: 'সম্পূর্ণ গ্রোথ সল্যুশন',
    price: '৳৮,৫00',
    period: 'মাসিক অথবা কাস্টম',
    shortDesc: 'ওয়েবসাইট প্লাস ফেসবুক ও গুগল অ্যাডস দিয়ে সেলস দ্রুত বৃদ্ধির ফুল প্যাকেজ।',
    features: [
      'প্রফেশনাল ই-কমার্স অথবা কাস্টম ওয়েবসাইট',
      'ফেসবুক ও ইনস্টাগ্রাম হাই-কনভার্টিং সেলস ক্যাম্পেইন',
      '৩টি প্রিমিয়াম অ্যাড ভিডিও/ইমেজ ডিজাইন',
      'গুগল সার্চ ও পারফরম্যান্স ম্যাক্স অ্যাডস সেটআপ',
      'সাপ্তাহিক ROAS অ্যানালিটিক্স ও সেলস রিপোর্ট'
    ],
    isPopular: false,
    ctaText: 'হোয়াটসঅ্যাপে যোগাযোগ করুন',
    order: 3
  }
];

const defaultCategories: Category[] = [
  {
    id: 'ready-website',
    name: 'Ready Website',
    slug: 'ready-website',
    description: 'Pre-built, high-converting websites ready to deploy in under 24 hours.',
    icon: 'Layout',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'facebook-growth',
    name: 'Facebook Growth',
    slug: 'facebook-growth',
    description: 'Organic page growth, real follower scaling, viral post strategies & brand reach.',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'custom-website',
    name: 'Custom Website',
    slug: 'custom-website',
    description: 'Bespoke web applications, CRM portals, SaaS MVPs and custom software.',
    icon: 'Code',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'facebook-ads',
    name: 'Facebook Ads',
    slug: 'facebook-ads',
    description: 'High-converting Meta ad campaigns, pixel tracking, retargeting & ROAS optimization.',
    icon: 'Target',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    slug: 'google-ads',
    description: 'Search PPC, Performance Max, Display Ads, YouTube marketing & conversion tracking.',
    icon: 'Search',
    image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    slug: 'social-media-management',
    description: 'End-to-end content creation, daily posting, caption copywriting & community engagement.',
    icon: 'Share2',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'branding-design',
    name: 'Branding & Design',
    slug: 'branding-design',
    description: 'Logo identity design, brand style guides, social banners & marketing creatives.',
    icon: 'Palette',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    order: 7,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'other-services',
    name: 'Other Services',
    slug: 'other-services',
    description: 'Domain & cloud hosting, SEO audit, speed optimization & technical consultation.',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    order: 8,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const defaultServices: Service[] = [
  {
    id: 'serv-ecommerce-ready',
    title: 'Professional E-commerce Website',
    slug: 'professional-ecommerce-website',
    categoryId: 'ready-website',
    price: '৳৫,৫০০',
    shortDescription: 'রেডি আধুনিক ই-কমার্স ওয়েবসাইট। প্রডাক্ট ক্যাটালগ, কার্ট, ওয়ান-ক্লিক হোয়াটসঅ্যাপ অর্ডার ও অ্যাডমিন প্যানেল।',
    fullDescription: 'আপনার অনলাইন রিটেল বিজনেস শুরু করুন মাত্র ২৪ ঘণ্টায়। মোবাইল ফ্রেন্ডলি ওয়ান-পেজ চেকআউট, পেমেন্ট অপশন (বিকাশ, নগদ, ক্যাশ অন ডেলিভারি), এবং হোয়াটসঅ্যাপ ডিরেক্ট পারচেজ বাটন সহ ফুল ডায়নামিক অ্যাডমিন প্যানেল।',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1000&q=80'
    ],
    demoUrl: 'https://ecommerce-preview-demo.example.com',
    deliveryTime: '২৪-৪৮ ঘণ্টা',
    features: [
      'ফুল মোবাইল ও ট্যাব রেসপনসিভ লেআউট',
      'অ্যাডমিন ড্যাশবোর্ড ও সেলস অ্যানালিটিক্স',
      'বিকাশ / নগদ / সিওডি পেমেন্ট রেডি',
      'ফ্রি ক্লাউড এসএসডি হোস্টিং সেটআপ',
      'হোয়াটসঅ্যাপ কুইক অর্ডার চেকআউট বাটন',
      'এসইও ফ্রেন্ডলি মেটা ও ওপেনগ্রাফ ট্যাগ'
    ],
    status: 'published',
    views: 1240,
    ordersCount: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'serv-business-corporate',
    title: 'Corporate Business Website',
    slug: 'corporate-business-website',
    categoryId: 'ready-website',
    price: '৳৩,৫০০',
    shortDescription: 'কর্পোরেট এজেন্সি ও প্রতিষ্ঠানের জন্য আধুনিক কোম্পানি শোকেস ওয়েবসাইট।',
    fullDescription: 'আপনার কোম্পানির সার্ভিস, ক্লায়েন্ট টেস্টিমোনিয়াল, টিম এবং ডিরেক্ট লিড জেনারেশন ফর্ম সহ চমৎকার একটি ওয়েবসাইট।',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80'
    ],
    demoUrl: 'https://corporate-preview-demo.example.com',
    deliveryTime: '২৪ ঘণ্টা',
    features: [
      '৫টি কমপ্লিট রেসপনসিভ সেকশন/পেজ',
      'লিড জেনারেশন কনট্যাক্ট ফর্ম',
      'গুগল ম্যাপ ও সোশ্যাল ইন্টিগ্রেশন',
      'ফ্রি এসএসএল ও ফাস্ট স্পিড অপ্টিমাইজেশন'
    ],
    status: 'published',
    views: 890,
    ordersCount: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'serv-fb-ads-roas',
    title: 'High-ROAS Facebook & Instagram Ads',
    slug: 'high-roas-facebook-ads-setup',
    categoryId: 'facebook-ads',
    price: '৳৪,৫০০',
    shortDescription: 'টার্গেটেড মেটা অ্যাডস ক্যাম্পেইন, পিক্সেল সেটআপ ও ম্যাক্সিমাম রিটার্ন ফানেল।',
    fullDescription: 'বাজেট নষ্ট না করে সঠিক ক্রেতার কাছে পৌঁছান। মেটা পিক্সেল, কনভার্শন এপিআই, আকর্ষণীয় অ্যাড কপি ও ডিজাইন সহ সম্পূর্ণ ক্যাম্পেইন পরিচালনা।',
    images: [
      'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1000&q=80'
    ],
    deliveryTime: '২-৩ দিন',
    features: [
      'মেটা পিক্সেল + CAPI সেটআপ',
      'লেজার টার্গেটেড অডিয়েন্স রিসার্চ',
      '৩টি হাই-কনভার্টিং অ্যাড ডিজাইন',
      '৭ দিনের মনিটরিং ও অপ্টিমাইজেশন'
    ],
    status: 'published',
    views: 1530,
    ordersCount: 56,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'serv-google-search-ads',
    title: 'Google Search Ads & PPC Campaign',
    slug: 'google-search-ads-ppc-campaign',
    categoryId: 'google-ads',
    price: '৳৫,০০০',
    shortDescription: 'গুগলে সার্চ করা ক্রেতাদের সরাসরি আপনার ওয়েবসাইটে আনার কার্যকরী ক্যাম্পেইন।',
    fullDescription: 'হাই-ইনটেন্ট কিওয়ার্ড রিসার্চ, নেগেটিভ কিওয়ার্ড ফিল্টার, কনভার্শন ট্র্যাকিং এবং রেসপনসিভ সার্চ অ্যাডস সেটআপ।',
    images: [
      'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'
    ],
    deliveryTime: '৩-৪ দিন',
    features: [
      'হাই-ইনটেন্ট কিওয়ার্ড রিসার্চ',
      'নেগেটিভ কিওয়ার্ড লিস্ট ফিল্টার',
      'গুগল ট্যাগ ম্যানেজার সেটআপ',
      '১৫টি হেডলাইন ও অ্যাড কপিরাইটিং'
    ],
    status: 'published',
    views: 980,
    ordersCount: 34,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sumon Ahmed',
    role: 'Managing Director',
    company: 'Elegance Fashion',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'DEGITAL WB AGENCY-র মাধ্যমে আমাদের রেডি ই-কমার্স ও ফেসবুক অ্যাডস চালুর পর সেলস ৩ গুণেরও বেশি বেড়েছে। হোয়াটসঅ্যাপে অর্ডার নেওয়ার সুবিধা ক্লায়েন্টদের খুব পছন্দ হয়েছে!',
    rating: 5,
    order: 1
  },
  {
    id: 'test-2',
    name: 'Aehtesham Aumee',
    role: 'CEO',
    company: 'eMart Skincare',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    content: 'Fastmart এর মতো ক্লিন ডিজাইন আর সুপার ফাস্ট সাইট পেয়ে আমরা অভিভূত। অ্যাডমিন প্যানেল দিয়ে প্রডাক্ট বা সার্ভিস যোগ করা একদম সহজ।',
    rating: 5,
    order: 2
  },
  {
    id: 'test-3',
    name: 'Bablu Ahmed',
    role: 'Founder',
    company: 'Tekka Gadgets',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    content: 'তাদের টিম অত্যন্ত প্রফেশনাল। ২৪ ঘণ্টার মধ্যে ওয়েবসাইট লাইভ হয়েছে এবং মেটা পিক্সেল সেটআপ পারফেক্ট কাজ করছে। হাইলি রিকমেন্ডেড!',
    rating: 5,
    order: 3
  }
];

const defaultFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'DEGITAL WB AGENCY কী এবং কীভাবে কাজ করে?',
    answer: 'DEGITAL WB AGENCY হলো একটি অল-ইন-ওয়ান ডিজিটাল সল্যুশন এজেন্সি। আমরা প্রি-বিল্ট রেডি ই-কমার্স ওয়েবসাইট, কাস্টম ওয়েব ডেভেলপমেন্ট, ফেসবুক অ্যাডস এবং কমপ্লিট ডিজিটাল মার্কেটিং সেবা সরাসরি হোয়াটসঅ্যাপে ওয়ান-অন-ওয়ান অর্ডারিংয়ের মাধ্যমে প্রদান করি।',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'ওয়েবসাইট ডেলিভারি হতে কতক্ষণ সময় লাগে?',
    answer: 'আমাদের রেডি ওয়েবসাইটগুলো সাধারণত ১২ থেকে ২৪ ঘণ্টার মধ্যে সম্পূর্ণ সেটআপ সহ লাইভ ডেলিভারি দেওয়া হয়। কাস্টম রিকোয়ারমেন্টের ক্ষেত্রে প্রোজেক্টভেদে ৩ থেকে ৭ দিন সময় লাগতে পারে।',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'আমি কি নিজের ডোমেইন এবং হোস্টিং ব্যবহার করতে পারব?',
    answer: 'হ্যাঁ, অবশ্যই! আপনি চাইলে আপনার কেনা ডোমেইন ও হোস্টিংয়েও ওয়েবসাইট লাইভ করে দেওয়া হবে, অথবা আমাদের অল-ইনক্লুসিভ ক্লাউড হোস্টিং সেটআপও বেছে নিতে পারেন।',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'অর্ডারের পর কীভাবে পেমেন্ট এবং যোগাযোগ হবে?',
    answer: '"ORDER VIA WHATSAPP" বাটনে ক্লিক করলে স্বয়ংক্রিয়ভাবে সার্ভিসের নাম, ক্যাটাগরি ও দাম সহ আমাদের অফিশিয়াল হোয়াটসঅ্যাপে মেসেজ ওপেন হবে। সেখানে বিস্তারিত আলোচনা করে বিকাশ, নগদ বা ব্যাংকের মাধ্যমে নিরাপদ পেমেন্ট নিশ্চিত করা যাবে।',
    order: 4
  }
];

const defaultBlogs: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Facebook Page-এর পাশাপাশি কেন ই-কমার্স ওয়েবসাইট থাকা আবশ্যক?',
    category: 'ই-কমার্স গাইড',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    readTime: '৩ মিনিট পড়া',
    date: '০৪ অক্টোবর, ২০২৬',
    excerpt: 'শুধু ফেসবুক পেজের উপর নির্ভর না করে নিজস্ব ওয়েবসাইটের মাধ্যমে ব্র্যান্ড অথরিটি তৈরি করুন ও স্থায়ী কাস্টমার বেস গড়ে তুলুন।',
    content: 'ফেসবুক পেজে পেজ ডাউন বা রেস্ট্রিকশনের ঝুঁকি থাকে। একটি প্রফেশনাল ই-কমার্স ওয়েবসাইট থাকলে ক্রেতারা সরাসরি ট্রাস্ট করে এবং অটোমেটেড অর্ডারিং সহজ হয়।'
  },
  {
    id: 'blog-2',
    title: 'মেটা অ্যাডস দিয়ে সেলস বৃদ্ধির গোপন ট্রিকস ও স্ট্র্যাটেজি',
    category: 'ডিজিটাল মার্কেটিং',
    image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80',
    readTime: '৪ মিনিট পড়া',
    date: '০৩ অক্টোবর, ২০২৬',
    excerpt: 'পিক্সেল ডেটা, কনভার্শন এপিআই ও কাস্টম অডিয়েন্স ব্যবহার করে বিজ্ঞাপনের খরচ কমিয়ে সর্বোচ্চ রিটার্ন অন অ্যাড স্পেন্ড (ROAS) পাওয়ার নিয়ম।',
    content: 'শুধুমাত্র বুস্ট না করে সেলস অবজেক্টিভে ক্যাম্পেইন তৈরি করুন এবং ভিডিও বিজ্ঞাপনে প্রথম ৩ সেকেন্ডে আকর্ষণ তৈরি করুন।'
  }
];

const defaultPortfolio: PortfolioProject[] = [
  {
    id: 'port-1',
    title: 'eMart Skincare - বিউটি ও স্কিনকেয়ার ওয়েবসাইট',
    category: 'স্কিনকেয়ার ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    description: 'অর্গানিক ও ডার্মাটোলজি স্কিনকেয়ার পণ্যের জন্য ওয়ান-ক্লিক হোয়াটসঅ্যাপ অর্ডার সমৃদ্ধ দ্রুতগতির ই-কমার্স ওয়েবসাইট।',
    techStack: ['Next.js', 'Tailwind CSS', 'WhatsApp Checkout', 'Meta Pixel'],
    liveUrl: 'https://example.com/demo/emart-skincare',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-2',
    title: 'Elegance Fashion - এক্সক্লুসিভ ক্লদিং ও ফ্যাশন ওয়েবসাইট',
    category: 'ফ্যাশন ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    description: 'উচ্চমানের আধুনিক পোশাক, থ্রি-পিস ও ক্যাজুয়াল ওয়্যারের জন্য তৈরি প্রিমিয়াম ফ্যাশন ই-কমার্স ওয়েবসাইট।',
    techStack: ['React', 'Vite', 'Tailwind', 'অটোমেটেড ইনভয়েস'],
    liveUrl: 'https://example.com/demo/elegance-fashion',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-3',
    title: 'Tekka Gadgets - স্মার্ট ইলেকট্রনিক্স ও গ্যাজেট ওয়েবসাইট',
    category: 'গ্যাজেট ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    description: 'স্মার্টওয়াচ, হেডফোন ও মোবাইল এক্সেসরিজ বিক্রির জন্য তৈরি সুপার ফাস্ট অনলাইন স্টোর ওয়েবসাইট।',
    techStack: ['Next.js', 'Tailwind', 'বিকাশ ও নগদ গেটওয়ে', 'Google Ads Tracking'],
    liveUrl: 'https://example.com/demo/tekka-gadgets',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-4',
    title: 'Modhudhara Organics - খাঁটি মধু ও ফুড ওয়েবসাইট',
    category: 'অর্গানিক ফুড ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'সুন্দরবনের খাঁটি মধু, কোল্ড-প্রেসড সরিষার তেল ও পুষ্টিকর অর্গানিক খাদ্য বিক্রির জন্য বিশেষায়িত ওয়েবসাইট।',
    techStack: ['React', 'Tailwind CSS', 'হোয়াটসঅ্যাপ ডিরেক্ট অর্ডার', 'ইনভেন্টরি সিস্টেম'],
    liveUrl: 'https://example.com/demo/modhudhara-organics',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-5',
    title: 'DermaBD Clinic - ডার্মাটোলজি ও হেলথকেয়ার ওয়েবসাইট',
    category: 'হেলথকেয়ার ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    description: 'ডক্টর কনসালটেশন অ্যাপয়েন্টমেন্ট ও মেডিসিনাল স্কিনকেয়ার পণ্যের জন্য তৈরি করপোরেট ওয়েবসাইট।',
    techStack: ['Tailwind CSS', 'Online Booking', 'হোয়াটসঅ্যাপ কনসাল্টেশন'],
    liveUrl: 'https://example.com/demo/dermabd-clinic',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-6',
    title: 'Daily Bazar Express - গ্রোসারি ও সুপারশপ ওয়েবসাইট',
    category: 'গ্রোসারি ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    description: 'নিত্যপ্রয়োজনীয় বাজার, ফলমূল ও শাকসবজি দ্রুত ডেলিভারির আধুনিক ই-কমার্স গ্রোসারি ওয়েবসাইট।',
    techStack: ['React', 'ক্যাশ অন ডেলিভারি', 'হোয়াটসঅ্যাপ অর্ডার', 'ফাস্ট কার্ট'],
    liveUrl: 'https://example.com/demo/daily-bazar',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-7',
    title: 'BabyLand BD - বাচ্চাদের পোশাক ও খেলনার ওয়েবসাইট',
    category: 'কিডস ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    description: 'শিশুদের আকর্ষণীয় পোশাক, বেবি কেয়ার সামগ্রী ও খেলনা বিক্রির চমৎকার মোবাইল-রেডি ওয়েবসাইট।',
    techStack: ['Next.js', 'হোয়াটসঅ্যাপ চেকআউট', 'ফেসবুক পিক্সেল', 'ফ্রি এসএসএল'],
    liveUrl: 'https://example.com/demo/babyland-bd',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-8',
    title: 'Leather Crafts BD - জেনুইন লেদার প্রডাক্ট ওয়েবসাইট',
    category: 'লেদার ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    description: 'প্রিমিয়াম লেদার ওয়ালেট, বেল্ট, অফিস ব্যাগ ও জুতা শোকেস এবং সেলসের লাক্সারি ওয়েবসাইট।',
    techStack: ['React', 'Tailwind', 'বিকাশ ও সিওডি', 'হোয়াটসঅ্যাপ সাপোর্ট'],
    liveUrl: 'https://example.com/demo/leather-crafts',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-9',
    title: 'Royal Perfume House - এক্সক্লুসিভ পারফিউম ওয়েবসাইট',
    category: 'পারফিউম ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    description: 'অ্যারাবিয়ান আতর, ফ্রেগ্রেন্স ও লাক্সারি পারফিউম অনলাইনের গ্রাহকদের কাছে পৌঁছে দেওয়ার প্রিমিয়াম ওয়েবসাইট।',
    techStack: ['Tailwind CSS', 'অটো হোয়াটসঅ্যাপ মেসেজিং', 'মেটা সেলস ক্যাম্পেইন'],
    liveUrl: 'https://example.com/demo/royal-perfume',
    createdAt: new Date().toISOString()
  },
  {
    id: 'port-10',
    title: 'HomeDecor BD - হোম ইন্টেরিয়র ও এক্সেসরিজ ওয়েবসাইট',
    category: 'হোম ডেকর ওয়েবসাইট',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'আধুনিক ঘরের সৌন্দর্য বৃদ্ধির লাইটিং, ওয়াল আর্ট ও ফার্নিচার শোকেসের আকর্ষণীয় লাইফস্টাইল ওয়েবসাইট।',
    techStack: ['Next.js', 'Tailwind', 'হোয়াটসঅ্যাপ ক্যাটালগ', 'এসইও অপ্টিমাইজড'],
    liveUrl: 'https://example.com/demo/homedecor-bd',
    createdAt: new Date().toISOString()
  }
];

const defaultLeads: LeadOrder[] = [];

function getDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        settings: { ...defaultSettings, ...parsed.settings },
        categories: parsed.categories || defaultCategories,
        services: parsed.services || defaultServices,
        pricingPlans: parsed.pricingPlans || defaultPricingPlans,
        partnerBrands: parsed.partnerBrands || defaultPartnerBrands,
        advantages: parsed.advantages || defaultAdvantages,
        testimonials: parsed.testimonials || defaultTestimonials,
        faqs: parsed.faqs || defaultFaqs,
        blogs: parsed.blogs || defaultBlogs,
        portfolio: parsed.portfolio || defaultPortfolio,
        leads: parsed.leads || defaultLeads,
        admin: parsed.admin || {
          username: 'admin',
          passwordHash: 'admin123',
          name: 'Super Admin',
          email: 'admin@degitalwbagency.com'
        }
      };
    }
  } catch (err) {
    console.error('Error reading database file, using defaults:', err);
  }

  const initialData: DatabaseSchema = {
    settings: defaultSettings,
    categories: defaultCategories,
    services: defaultServices,
    pricingPlans: defaultPricingPlans,
    partnerBrands: defaultPartnerBrands,
    advantages: defaultAdvantages,
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
    blogs: defaultBlogs,
    portfolio: defaultPortfolio,
    leads: defaultLeads,
    admin: {
      username: 'admin',
      passwordHash: 'admin123',
      name: 'Super Admin',
      email: 'admin@degitalwbagency.com'
    }
  };

  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Disable caching for all API endpoints to guarantee immediate updates
  app.use('/api', (_req: Request, res: Response, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Initialize DB
  getDatabase();

  // -------------------------------------------------------------
  // REST API Routes
  // -------------------------------------------------------------

  // Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const db = getDatabase();
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // Categories
  app.get('/api/categories', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json([...db.categories].sort((a, b) => a.order - b.order));
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    const db = getDatabase();
    const { name, description, icon, image, order, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: description || '',
      icon: icon || 'Folder',
      image: image || '',
      order: typeof order === 'number' ? order : db.categories.length + 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString()
    };
    db.categories.push(newCategory);
    saveDatabase(db);
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.categories.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    db.categories[index] = { ...db.categories[index], ...req.body, id: db.categories[index].id };
    saveDatabase(db);
    res.json(db.categories[index]);
  });

  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.categories = db.categories.filter((c) => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Services
  app.get('/api/services', (req: Request, res: Response) => {
    const db = getDatabase();
    const { category, search, status } = req.query;
    let list = [...db.services];

    if (category && category !== 'all') {
      list = list.filter((s) => s.categoryId === category || s.categoryId.toLowerCase() === (category as string).toLowerCase());
    }
    if (status && status !== 'all') {
      list = list.filter((s) => s.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
    }
    res.json(list);
  });

  app.get('/api/services/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const s = db.services.find((item) => item.id === req.params.id || item.slug === req.params.id);
    if (!s) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    s.views = (s.views || 0) + 1;
    saveDatabase(db);
    res.json(s);
  });

  app.post('/api/services', (req: Request, res: Response) => {
    const db = getDatabase();
    const { title, categoryId, price, shortDescription, fullDescription, images, demoUrl, deliveryTime, features, status } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
    const newService: Service = {
      id: `serv-${Date.now()}`,
      title,
      slug,
      categoryId,
      price,
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      images: Array.isArray(images) ? images.slice(0, 3) : [],
      demoUrl: demoUrl || '',
      deliveryTime: deliveryTime || '',
      features: Array.isArray(features) ? features : [],
      status: status === 'draft' ? 'draft' : 'published',
      views: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.services.unshift(newService);
    saveDatabase(db);
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.services.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    db.services[index] = { ...db.services[index], ...req.body, id: db.services[index].id, updatedAt: new Date().toISOString() };
    saveDatabase(db);
    res.json(db.services[index]);
  });

  app.delete('/api/services/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.services = db.services.filter((s) => s.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  app.post('/api/services/:id/duplicate', (req: Request, res: Response) => {
    const db = getDatabase();
    const s = db.services.find((item) => item.id === req.params.id);
    if (!s) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    const dup: Service = {
      ...s,
      id: `serv-${Date.now()}`,
      title: `${s.title} (Copy)`,
      slug: `${s.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      views: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.services.unshift(dup);
    saveDatabase(db);
    res.status(201).json(dup);
  });

  // Pricing Plans
  app.get('/api/pricing', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json([...db.pricingPlans].sort((a, b) => a.order - b.order));
  });

  app.post('/api/pricing', (req: Request, res: Response) => {
    const db = getDatabase();
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      ...req.body,
      order: req.body.order || db.pricingPlans.length + 1
    };
    db.pricingPlans.push(newPlan);
    saveDatabase(db);
    res.status(201).json(newPlan);
  });

  app.put('/api/pricing/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.pricingPlans.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Plan not found' });
      return;
    }
    db.pricingPlans[index] = { ...db.pricingPlans[index], ...req.body, id: db.pricingPlans[index].id };
    saveDatabase(db);
    res.json(db.pricingPlans[index]);
  });

  app.delete('/api/pricing/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.pricingPlans = db.pricingPlans.filter((p) => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Partner Brands
  app.get('/api/brands', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json([...db.partnerBrands].sort((a, b) => a.order - b.order));
  });

  app.post('/api/brands', (req: Request, res: Response) => {
    const db = getDatabase();
    const newBrand: PartnerBrand = {
      id: `brand-${Date.now()}`,
      ...req.body,
      order: req.body.order || db.partnerBrands.length + 1
    };
    db.partnerBrands.push(newBrand);
    saveDatabase(db);
    res.status(201).json(newBrand);
  });

  app.put('/api/brands/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.partnerBrands.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    db.partnerBrands[index] = { ...db.partnerBrands[index], ...req.body, id: db.partnerBrands[index].id };
    saveDatabase(db);
    res.json(db.partnerBrands[index]);
  });

  app.delete('/api/brands/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.partnerBrands = db.partnerBrands.filter((b) => b.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Testimonials
  app.get('/api/testimonials', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json([...db.testimonials].sort((a, b) => a.order - b.order));
  });

  app.post('/api/testimonials', (req: Request, res: Response) => {
    const db = getDatabase();
    const item: Testimonial = {
      id: `test-${Date.now()}`,
      ...req.body,
      order: req.body.order || db.testimonials.length + 1
    };
    db.testimonials.push(item);
    saveDatabase(db);
    res.status(201).json(item);
  });

  app.put('/api/testimonials/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.testimonials.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    db.testimonials[index] = { ...db.testimonials[index], ...req.body, id: db.testimonials[index].id };
    saveDatabase(db);
    res.json(db.testimonials[index]);
  });

  app.delete('/api/testimonials/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // FAQs
  app.get('/api/faqs', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json([...db.faqs].sort((a, b) => a.order - b.order));
  });

  app.post('/api/faqs', (req: Request, res: Response) => {
    const db = getDatabase();
    const faq: FaqItem = {
      id: `faq-${Date.now()}`,
      ...req.body,
      order: req.body.order || db.faqs.length + 1
    };
    db.faqs.push(faq);
    saveDatabase(db);
    res.status(201).json(faq);
  });

  app.put('/api/faqs/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.faqs.findIndex((f) => f.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    db.faqs[index] = { ...db.faqs[index], ...req.body, id: db.faqs[index].id };
    saveDatabase(db);
    res.json(db.faqs[index]);
  });

  app.delete('/api/faqs/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.faqs = db.faqs.filter((f) => f.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Portfolio
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.portfolio);
  });

  app.post('/api/portfolio', (req: Request, res: Response) => {
    const db = getDatabase();
    const newProject: PortfolioProject = {
      id: `port-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    db.portfolio.unshift(newProject);
    saveDatabase(db);
    res.status(201).json(newProject);
  });

  app.put('/api/portfolio/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const index = db.portfolio.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    db.portfolio[index] = { ...db.portfolio[index], ...req.body, id: db.portfolio[index].id };
    saveDatabase(db);
    res.json(db.portfolio[index]);
  });

  app.delete('/api/portfolio/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    db.portfolio = db.portfolio.filter((p) => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Leads
  app.get('/api/leads', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.leads);
  });

  app.post('/api/leads', (req: Request, res: Response) => {
    const db = getDatabase();
    const newLead: LeadOrder = {
      id: `lead-${Date.now()}`,
      serviceTitle: req.body.serviceTitle || 'General WhatsApp Inquiry',
      categoryName: req.body.categoryName || 'General',
      price: req.body.price || 'N/A',
      customerName: req.body.customerName || 'WhatsApp Customer',
      customerPhone: req.body.customerPhone || '',
      message: req.body.message || '',
      status: 'new',
      source: req.body.source || 'whatsapp_button',
      createdAt: new Date().toISOString()
    };
    db.leads.unshift(newLead);
    saveDatabase(db);
    res.status(201).json(newLead);
  });

  app.put('/api/leads/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const lead = db.leads.find((l) => l.id === req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    if (req.body.status) lead.status = req.body.status;
    saveDatabase(db);
    res.json(lead);
  });

  // Upload
  app.post('/api/upload', (req: Request, res: Response) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl) {
        res.status(400).json({ error: 'No image provided' });
        return;
      }
      if (dataUrl.startsWith('data:image/')) {
        const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'png';
          const buffer = Buffer.from(matches[2], 'base64');
          const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, safeName);
          fs.writeFileSync(filePath, buffer);
          res.json({ success: true, url: `/uploads/${safeName}` });
          return;
        }
      }
      res.json({ success: true, url: dataUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Upload failed' });
    }
  });

  // Auth
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const db = getDatabase();
    if (username === db.admin.username && password === db.admin.passwordHash) {
      res.json({
        success: true,
        token: `session_${Buffer.from(username + ':' + Date.now()).toString('base64')}`,
        user: {
          username: db.admin.username,
          name: db.admin.name,
          email: db.admin.email,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  app.post('/api/auth/change-password', (req: Request, res: Response) => {
    const { currentPassword, newPassword, name, email } = req.body;
    const db = getDatabase();
    if (currentPassword !== db.admin.passwordHash) {
      res.status(400).json({ error: 'Current password does not match' });
      return;
    }
    if (newPassword && newPassword.length >= 4) {
      db.admin.passwordHash = newPassword;
    }
    if (name) db.admin.name = name;
    if (email) db.admin.email = email;
    saveDatabase(db);
    res.json({ success: true, message: 'Profile updated' });
  });

  // Stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json({
      totalServices: db.services.length,
      totalCategories: db.categories.length,
      publishedServices: db.services.filter((s) => s.status === 'published').length,
      draftServices: db.services.filter((s) => s.status === 'draft').length,
      totalLeads: db.leads.length,
      totalOrdersTracked: db.services.reduce((acc, s) => acc + (s.ordersCount || 0), 0)
    });
  });

  // -------------------------------------------------------------
  // Vite Server Integration & Direct /admin routing support!
  // -------------------------------------------------------------
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> DEGITAL WB AGENCY Server ready on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
