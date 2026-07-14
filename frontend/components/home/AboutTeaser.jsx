import Link from 'next/link';
import { fetchPage } from '@/lib/pages';

export default async function AboutTeaser() {
  const page = await fetchPage('about');

  if (!page) return null;

  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="about-teaser-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">About Us</p>
            <h2 id="about-teaser-heading" className="mt-2 text-3xl font-bold text-navy">
              {page.title}
            </h2>
            <p className="mt-4 text-slate">{page.subtitle}</p>
            {page.sections[0]?.body && (
              <p className="mt-4 text-slate">{page.sections[0].body}</p>
            )}
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-semibold text-navy hover:text-gold"
            >
              Learn more about us →
            </Link>
          </div>

          {page.highlights.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {page.highlights.slice(0, 4).map((item) => (
                <li
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-slate-light/40 p-5"
                >
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="mt-1 text-sm text-slate">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
