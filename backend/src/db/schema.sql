-- ============================================================
-- DEALER SITE — PostgreSQL Schema
-- Run this file to initialize the full database structure
-- ============================================================

-- Enable UUID extension (optional, using SERIAL for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DROP TABLES (clean slate — comment out in production!)
-- ============================================================
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS site_pages CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;


-- ============================================================
-- TABLE: admins
-- Stores admin users who can log in to manage the site
-- ============================================================
CREATE TABLE admins (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- TABLE: password_reset_tokens
-- One-time tokens for admin password reset emails
-- ============================================================
CREATE TABLE password_reset_tokens (
  id          SERIAL PRIMARY KEY,
  admin_id    INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_admin ON password_reset_tokens(admin_id);


-- ============================================================
-- TABLE: site_settings
-- Single-row site configuration (name, logo, contact info)
-- ============================================================
CREATE TABLE site_settings (
  id              INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name       VARCHAR(255) NOT NULL DEFAULT 'Home Dealership',
  tagline         VARCHAR(255) DEFAULT 'Manufactured & Tiny Homes',
  logo_url        TEXT,
  contact_phone   VARCHAR(50) DEFAULT '(555) 123-4567',
  contact_email   VARCHAR(255) DEFAULT 'info@dealersite.com',
  contact_address VARCHAR(255) DEFAULT '123 Dealer Way, Suite 100',
  contact_city    VARCHAR(255) DEFAULT 'Your City, ST 12345',
  contact_hours   VARCHAR(255) DEFAULT 'Mon–Fri 9am–6pm · Sat 10am–4pm',
  hero_content    JSONB NOT NULL DEFAULT '{}',
  trust_signals   JSONB NOT NULL DEFAULT '[]',
  how_it_works    JSONB NOT NULL DEFAULT '{}',
  featured_homes_count INTEGER NOT NULL DEFAULT 3,
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- TABLE: site_pages
-- Editable content pages (about, financing, etc.)
-- ============================================================
CREATE TABLE site_pages (
  slug          VARCHAR(50) PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  subtitle      TEXT,
  sections      JSONB NOT NULL DEFAULT '[]',
  highlights    JSONB NOT NULL DEFAULT '[]',
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- TABLE: testimonials
-- Customer reviews on the home page carousel
-- ============================================================
CREATE TABLE testimonials (
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


-- ============================================================
-- TABLE: team_members
-- Staff profiles shown on the home page team section
-- ============================================================
CREATE TABLE team_members (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(255) NOT NULL,
  bio           TEXT,
  email         VARCHAR(255),
  photo_url     TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- TABLE: properties
-- The core listings table — every home for sale
-- ============================================================
CREATE TABLE properties (
  id               SERIAL PRIMARY KEY,
  slug             VARCHAR(255) UNIQUE NOT NULL,

  -- Basic Info
  name             VARCHAR(255) NOT NULL,
  category         VARCHAR(50) NOT NULL
                     CHECK (category IN ('new', 'pre-owned', 'tiny')),
  status           VARCHAR(50) NOT NULL DEFAULT 'available'
                     CHECK (status IN ('available', 'pending', 'sold')),

  -- Pricing
  price            NUMERIC(12, 2) NOT NULL,
  down_payment     NUMERIC(12, 2),
  monthly_est      NUMERIC(12, 2),

  -- Physical Specs
  bedrooms         INTEGER,
  bathrooms        NUMERIC(3, 1),
  sqft             INTEGER,
  year_built       INTEGER,
  make_model       VARCHAR(255),
  dimensions       VARCHAR(100),      -- e.g. "76ft × 28ft"
  hvac_type        VARCHAR(100),      -- e.g. "Central Air"
  insulation       VARCHAR(100),      -- e.g. "R-19"
  foundation_type  VARCHAR(100),      -- e.g. "Pier & Beam"

  -- Content
  description      TEXT,
  features         TEXT[],            -- e.g. ARRAY['Open floor plan', 'Granite countertops']
  delivery_info    TEXT,

  -- Media
  images           TEXT[],            -- Array of image URLs / paths
  pdf_floorplan    TEXT,              -- URL / path to PDF floor plan
  virtual_tour     TEXT,              -- Embed URL for 360° tour

  -- Flags
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- TABLE: inquiries
-- Contact form submissions from potential buyers
-- ============================================================
CREATE TABLE inquiries (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255),
  phone          VARCHAR(50),
  message        TEXT,

  -- Optional link to a specific property
  property_id    INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  property_name  VARCHAR(255),

  -- Type of inquiry
  inquiry_type   VARCHAR(50) NOT NULL DEFAULT 'general'
                   CHECK (inquiry_type IN ('general', 'property', 'service', 'financing')),

  -- Admin tracking
  status         VARCHAR(50) NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'read', 'resolved')),

  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- TABLE: resources
-- Blog / knowledge base articles: buying guides, permit info, etc.
-- ============================================================
CREATE TABLE resources (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  title         VARCHAR(255) NOT NULL,
  type          VARCHAR(50) NOT NULL
                  CHECK (type IN ('buying-guide', 'permit', 'maintenance', 'general')),
  excerpt       TEXT,
  content       TEXT,              -- HTML or Markdown body
  cover_image   TEXT,
  reading_time  INTEGER,           -- Estimated minutes to read
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_resources_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- TABLE: faqs
-- Frequently asked questions — displayed on /resources/faqs
-- ============================================================
CREATE TABLE faqs (
  id           SERIAL PRIMARY KEY,
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  category     VARCHAR(100) NOT NULL DEFAULT 'general'
                 CHECK (category IN ('general', 'financing', 'delivery', 'installation', 'buying')),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE
);


-- ============================================================
-- TABLE: leads
-- Newsletter subscribers and pre-qualification form submissions
-- ============================================================
CREATE TABLE leads (
  id             SERIAL PRIMARY KEY,
  type           VARCHAR(50) NOT NULL
                   CHECK (type IN ('newsletter', 'prequalify')),
  name           VARCHAR(255),
  email          VARCHAR(255) NOT NULL,
  phone          VARCHAR(50),

  -- Pre-qualification fields (nullable — only for type='prequalify')
  income_range   VARCHAR(100),      -- e.g. "$50k–$75k"
  credit_range   VARCHAR(100),      -- e.g. "Good (670–739)"
  desired_price  NUMERIC(12, 2),

  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================
-- INDEXES — For common query patterns
-- ============================================================
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_status   ON properties(status);
CREATE INDEX idx_properties_featured ON properties(is_featured);
CREATE INDEX idx_properties_price    ON properties(price);
CREATE INDEX idx_inquiries_status    ON inquiries(status);
CREATE INDEX idx_inquiries_property  ON inquiries(property_id);
CREATE INDEX idx_resources_type      ON resources(type);
CREATE INDEX idx_resources_published ON resources(is_published);
CREATE INDEX idx_faqs_category       ON faqs(category);
CREATE INDEX idx_leads_type          ON leads(type);
CREATE INDEX idx_leads_email         ON leads(email);
CREATE INDEX idx_team_members_published ON team_members(is_published);
CREATE INDEX idx_team_members_sort      ON team_members(sort_order);
CREATE INDEX idx_testimonials_published ON testimonials(is_published);
CREATE INDEX idx_testimonials_sort      ON testimonials(sort_order);
