'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { normalizePage } from '@/lib/pages';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

const emptySection = { heading: '', body: '' };
const emptyHighlight = { title: '', body: '' };

function toForm(page) {
  const normalized = normalizePage(page);
  return {
    title: normalized.title || '',
    subtitle: normalized.subtitle || '',
    sections: normalized.sections.length ? normalized.sections : [{ ...emptySection }],
    highlights: normalized.highlights.length ? normalized.highlights : [{ ...emptyHighlight }],
  };
}

export default function PageEditorForm({ token, slug, pageLabel }) {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .getPage(slug)
      .then((data) => setForm(toForm(data.page)))
      .catch(() => setError(`Failed to load ${pageLabel} page`));
  }, [slug, pageLabel]);

  function updateSection(index, field, value) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
    setSuccess('');
  }

  function updateHighlight(index, field, value) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    }));
    setSuccess('');
  }

  function addSection() {
    setForm((prev) => ({ ...prev, sections: [...prev.sections, { ...emptySection }] }));
  }

  function removeSection(index) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  function addHighlight() {
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, { ...emptyHighlight }] }));
  }

  function removeHighlight(index) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || !form) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.updatePage(token, slug, {
        title: form.title,
        subtitle: form.subtitle,
        sections: form.sections.filter((s) => s.heading || s.body),
        highlights: form.highlights.filter((h) => h.title || h.body),
      });
      setSuccess('Page saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  }

  if (!form) {
    return <div className="h-40 animate-pulse rounded-lg bg-slate-200" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          {success}
        </p>
      )}

      <div className="border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy">Page title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Subtitle</label>
          <textarea
            value={form.subtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
            rows={2}
            className={inputClass}
          />
        </div>
      </div>

      <div className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy">Content sections</h2>
          <button
            type="button"
            onClick={addSection}
            className="text-sm font-medium text-navy hover:text-gold"
          >
            + Add section
          </button>
        </div>
        <div className="mt-4 space-y-6">
          {form.sections.map((section, index) => (
            <div key={index} className="rounded-md border border-slate-100 bg-slate-light/30 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-navy">Section {index + 1}</p>
                {form.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={section.heading}
                onChange={(e) => updateSection(index, 'heading', e.target.value)}
                placeholder="Heading"
                className={inputClass}
              />
              <textarea
                value={section.body}
                onChange={(e) => updateSection(index, 'body', e.target.value)}
                placeholder="Body text"
                rows={3}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy">Highlight cards</h2>
          <button
            type="button"
            onClick={addHighlight}
            className="text-sm font-medium text-navy hover:text-gold"
          >
            + Add card
          </button>
        </div>
        <p className="mt-1 text-sm text-slate">
          Short cards shown on the page and home page teaser.
        </p>
        <div className="mt-4 space-y-6">
          {form.highlights.map((item, index) => (
            <div key={index} className="rounded-md border border-slate-100 bg-slate-light/30 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-navy">Card {index + 1}</p>
                {form.highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                placeholder="Card title"
                className={inputClass}
              />
              <textarea
                value={item.body}
                onChange={(e) => updateHighlight(index, 'body', e.target.value)}
                placeholder="Card description"
                rows={2}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={adminPrimaryBtnClass}
      >
        {loading ? 'Saving…' : 'Save page'}
      </button>
    </form>
  );
}
