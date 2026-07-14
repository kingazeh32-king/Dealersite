const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const defaultPages = {
  about: {
    slug: 'about',
    title: 'About Us',
    subtitle:
      'A family-focused dealership helping buyers find quality manufactured and tiny homes.',
    sections: [],
    highlights: [],
  },
  financing: {
    slug: 'financing',
    title: 'Financing Options',
    subtitle: 'Flexible loan programs for manufactured and tiny home buyers.',
    sections: [],
    highlights: [],
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'We collect only the information needed to answer your questions, assist with home buying, and improve your experience with our dealership.',
    sections: [
      {
        heading: 'Information we collect',
        body: 'When you contact us through our website, request a quote, or inquire about a home, we may collect your name, phone number, email address, preferred location, and any details you share in your message. We may also collect technical information such as browser type, IP address, and pages visited to help us understand site usage and protect our platform.',
      },
      {
        heading: 'How we use your information',
        body: 'We use your information to respond to inquiries, follow up about homes or financing options, improve our website and services, and comply with applicable legal obligations. We do not sell your personal information to third parties for marketing purposes.',
      },
      {
        heading: 'Sharing and retention',
        body: 'We may share information with trusted service providers who help operate our website, process communications, or provide support functions. We keep personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.',
      },
      {
        heading: 'Your choices',
        body: 'You may request access to, correction of, or deletion of your personal information, or ask us to stop sending certain communications. We will handle valid requests in accordance with applicable law and will respond as promptly as reasonably possible.',
      },
    ],
    highlights: [
      {
        title: 'Secure communication',
        body: 'We use reasonable administrative, technical, and physical safeguards to help protect the information you share with us.',
      },
      {
        title: 'Clear boundaries',
        body: 'We only use your information for the purposes described here and for legitimate business or legal needs.',
      },
    ],
  },
  terms: {
    slug: 'terms',
    title: 'Terms of Use',
    subtitle: 'These terms govern your use of our website and your interaction with our dealership team.',
    sections: [
      {
        heading: 'Use of this website',
        body: 'The content on this website is provided for informational purposes only. It is not legal, financial, or professional advice, and you should confirm any important details directly with our team before making decisions regarding purchasing, financing, or home placement.',
      },
      {
        heading: 'Property and pricing information',
        body: 'Availability, pricing, promotions, and home features may change at any time. We reserve the right to update or remove listings and information without notice, and we do not guarantee that every detail will remain current or error-free.',
      },
      {
        heading: 'User communications',
        body: 'By submitting a form, sending an email, or contacting us through the website, you agree that our team may use your information to respond to your inquiry and provide relevant follow-up. You are responsible for ensuring that any information you provide is accurate, complete, and lawful.',
      },
      {
        heading: 'Limitation of liability',
        body: 'To the extent permitted by law, we are not liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or reliance on its content. Your use of the site is at your own risk.',
      },
    ],
    highlights: [
      {
        title: 'Accuracy',
        body: 'We work to keep our website content current, but we cannot guarantee every listing or detail will be free of errors or omissions.',
      },
      {
        title: 'Respectful use',
        body: 'You agree not to misuse this website or submit unlawful, misleading, or abusive content.',
      },
    ],
  },
};

export function normalizePage(row) {
  if (!row) return null;

  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    sections: Array.isArray(row.sections) ? row.sections : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
  };
}

export async function fetchPage(slug) {
  try {
    const res = await fetch(`${API_URL}/pages/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return defaultPages[slug] || null;

    const data = await res.json();
    return normalizePage(data.page);
  } catch {
    return defaultPages[slug] || null;
  }
}
