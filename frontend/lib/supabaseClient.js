/**
 * Data layer client — bridges Next.js frontend to Express backend + PostgreSQL.
 *
 * This is NOT a Supabase client. It's a custom data access layer that wraps
 * the Express API client and provides domain-specific functions for properties,
 * homes, and leads management.
 *
 * Table/Route mapping:
 *   properties table  →  GET  /api/properties
 *   leads table       →  POST /api/leads
 */

import { api, ApiError } from './api';

/**
 * Fetch all available homes from the inventory.
 * Maps to the `properties` table where status = 'available'.
 *
 * @param {Object} [options]
 * @param {string} [options.category] - 'new' | 'pre-owned' | 'tiny'
 * @param {string} [options.sort]     - 'newest' | 'price_asc' | 'price_desc' | 'featured'
 * @param {number} [options.limit]    - Max results (default 20, max 100)
 * @param {string} [options.search]   - Text search (name, description, make/model)
 * @param {number} [options.offset]   - Pagination offset
 * @returns {Promise<{ homes: Object[], total: number, limit: number, offset: number }>}
 */
export async function fetchAvailableHomes(options = {}) {
  const { category, sort, search, limit, offset } = options;

  const result = await api.getProperties({
    status: 'available',
    category,
    sort,
    search,
    limit,
    offset,
  });

  return {
    homes: result.rows,
    total: result.total,
    limit: result.limit,
    offset: result.offset,
  };
}

/**
 * Fetch featured available homes for the landing page.
 * @param {number} [limit=6]
 * @returns {Promise<Object[]>}
 */
export async function fetchFeaturedHomes(limit = 6) {
  const result = await api.getFeaturedProperties(limit);
  return result.rows || [];
}

/**
 * Insert a new lead into the `leads` table.
 *
 * @param {Object} lead
 * @param {'newsletter' | 'prequalify'} lead.type
 * @param {string} lead.email
 * @param {string} [lead.name]
 * @param {string} [lead.phone]
 * @param {string} [lead.income_range]   - For prequalify leads
 * @param {string} [lead.credit_range]   - For prequalify leads
 * @param {number} [lead.desired_price]  - For prequalify leads
 * @returns {Promise<Object>} The created lead record
 */
export async function insertLead(lead) {
  if (!lead?.type) {
    throw new ApiError('Lead type is required', 400);
  }
  if (!lead?.email) {
    throw new ApiError('Email is required', 400);
  }
  if (!['newsletter', 'prequalify'].includes(lead.type)) {
    throw new ApiError('Lead type must be "newsletter" or "prequalify"', 400);
  }
  if (lead.type === 'prequalify' && !lead.name?.trim()) {
    throw new ApiError('Name is required for pre-qualification', 400);
  }

  const result = await api.submitLead({
    type: lead.type,
    email: lead.email,
    name: lead.name || null,
    phone: lead.phone || null,
    income_range: lead.income_range || null,
    credit_range: lead.credit_range || null,
    desired_price: lead.desired_price || null,
  });

  return result.lead;
}

/**
 * Fetch a single home by slug (URL-friendly ID).
 * Maps to GET /api/properties/:slug
 *
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function fetchHomeBySlug(slug) {
  const result = await api.getPropertyBySlug(slug);
  return result.property || null;
}

/**
 * Submit a property inquiry (contact form on detail page).
 * Maps to the `inquiries` table — linked to a specific home.
 *
 * @param {Object} inquiry
 * @param {string} inquiry.name
 * @param {string} [inquiry.email]
 * @param {string} [inquiry.phone]
 * @param {string} [inquiry.message]
 * @param {number} [inquiry.property_id]
 * @param {string} [inquiry.property_name]
 * @returns {Promise<Object>}
 */
export async function insertInquiry(inquiry) {
  if (!inquiry?.name?.trim()) {
    throw new ApiError('Name is required', 400);
  }
  if (!inquiry?.email && !inquiry?.phone) {
    throw new ApiError('Email or phone is required', 400);
  }

  const result = await api.submitInquiry({
    name: inquiry.name.trim(),
    email: inquiry.email || null,
    phone: inquiry.phone || null,
    message: inquiry.message || null,
    property_id: inquiry.property_id || null,
    property_name: inquiry.property_name || null,
    inquiry_type: inquiry.inquiry_type || 'property',
  });

  return result.inquiry;
}

export async function fetchResources(options = {}) {
  const result = await api.getResources(options);
  return { articles: result.rows || [], total: result.total };
}

export async function fetchResourceBySlug(slug) {
  const result = await api.getResourceBySlug(slug);
  return result.resource || null;
}

export async function fetchFaqs(category) {
  const result = await api.getFaqs(category);
  return result.rows || [];
}

export async function fetchTeamMembers() {
  const result = await api.getTeamMembers();
  return result.rows || [];
}

/** Default export — use named imports or this object in components */
const supabaseClient = {
  fetchAvailableHomes,
  fetchFeaturedHomes,
  fetchHomeBySlug,
  fetchResources,
  fetchResourceBySlug,
  fetchFaqs,
  fetchTeamMembers,
  insertLead,
  insertInquiry,
};

export default supabaseClient;
export { ApiError };
