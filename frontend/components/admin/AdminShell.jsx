'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { normalizeSettings } from '@/lib/siteSettings';

const navGroups = [
  {
    title: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', exact: true }],
  },
  {
    title: 'Listings & Leads',
    items: [
      { href: '/admin/properties', label: 'Properties' },
      { href: '/admin/inquiries', label: 'Inquiries' },
      { href: '/admin/leads', label: 'Leads' },
    ],
  },
  {
    title: 'Website Content',
    items: [
      { href: '/admin/home', label: 'Home Page' },
      { href: '/admin/testimonials', label: 'Testimonials' },
      { href: '/admin/team', label: 'Team' },
      { href: '/admin/resources', label: 'Resources' },
      { href: '/admin/faqs', label: 'FAQs' },
      { href: '/admin/pages', label: 'Pages' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Site Settings' },
      { href: '/admin/account', label: 'Account' },
    ],
  },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuth();
  const [siteName, setSiteName] = useState('Manufactured Mobile Homes of Texas');

  useEffect(() => {
    api
      .getSettings()
      .then((data) => setSiteName(normalizeSettings(data.settings).siteName))
      .catch(() => {});
  }, [pathname]);

  function isActive(href, exact) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-light/50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-navy-deep text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Admin
          </p>
          <p className="mt-1 font-semibold">{siteName}</p>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto p-4" aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href, item.exact)
                        ? 'bg-gold text-navy-deep'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 p-4">
          <p className="truncate text-xs text-slate-400">{admin?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 text-sm font-medium text-gold hover:text-gold-hover"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 lg:px-8">
          <div className="lg:hidden">
            <p className="text-sm font-semibold text-navy">Admin Dashboard</p>
          </div>
          <p className="hidden text-sm text-slate lg:block">
            Signed in as <span className="font-medium text-navy">{admin?.name}</span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate hover:text-navy">
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-navy hover:text-gold lg:hidden"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="space-y-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {group.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      isActive(item.href, item.exact)
                        ? 'bg-navy text-white'
                        : 'bg-slate-light text-navy'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
