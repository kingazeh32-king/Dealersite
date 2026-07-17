import Link from 'next/link';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80';

export default function Hero({ hero }) {
  if (!hero) return null;

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden text-white sm:min-h-[85vh]">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-deep/92 via-navy-deep/78 to-navy-deep/45"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-navy-deep/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:min-h-[85vh] sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
          {hero.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {hero.description}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href={hero.primaryCta?.href || '/inventory'}
            className="rounded-md bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover"
          >
            {hero.primaryCta?.label || 'Browse Inventory'}
          </Link>
          <Link
            href={hero.secondaryCta?.href || '/request-quote'}
            className="rounded-md border border-white/35 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            {hero.secondaryCta?.label || 'Request a Quote'}
          </Link>
        </div>
      </div>
    </section>
  );
}
