'use client';

import { useMemo, useState } from 'react';
import { resolveImageUrl } from '@/lib/images';
import PropertyImage from '@/components/ui/PropertyImage';

export default function PropertyGallery({ images = [], name }) {
  const sources = useMemo(
    () => images.map(resolveImageUrl).filter(Boolean),
    [images]
  );
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});

  const visible = sources
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => !failed[index]);

  if (!visible.length) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="aspect-[16/10]">
          <PropertyImage src={null} alt={name} />
        </div>
      </div>
    );
  }

  const safeActive = Math.min(
    active,
    Math.max(visible.length - 1, 0)
  );
  const current = visible[safeActive] || visible[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-light">
        <PropertyImage
          src={current.src}
          alt={`${name} — photo ${safeActive + 1}`}
          className="h-full w-full object-cover"
          fallbackLabel="Photo unavailable"
        />
      </div>

      {visible.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {visible.map(({ src, index }, i) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === safeActive ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setFailed((prev) => ({ ...prev, [index]: true }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
