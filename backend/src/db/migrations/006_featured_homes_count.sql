ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS featured_homes_count INTEGER NOT NULL DEFAULT 3;

UPDATE site_settings SET featured_homes_count = 3
WHERE id = 1 AND featured_homes_count IS NULL;
