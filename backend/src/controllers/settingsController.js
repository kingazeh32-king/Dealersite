const db = require('../db/queries');

const SETTINGS_FIELDS = db.settings.FIELDS;

function pickFields(body) {
  const data = {};
  for (const field of SETTINGS_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

/** Normalize logo paths so mangled absolute URLs become /uploads/... */
function sanitizeLogoUrl(logoUrl) {
  if (!logoUrl) return logoUrl;
  const value = String(logoUrl).trim();
  if (!value) return value;
  if (value.startsWith('/uploads/')) return value;

  const match = value.match(/\/uploads\/[^\s?#]+/);
  if (match) return match[0];

  if (value.startsWith('/api/uploads/')) return value.slice(4);
  return value;
}

async function get(req, res, next) {
  try {
    let settings = await db.settings.get();

    if (!settings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    const cleaned = sanitizeLogoUrl(settings.logo_url);
    if (cleaned && cleaned !== settings.logo_url) {
      settings = (await db.settings.update({ logo_url: cleaned })) || {
        ...settings,
        logo_url: cleaned,
      };
    }

    res.json({ settings });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = pickFields(req.body);
    if (data.logo_url !== undefined) {
      data.logo_url = sanitizeLogoUrl(data.logo_url);
    }

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
