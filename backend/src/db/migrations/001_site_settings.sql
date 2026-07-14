-- Add site_settings table to an existing database (no data loss)
CREATE TABLE IF NOT EXISTS site_settings (
  id              INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name       VARCHAR(255) NOT NULL DEFAULT 'Home Dealership',
  tagline         VARCHAR(255) DEFAULT 'Manufactured & Tiny Homes',
  logo_url        TEXT,
  contact_phone   VARCHAR(50) DEFAULT '(555) 123-4567',
  contact_email   VARCHAR(255) DEFAULT 'info@dealersite.com',
  contact_address VARCHAR(255) DEFAULT '123 Dealer Way, Suite 100',
  contact_city    VARCHAR(255) DEFAULT 'Your City, ST 12345',
  contact_hours   VARCHAR(255) DEFAULT 'Mon–Fri 9am–6pm · Sat 10am–4pm',
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
