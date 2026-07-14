'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

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

export default function PropertyForm({ token, property }) {
  const router = useRouter();
  const isEdit = !!property;
  const [form, setForm] = useState(() => toForm(property));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Virtual Tour URL</label>
          <input
            name="virtual_tour"
            type="url"
            value={form.virtual_tour}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://my.matterport.com/show/?m=..."
          />
          <p className="mt-1 text-xs text-slate">
            Embed URL for a 360° tour (Matterport, etc.). Shown on the public listing page.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-navy">Floor Plan PDF URL</label>
          <input
            name="pdf_floorplan"
            type="url"
            value={form.pdf_floorplan}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://example.com/floorplan.pdf or /uploads/..."
          />
          <p className="mt-1 text-xs text-slate">
            Link to a PDF floor plan. Buyers can open it from the listing page.
          </p>
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
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep hover:bg-gold-hover disabled:opacity-60"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-medium text-navy hover:bg-slate-light"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
