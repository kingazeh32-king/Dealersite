const db = require('../db/queries');

const MEMBER_FIELDS = db.team.FIELDS;

function pickFields(body) {
  const data = {};
  for (const field of MEMBER_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

async function list(req, res, next) {
  try {
    const publishedOnly = !req.admin;
    const rows = await db.team.findAll({ publishedOnly });
    res.json({ rows });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const member = await db.team.findById(Number(req.params.id));
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    if (!req.admin && !member.is_published) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json({ member });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = pickFields(req.body);
    const member = await db.team.create(data);
    res.status(201).json({ member });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = pickFields(req.body);
    const member = await db.team.update(id, data);

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ member });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await db.team.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted' });
  } catch (err) {
    next(err);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    const id = Number(req.params.id);
    const member = await db.team.findById(id);

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const { filePublicUrl } = require('../utils/upload');
    const photoUrl = filePublicUrl(req.file, 'team');
    const updated = await db.team.update(id, { photo_url: photoUrl });

    res.json({ member: updated, photo_url: photoUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  uploadPhoto,
};
