import { Suspense } from 'react';
import { fetchAvailableHomes } from '@/lib/supabaseClient';
import HomeCard from '@/components/inventory/HomeCard';
import FilterBar from '@/components/inventory/FilterBar';

export const metadata = {
  title: 'Inventory',
  description: 'Browse new, pre-owned, and tiny manufactured homes available now.',
};

export default async function InventoryPage({ searchParams }) {
  const params = await searchParams;
  const category = params.category || undefined;
  const sort = params.sort || 'featured';
  const search = params.search || undefined;

  const { homes, total } = await fetchAvailableHomes({
    category,
    sort,
    search,
    limit: 100,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Home Inventory</h1>
        <p className="mt-3 max-w-2xl text-slate">
          Explore our selection of quality manufactured and tiny homes. Every listing
          is available for viewing — request information with no obligation to buy.
        </p>
      </header>

      <Suspense fallback={<div className="h-16 animate-pulse rounded-lg bg-slate-light" />}>
        <FilterBar />
      </Suspense>

      <p className="mt-6 text-sm text-slate">
        Showing <span className="font-semibold text-navy">{homes.length}</span> of{' '}
        <span className="font-semibold text-navy">{total}</span> homes
      </p>

      {homes.length > 0 ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-lg border border-dashed border-slate-200 py-16 text-center">
          <p className="text-lg font-medium text-navy">No homes match your filters</p>
          <p className="mt-2 text-slate">
            {search
              ? 'Try a different search term or clear your filters.'
              : 'Try selecting a different category or check back soon.'}
          </p>
        </div>
      )}
    </div>
  );
}
