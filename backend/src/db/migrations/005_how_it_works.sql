ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS how_it_works JSONB NOT NULL DEFAULT '{}';

UPDATE site_settings SET how_it_works = '{
  "eyebrow": "Simple process",
  "title": "How it works",
  "description": "No shopping cart. No hidden fees. Just a straightforward path from browsing to homeownership.",
  "steps": [
    {"step": "01", "title": "Browse & compare", "text": "Explore our inventory online. Filter by category, price, and size to find homes that fit your needs."},
    {"step": "02", "title": "Talk to our team", "text": "Request information or a quote. We answer your questions about financing, delivery, and site preparation."},
    {"step": "03", "title": "Move in with confidence", "text": "We coordinate delivery, setup, and utility hookups. Your home arrives ready for the next chapter."}
  ]
}'::jsonb
WHERE id = 1 AND (how_it_works IS NULL OR how_it_works = '{}'::jsonb);
