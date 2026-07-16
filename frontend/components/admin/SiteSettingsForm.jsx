'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { normalizeSettings, toApiPayload } from '@/lib/siteSettings';
import { resolveImageUrl } from '@/lib/images';
import { useSiteSettings } from '@/context/SiteSettingsContext';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

function toForm(settings) {
  return {
    siteName: settings.siteName || '',
    tagline: settings.tagline || '',
    logoUrl: settings.logoUrl || '/logo.svg',
    faviconUrl: settings.faviconUrl || '/icon.svg',
    contactPhone: settings.contact?.phone || '',
    contactEmail: settings.contact?.email || '',
    contactAddress: settings.contact?.address || '',
    contactCity: settings.contact?.city || '',
    contactHours: settings.contact?.hours || '',
  };
}

export default function SiteSettingsForm({ token, onSaved }) {
  const logoFileRef = useRef(null);
  const faviconFileRef = useRef(null);
  const { setSettings } = useSiteSettings();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((data) => {
        const normalized = normalizeSettings(data.settings);
        setForm(toForm(normalized));
        setSettings(normalized);
      })
      .catch(() => setError('Failed to load site settings'));
  }, [setSettings]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingLogo(true);
    setError('');
    setSuccess('');

    try {
      const data = await api.uploadLogo(token, file);
      const normalized = normalizeSettings(data.settings);
      setForm((prev) => ({
        ...prev,
        logoUrl: normalized.logoUrl,
        faviconUrl: normalized.faviconUrl,
      }));
      setSettings(normalized);
      setSuccess('Logo uploaded and saved. Refresh the public site to see it.');
      onSaved?.(normalized);
    } catch (err) {
      setError(err.message || 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
      if (logoFileRef.current) logoFileRef.current.value = '';
    }
  }

  async function handleFaviconChange(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingFavicon(true);
    setError('');
    setSuccess('');

    try {
      const data = await api.uploadFavicon(token, file);
      const normalized = normalizeSettings(data.settings);
      setForm((prev) => ({
        ...prev,
        logoUrl: normalized.logoUrl,
        faviconUrl: normalized.faviconUrl,
      }));
      setSettings(normalized);
      setSuccess('Favicon uploaded and saved. Refresh the public site to see it.');
      onSaved?.(normalized);
    } catch (err) {
      setError(err.message || 'Favicon upload failed');
    } finally {
      setUploadingFavicon(false);
      if (faviconFileRef.current) faviconFileRef.current.value = '';
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
        faviconUrl: form.faviconUrl,
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
      setSettings(normalized);
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

  const previewSrc = resolveImageUrl(form.logoUrl) || form.logoUrl;
  const faviconPreviewSrc = resolveImageUrl(form.faviconUrl) || form.faviconUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
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
              <div className="flex h-16 min-w-[120px] items-center justify-center border border-slate-200 bg-slate-light/50 px-4">
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt="Current logo"
                  className="max-h-12 max-w-[160px] object-contain"
                />
              </div>
              <div>
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleLogoChange}
                  className="text-sm text-slate"
                />
                <p className="mt-1 text-xs text-slate">
                  {uploadingLogo ? 'Uploading…' : 'JPEG, PNG, WebP, GIF, or SVG. Max 5 MB.'}
                </p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy">Favicon</label>
            <p className="mt-1 text-xs text-slate">
              Browser tab icon. Square PNG or SVG works best (32×32 or 64×64).
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center border border-slate-200 bg-slate-light/50 p-2">
                <img
                  key={faviconPreviewSrc}
                  src={faviconPreviewSrc}
                  alt="Current favicon"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <input
                  ref={faviconFileRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/webp,image/gif,image/jpeg,.ico"
                  onChange={handleFaviconChange}
                  className="text-sm text-slate"
                />
                <p className="mt-1 text-xs text-slate">
                  {uploadingFavicon
                    ? 'Uploading…'
                    : 'PNG, SVG, ICO, WebP, GIF, or JPEG. Max 2 MB.'}
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
        <button type="submit" disabled={loading} className={adminPrimaryBtnClass}>
          {loading ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}
