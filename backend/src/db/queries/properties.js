const pool = require('../pool');

const SORT_OPTIONS = {
  newest:     'created_at DESC',
  price_asc:  'price ASC',
  price_desc: 'price DESC',
  featured:   'is_featured DESC, created_at DESC',
};

function buildFilters(filters = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  const { category, status, featured, minPrice, maxPrice, search } = filters;

  if (category) {
    conditions.push(`category = $${i++}`);
    values.push(category);
  }
  if (status) {
    conditions.push(`status = $${i++}`);
    values.push(status);
  }
  if (featured !== undefined && featured !== null) {
    conditions.push(`is_featured = $${i++}`);
    values.push(featured);
  }
  if (minPrice != null) {
    conditions.push(`price >= $${i++}`);
    values.push(minPrice);
  }
  if (maxPrice != null) {
    conditions.push(`price <= $${i++}`);
    values.push(maxPrice);
  }
  if (search) {
    conditions.push(
      `(name ILIKE $${i} OR description ILIKE $${i} OR make_model ILIKE $${i})`
    );
    values.push(`%${search}%`);
    i++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, values, nextIndex: i };
}

async function findAll(filters = {}) {
  const limit  = Math.min(filters.limit  ?? 20, 100);
  const offset = filters.offset ?? 0;
  const sort   = SORT_OPTIONS[filters.sort] || SORT_OPTIONS.featured;

  const { where, values, nextIndex } = buildFilters(filters);
  values.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT * FROM properties ${where} ORDER BY ${sort} LIMIT $${nextIndex} OFFSET $${nextIndex + 1}`,
    values
  );

  const countValues = values.slice(0, -2);
  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM properties ${where}`,
    countValues
  );

  return { rows, total: count, limit, offset };
}

async function findFeatured(limit = 6) {
  const { rows } = await pool.query(
    `SELECT * FROM properties
     WHERE is_featured = TRUE AND status = 'available'
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

async function findBySlug(slug) {
  const { rows } = await pool.query(
    'SELECT * FROM properties WHERE slug = $1',
    [slug]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM properties WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const columns = Object.keys(data);
  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const values = columns.map((col) => data[col]);

  const { rows } = await pool.query(
    `INSERT INTO properties (${columns.join(', ')})
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
    `UPDATE properties SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM properties WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}

module.exports = {
  findAll,
  findFeatured,
  findBySlug,
  findById,
  create,
  update,
  remove,
};
