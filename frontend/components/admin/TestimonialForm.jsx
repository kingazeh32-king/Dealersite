'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { normalizeTestimonial, toTestimonialPayload } from '@/lib/testimonials';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

const emptyForm = {
  quote: '', name: '', location: '', home: '', rating: '5', sortOrder: '0', isPublished: true,
};

function toForm(item) {
  if (!item) return emptyForm;
  const n = normalizeTestimonial(item);
  return {
    quote: n.quote, name: n.name, location: n.location, home: n.home,
    rating: String(n.rating), sortOrder: String(n.sortOrder), isPublished: n.isPublished,
  };
}

export default function TestimonialForm({ token, testimonial }) {
  const router = useRouter();
  const isEdit = !!testimonial;
  const [form, setForm] = useState(() => toForm(testimonial));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const payload = toTestimonialPayload(form);
      if (isEdit) {
        await api.updateTestimonial(token, testimonial.id, payload);
        router.push('/admin/testimonials');
      } else {
        await api.createTestimonial(token, payload);
        router.push('/admin/testimonials');
      }
    } catch (err) {
      setError(err.message || 'Failed to save');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy">Quote</label>
          <textarea name="quote" value={form.quote} onChange={handleChange} required rows={4} className={inputClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-navy">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Home purchased</label>
            <input name="home" value={form.home} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Rating (1–5)</label>
            <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Sort order</label>
            <input name="sortOrder" type="number" min="0" value={form.sortOrder} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
          Published on website
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60">
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create testimonial'}
        </button>
        <button type="button" onClick={() => router.push('/admin/testimonials')} className="rounded-md border border-slate-200 px-6 py-2.5 text-sm text-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
