CREATE TABLE IF NOT EXISTS site_pages (
  slug          VARCHAR(50) PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  subtitle      TEXT,
  sections      JSONB NOT NULL DEFAULT '[]',
  highlights    JSONB NOT NULL DEFAULT '[]',
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_pages (slug, title, subtitle, sections, highlights)
SELECT v.slug, v.title, v.subtitle, v.sections::jsonb, v.highlights::jsonb
FROM (
  VALUES
    (
      'about',
      'About Us',
      'A family-focused dealership helping buyers find quality manufactured and tiny homes — without the pressure.',
      '[
        {"heading": "Our Story", "body": "We started with a simple belief: everyone deserves a path to homeownership that is honest, affordable, and straightforward. For over a decade, we have helped families across the region find HUD-compliant manufactured homes and thoughtfully designed tiny homes that fit their budget and lifestyle."},
        {"heading": "What We Stand For", "body": "No high-pressure sales. No hidden fees. Just real guidance from people who know manufactured housing inside and out — from floor plans and land prep to delivery and setup coordination."},
        {"heading": "Why Manufactured Homes", "body": "Modern manufactured homes offer exceptional value — often 30–50% less per square foot than site-built homes — while meeting strict federal safety and construction standards. Whether you are buying new, pre-owned, or going tiny, we help you understand every step before you commit."}
      ]',
      '[
        {"title": "HUD-Compliant Inventory", "body": "Every home we sell meets federal manufactured housing standards."},
        {"title": "Nationwide Delivery", "body": "We coordinate transport, placement, and setup with trusted crews."},
        {"title": "Local Expertise", "body": "Our team knows zoning, foundations, and lenders in your area."},
        {"title": "After-Sale Support", "body": "We stay in touch long after delivery to answer questions."}
      ]'
    ),
    (
      'financing',
      'Financing Options',
      'Flexible loan programs and guidance for manufactured, modular, and tiny home buyers.',
      '[
        {"heading": "Financing Made Clear", "body": "Manufactured home financing works differently than traditional site-built mortgages — but that does not mean it has to be confusing. Our financing coordinators walk you through every option and connect you with lenders who understand this market."},
        {"heading": "Get Pre-Qualified", "body": "Knowing your budget upfront saves time and helps us match you with homes that fit. Fill out our quick pre-qualification form and a team member will reach out within one business day — no obligation, no credit hit until you are ready."}
      ]',
      '[
        {"title": "Conventional & FHA Loans", "body": "For homes on permanent foundations, traditional mortgage products may apply — including FHA Title II loans with competitive rates."},
        {"title": "Chattel Loans", "body": "Homes on leased land or without real property often qualify for chattel financing — typically faster to close with flexible terms."},
        {"title": "FHA Title I", "body": "Personal property loans for buyers who own land or are placing a home in a community park."},
        {"title": "In-House Programs", "body": "Select homes qualify for flexible payment plans and rent-to-own arrangements — ask our team for current availability."}
      ]'
    )
) AS v(slug, title, subtitle, sections, highlights)
WHERE NOT EXISTS (SELECT 1 FROM site_pages WHERE slug = v.slug);
