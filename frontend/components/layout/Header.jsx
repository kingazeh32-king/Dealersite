'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/about', label: 'About Us' },
  { href: '/financing', label: 'Financing' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white transition-shadow ${
          scrolled ? 'shadow-md' : 'shadow-none'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-[0.02em] text-navy transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/request-quote"
              className="hidden rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-hover sm:inline-block"
            >
              Get Started
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-navy hover:bg-slate-light md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            className="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-navy hover:bg-slate-light hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/request-quote"
                  onClick={closeMenu}
                  className="block rounded-md bg-gold px-3 py-2.5 text-center text-sm font-semibold text-navy-deep hover:bg-gold-hover"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Keeps page content below the fixed bar */}
      <div className="h-16 shrink-0 sm:h-[4.25rem]" aria-hidden="true" />
    </>
  );
}
