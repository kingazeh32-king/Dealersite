'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { value: '', label: 'All Homes' },
  { value: 'new', label: 'New' },
  { value: 'pre-owned', label: 'Pre-Owned' },
  { value: 'tiny', label: 'Tiny Homes' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';

  const [query, setQuery] = useState(currentSearch);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/inventory?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParams({ search: query.trim() });
  }

  function clearSearch() {
    setQuery('');
    updateParams({ search: '' });
  }

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'featured';

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-light/50 p-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <label htmlFor="inventory-search" className="sr-only">
          Search homes
        </label>
        <input
          id="inventory-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, model, or description..."
          className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button
          type="submit"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-deep"
        >
          Search
        </button>
        {currentSearch && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-slate-light"
          >
            Clear
          </button>
        )}
      </form>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => updateParams({ category: cat.value })}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                currentCategory === cat.value
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy hover:bg-navy/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate">
          <span className="font-medium text-navy">Sort by</span>
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
