'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { resolveImageUrl } from '@/lib/images';

export default function PropertyImageManager({ property, token, onUpdate }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const images = property.images || [];

  async function saveImages(nextImages) {
    const data = await api.updatePropertyImages(token, property.id, nextImages);
    onUpdate?.(data.property);
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const data = await api.uploadPropertyImages(token, property.id, files);
      onUpdate?.(data.property);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  }

  async function handleSetPrimary(index) {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    try {
      await saveImages(next);
    } catch (err) {
      setError(err.message || 'Failed to update images');
    }
  }

  async function handleRemove(index) {
    if (!confirm('Remove this image?')) return;
    const next = images.filter((_, i) => i !== index);
    try {
      await saveImages(next);
    } catch (err) {
      setError(err.message || 'Failed to remove image');
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-navy">Property Images</h2>
          <p className="mt-1 text-sm text-slate">
            The first image is the main photo on cards and the detail page gallery.
            Add multiple photos to show in the home detail view.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : '+ Add Images'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {images.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((path, index) => {
            const src = resolveImageUrl(path);
            return (
              <div
                key={`${path}-${index}`}
                className="overflow-hidden rounded-lg border border-slate-200"
              >
                <div className="relative aspect-[4/3] bg-slate-light">
                  <img
                    src={src}
                    alt={`${property.name} image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-xs font-semibold text-navy-deep">
                      Main Photo
                    </span>
                  )}
                </div>
                <div className="flex gap-2 border-t border-slate-100 p-2">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="flex-1 rounded px-2 py-1.5 text-xs font-medium text-navy hover:bg-slate-light"
                    >
                      Set as Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex-1 rounded px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm text-slate">No images yet. Upload photos for this listing.</p>
        </div>
      )}
    </section>
  );
}
