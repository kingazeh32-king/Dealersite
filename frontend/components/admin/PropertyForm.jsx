'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { resolveImageUrl } from '@/lib/images';

import {
  adminFieldClass as inputClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from '@/lib/adminUi';

const emptyForm = {
  name: '',
  category: 'new',
  status: 'available',
  price: '',
  down_payment: '',
  monthly_est: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  year_built: '',
  make_model: '',
  dimensions: '',
  description: '',
  delivery_info: '',
  virtual_tour: '',
  pdf_floorplan: '',
  is_featured: false,
};

function toForm(property) {
  if (!property) return emptyForm;
  return {
    name: property.name || '',
    category: property.category || 'new',
    status: property.status || 'available',
    price: property.price ?? '',
    down_payment: property.down_payment ?? '',
    monthly_est: property.monthly_est ?? '',
    bedrooms: property.bedrooms ?? '',
    bathrooms: property.bathrooms ?? '',
    sqft: property.sqft ?? '',
    year_built: property.year_built ?? '',
    make_model: property.make_model || '',
    dimensions: property.dimensions || '',
    description: property.description || '',
    delivery_info: property.delivery_info || '',
    virtual_tour: property.virtual_tour || '',
    pdf_floorplan: property.pdf_floorplan || '',
    is_featured: property.is_featured || false,
  };
}

function toPayload(form) {
  return {
    name: form.name,
    category: form.category,
    status: form.status,
    price: Number(form.price),
    down_payment: form.down_payment ? Number(form.down_payment) : null,
    monthly_est: form.monthly_est ? Number(form.monthly_est) : null,
    bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
    bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
    sqft: form.sqft ? Number(form.sqft) : null,
    year_built: form.year_built ? Number(form.year_built) : null,
    make_model: form.make_model || null,
    dimensions: form.dimensions || null,
    description: form.description || null,
    delivery_info: form.delivery_info || null,
    virtual_tour: form.virtual_tour || null,
    pdf_floorplan: form.pdf_floorplan || null,
    is_featured: form.is_featured,
  };
}

function fileLabel(path) {
  if (!path) return null;
  const parts = String(path).split('/');
  return parts[parts.length - 1] || path;
}

export default function PropertyForm({ token, property, onPropertyUpdate }) {
  const router = useRouter();
  const isEdit = !!property;
  const [form, setForm] = useState(() => toForm(property));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingTour, setUploadingTour] = useState(false);
  const [uploadingFloorPlan, setUploadingFloorPlan] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function applyPropertyUpdate(updated) {
    if (!updated) return;
    setForm((prev) => ({
      ...prev,
      virtual_tour: updated.virtual_tour || '',
      pdf_floorplan: updated.pdf_floorplan || '',
    }));
    onPropertyUpdate?.(updated);
  }

  async function handleTourUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !property?.id) return;

    setError('');
    setUploadingTour(true);
    try {
      const data = await api.uploadPropertyVirtualTour(token, property.id, file);
      applyPropertyUpdate(data.property);
    } catch (err) {
      setError(err.message || 'Failed to upload virtual tour video');
    } finally {
      setUploadingTour(false);
    }
  }

  async function handleFloorPlanUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !property?.id) return;

    setError('');
    setUploadingFloorPlan(true);
    try {
      const data = await api.uploadPropertyFloorPlan(token, property.id, file);
      applyPropertyUpdate(data.property);
    } catch (err) {
      setError(err.message || 'Failed to upload floor plan PDF');
    } finally {
      setUploadingFloorPlan(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = toPayload(form);
      if (isEdit) {
        await api.updateProperty(token, property.id, payload);
        router.push('/admin/properties');
      } else {
        const data = await api.createProperty(token, payload);
        router.push(`/admin/properties/${data.property.id}/edit`);
      }
      router.refresh();
    } catch (err) {
      setError(err.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            <option value="new">New</option>
            <option value="pre-owned">Pre-Owned</option>
            <option value="tiny">Tiny Home</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Price *</label>
          <input name="price" type="number" required min="0" value={form.price} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Down Payment</label>
          <input name="down_payment" type="number" min="0" value={form.down_payment} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Est. Monthly</label>
          <input name="monthly_est" type="number" min="0" value={form.monthly_est} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Bedrooms</label>
          <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Bathrooms</label>
          <input name="bathrooms" type="number" min="0" step="0.5" value={form.bathrooms} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Sq Ft</label>
          <input name="sqft" type="number" min="0" value={form.sqft} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">Year Built</label>
          <input name="year_built" type="number" value={form.year_built} onChange={handleChange} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Make / Model</label>
          <input name="make_model" value={form.make_model} onChange={handleChange} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Dimensions</label>
          <input name="dimensions" value={form.dimensions} onChange={handleChange} className={inputClass} placeholder="76ft × 28ft" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Delivery Info</label>
          <textarea name="delivery_info" rows={2} value={form.delivery_info} onChange={handleChange} className={inputClass} />
        </div>

        <div className="space-y-3 border border-slate-200 bg-slate-light/30 p-4 sm:col-span-2">
          <div>
            <label className="block text-sm font-medium text-navy">Virtual Tour</label>
            <p className="mt-1 text-xs text-slate">
              Upload a walkthrough video from this device, or paste a Matterport / embed URL.
            </p>
          </div>

          {isEdit ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                Upload video
              </label>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleTourUpload}
                disabled={uploadingTour}
                className="mt-1 block w-full text-sm text-slate file:mr-3 file:border-0 file:bg-navy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-deep disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-slate">
                {uploadingTour ? 'Uploading…' : 'MP4, WebM, or MOV · up to 80MB'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate">
              Create the property first, then you can upload a tour video on the edit page.
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate">
              Or paste URL
            </label>
            <input
              name="virtual_tour"
              type="text"
              value={form.virtual_tour}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://my.matterport.com/show/?m=... or uploaded file path"
            />
            {form.virtual_tour && (
              <p className="mt-1 truncate text-xs text-slate">
                Current:{' '}
                <a
                  href={resolveImageUrl(form.virtual_tour) || form.virtual_tour}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy hover:text-gold"
                >
                  {fileLabel(form.virtual_tour)}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 border border-slate-200 bg-slate-light/30 p-4 sm:col-span-2">
          <div>
            <label className="block text-sm font-medium text-navy">Floor Plan PDF</label>
            <p className="mt-1 text-xs text-slate">
              Upload a PDF from this device, or paste a link to an existing file.
            </p>
          </div>

          {isEdit ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                Upload PDF
              </label>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFloorPlanUpload}
                disabled={uploadingFloorPlan}
                className="mt-1 block w-full text-sm text-slate file:mr-3 file:border-0 file:bg-navy file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-deep disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-slate">
                {uploadingFloorPlan ? 'Uploading…' : 'PDF only · up to 20MB'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate">
              Create the property first, then you can upload a floor plan PDF on the edit page.
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate">
              Or paste URL
            </label>
            <input
              name="pdf_floorplan"
              type="text"
              value={form.pdf_floorplan}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com/floorplan.pdf or uploaded file path"
            />
            {form.pdf_floorplan && (
              <p className="mt-1 truncate text-xs text-slate">
                Current:{' '}
                <a
                  href={resolveImageUrl(form.pdf_floorplan) || form.pdf_floorplan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy hover:text-gold"
                >
                  {fileLabel(form.pdf_floorplan)}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="is_featured"
            name="is_featured"
            type="checkbox"
            checked={form.is_featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-navy">
            Featured on homepage
          </label>
        </div>
      </div>

      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || uploadingTour || uploadingFloorPlan}
          className={adminPrimaryBtnClass}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={adminSecondaryBtnClass}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
