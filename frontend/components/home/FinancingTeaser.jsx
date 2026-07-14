import Link from 'next/link';
import { fetchPage } from '@/lib/pages';

export default async function FinancingTeaser() {
  const page = await fetchPage('financing');

  if (!page) return null;

  return (
    <section className="border-y border-slate-200 bg-navy-deep py-16 text-white sm:py-20" aria-labelledby="financing-teaser-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Financing</p>
          <h2 id="financing-teaser-heading" className="mt-2 text-3xl font-bold">
            {page.title}
          </h2>
          <p className="mt-4 text-slate-300">{page.subtitle}</p>
        </div>

        {page.highlights.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/financing"
            className="rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-hover"
          >
            Explore Financing
          </Link>
          <Link
            href="/request-quote"
            className="rounded-md border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Get Pre-Qualified
          </Link>
        </div>
      </div>
    </section>
  );
}
