const db = require('../db/queries');

const SETTINGS_FIELDS = db.settings.FIELDS;

function pickFields(body) {
  const data = {};
  for (const field of SETTINGS_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

async function get(req, res, next) {
  try {
    let settings = await db.settings.get();

    if (!settings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    res.json({ settings });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = pickFields(req.body);

    if (!Object.keys(data).length) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const settings = await db.settings.update(data);

    if (!settings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    res.json({ settings });
  } catch (err) {
    next(err);
  }
}

async function uploadLogo(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No logo file uploaded' });
    }

    const { filePublicUrl } = require('../utils/upload');
    const logoUrl = filePublicUrl(req.file, 'site');
    const settings = await db.settings.update({ logo_url: logoUrl });

    res.json({ settings, logo_url: logoUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, update, uploadLogo };
