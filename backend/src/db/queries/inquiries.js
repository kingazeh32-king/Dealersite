const pool = require('../pool');

async function findAll({ status, limit = 50, offset = 0 } = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  if (status) {
    conditions.push(`status = $${i++}`);
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT i.*, p.slug AS property_slug
     FROM inquiries i
     LEFT JOIN properties p ON p.id = i.property_id
     ${where}
     ORDER BY i.created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    values
  );

  const countValues = values.slice(0, -2);
  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM inquiries ${where}`,
    countValues
  );

  return { rows, total: count, limit, offset };
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT i.*, p.slug AS property_slug
     FROM inquiries i
     LEFT JOIN properties p ON p.id = i.property_id
     WHERE i.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const columns = Object.keys(data);
  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const values = columns.map((col) => data[col]);

  const { rows } = await pool.query(
    `INSERT INTO inquiries (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     RETURNING *`,
    values
  );
  return rows[0];
}

async function updateStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE inquiries SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  create,
  updateStatus,
};
