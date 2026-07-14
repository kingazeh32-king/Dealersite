'use client';

import { useState } from 'react';

const categoryLabels = {
  general: 'General',
  financing: 'Financing',
  delivery: 'Delivery',
  installation: 'Installation',
  buying: 'Buying Process',
};

export default function FaqAccordion({ faqs }) {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);

  const grouped = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <section key={category} aria-labelledby={`faq-${category}`}>
          <h2 id={`faq-${category}`} className="text-xl font-semibold text-navy">
            {categoryLabels[category] || category}
          </h2>
          <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {grouped[category].map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-navy">{faq.question}</span>
                    <span className="shrink-0 text-gold" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-4 pt-2">
                      <p className="text-sm leading-relaxed text-slate">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
