const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function normalizeTestimonial(row) {
  if (!row) return null;
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    location: row.location || '',
    home: row.home || '',
    rating: row.rating ?? 5,
    sortOrder: row.sort_order ?? 0,
    isPublished: row.is_published ?? true,
  };
}

export function toTestimonialPayload(form) {
  return {
    quote: form.quote,
    name: form.name,
    location: form.location || null,
    home: form.home || null,
    rating: form.rating ? Number(form.rating) : 5,
    sort_order: form.sortOrder !== '' ? Number(form.sortOrder) : 0,
    is_published: form.isPublished,
  };
}

export async function fetchTestimonials() {
  try {
    const res = await fetch(`${API_URL}/testimonials`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.rows || []).map(normalizeTestimonial).filter(Boolean);
  } catch {
    return [];
  }
}
