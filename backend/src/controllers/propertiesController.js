const db = require('../db/queries');
const { uniquePropertySlug } = require('../utils/slug');

const PROPERTY_FIELDS = [
  'name', 'category', 'status', 'price', 'down_payment', 'monthly_est',
  'bedrooms', 'bathrooms', 'sqft', 'year_built', 'make_model', 'dimensions',
  'hvac_type', 'insulation', 'foundation_type', 'description', 'features',
  'delivery_info', 'images', 'pdf_floorplan', 'virtual_tour', 'is_featured',
];

function pickFields(body) {
  const data = {};
  for (const field of PROPERTY_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

function parseQuery(req) {
  return {
    category:  req.query.category,
    status:    req.query.status,
    featured:  req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
    minPrice:  req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice:  req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    search:    req.query.search,
    sort:      req.query.sort,
    limit:     req.query.limit ? Number(req.query.limit) : 20,
    offset:    req.query.offset ? Number(req.query.offset) : 0,
  };
}

async function list(req, res, next) {
  try {
    const filters = parseQuery(req);
    if (!req.admin) filters.status = filters.status || 'available';

    const result = await db.properties.findAll(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function featured(req, res, next) {
  try {
    const raw = req.query.limit ? Number(req.query.limit) : 6;
    const limit = Math.min(12, Math.max(0, Math.round(raw) || 0));
    const rows = await db.properties.findFeatured(limit);
    res.json({ rows });
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const property = await db.properties.findBySlug(req.params.slug);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (!req.admin && property.status !== 'available') {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ property });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = pickFields(req.body);
    data.slug = await uniquePropertySlug(data.name);

    const property = await db.properties.create(data);
    res.status(201).json({ property });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A property with this slug already exists' });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await db.properties.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const data = pickFields(req.body);
    if (data.name && data.name !== existing.name) {
      data.slug = await uniquePropertySlug(data.name, id);
    }

    const property = await db.properties.update(id, data);
    res.json({ property });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const property = await db.properties.update(id, { status });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ property });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await db.properties.remove(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
}

async function uploadImages(req, res, next) {
  try {
    const id = Number(req.params.id);
    const property = await db.properties.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const { filePublicUrl } = require('../utils/upload');
    const newPaths = (req.files || []).map((f) =>
      filePublicUrl(f, 'properties')
    );

    const images = [...(property.images || []), ...newPaths];
    const updated = await db.properties.update(id, { images });

    res.json({ property: updated });
  } catch (err) {
    next(err);
  }
}

async function updateImages(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { images } = req.body;

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'images must be an array' });
    }

    const property = await db.properties.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const updated = await db.properties.update(id, { images });
    res.json({ property: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  featured,
  getBySlug,
  create,
  update,
  updateStatus,
  remove,
  uploadImages,
  updateImages,
};
