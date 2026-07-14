import PageLayout, { ContentSections, HighlightCards } from '@/components/pages/PageLayout';
import { fetchPage } from '@/lib/pages';

export async function generateMetadata() {
  const page = await fetchPage('privacy-policy');
  return {
    title: page?.title || 'Privacy Policy',
    description: page?.subtitle,
  };
}

export default async function PrivacyPolicyPage() {
  const page = await fetchPage('privacy-policy');

  if (!page) {
    return <p className="p-8 text-slate">Page not available.</p>;
  }

  return (
    <PageLayout page={page} eyebrow="Legal">
      <ContentSections sections={page.sections} />
      <HighlightCards highlights={page.highlights} />
    </PageLayout>
  );
}
