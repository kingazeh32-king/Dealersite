const pool = require('../pool');

async function findAll({ category, publishedOnly = true } = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  if (publishedOnly) {
    conditions.push('is_published = TRUE');
  }
  if (category) {
    conditions.push(`category = $${i++}`);
    values.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT * FROM faqs ${where} ORDER BY sort_order ASC, id ASC`,
    values
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM faqs WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const columns = Object.keys(data);
  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const values = columns.map((col) => data[col]);

  const { rows } = await pool.query(
    `INSERT INTO faqs (${columns.join(', ')})
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
    `UPDATE faqs SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM faqs WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
