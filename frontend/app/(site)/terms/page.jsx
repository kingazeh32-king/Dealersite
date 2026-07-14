import PageLayout, { ContentSections, HighlightCards } from '@/components/pages/PageLayout';
import { fetchPage } from '@/lib/pages';

export async function generateMetadata() {
  const page = await fetchPage('terms');
  return {
    title: page?.title || 'Terms',
    description: page?.subtitle,
  };
}

export default async function TermsPage() {
  const page = await fetchPage('terms');

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
