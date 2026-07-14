ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_content JSONB NOT NULL DEFAULT '{}';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS trust_signals JSONB NOT NULL DEFAULT '[]';

UPDATE site_settings SET hero_content = '{
  "eyebrow": "Manufactured & Tiny Homes",
  "title": "Your path to homeownership starts here",
  "description": "Quality new, pre-owned, and tiny homes at prices that make sense. We guide you from browsing to delivery — with honest advice, not high-pressure sales.",
  "primaryCta": {"label": "Browse Inventory", "href": "/inventory"},
  "secondaryCta": {"label": "Request a Quote", "href": "/request-quote"},
  "cardTitle": "Why buyers choose us",
  "cardFooter": "Every home in our inventory meets federal HUD standards. We handle delivery, setup coordination, and financing guidance — so you can focus on finding the right home.",
  "badges": ["Nationwide Delivery", "Flexible Financing", "HUD-Compliant Homes", "No-Pressure Sales"]
}'::jsonb
WHERE id = 1 AND (hero_content IS NULL OR hero_content = '{}'::jsonb);

UPDATE site_settings SET trust_signals = '[
  {"value": "30–50%", "label": "Savings vs. site-built", "detail": "Per square foot"},
  {"value": "7+", "label": "Homes in stock", "detail": "New, pre-owned & tiny"},
  {"value": "100%", "label": "HUD compliant", "detail": "Federal safety standards"},
  {"value": "48hr", "label": "Response time", "detail": "On all inquiries"}
]'::jsonb
WHERE id = 1 AND (trust_signals IS NULL OR trust_signals = '[]'::jsonb);

CREATE TABLE IF NOT EXISTS testimonials (
  id            SERIAL PRIMARY KEY,
  quote         TEXT NOT NULL,
  name          VARCHAR(255) NOT NULL,
  location      VARCHAR(255),
  home          VARCHAR(255),
  rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials(sort_order);

INSERT INTO testimonials (quote, name, location, home, rating, sort_order)
SELECT v.quote, v.name, v.location, v.home, v.rating, v.sort_order
FROM (
  VALUES
    ('From the first phone call to move-in day, the team made everything straightforward. They walked us through financing options we didn''t even know existed and kept us updated every step of the way.', 'Sarah & Mike T.', 'Georgetown, TX', 'Texas Ruby', 5, 1),
    ('We were nervous about buying a manufactured home, but seeing the HUD certification and touring the lot in person put us at ease. Delivery was on schedule and the setup crew was professional.', 'James R.', 'Round Rock, TX', 'Southern Charm', 5, 2),
    ('Downsizing into a tiny home was the best decision we made. They helped us understand zoning, foundation options, and what we could realistically afford on a fixed income.', 'Linda K.', 'Bastrop, TX', 'Skyberry Tiny', 5, 3),
    ('No pressure sales — just honest answers. We compared three models on the lot, took our time, and never felt rushed. Our monthly payment ended up lower than our old apartment rent.', 'Carlos & Elena M.', 'Killeen, TX', 'Horizon View', 5, 4),
    ('As a first-time homebuyer, I had a lot of questions. They explained the difference between chattel and land-home loans clearly and connected me with a lender who understood manufactured housing.', 'Daniel W.', 'Temple, TX', 'Prairie Creek', 5, 5),
    ('We drove two hours to visit and it was worth every mile. The home was exactly as pictured, and the delivery team coordinated with our contractor for utilities without a single headache.', 'Patricia & Robert H.', 'Waco, TX', 'Magnolia Ridge', 5, 6),
    ('After a bad experience elsewhere, we were skeptical. This dealership restored our confidence — transparent pricing, real photos, and a team that still checks in months after we closed.', 'Angela S.', 'Cedar Park, TX', 'Lone Star Deluxe', 5, 7)
) AS v(quote, name, location, home, rating, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
