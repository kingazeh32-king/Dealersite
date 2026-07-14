import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-navy-deep py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to find your home?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Whether you know exactly what you want or you&apos;re just starting to
          explore — our team is here to help with zero pressure.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/inventory"
            className="rounded-md bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover"
          >
            View Inventory
          </Link>
          <Link
            href="/request-quote"
            className="rounded-md border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
