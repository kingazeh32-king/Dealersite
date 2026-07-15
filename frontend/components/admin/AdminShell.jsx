'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
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

function MenuIcon({ open }) {
  return open ? (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SidebarNav({ siteName, adminEmail, isActive, onNavigate, onLogout, navId }) {
  return (
    <>
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Admin</p>
        <p className="mt-1 font-semibold leading-snug">{siteName}</p>
      </div>

      <nav
        id={navId}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
        aria-label="Admin navigation"
      >
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
                  onClick={onNavigate}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
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
        <p className="truncate text-xs text-slate-400">{adminEmail}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 text-sm font-medium text-gold hover:text-gold-hover"
        >
          Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuth();
  const [siteName, setSiteName] = useState('Manufactured Mobile Homes of Texas');
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavId = useId();

  useEffect(() => {
    api
      .getSettings()
      .then((data) => setSiteName(normalizeSettings(data.settings).siteName))
      .catch(() => {});
  }, [pathname]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape key + body scroll lock while drawer is open
  useEffect(() => {
    if (!mobileOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') setMobileOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  function isActive(href, exact) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleLogout() {
    setMobileOpen(false);
    logout();
    router.push('/admin/login');
  }

  const sidebarProps = {
    siteName,
    adminEmail: admin?.email,
    isActive,
    onLogout: handleLogout,
  };

  return (
    <div className="flex min-h-screen bg-slate-light/50">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-navy-deep text-white lg:flex lg:flex-col">
        <SidebarNav {...sidebarProps} onNavigate={undefined} />
      </aside>

      {/* Mobile drawer */}
      <div className="lg:hidden" aria-hidden={!mobileOpen}>
        <button
          type="button"
          className={`fixed inset-0 z-40 bg-navy-deep/50 transition-opacity duration-200 ${
            mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-label="Close navigation"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] max-w-full flex-col bg-navy-deep text-white shadow-none transition-transform duration-200 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Menu</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <MenuIcon open />
            </button>
          </div>
          <SidebarNav
            {...sidebarProps}
            navId={mobileNavId}
            onNavigate={() => setMobileOpen(false)}
          />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-slate-light lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls={mobileNavId}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <MenuIcon open={mobileOpen} />
              <span>Menu</span>
            </button>
            <div className="min-w-0 lg:hidden">
              <p className="truncate text-sm font-semibold text-navy">Admin</p>
              <p className="truncate text-xs text-slate">{siteName}</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
                Admin dashboard
              </p>
              <p className="mt-0.5 text-sm text-navy">
                Signed in as <span className="font-medium">{admin?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link href="/" className="text-sm text-slate hover:text-navy">
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden text-sm font-medium text-navy hover:text-gold sm:inline lg:hidden"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
