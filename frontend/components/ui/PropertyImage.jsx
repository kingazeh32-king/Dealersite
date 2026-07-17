'use client';

import { useState } from 'react';

/**
 * Listing photo with graceful fallback when the URL 404s or fails to load.
 */
export default function PropertyImage({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  fallbackLabel = 'Photo coming soon',
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-deep via-navy to-slate-600 ${fallbackClassName}`}
        role="img"
        aria-label={alt || fallbackLabel}
      >
        <div className="px-4 text-center">
          <div
            className="mx-auto mb-2 h-10 w-16 rounded-sm border border-white/25 bg-white/10"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-white/80">{fallbackLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
