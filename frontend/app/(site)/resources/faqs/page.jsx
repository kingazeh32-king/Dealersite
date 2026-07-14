import Link from 'next/link';
import { fetchFaqs } from '@/lib/supabaseClient';
import FaqAccordion from '@/components/resources/FaqAccordion';

export const metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about buying, financing, and delivering manufactured homes.',
};

export default async function FaqsPage() {
  let faqs = [];

  try {
    faqs = await fetchFaqs();
  } catch {
    // API offline
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Help Center
        </p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-slate">
          Answers to common questions about our homes, financing, delivery, and
          the buying process.
        </p>
        <Link
          href="/resources"
          className="mt-4 inline-block text-sm font-semibold text-navy hover:text-gold"
        >
          ← Browse buying guides
        </Link>
      </header>

      {faqs.length > 0 ? (
        <div className="mt-12">
          <FaqAccordion faqs={faqs} />
        </div>
      ) : (
        <p className="mt-12 text-slate">No FAQs available at the moment.</p>
      )}

      <div className="mt-16 rounded-lg border border-slate-200 bg-navy-deep p-8 text-center text-white">
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="mt-2 text-slate-300">
          Our team is happy to help — no pressure, just honest answers.
        </p>
        <Link
          href="/request-quote"
          className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-hover"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
