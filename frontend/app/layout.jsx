import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/providers/Providers';

export const icons = {
  icon: '/icon.svg',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'Manufactured Mobile Homes of Texas',
    template: '%s | Manufactured Mobile Homes of Texas',
  },
  description:
    'Browse new and pre-owned manufactured homes in Texas. Request information or schedule a viewing today.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
