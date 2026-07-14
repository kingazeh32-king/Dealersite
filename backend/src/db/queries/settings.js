const pool = require('../pool');

const SETTINGS_ID = 1;

const FIELDS = [
  'site_name',
  'tagline',
  'logo_url',
  'contact_phone',
  'contact_email',
  'contact_address',
  'contact_city',
  'contact_hours',
  'hero_content',
  'trust_signals',
  'how_it_works',
  'featured_homes_count',
];

async function get() {
  const { rows } = await pool.query(
    'SELECT * FROM site_settings WHERE id = $1',
    [SETTINGS_ID]
  );
  return rows[0] || null;
}

async function update(data) {
  const updates = [];
  const values = [];
  let i = 1;

  for (const field of FIELDS) {
    if (data[field] !== undefined) {
      updates.push(`${field} = $${i++}`);
      values.push(data[field]);
    }
  }

  if (!updates.length) {
    return get();
  }

  updates.push('updated_at = NOW()');
  values.push(SETTINGS_ID);

  const { rows } = await pool.query(
    `UPDATE site_settings SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0];
}

module.exports = { get, update, FIELDS };
