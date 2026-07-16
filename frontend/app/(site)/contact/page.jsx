import ContactForm from '@/components/contact/ContactForm';
import Link from 'next/link';
import { fetchSiteSettings, phoneHref, emailHref } from '@/lib/siteSettings';

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    title: 'Contact Us',
    description: `Get in touch with ${settings.siteName} about manufactured and tiny homes, financing, and delivery.`,
  };
}

export default async function ContactPage() {
  const settings = await fetchSiteSettings();
  const contact = settings.contact;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Get in touch
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {settings.siteName}
          </h1>
          <p className="mt-4 max-w-md text-slate">
            Questions about homes, financing, or delivery? Reach out — no pressure,
            just honest answers.
          </p>

          <dl className="mt-10 space-y-5 border-t border-slate-200 pt-8">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={emailHref(contact.email)}
                  className="text-lg font-medium text-navy transition-colors hover:text-gold"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  href={phoneHref(contact.phone)}
                  className="text-lg font-medium text-navy transition-colors hover:text-gold"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                Location
              </dt>
              <dd className="mt-1 text-lg font-medium text-navy">
                {contact.address ? (
                  <>
                    {contact.address}
                    <br />
                  </>
                ) : null}
                {contact.city}
              </dd>
            </div>
            {contact.hours ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
                  Hours
                </dt>
                <dd className="mt-1 text-sm text-slate">{contact.hours}</dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-10 text-sm text-slate">
            Looking for a specific home?{' '}
            <Link href="/inventory" className="font-medium text-navy hover:text-gold">
              Browse inventory
            </Link>{' '}
            and request info on any listing.
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-navy">Send us a message</h2>
          <p className="mt-1 text-sm text-slate">
            We typically respond within one business day. Your message is saved to our
            dashboard and emailed to the team.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
