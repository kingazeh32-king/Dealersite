const pool = require('./pool');
const logger = require('../utils/logger');

/**
 * Lightweight startup migrations that are safe to re-run.
 * Keeps production in sync without a separate migrate step for small schema adds.
 */
async function ensureSchema() {
  await pool.query(`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS favicon_url TEXT
  `);

  // One-time branding migration for known placeholders only.
  // Do not treat empty strings as placeholders — admins must be able to clear fields.
  await pool.query(`
    UPDATE site_settings
    SET
      site_name = CASE
        WHEN site_name IS NULL OR site_name = 'Home Dealership'
          THEN 'Manufactured Mobile Homes of Texas'
        ELSE site_name
      END,
      contact_email = CASE
        WHEN contact_email IS NULL OR contact_email = 'info@dealersite.com'
          THEN 'info@mobilehomesoftx.com'
        ELSE contact_email
      END,
      contact_city = CASE
        WHEN contact_city IS NULL OR contact_city = 'Your City, ST 12345'
          THEN 'Texas, USA'
        ELSE contact_city
      END,
      contact_address = CASE
        WHEN contact_address IN ('123 Dealer Way, Suite 100', '123 Dealer Way')
          THEN ''
        ELSE contact_address
      END,
      updated_at = NOW()
    WHERE id = 1
      AND (
        site_name IS NULL
        OR site_name = 'Home Dealership'
        OR contact_email IS NULL
        OR contact_email = 'info@dealersite.com'
        OR contact_city IS NULL
        OR contact_city = 'Your City, ST 12345'
        OR contact_address IN ('123 Dealer Way, Suite 100', '123 Dealer Way')
      )
  `);
}

async function runStartupMigrations() {
  try {
    await ensureSchema();
    logger.info('Startup schema checks complete');
  } catch (err) {
    logger.error('Startup schema check failed', { message: err.message });
    throw err;
  }
}

module.exports = { runStartupMigrations };
