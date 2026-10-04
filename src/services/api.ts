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
  WebsiteSettings,
  AdminUser
} from '../types/index.ts';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method === 'GET';
  const url = isGet
    ? `${API_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}_t=${Date.now()}`
    : `${API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    ...(options.headers as Record<string, string> || {})
  };

  const res = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Settings
  async getSettings(): Promise<WebsiteSettings> {
    return request<WebsiteSettings>('/settings');
  },

  async updateSettings(data: Partial<WebsiteSettings>): Promise<{ success: boolean; settings: WebsiteSettings }> {
    return request<{ success: boolean; settings: WebsiteSettings }>('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return request<Category[]>('/categories');
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' });
  },

  async reorderCategories(orderedIds: string[]): Promise<Category[]> {
    return request<Category[]>('/categories/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    });
  },

  // Services
  async getServices(): Promise<Service[]> {
    return request<Service[]>('/services');
  },

  async getService(idOrSlug: string): Promise<Service> {
    return request<Service>(`/services/${idOrSlug}`);
  },

  async createService(data: Partial<Service>): Promise<Service> {
    return request<Service>('/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    return request<Service>(`/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/services/${id}`, { method: 'DELETE' });
  },

  async duplicateService(id: string): Promise<Service> {
    return request<Service>(`/services/${id}/duplicate`, { method: 'POST' });
  },

  async trackOrder(serviceId: string, customerData: { name?: string; phone?: string; notes?: string }): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/services/${serviceId}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
  },

  // Pricing
  async getPricing(): Promise<PricingPlan[]> {
    return request<PricingPlan[]>('/pricing');
  },

  async createPricing(data: Partial<PricingPlan>): Promise<PricingPlan> {
    return request<PricingPlan>('/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updatePricing(id: string, data: Partial<PricingPlan>): Promise<PricingPlan> {
    return request<PricingPlan>(`/pricing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deletePricing(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/pricing/${id}`, { method: 'DELETE' });
  },

  // Brands
  async getBrands(): Promise<PartnerBrand[]> {
    return request<PartnerBrand[]>('/brands');
  },

  async createBrand(data: Partial<PartnerBrand>): Promise<PartnerBrand> {
    return request<PartnerBrand>('/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateBrand(id: string, data: Partial<PartnerBrand>): Promise<PartnerBrand> {
    return request<PartnerBrand>(`/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteBrand(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/brands/${id}`, { method: 'DELETE' });
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return request<Testimonial[]>('/testimonials');
  },

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    return request<Testimonial>('/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    return request<Testimonial>(`/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/testimonials/${id}`, { method: 'DELETE' });
  },

  // FAQs
  async getFaqs(): Promise<FaqItem[]> {
    return request<FaqItem[]>('/faqs');
  },

  async createFaq(data: Partial<FaqItem>): Promise<FaqItem> {
    return request<FaqItem>('/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateFaq(id: string, data: Partial<FaqItem>): Promise<FaqItem> {
    return request<FaqItem>(`/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/faqs/${id}`, { method: 'DELETE' });
  },

  // Portfolio
  async getPortfolio(): Promise<PortfolioProject[]> {
    return request<PortfolioProject[]>('/portfolio');
  },

  async createPortfolio(data: Partial<PortfolioProject>): Promise<PortfolioProject> {
    return request<PortfolioProject>('/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updatePortfolio(id: string, data: Partial<PortfolioProject>): Promise<PortfolioProject> {
    return request<PortfolioProject>(`/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deletePortfolio(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/portfolio/${id}`, { method: 'DELETE' });
  },

  // Leads
  async getLeads(): Promise<LeadOrder[]> {
    return request<LeadOrder[]>('/leads');
  },

  async recordLead(data: Partial<LeadOrder>): Promise<LeadOrder> {
    return request<LeadOrder>('/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateLeadStatus(id: string, status: string): Promise<LeadOrder> {
    return request<LeadOrder>(`/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  // Upload
  async uploadImage(dataUrl: string): Promise<{ success: boolean; url: string }> {
    return request<{ success: boolean; url: string }>('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
  },

  // Auth
  async loginAdmin(credentials: { username: string; password: string }): Promise<{ success: boolean; token: string; user: AdminUser }> {
    return request<{ success: boolean; token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  },

  async changePassword(data: { currentPassword: string; newPassword?: string; name?: string; email?: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  // Stats
  async getStats(): Promise<any> {
    return request<any>('/stats');
  }
};
