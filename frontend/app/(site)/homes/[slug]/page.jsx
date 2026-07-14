import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchHomeBySlug } from '@/lib/supabaseClient';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyMedia from '@/components/property/PropertyMedia';
import SpecsTable from '@/components/property/SpecsTable';
import PropertyContactForm from '@/components/property/PropertyContactForm';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function formatCategory(category) {
  const labels = { new: 'New', 'pre-owned': 'Pre-Owned', tiny: 'Tiny Home' };
  return labels[category] || category;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const home = await fetchHomeBySlug(slug);
  if (!home) return { title: 'Home Not Found' };
  return {
    title: home.name,
    description: home.description?.slice(0, 160) || `${home.name} — manufactured home for sale.`,
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const home = await fetchHomeBySlug(slug);

  if (!home) notFound();

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate" aria-label="Breadcrumb">
        <Link href="/inventory" className="hover:text-gold">
          Inventory
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy">{home.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Gallery + main info */}
        <div className="lg:col-span-3">
          <PropertyGallery images={home.images} name={home.name} />

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-navy-deep px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {formatCategory(home.category)}
              </span>
              {home.is_featured && (
                <span className="rounded bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-deep">
                  Featured
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-navy sm:text-4xl">{home.name}</h1>
            {home.make_model && (
              <p className="mt-2 text-lg text-slate">{home.make_model}</p>
            )}
          </header>

          {home.description && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-navy">About This Home</h2>
              <p className="mt-4 leading-relaxed text-slate">{home.description}</p>
            </section>
          )}

          {home.features?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-navy">Features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {home.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate">
                    <span className="mt-1 text-gold" aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {home.delivery_info && (
            <section className="mt-8 rounded-lg bg-slate-light/60 p-6">
              <h2 className="text-lg font-semibold text-navy">Delivery &amp; Setup</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">{home.delivery_info}</p>
            </section>
          )}

          <PropertyMedia
            virtualTour={home.virtual_tour}
            pdfFloorplan={home.pdf_floorplan}
          />
        </div>

        {/* Sidebar — pricing + specs */}
        <aside className="lg:col-span-2">
          <div className="sticky top-8 space-y-8">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-slate">Price</p>
              <p className="mt-1 text-3xl font-bold text-navy-deep">{formatPrice(home.price)}</p>
              {home.down_payment != null && (
                <p className="mt-2 text-sm text-slate">
                  Est. down payment:{' '}
                  <span className="font-semibold text-navy">{formatPrice(home.down_payment)}</span>
                </p>
              )}
              {home.monthly_est != null && (
                <p className="mt-1 text-sm text-slate">
                  Est. monthly:{' '}
                  <span className="font-semibold text-navy">{formatPrice(home.monthly_est)}/mo</span>
                </p>
              )}
            </div>

            <SpecsTable home={home} />
          </div>
        </aside>
      </div>

      {/* Contact form */}
      <section
        id="request-info"
        className="mt-16 scroll-mt-24 rounded-lg border border-slate-200 bg-slate-light/40 p-8 sm:p-10"
      >
        <h2 className="text-2xl font-bold text-navy">Request More Information</h2>
        <p className="mt-2 text-slate">
          Interested in <strong>{home.name}</strong>? Fill out the form below and our team
          will reach out to schedule a viewing or answer your questions.
        </p>
        <div className="mt-8 max-w-xl">
          <PropertyContactForm property={home} />
        </div>
      </section>
    </article>
  );
}
