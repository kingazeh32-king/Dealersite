const pool = require('../pool');

const FIELDS = ['title', 'subtitle', 'sections', 'highlights'];

function serializeValue(value) {
  if (value === undefined || value === null) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}

async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM site_pages ORDER BY slug ASC'
  );
  return rows;
}

async function findBySlug(slug) {
  const { rows } = await pool.query(
    'SELECT * FROM site_pages WHERE slug = $1',
    [slug]
  );
  return rows[0] || null;
}

async function create(slug, data = {}) {
  const columns = ['slug', ...Object.keys(data)];
  const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
  const values = [slug, ...columns.filter((col) => col !== 'slug').map((col) => serializeValue(data[col]))];

  const { rows } = await pool.query(
    `INSERT INTO site_pages (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function update(slug, data) {
  const columns = Object.keys(data);
  if (!columns.length) return findBySlug(slug);

  const setClause = columns.map((col, idx) => `${col} = $${idx + 2}`).join(', ');
  const values = [slug, ...columns.map((col) => serializeValue(data[col]))];

  const { rows } = await pool.query(
    `UPDATE site_pages SET ${setClause}, updated_at = NOW() WHERE slug = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

module.exports = {
  findAll,
  findBySlug,
  create,
  update,
  FIELDS,
};
