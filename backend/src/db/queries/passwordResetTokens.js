const crypto = require('crypto');
const pool = require('../pool');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function create(adminId, token, expiresAt) {
  await pool.query('DELETE FROM password_reset_tokens WHERE admin_id = $1', [adminId]);
  const { rows } = await pool.query(
    `INSERT INTO password_reset_tokens (admin_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [adminId, hashToken(token), expiresAt]
  );
  return rows[0];
}

async function findValid(token) {
  const { rows } = await pool.query(
    `SELECT t.*, a.email, a.name
     FROM password_reset_tokens t
     JOIN admins a ON a.id = t.admin_id
     WHERE t.token_hash = $1 AND t.expires_at > NOW()`,
    [hashToken(token)]
  );
  return rows[0] || null;
}

async function deleteByAdminId(adminId) {
  await pool.query('DELETE FROM password_reset_tokens WHERE admin_id = $1', [adminId]);
}

module.exports = { create, findValid, deleteByAdminId };
