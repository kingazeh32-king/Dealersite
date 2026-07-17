const db = require('../db/queries');

const SETTINGS_FIELDS = db.settings.FIELDS;

function pickFields(body) {
  const data = {};
  for (const field of SETTINGS_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

/** Normalize media paths so mangled absolute URLs become /uploads/... */
function sanitizeMediaUrl(mediaUrl) {
  if (!mediaUrl) return mediaUrl;
  const value = String(mediaUrl).trim();
  if (!value) return value;
  if (value.startsWith('/uploads/')) return value;

  const match = value.match(/\/uploads\/[^\s?#]+/);
  if (match) return match[0];

  if (value.startsWith('/api/uploads/')) return value.slice(4);
  return value;
}

function selfHealMediaField(settings, field) {
  const cleaned = sanitizeMediaUrl(settings[field]);
  if (cleaned && cleaned !== settings[field]) {
    return { [field]: cleaned };
  }
  return null;
}

async function get(req, res, next) {
  try {
    let settings = await db.settings.get();

    if (!settings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    const heal = {
      ...selfHealMediaField(settings, 'logo_url'),
      ...selfHealMediaField(settings, 'favicon_url'),
    };

    if (Object.keys(heal).length) {
      settings = (await db.settings.update(heal)) || {
        ...settings,
        ...heal,
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
      data.logo_url = sanitizeMediaUrl(data.logo_url);
    }
    if (data.favicon_url !== undefined) {
      data.favicon_url = sanitizeMediaUrl(data.favicon_url);
    }
    if (data.hero_content && typeof data.hero_content === 'object') {
      const imageUrl = data.hero_content.imageUrl || data.hero_content.image_url;
      if (imageUrl) {
        data.hero_content = {
          ...data.hero_content,
          imageUrl: sanitizeMediaUrl(imageUrl),
        };
        delete data.hero_content.image_url;
      }
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

async function uploadFavicon(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No favicon file uploaded' });
    }

    const { filePublicUrl } = require('../utils/upload');
    const faviconUrl = filePublicUrl(req.file, 'site');
    const settings = await db.settings.update({ favicon_url: faviconUrl });

    res.json({ settings, favicon_url: faviconUrl });
  } catch (err) {
    next(err);
  }
}

async function uploadHero(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No hero image uploaded' });
    }

    const { filePublicUrl } = require('../utils/upload');
    const imageUrl = filePublicUrl(req.file, 'site');
    const current = await db.settings.get();
    const heroContent = {
      ...(current?.hero_content && typeof current.hero_content === 'object'
        ? current.hero_content
        : {}),
      imageUrl,
    };
    delete heroContent.image_url;

    const settings = await db.settings.update({ hero_content: heroContent });

    res.json({ settings, image_url: imageUrl, imageUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, update, uploadLogo, uploadFavicon, uploadHero };
