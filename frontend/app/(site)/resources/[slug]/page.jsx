import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchResourceBySlug } from '@/lib/supabaseClient';

const typeLabels = {
  'buying-guide': 'Buying Guide',
  permit: 'Permits',
  maintenance: 'Maintenance',
  general: 'General',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await fetchResourceBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ResourceDetailPage({ params }) {
  const { slug } = await params;
  const article = await fetchResourceBySlug(slug);

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate" aria-label="Breadcrumb">
        <Link href="/resources" className="hover:text-gold">
          Resources
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy">{article.title}</span>
      </nav>

      <header className="mt-8">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">
          {typeLabels[article.type] || article.type}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">{article.title}</h1>
        {article.reading_time && (
          <p className="mt-3 text-sm text-slate">{article.reading_time} min read</p>
        )}
      </header>

      {article.content && (
        <div
          className="article-content mt-10"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}

      <div className="mt-12 rounded-lg border border-slate-200 bg-slate-light/40 p-6">
        <p className="font-semibold text-navy">Have questions?</p>
        <p className="mt-2 text-sm text-slate">
          Browse our{' '}
          <Link href="/resources/faqs" className="font-medium text-navy hover:text-gold">
            FAQ page
          </Link>{' '}
          or{' '}
          <Link href="/request-quote" className="font-medium text-navy hover:text-gold">
            request a quote
          </Link>{' '}
          to speak with our team.
        </p>
      </div>
    </article>
  );
}
