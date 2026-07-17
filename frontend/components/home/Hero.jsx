import Link from 'next/link';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80';

export default function Hero({ hero }) {
  if (!hero) return null;

  return (
    <section className="relative isolate overflow-hidden text-white">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-deep/94 via-navy-deep/88 to-navy-deep/70"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              {hero.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={hero.primaryCta?.href || '/inventory'}
                className="rounded-md bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover"
              >
                {hero.primaryCta?.label || 'Browse Inventory'}
              </Link>
              <Link
                href={hero.secondaryCta?.href || '/request-quote'}
                className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {hero.secondaryCta?.label || 'Request a Quote'}
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-gold">
              {hero.cardTitle}
            </p>
            <ul className="mt-6 space-y-5">
              {(hero.badges || []).map((badge) => (
                <li key={badge} className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="font-medium text-white">{badge}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-relaxed text-slate-400">
              {hero.cardFooter}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
