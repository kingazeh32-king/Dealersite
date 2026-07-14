const pool = require('../pool');

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM admins WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, created_at FROM admins WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function findByIdWithHash(id) {
  const { rows } = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updatePassword(id, password_hash) {
  const { rows } = await pool.query(
    `UPDATE admins SET password_hash = $1
     WHERE id = $2
     RETURNING id, name, email, created_at`,
    [password_hash, id]
  );
  return rows[0] || null;
}

async function updateEmail(id, email) {
  const { rows } = await pool.query(
    `UPDATE admins SET email = $1
     WHERE id = $2
     RETURNING id, name, email, created_at`,
    [email, id]
  );
  return rows[0] || null;
}

async function create({ name, email, password_hash }) {
  const { rows } = await pool.query(
    `INSERT INTO admins (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, password_hash]
  );
  return rows[0];
}

module.exports = {
  findByEmail,
  findById,
  findByIdWithHash,
  updatePassword,
  updateEmail,
  create,
};
