const db = require('../db/queries');

const FAQ_FIELDS = ['question', 'answer', 'category', 'sort_order', 'is_published'];

function pickFields(body) {
  const data = {};
  for (const field of FAQ_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

async function list(req, res, next) {
  try {
    const rows = await db.faqs.findAll({
      category: req.query.category,
      publishedOnly: !req.admin,
    });
    res.json({ rows });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const faq = await db.faqs.findById(Number(req.params.id));
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ faq });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const faq = await db.faqs.create(pickFields(req.body));
    res.status(201).json({ faq });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const faq = await db.faqs.update(Number(req.params.id), pickFields(req.body));
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ faq });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await db.faqs.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
