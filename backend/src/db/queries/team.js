const pool = require('../pool');

const FIELDS = ['name', 'role', 'bio', 'email', 'photo_url', 'sort_order', 'is_published'];

async function findAll({ publishedOnly = true } = {}) {
  const where = publishedOnly ? 'WHERE is_published = TRUE' : '';

  const { rows } = await pool.query(
    `SELECT * FROM team_members ${where} ORDER BY sort_order ASC, id ASC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(data) {
  const columns = Object.keys(data);
  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const values = columns.map((col) => data[col]);

  const { rows } = await pool.query(
    `INSERT INTO team_members (${columns.join(', ')})
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
    `UPDATE team_members SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM team_members WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  FIELDS,
};
