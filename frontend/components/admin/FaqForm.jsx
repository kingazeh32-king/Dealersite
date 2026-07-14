'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

const categories = ['general', 'financing', 'delivery', 'installation', 'buying'];

const emptyForm = {
  question: '', answer: '', category: 'general', sort_order: '0', is_published: true,
};

function toForm(faq) {
  if (!faq) return emptyForm;
  return {
    question: faq.question || '',
    answer: faq.answer || '',
    category: faq.category || 'general',
    sort_order: String(faq.sort_order ?? 0),
    is_published: faq.is_published ?? true,
  };
}

export default function FaqForm({ token, faq }) {
  const router = useRouter();
  const isEdit = !!faq;
  const [form, setForm] = useState(() => toForm(faq));
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
      const payload = {
        question: form.question,
        answer: form.answer,
        category: form.category,
        sort_order: Number(form.sort_order),
        is_published: form.is_published,
      };
      if (isEdit) {
        await api.updateFaq(token, faq.id, payload);
      } else {
        await api.createFaq(token, payload);
      }
      router.push('/admin/faqs');
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
          <label className="block text-sm font-medium text-navy">Question</label>
          <input name="question" value={form.question} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Answer</label>
          <textarea name="answer" value={form.answer} onChange={handleChange} required rows={5} className={inputClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-navy">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Sort order</label>
            <input name="sort_order" type="number" min="0" value={form.sort_order} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
          Published
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60">
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create FAQ'}
        </button>
        <button type="button" onClick={() => router.push('/admin/faqs')} className="rounded-md border border-slate-200 px-6 py-2.5 text-sm text-navy">Cancel</button>
      </div>
    </form>
  );
}
