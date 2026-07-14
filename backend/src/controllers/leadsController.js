const db = require('../db/queries');
const { notifyLead } = require('../utils/mail');

async function create(req, res, next) {
  try {
    const data = {
      type:          req.body.type,
      name:          req.body.name || null,
      email:         req.body.email,
      phone:         req.body.phone || null,
      income_range:  req.body.income_range || null,
      credit_range:  req.body.credit_range || null,
      desired_price: req.body.desired_price || null,
    };

    const lead = await db.leads.create(data);
    notifyLead(lead).catch((err) => console.error('[email]', err.message));
    res.status(201).json({ lead, message: 'Thank you — we will be in touch soon' });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const result = await db.leads.findAll({
      type:   req.query.type,
      limit:  req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list };
