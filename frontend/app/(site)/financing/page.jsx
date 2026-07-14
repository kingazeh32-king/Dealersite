import Link from 'next/link';
import { fetchPage } from '@/lib/pages';
import { fetchFaqs } from '@/lib/supabaseClient';
import PageLayout, {
  ContentSections,
  HighlightCards,
  PageCTA,
} from '@/components/pages/PageLayout';

export async function generateMetadata() {
  const page = await fetchPage('financing');
  return {
    title: page?.title || 'Financing',
    description: page?.subtitle,
  };
}

export default async function FinancingPage() {
  const [page, financingFaqs] = await Promise.all([
    fetchPage('financing'),
    fetchFaqs('financing').catch(() => []),
  ]);

  if (!page) {
    return <p className="p-8 text-slate">Page not available.</p>;
  }

  return (
    <PageLayout page={page} eyebrow="Homeownership">
      <HighlightCards highlights={page.highlights} />
      <ContentSections sections={page.sections} />

      {financingFaqs.length > 0 && (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold text-navy">Common financing questions</h2>
          <div className="mt-6 space-y-4">
            {financingFaqs.slice(0, 4).map((faq) => (
              <div
                key={faq.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-medium text-navy">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{faq.answer}</p>
              </div>
            ))}
          </div>
          <Link
            href="/resources/faqs"
            className="mt-4 inline-block text-sm font-semibold text-navy hover:text-gold"
          >
            View all FAQs →
          </Link>
        </section>
      )}

      <PageCTA
        href="/request-quote"
        label="Get Pre-Qualified"
        title="Find out what you qualify for"
        description="Submit our quick form and a financing coordinator will reach out within one business day."
      />
    </PageLayout>
  );
}
