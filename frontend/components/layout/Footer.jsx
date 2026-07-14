'use client';

import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';
import ContactInfo from './ContactInfo';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-navy-deep text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-3">
          <NewsletterSignup />
          <ContactInfo />
          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            <p className="text-sm font-semibold text-white">Quick links</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/inventory" className="hover:text-white">
                Inventory
              </Link>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/financing" className="hover:text-white">
                Financing
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/resources" className="hover:text-white">
                Resources
              </Link>
              <Link href="/resources/faqs" className="hover:text-white">
                FAQs
              </Link>
              <Link href="/request-quote" className="hover:text-white">
                Request a Quote
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
