'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { resolveImageUrl } from '@/lib/images';
import { defaultHero, defaultTrustSignals, defaultHowItWorks, defaultFeaturedHomesCount, normalizeSettings } from '@/lib/siteSettings';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
} from '@/lib/adminUi';

const emptySignal = { value: '', label: '', detail: '' };
const emptyStep = { step: '', title: '', text: '' };

export default function HomePageForm({ token }) {
  const [hero, setHero] = useState(defaultHero);
  const [signals, setSignals] = useState(defaultTrustSignals);
  const [howItWorks, setHowItWorks] = useState(defaultHowItWorks);
  const [featuredHomesCount, setFeaturedHomesCount] = useState(defaultFeaturedHomesCount);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileRef = useRef(null);

  useEffect(() => {
    api.getSettings().then((data) => {
      const s = normalizeSettings(data.settings);
      setHero(s.hero);
      setSignals(s.trustSignals.length ? s.trustSignals : [{ ...emptySignal }]);
      setHowItWorks(s.howItWorks);
      setFeaturedHomesCount(s.featuredHomesCount);
    });
  }, []);

  function updateHero(field, value) {
    setHero((prev) => ({ ...prev, [field]: value }));
    setSuccess('');
  }

  function updateBadge(index, value) {
    setHero((prev) => ({
      ...prev,
      badges: prev.badges.map((b, i) => (i === index ? value : b)),
    }));
  }

  function addBadge() {
    setHero((prev) => ({ ...prev, badges: [...prev.badges, ''] }));
  }

  async function handleHeroUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingHero(true);
    setError('');
    setSuccess('');
    try {
      const data = await api.uploadHeroImage(token, file);
      const imageUrl = data.imageUrl || data.image_url;
      if (imageUrl) {
        setHero((prev) => ({ ...prev, imageUrl }));
      } else if (data.settings) {
        const s = normalizeSettings(data.settings);
        setHero(s.hero);
      }
      setSuccess('Hero image uploaded.');
    } catch (err) {
      setError(err.message || 'Hero image upload failed');
    } finally {
      setUploadingHero(false);
      if (heroFileRef.current) heroFileRef.current.value = '';
    }
  }

  function updateSignal(index, field, value) {
    setSignals((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    setSuccess('');
  }

  function addSignal() {
    setSignals((prev) => [...prev, { ...emptySignal }]);
  }

  function updateHowItWorks(field, value) {
    setHowItWorks((prev) => ({ ...prev, [field]: value }));
    setSuccess('');
  }

  function updateStep(index, field, value) {
    setHowItWorks((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
    setSuccess('');
  }

  function addStep() {
    const next = String(howItWorks.steps.length + 1).padStart(2, '0');
    setHowItWorks((prev) => ({
      ...prev,
      steps: [...prev.steps, { ...emptyStep, step: next }],
    }));
  }

  function removeStep(index) {
    setHowItWorks((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.updateSettings(token, {
        hero_content: {
          ...hero,
          badges: hero.badges.filter(Boolean),
        },
        trust_signals: signals.filter((s) => s.value || s.label),
        how_it_works: {
          ...howItWorks,
          steps: howItWorks.steps.filter((s) => s.title || s.text),
        },
        featured_homes_count: Number(featuredHomesCount),
      });
      setSuccess('Home page content saved.');
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  }

  const heroPreviewSrc = resolveImageUrl(hero.imageUrl) || hero.imageUrl;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

      <section className="border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-navy">Hero section</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy">Background image URL</label>
            <input
              className={inputClass}
              value={hero.imageUrl || ''}
              onChange={(e) => updateHero('imageUrl', e.target.value)}
              placeholder="https://… or /uploads/site/…"
            />
            <p className="mt-1 text-xs text-slate">
              Paste an image URL, or upload a file below. Save the form after changing the URL.
            </p>
            {heroPreviewSrc ? (
              <img
                key={heroPreviewSrc}
                src={heroPreviewSrc}
                alt="Hero background preview"
                className="mt-3 h-36 w-full rounded-md object-cover"
              />
            ) : null}
            <div className="mt-3">
              <input
                ref={heroFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleHeroUpload}
                disabled={!token || uploadingHero}
                className="block w-full text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {uploadingHero ? <p className="mt-1 text-xs text-slate">Uploading…</p> : null}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Eyebrow</label>
            <input className={inputClass} value={hero.eyebrow} onChange={(e) => updateHero('eyebrow', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Headline</label>
            <input className={inputClass} value={hero.title} onChange={(e) => updateHero('title', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Description</label>
            <textarea className={inputClass} rows={3} value={hero.description} onChange={(e) => updateHero('description', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy">Primary button label</label>
              <input className={inputClass} value={hero.primaryCta?.label || ''} onChange={(e) => updateHero('primaryCta', { ...hero.primaryCta, label: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy">Primary button link</label>
              <input className={inputClass} value={hero.primaryCta?.href || ''} onChange={(e) => updateHero('primaryCta', { ...hero.primaryCta, href: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy">Secondary button label</label>
              <input className={inputClass} value={hero.secondaryCta?.label || ''} onChange={(e) => updateHero('secondaryCta', { ...hero.secondaryCta, label: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy">Secondary button link</label>
              <input className={inputClass} value={hero.secondaryCta?.href || ''} onChange={(e) => updateHero('secondaryCta', { ...hero.secondaryCta, href: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Card title</label>
            <input className={inputClass} value={hero.cardTitle} onChange={(e) => updateHero('cardTitle', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Card footer text</label>
            <textarea className={inputClass} rows={2} value={hero.cardFooter} onChange={(e) => updateHero('cardFooter', e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-navy">Hero badges</label>
              <button type="button" onClick={addBadge} className="text-sm text-navy hover:text-gold">+ Add</button>
            </div>
            <div className="mt-2 space-y-2">
              {hero.badges.map((badge, i) => (
                <input key={i} className={inputClass} value={badge} onChange={(e) => updateBadge(i, e.target.value)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy">Trust signals</h2>
          <button type="button" onClick={addSignal} className="text-sm text-navy hover:text-gold">+ Add signal</button>
        </div>
        <div className="mt-4 space-y-4">
          {signals.map((signal, index) => (
            <div key={index} className="grid gap-3 rounded-md border border-slate-100 bg-slate-light/30 p-4 sm:grid-cols-3">
              <input className={inputClass} placeholder="Value" value={signal.value} onChange={(e) => updateSignal(index, 'value', e.target.value)} />
              <input className={inputClass} placeholder="Label" value={signal.label} onChange={(e) => updateSignal(index, 'label', e.target.value)} />
              <input className={inputClass} placeholder="Detail" value={signal.detail} onChange={(e) => updateSignal(index, 'detail', e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy">How it works</h2>
          <button type="button" onClick={addStep} className="text-sm text-navy hover:text-gold">
            + Add step
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy">Eyebrow</label>
            <input
              className={inputClass}
              value={howItWorks.eyebrow}
              onChange={(e) => updateHowItWorks('eyebrow', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Section title</label>
            <input
              className={inputClass}
              value={howItWorks.title}
              onChange={(e) => updateHowItWorks('title', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Description</label>
            <textarea
              className={inputClass}
              rows={2}
              value={howItWorks.description}
              onChange={(e) => updateHowItWorks('description', e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {howItWorks.steps.map((step, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-100 bg-slate-light/30 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-navy">Step {index + 1}</span>
                  {howItWorks.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    className={inputClass}
                    placeholder="Step number (e.g. 01)"
                    value={step.step}
                    onChange={(e) => updateStep(index, 'step', e.target.value)}
                  />
                  <input
                    className={`${inputClass} sm:col-span-2`}
                    placeholder="Title"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                  />
                </div>
                <textarea
                  className={`${inputClass} mt-3`}
                  rows={2}
                  placeholder="Description"
                  value={step.text}
                  onChange={(e) => updateStep(index, 'text', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-navy">Featured homes</h2>
        <p className="mt-1 text-sm text-slate">
          How many featured listings to show on the homepage (0–12). Only properties
          marked as featured in inventory appear here.
        </p>
        <div className="mt-4 max-w-xs">
          <label className="block text-sm font-medium text-navy">Number of homes</label>
          <input
            type="number"
            min={0}
            max={12}
            className={inputClass}
            value={featuredHomesCount}
            onChange={(e) => {
              setFeaturedHomesCount(e.target.value);
              setSuccess('');
            }}
          />
        </div>
      </section>

      <button type="submit" disabled={loading} className={adminPrimaryBtnClass}>
        {loading ? 'Saving…' : 'Save home page'}
      </button>
    </form>
  );
}
