import { resolveImageUrl } from './images';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const defaultHero = {
  eyebrow: 'Manufactured & Tiny Homes',
  title: 'Your path to homeownership starts here',
  description:
    'Quality new, pre-owned, and tiny homes at prices that make sense. We guide you from browsing to delivery — with honest advice, not high-pressure sales.',
  primaryCta: { label: 'Browse Inventory', href: '/inventory' },
  secondaryCta: { label: 'Request a Quote', href: '/request-quote' },
  cardTitle: 'Why buyers choose us',
  cardFooter:
    'Every home in our inventory meets federal HUD standards. We handle delivery, setup coordination, and financing guidance — so you can focus on finding the right home.',
  badges: ['Nationwide Delivery', 'Flexible Financing', 'HUD-Compliant Homes', 'No-Pressure Sales'],
};

export const defaultTrustSignals = [
  { value: '30–50%', label: 'Savings vs. site-built', detail: 'Per square foot' },
  { value: '7+', label: 'Homes in stock', detail: 'New, pre-owned & tiny' },
  { value: '100%', label: 'HUD compliant', detail: 'Federal safety standards' },
  { value: '48hr', label: 'Response time', detail: 'On all inquiries' },
];

export const defaultHowItWorks = {
  eyebrow: 'Simple process',
  title: 'How it works',
  description:
    'No shopping cart. No hidden fees. Just a straightforward path from browsing to homeownership.',
  steps: [
    {
      step: '01',
      title: 'Browse & compare',
      text: 'Explore our inventory online. Filter by category, price, and size to find homes that fit your needs.',
    },
    {
      step: '02',
      title: 'Talk to our team',
      text: 'Request information or a quote. We answer your questions about financing, delivery, and site preparation.',
    },
    {
      step: '03',
      title: 'Move in with confidence',
      text: 'We coordinate delivery, setup, and utility hookups. Your home arrives ready for the next chapter.',
    },
  ],
};

export const defaultFeaturedHomesCount = 3;

export const defaultSiteSettings = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Manufactured Mobile Homes of Texas',
  tagline: 'Quality homes for Texas living',
  logoUrl: process.env.NEXT_PUBLIC_LOGO_SRC || '/logo.svg',
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_SRC || '/icon.svg',
  hero: defaultHero,
  trustSignals: defaultTrustSignals,
  howItWorks: defaultHowItWorks,
  featuredHomesCount: defaultFeaturedHomesCount,
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '(555) 123-4567',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@dealersite.com',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '123 Dealer Way, Suite 100',
    city: process.env.NEXT_PUBLIC_CONTACT_CITY || 'Your City, ST 12345',
    hours: process.env.NEXT_PUBLIC_CONTACT_HOURS || 'Mon–Fri 9am–6pm · Sat 10am–4pm',
  },
};

function normalizeHero(raw) {
  if (!raw || typeof raw !== 'object') return defaultHero;
  return {
    eyebrow: raw.eyebrow || defaultHero.eyebrow,
    title: raw.title || defaultHero.title,
    description: raw.description || defaultHero.description,
    primaryCta: raw.primaryCta || defaultHero.primaryCta,
    secondaryCta: raw.secondaryCta || defaultHero.secondaryCta,
    cardTitle: raw.cardTitle || defaultHero.cardTitle,
    cardFooter: raw.cardFooter || defaultHero.cardFooter,
    badges: Array.isArray(raw.badges) && raw.badges.length ? raw.badges : defaultHero.badges,
  };
}

function normalizeFeaturedHomesCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return defaultFeaturedHomesCount;
  return Math.min(12, Math.max(0, Math.round(n)));
}

function normalizeHowItWorks(raw) {
  if (!raw || typeof raw !== 'object') return defaultHowItWorks;
  const steps =
    Array.isArray(raw.steps) && raw.steps.length
      ? raw.steps.map((s, i) => ({
          step: s.step || String(i + 1).padStart(2, '0'),
          title: s.title || '',
          text: s.text || '',
        }))
      : defaultHowItWorks.steps;
  return {
    eyebrow: raw.eyebrow || defaultHowItWorks.eyebrow,
    title: raw.title || defaultHowItWorks.title,
    description: raw.description || defaultHowItWorks.description,
    steps,
  };
}

export function normalizeSettings(row) {
  if (!row) return defaultSiteSettings;

  const logoPath = row.logo_url || defaultSiteSettings.logoUrl;
  const resolvedLogo = resolveImageUrl(logoPath) || logoPath;
  const faviconPath = row.favicon_url || defaultSiteSettings.faviconUrl;
  const resolvedFavicon = resolveImageUrl(faviconPath) || faviconPath;

  return {
    siteName: row.site_name || defaultSiteSettings.siteName,
    tagline: row.tagline || defaultSiteSettings.tagline,
    logoUrl: resolvedLogo || defaultSiteSettings.logoUrl,
    faviconUrl: resolvedFavicon || defaultSiteSettings.faviconUrl,
    hero: normalizeHero(row.hero_content),
    trustSignals:
      Array.isArray(row.trust_signals) && row.trust_signals.length
        ? row.trust_signals
        : defaultTrustSignals,
    howItWorks: normalizeHowItWorks(row.how_it_works),
    featuredHomesCount: normalizeFeaturedHomesCount(row.featured_homes_count),
    contact: {
      phone: row.contact_phone || defaultSiteSettings.contact.phone,
      email: row.contact_email || defaultSiteSettings.contact.email,
      address: row.contact_address || defaultSiteSettings.contact.address,
      city: row.contact_city || defaultSiteSettings.contact.city,
      hours: row.contact_hours || defaultSiteSettings.contact.hours,
    },
  };
}

function toStoredMediaPath(mediaUrl) {
  if (!mediaUrl) return mediaUrl;
  const value = String(mediaUrl).trim();
  if (!value) return value;

  // Keep frontend public defaults as-is
  if (
    value === '/logo.svg' ||
    value.startsWith('/logo.') ||
    value === '/icon.svg' ||
    value.startsWith('/icon.')
  ) {
    return value;
  }

  const uploadsMatch = value.match(/\/uploads\/[^\s?#]+/);
  if (uploadsMatch) return uploadsMatch[0];

  if (value.startsWith('/api/uploads/')) return value.slice(4);

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      return new URL(value).pathname;
    } catch {
      return value;
    }
  }

  return value;
}

export function toApiPayload(settings) {
  return {
    site_name: settings.siteName,
    tagline: settings.tagline,
    logo_url: toStoredMediaPath(settings.logoUrl),
    favicon_url: toStoredMediaPath(settings.faviconUrl),
    contact_phone: settings.contact.phone,
    contact_email: settings.contact.email,
    contact_address: settings.contact.address,
    contact_city: settings.contact.city,
    contact_hours: settings.contact.hours,
    hero_content: settings.hero,
    trust_signals: settings.trustSignals,
    how_it_works: settings.howItWorks,
    featured_homes_count: settings.featuredHomesCount,
  };
}

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { cache: 'no-store' });
    if (!res.ok) return defaultSiteSettings;
    const data = await res.json();
    return normalizeSettings(data.settings);
  } catch {
    return defaultSiteSettings;
  }
}

export function phoneHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function emailHref(email) {
  return `mailto:${email}`;
}
