const db = require('../db/queries');
const { notifyInquiry } = require('../utils/mail');

async function create(req, res, next) {
  try {
    const data = {
      name:          req.body.name,
      email:         req.body.email || null,
      phone:         req.body.phone || null,
      message:       req.body.message || null,
      property_id:   req.body.property_id || null,
      property_name: req.body.property_name || null,
      inquiry_type:  req.body.inquiry_type || 'general',
    };

    if (data.property_id) {
      const property = await db.properties.findById(data.property_id);
      if (property) {
        data.property_name = data.property_name || property.name;
        data.inquiry_type = data.inquiry_type === 'general' ? 'property' : data.inquiry_type;
      }
    }

    const inquiry = await db.inquiries.create(data);
    notifyInquiry(inquiry).catch((err) => console.error('[email]', err.message));
    res.status(201).json({ inquiry, message: 'Inquiry submitted successfully' });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const result = await db.inquiries.findAll({
      status: req.query.status,
      limit:  req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const inquiry = await db.inquiries.updateStatus(id, status);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json({ inquiry });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, updateStatus };
