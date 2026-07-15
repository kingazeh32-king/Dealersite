'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { normalizeSettings, toApiPayload } from '@/lib/siteSettings';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

function toForm(settings) {
  return {
    siteName: settings.siteName || '',
    tagline: settings.tagline || '',
    logoUrl: settings.logoUrl || '/logo.svg',
    contactPhone: settings.contact?.phone || '',
    contactEmail: settings.contact?.email || '',
    contactAddress: settings.contact?.address || '',
    contactCity: settings.contact?.city || '',
    contactHours: settings.contact?.hours || '',
  };
}

export default function SiteSettingsForm({ token, onSaved }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((data) => setForm(toForm(normalizeSettings(data.settings))))
      .catch(() => setError('Failed to load site settings'));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const data = await api.uploadLogo(token, file);
      const normalized = normalizeSettings(data.settings);
      setForm((prev) => ({ ...prev, logoUrl: normalized.logoUrl }));
      setSuccess('Logo uploaded and saved. Refresh the public site to see it.');
      onSaved?.(normalized);
    } catch (err) {
      setError(err.message || 'Logo upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || !form) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = toApiPayload({
        siteName: form.siteName,
        tagline: form.tagline,
        logoUrl: form.logoUrl,
        contact: {
          phone: form.contactPhone,
          email: form.contactEmail,
          address: form.contactAddress,
          city: form.contactCity,
          hours: form.contactHours,
        },
      });

      const data = await api.updateSettings(token, payload);
      const normalized = normalizeSettings(data.settings);
      setForm(toForm(normalized));
      setSuccess('Site settings saved. Visit the public site to see changes.');
      onSaved?.(normalized);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  if (!form) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
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

      <section className="border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy">Site identity</h2>
        <p className="mt-1 text-sm text-slate">
          Your dealership name and logo appear in the header, footer, and browser tab.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">Site name</label>
            <input
              type="text"
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="Manufactured & Tiny Homes"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate">Shown in page titles and SEO metadata.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">Logo</label>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex h-16 min-w-[120px] items-center justify-center rounded-md border border-slate-200 bg-slate-light/50 px-4">
                <img
                  src={form.logoUrl}
                  alt="Current logo"
                  className="max-h-12 max-w-[160px] object-contain"
                />
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleLogoChange}
                  className="text-sm text-slate"
                />
                <p className="mt-1 text-xs text-slate">
                  {uploading ? 'Uploading…' : 'JPEG, PNG, WebP, GIF, or SVG. Max 5 MB.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy">Contact information</h2>
        <p className="mt-1 text-sm text-slate">
          Displayed in the footer, contact page, and anywhere visitors reach out.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-navy">Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy">Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">Street address</label>
            <input
              type="text"
              name="contactAddress"
              value={form.contactAddress}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">City, state & ZIP</label>
            <input
              type="text"
              name="contactCity"
              value={form.contactCity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">Business hours</label>
            <input
              type="text"
              name="contactHours"
              value={form.contactHours}
              onChange={handleChange}
              placeholder="Mon–Fri 9am–6pm · Sat 10am–4pm"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className={adminPrimaryBtnClass}
        >
          {loading ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}
