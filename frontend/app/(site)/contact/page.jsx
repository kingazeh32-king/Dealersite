import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/layout/ContactInfo';
import { fetchSiteSettings, phoneHref } from '@/lib/siteSettings';

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
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Get in Touch</p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Contact Us</h1>
        <p className="mt-4 text-slate">
          Have a question about our homes, financing, or delivery? We&apos;re here to help —
          no pressure, just honest answers.
        </p>
        <a
          href={phoneHref(contact.phone)}
          className="mt-4 inline-block text-lg font-semibold text-navy hover:text-gold"
        >
          {contact.phone}
        </a>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-navy">Send us a message</h2>
          <p className="mt-1 text-sm text-slate">
            Fill out the form and we&apos;ll respond within one business day.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border border-slate-200 bg-slate-light/40 p-6">
            <ContactInfo className="[&_p]:text-navy [&_ul]:text-slate [&_a]:text-navy [&_a]:hover:text-gold [&_li:last-child]:text-slate" />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-navy">Visit our showroom</h2>
            <p className="mt-2 text-sm text-slate">
              Walk our inventory in person and speak with a home specialist. Appointments
              are welcome but not required.
            </p>
            <p className="mt-4 text-sm font-medium text-navy">{contact.hours}</p>
          </div>

          <div className="rounded-lg bg-navy-deep p-6 text-white">
            <h2 className="font-semibold">Looking for a specific home?</h2>
            <p className="mt-2 text-sm text-slate-300">
              Browse our inventory and use the &quot;Request Info&quot; button on any
              listing to ask about that home directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
