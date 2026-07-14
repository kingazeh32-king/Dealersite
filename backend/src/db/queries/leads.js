const pool = require('../pool');

async function findAll({ type, limit = 50, offset = 0 } = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  if (type) {
    conditions.push(`type = $${i++}`);
    values.push(type);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT * FROM leads ${where}
     ORDER BY created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    values
  );

  const countValues = values.slice(0, -2);
  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM leads ${where}`,
    countValues
  );

  return { rows, total: count, limit, offset };
}

async function create(data) {
  const columns = Object.keys(data);
  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const values = columns.map((col) => data[col]);

  const { rows } = await pool.query(
    `INSERT INTO leads (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     RETURNING *`,
    values
  );
  return rows[0];
}

async function findByEmail(email, type) {
  const conditions = ['email = $1'];
  const values = [email];

  if (type) {
    conditions.push('type = $2');
    values.push(type);
  }

  const { rows } = await pool.query(
    `SELECT * FROM leads WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT 1`,
    values
  );
  return rows[0] || null;
}

module.exports = {
  findAll,
  create,
  findByEmail,
};
