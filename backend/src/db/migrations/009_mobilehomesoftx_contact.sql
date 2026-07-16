-- Brand contact defaults for mobilehomesoftx.com
UPDATE site_settings
SET
  site_name = CASE
    WHEN site_name IS NULL OR site_name IN ('Home Dealership', '')
      THEN 'Manufactured Mobile Homes of Texas'
    ELSE site_name
  END,
  contact_email = 'info@mobilehomesoftx.com',
  contact_city = 'Texas, USA',
  contact_address = CASE
    WHEN contact_address IN ('123 Dealer Way, Suite 100', '123 Dealer Way') THEN ''
    ELSE COALESCE(contact_address, '')
  END,
  updated_at = NOW()
WHERE id = 1;
