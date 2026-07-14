import RequestQuoteForm from '@/components/forms/RequestQuoteForm';

export const metadata = {
  title: 'Request a Quote',
  description:
    'Get a personalized quote and explore financing options for your manufactured or tiny home.',
};

const benefits = [
  {
    title: 'No obligation',
    text: 'Requesting a quote does not commit you to a purchase.',
  },
  {
    title: 'Flexible financing',
    text: 'We work with FHA, chattel, and in-house payment options.',
  },
  {
    title: 'Expert guidance',
    text: 'Our team helps you find a home that fits your budget and lifestyle.',
  },
];

export default function RequestQuotePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Intro */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Financing &amp; Pre-Qualification
          </p>
          <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
            Request a Quote
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate">
            Tell us a little about yourself and your budget. We&apos;ll match you with
            homes and financing options — no shopping cart, just a real conversation
            about homeownership.
          </p>

          <ul className="mt-10 space-y-6">
            {benefits.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="mt-1 text-sm text-slate">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-navy">Your Information</h2>
          <p className="mt-1 text-sm text-slate">
            Fields marked with <span className="text-red-600">*</span> are required.
          </p>
          <div className="mt-6">
            <RequestQuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
}
