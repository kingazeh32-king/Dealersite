import Hero from '@/components/home/Hero';
import TrustSignals from '@/components/home/TrustSignals';
import FeaturedHomes from '@/components/home/FeaturedHomes';
import AboutTeaser from '@/components/home/AboutTeaser';
import HowItWorks from '@/components/home/HowItWorks';
import FinancingTeaser from '@/components/home/FinancingTeaser';
import Testimonials from '@/components/home/Testimonials';
import TeamSection from '@/components/home/TeamSection';
import CTASection from '@/components/home/CTASection';
import { fetchFeaturedHomes, fetchTeamMembers } from '@/lib/supabaseClient';
import { fetchSiteSettings } from '@/lib/siteSettings';
import { fetchTestimonials } from '@/lib/testimonials';
import { normalizeTeamMember } from '@/lib/team';

export default async function HomePage() {
  let featuredHomes = [];
  let teamMembers = [];
  let testimonials = [];
  let settings = null;

  try {
    settings = await fetchSiteSettings();
  } catch {
    // fall back to defaults inside components
  }

  const featuredCount = settings?.featuredHomesCount ?? 3;

  try {
    featuredHomes = await fetchFeaturedHomes(featuredCount);
  } catch {
    // API offline
  }

  try {
    const rows = await fetchTeamMembers();
    teamMembers = rows.map(normalizeTeamMember).filter(Boolean);
  } catch {
    // API offline
  }

  try {
    testimonials = await fetchTestimonials();
  } catch {
    // API offline
  }

  return (
    <>
      <Hero hero={settings?.hero} />
      <TrustSignals signals={settings?.trustSignals} />
      <AboutTeaser />
      <FeaturedHomes homes={featuredHomes} />
      <HowItWorks content={settings?.howItWorks} />
      <FinancingTeaser />
      <TeamSection members={teamMembers} />
      <Testimonials items={testimonials} />
      <CTASection />
    </>
  );
}
