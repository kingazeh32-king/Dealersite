'use client';

import { useState } from 'react';
import { resolveImageUrl } from '@/lib/images';

export default function PropertyGallery({ images = [], name }) {
  const sources = images.map(resolveImageUrl).filter(Boolean);
  const [active, setActive] = useState(0);

  if (!sources.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-lg bg-slate-light">
        <span className="text-slate">Photos coming soon</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-light">
        <img
          src={sources[active]}
          alt={`${name} — photo ${active + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {sources.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sources.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === active ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
