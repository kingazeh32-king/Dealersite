import Link from 'next/link';

const typeLabels = {
  'buying-guide': 'Buying Guide',
  permit: 'Permits',
  maintenance: 'Maintenance',
  general: 'General',
};

export default function ResourceCard({ article }) {
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-xs font-semibold uppercase tracking-wide text-gold">
        {typeLabels[article.type] || article.type}
      </span>
      <h2 className="mt-2 text-lg font-semibold text-navy">
        <Link href={`/resources/${article.slug}`} className="hover:text-gold">
          {article.title}
        </Link>
      </h2>
      {article.excerpt && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{article.excerpt}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-sm">
        {article.reading_time && (
          <span className="text-slate">{article.reading_time} min read</span>
        )}
        <Link
          href={`/resources/${article.slug}`}
          className="font-semibold text-navy hover:text-gold"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
