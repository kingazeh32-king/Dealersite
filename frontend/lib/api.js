/**
 * API client for the Express backend.
 * Replaces @supabase/supabase-js in our Local PostgreSQL + JWT stack.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const { token, body, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.error || 'Request failed',
      res.status,
      data.details
    );
  }

  return data;
}

export const api = {
  // Health
  health: () => request('/health'),

  // Properties
  getProperties: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString();
    return request(`/properties${query ? `?${query}` : ''}`);
  },
  getFeaturedProperties: (limit = 6) =>
    request(`/properties/featured?limit=${limit}`),
  getPropertyBySlug: (slug) => request(`/properties/${slug}`),

  // Inquiries & leads
  submitInquiry: (body) => request('/inquiries', { method: 'POST', body }),
  submitLead: (body) => request('/leads', { method: 'POST', body }),

  // Content
  getResources: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/resources${query ? `?${query}` : ''}`);
  },
  getResourceBySlug: (slug) => request(`/resources/${slug}`),
  getFaqs: (category) =>
    request(`/faqs${category ? `?category=${category}` : ''}`),

  // Site settings
  getSettings: () => request('/settings'),
  updateSettings: (token, body) =>
    request('/settings', { method: 'PUT', token, body }),
  uploadLogo: async (token, file) => {
    const formData = new FormData();
    formData.append('logo', file);

    const res = await fetch(`${API_URL}/settings/logo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(data.error || 'Logo upload failed', res.status, data.details);
    }
    return data;
  },

  // Auth (admin)
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  getMe: (token) => request('/auth/me', { token }),
  changePassword: (token, body) =>
    request('/auth/change-password', { method: 'POST', token, body }),
  changeEmail: (token, body) =>
    request('/auth/change-email', { method: 'POST', token, body }),
  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) =>
    request('/auth/reset-password', { method: 'POST', body: { token, password } }),

  // Admin — properties
  getAdminProperties: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/properties/admin/all${query ? `?${query}` : ''}`, { token });
  },
  createProperty: (token, body) =>
    request('/properties/admin', { method: 'POST', token, body }),
  updateProperty: (token, id, body) =>
    request(`/properties/admin/${id}`, { method: 'PUT', token, body }),
  updatePropertyStatus: (token, id, status) =>
    request(`/properties/admin/${id}/status`, {
      method: 'PATCH',
      token,
      body: { status },
    }),
  deleteProperty: (token, id) =>
    request(`/properties/admin/${id}`, { method: 'DELETE', token }),

  uploadPropertyImages: async (token, id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const res = await fetch(`${API_URL}/properties/admin/${id}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(data.error || 'Upload failed', res.status, data.details);
    }
    return data;
  },

  uploadPropertyFloorPlan: async (token, id, file) => {
    const formData = new FormData();
    formData.append('floorplan', file);

    const res = await fetch(`${API_URL}/properties/admin/${id}/floorplan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(data.error || 'Floor plan upload failed', res.status, data.details);
    }
    return data;
  },

  uploadPropertyVirtualTour: async (token, id, file) => {
    const formData = new FormData();
    formData.append('virtual_tour', file);

    const res = await fetch(`${API_URL}/properties/admin/${id}/virtual-tour`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(data.error || 'Virtual tour upload failed', res.status, data.details);
    }
    return data;
  },

  updatePropertyImages: (token, id, images) =>
    request(`/properties/admin/${id}/images`, {
      method: 'PUT',
      token,
      body: { images },
    }),

  // Admin — inquiries & leads
  getAdminInquiries: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/inquiries/admin${query ? `?${query}` : ''}`, { token });
  },
  updateInquiryStatus: (token, id, status) =>
    request(`/inquiries/admin/${id}/status`, {
      method: 'PATCH',
      token,
      body: { status },
    }),
  getAdminLeads: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/leads/admin${query ? `?${query}` : ''}`, { token });
  },

  // Team
  getTeamMembers: () => request('/team'),
  getAdminTeamMembers: (token) => request('/team/admin/all', { token }),
  getAdminTeamMember: (token, id) => request(`/team/admin/${id}`, { token }),
  createTeamMember: (token, body) =>
    request('/team/admin', { method: 'POST', token, body }),
  updateTeamMember: (token, id, body) =>
    request(`/team/admin/${id}`, { method: 'PUT', token, body }),
  deleteTeamMember: (token, id) =>
    request(`/team/admin/${id}`, { method: 'DELETE', token }),
  uploadTeamPhoto: async (token, id, file) => {
    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch(`${API_URL}/team/admin/${id}/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(data.error || 'Photo upload failed', res.status, data.details);
    }
    return data;
  },

  // Pages (about, financing)
  getPage: (slug) => request(`/pages/${slug}`),
  getAdminPages: (token) => request('/pages/admin/all', { token }),
  updatePage: (token, slug, body) =>
    request(`/pages/admin/${slug}`, { method: 'PUT', token, body }),

  // Testimonials
  getTestimonials: () => request('/testimonials'),
  getAdminTestimonials: (token) => request('/testimonials/admin/all', { token }),
  getAdminTestimonial: (token, id) => request(`/testimonials/admin/${id}`, { token }),
  createTestimonial: (token, body) =>
    request('/testimonials/admin', { method: 'POST', token, body }),
  updateTestimonial: (token, id, body) =>
    request(`/testimonials/admin/${id}`, { method: 'PUT', token, body }),
  deleteTestimonial: (token, id) =>
    request(`/testimonials/admin/${id}`, { method: 'DELETE', token }),

  // Admin resources
  getAdminResources: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/resources/admin/all${query ? `?${query}` : ''}`, { token });
  },
  getAdminResource: (token, id) => request(`/resources/admin/${id}`, { token }),
  createResource: (token, body) =>
    request('/resources/admin', { method: 'POST', token, body }),
  updateResource: (token, id, body) =>
    request(`/resources/admin/${id}`, { method: 'PUT', token, body }),
  deleteResource: (token, id) =>
    request(`/resources/admin/${id}`, { method: 'DELETE', token }),

  // Admin FAQs
  getAdminFaqs: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/faqs/admin/all${query ? `?${query}` : ''}`, { token });
  },
  getAdminFaq: (token, id) => request(`/faqs/admin/${id}`, { token }),
  createFaq: (token, body) => request('/faqs/admin', { method: 'POST', token, body }),
  updateFaq: (token, id, body) =>
    request(`/faqs/admin/${id}`, { method: 'PUT', token, body }),
  deleteFaq: (token, id) => request(`/faqs/admin/${id}`, { method: 'DELETE', token }),
};

export { ApiError };
