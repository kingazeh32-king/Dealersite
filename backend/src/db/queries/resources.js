const pool = require('../pool');

async function findAll({ type, publishedOnly = true, limit = 20, offset = 0 } = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  if (publishedOnly) {
    conditions.push(`is_published = TRUE`);
  }
  if (type) {
    conditions.push(`type = $${i++}`);
    values.push(type);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT id, slug, title, type, excerpt, cover_image, reading_time, is_published, created_at, updated_at
     FROM resources ${where}
     ORDER BY created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    values
  );

  const countValues = values.slice(0, -2);
  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM resources ${where}`,
    countValues
  );

  return { rows, total: count, limit, offset };
}

async function findBySlug(slug, { publishedOnly = true } = {}) {
  const conditions = ['slug = $1'];
  const values = [slug];

  if (publishedOnly) {
    conditions.push('is_published = TRUE');
  }

  const { rows } = await pool.query(
    `SELECT * FROM resources WHERE ${conditions.join(' AND ')}`,
    values
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM resources WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const columns = Object.keys(data);
  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const values = columns.map((col) => data[col]);

  const { rows } = await pool.query(
    `INSERT INTO resources (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     RETURNING *`,
    values
  );
  return rows[0];
}

async function update(id, data) {
  const columns = Object.keys(data);
  if (!columns.length) return findById(id);

  const setClause = columns.map((col, idx) => `${col} = $${idx + 2}`).join(', ');
  const values = [id, ...columns.map((col) => data[col])];

  const { rows } = await pool.query(
    `UPDATE resources SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM resources WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}

module.exports = {
  findAll,
  findBySlug,
  findById,
  create,
  update,
  remove,
};
