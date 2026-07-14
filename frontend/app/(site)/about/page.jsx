import Link from 'next/link';
import { fetchPage } from '@/lib/pages';
import PageLayout, {
  ContentSections,
  HighlightCards,
  PageCTA,
} from '@/components/pages/PageLayout';

export async function generateMetadata() {
  const page = await fetchPage('about');
  return {
    title: page?.title || 'About Us',
    description: page?.subtitle,
  };
}

export default async function AboutPage() {
  const page = await fetchPage('about');

  if (!page) {
    return <p className="p-8 text-slate">Page not available.</p>;
  }

  return (
    <PageLayout page={page} eyebrow="Who We Are">
      <ContentSections sections={page.sections} />
      <HighlightCards highlights={page.highlights} />
      <PageCTA
        href="/contact"
        label="Contact Us"
        title="Ready to talk?"
        description="Visit our lot, call us, or send a message — we are happy to answer your questions with no pressure."
      />
    </PageLayout>
  );
}
