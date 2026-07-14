import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { fetchSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await fetchSiteSettings();

  return {
    title: {
      default: `${settings.siteName} | ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
  };
}

export default async function SiteLayout({ children }) {
  const settings = await fetchSiteSettings();

  return (
    <SiteSettingsProvider initialSettings={settings}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </SiteSettingsProvider>
  );
}
