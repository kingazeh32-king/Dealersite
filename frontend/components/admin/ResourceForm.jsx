'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from '@/lib/adminUi';

const types = ['buying-guide', 'permit', 'maintenance', 'general'];

const emptyForm = {
  title: '', type: 'buying-guide', excerpt: '', content: '', reading_time: '', is_published: true,
};

function toForm(resource) {
  if (!resource) return emptyForm;
  return {
    title: resource.title || '',
    type: resource.type || 'buying-guide',
    excerpt: resource.excerpt || '',
    content: resource.content || '',
    reading_time: resource.reading_time ?? '',
    is_published: resource.is_published ?? true,
  };
}

export default function ResourceForm({ token, resource }) {
  const router = useRouter();
  const isEdit = !!resource;
  const [form, setForm] = useState(() => toForm(resource));
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
        title: form.title,
        type: form.type,
        excerpt: form.excerpt || null,
        content: form.content || null,
        reading_time: form.reading_time ? Number(form.reading_time) : null,
        is_published: form.is_published,
      };
      if (isEdit) {
        await api.updateResource(token, resource.id, payload);
      } else {
        await api.createResource(token, payload);
      }
      router.push('/admin/resources');
    } catch (err) {
      setError(err.message || 'Failed to save');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
      {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-navy">Title</label>
        <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-navy">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Reading time (min)</label>
          <input name="reading_time" type="number" min="1" value={form.reading_time} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Excerpt</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Content (HTML)</label>
        <textarea name="content" value={form.content} onChange={handleChange} rows={12} className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
        Published
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className={adminPrimaryBtnClass}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create article'}
        </button>
        <button type="button" onClick={() => router.push('/admin/resources')} className={adminSecondaryBtnClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}
