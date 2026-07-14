const db = require('../db/queries');

const FIELDS = db.testimonials.FIELDS;

function pickFields(body) {
  const data = {};
  for (const field of FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

async function list(req, res, next) {
  try {
    const rows = await db.testimonials.findAll({ publishedOnly: !req.admin });
    res.json({ rows });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const testimonial = await db.testimonials.findById(Number(req.params.id));
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ testimonial });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const testimonial = await db.testimonials.create(pickFields(req.body));
    res.status(201).json({ testimonial });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const testimonial = await db.testimonials.update(Number(req.params.id), pickFields(req.body));
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ testimonial });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await db.testimonials.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
