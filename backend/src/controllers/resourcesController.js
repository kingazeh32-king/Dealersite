const db = require('../db/queries');
const { uniqueResourceSlug } = require('../utils/slug');

const RESOURCE_FIELDS = [
  'title', 'type', 'excerpt', 'content', 'cover_image', 'reading_time', 'is_published', 'slug',
];

function pickFields(body) {
  const data = {};
  for (const field of RESOURCE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

async function list(req, res, next) {
  try {
    const result = await db.resources.findAll({
      type: req.query.type,
      publishedOnly: !req.admin,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const resource = await db.resources.findBySlug(req.params.slug, {
      publishedOnly: !req.admin,
    });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const resource = await db.resources.findById(Number(req.params.id));
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = pickFields(req.body);
    data.slug = data.slug || await uniqueResourceSlug(data.title);
    const resource = await db.resources.create(data);
    res.status(201).json({ resource });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = pickFields(req.body);
    if (data.title && !data.slug) {
      const existing = await db.resources.findById(id);
      if (existing && data.title !== existing.title) {
        data.slug = await uniqueResourceSlug(data.title, id);
      }
    }
    const resource = await db.resources.update(id, data);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await db.resources.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getBySlug, getById, create, update, remove };
