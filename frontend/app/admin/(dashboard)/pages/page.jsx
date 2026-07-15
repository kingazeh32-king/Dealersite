'use client';

import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import { adminActionLinkClass } from '@/lib/adminUi';

const pages = [
  {
    slug: 'about',
    label: 'About Us',
    description:
      'Company story, mission, and value highlights on /about and the home page.',
    href: '/about',
  },
  {
    slug: 'financing',
    label: 'Financing',
    description:
      'Loan options and pre-qualification info on /financing and the home page.',
    href: '/financing',
  },
  {
    slug: 'privacy-policy',
    label: 'Privacy Policy',
    description: 'Privacy details and data practices linked from the site footer.',
    href: '/privacy-policy',
  },
  {
    slug: 'terms',
    label: 'Terms',
    description: 'Website use guidance and legal terms linked from the footer.',
    href: '/terms',
  },
];

export default function AdminPagesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Website content"
        title="Pages"
        description="Edit content for key public site pages."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <AdminPanel key={page.slug} className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-navy">{page.label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">{page.description}</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href={`/admin/pages/${page.slug}/edit`}
                className={adminActionLinkClass}
              >
                Edit content
              </Link>
              <Link
                href={page.href}
                target="_blank"
                className="text-sm text-slate transition-colors hover:text-navy"
              >
                View page ↗
              </Link>
            </div>
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
