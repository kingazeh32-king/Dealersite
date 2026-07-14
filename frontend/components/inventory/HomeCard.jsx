import Link from 'next/link';
import { resolveImageUrl } from '@/lib/images';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function formatCategory(category) {
  const labels = {
    new: 'New',
    'pre-owned': 'Pre-Owned',
    tiny: 'Tiny Home',
  };
  return labels[category] || category;
}

function getImageSrc(home) {
  const path = home?.images?.[0];
  return resolveImageUrl(path);
}

export default function HomeCard({ home }) {
  if (!home) return null;

  const {
    slug,
    name,
    price,
    category,
    bedrooms,
    bathrooms,
    sqft,
    status,
    is_featured,
  } = home;

  const imageSrc = getImageSrc(home);
  const detailHref = `/homes/${slug}`;
  const inquiryHref = `${detailHref}#request-info`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden bg-slate-light">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-deep/5">
            <span className="text-sm font-medium text-slate">Photo coming soon</span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded bg-navy-deep/90 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {formatCategory(category)}
          </span>
          {is_featured && (
            <span className="rounded bg-gold px-2 py-1 text-xs font-semibold uppercase tracking-wide text-navy-deep">
              Featured
            </span>
          )}
        </div>

        {status && status !== 'available' && (
          <span className="absolute right-3 top-3 rounded bg-slate/90 px-2 py-1 text-xs font-semibold uppercase text-white">
            {status}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={detailHref}>
          <h3 className="text-lg font-semibold text-navy transition-colors group-hover:text-gold">
            {name}
          </h3>
        </Link>

        <p className="mt-2 text-2xl font-bold text-navy-deep">{formatPrice(price)}</p>

        {/* Specs */}
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate" aria-label="Home specifications">
          {bedrooms != null && (
            <li>
              <span className="font-medium text-navy">{bedrooms}</span> bed
            </li>
          )}
          {bathrooms != null && (
            <li>
              <span className="font-medium text-navy">{bathrooms}</span> bath
            </li>
          )}
          {sqft != null && (
            <li>
              <span className="font-medium text-navy">{sqft.toLocaleString()}</span> sqft
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={detailHref}
            className="flex-1 rounded-md border border-navy bg-white px-4 py-2.5 text-center text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            View Details
          </Link>
          <Link
            href={inquiryHref}
            className="flex-1 rounded-md bg-gold px-4 py-2.5 text-center text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover"
          >
            Request Info
          </Link>
        </div>
      </div>
    </article>
  );
}
