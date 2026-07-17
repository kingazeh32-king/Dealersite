import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Providers from '@/providers/Providers';

export const icons = {
  icon: '/icon.svg',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Manufactured Mobile Homes of Texas',
    template: '%s | Manufactured Mobile Homes of Texas',
  },
  description:
    'Browse new and pre-owned manufactured homes in Texas. Request information or schedule a viewing today.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

/** Minimal brand styles if the main CSS chunk is blocked on some phones */
const criticalCSS = `
:root{--navy:#1e293b;--navy-deep:#0f172a;--slate:#64748b;--slate-light:#f1f5f9;--gold:#c9a227;--gold-hover:#b8922a}
html,body{height:100%}
body{margin:0;background:#fff;color:#0f172a;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
