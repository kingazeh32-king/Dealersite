import Link from 'next/link';
import HomeCard from '@/components/inventory/HomeCard';

export default function FeaturedHomes({ homes = [] }) {
  if (!homes.length) return null;

  return (
    <section className="bg-slate-light/40 py-16 sm:py-20" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Featured Inventory
            </p>
            <h2 id="featured-heading" className="mt-2 text-3xl font-bold text-navy">
              Homes worth a closer look
            </h2>
            <p className="mt-2 max-w-xl text-slate">
              Hand-picked listings from our current inventory. Request information
              or schedule a viewing — no obligation.
            </p>
          </div>
          <Link
            href="/inventory"
            className="shrink-0 text-sm font-semibold text-navy underline-offset-4 hover:text-gold hover:underline"
          >
            View all homes →
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      </div>
    </section>
  );
}
