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
