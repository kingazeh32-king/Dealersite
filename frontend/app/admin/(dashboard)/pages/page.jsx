'use client';

import Link from 'next/link';

const pages = [
  {
    slug: 'about',
    label: 'About Us',
    description: 'Company story, mission, and value highlights on /about and the home page.',
    href: '/about',
  },
  {
    slug: 'financing',
    label: 'Financing',
    description: 'Loan options and pre-qualification info on /financing and the home page.',
    href: '/financing',
  },
  {
    slug: 'privacy-policy',
    label: 'Privacy Policy',
    description: 'Your privacy details and data practices shown in the site footer.',
    href: '/privacy-policy',
  },
  {
    slug: 'terms',
    label: 'Terms',
    description: 'Website use guidance and legal terms displayed from the footer links.',
    href: '/terms',
  },
];

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Pages</h1>
      <p className="mt-1 text-sm text-slate">
        Edit content for the About and Financing pages shown on your public site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <div
            key={page.slug}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-navy">{page.label}</h2>
            <p className="mt-2 text-sm text-slate">{page.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/admin/pages/${page.slug}/edit`}
                className="text-sm font-semibold text-navy hover:text-gold"
              >
                Edit content
              </Link>
              <Link
                href={page.href}
                target="_blank"
                className="text-sm text-slate hover:text-navy"
              >
                View page ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
