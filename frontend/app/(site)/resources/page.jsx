import Link from 'next/link';
import { fetchResources } from '@/lib/supabaseClient';
import ResourceCard from '@/components/resources/ResourceCard';

export const metadata = {
  title: 'Resources',
  description: 'Buying guides and expert advice for manufactured and tiny home buyers.',
};

export default async function ResourcesPage() {
  let articles = [];

  try {
    const data = await fetchResources({ limit: 20 });
    articles = data.articles;
  } catch {
    // API offline
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Knowledge Base
        </p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Buying Guides &amp; Resources
        </h1>
        <p className="mt-4 text-slate">
          Expert articles to help you make informed decisions about manufactured
          and tiny home ownership.
        </p>
        <Link
          href="/resources/faqs"
          className="mt-4 inline-block text-sm font-semibold text-navy hover:text-gold"
        >
          View frequently asked questions →
        </Link>
      </header>

      {articles.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {articles.map((article) => (
            <ResourceCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-slate">No articles available at the moment.</p>
      )}
    </div>
  );
}
