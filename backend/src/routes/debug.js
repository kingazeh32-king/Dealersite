const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../db/queries');
const { uploadPropertyImages, propertiesDir } = require('../utils/upload');
const { upload } = require('../config/env');

const router = Router();

// Debug: return property and check uploaded files
router.get('/property/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const property = await db.properties.findById(id);
    if (!property) return res.status(404).json({ error: 'Not found' });

    const images = (property.images || []).map((p) => {
      const normalized = String(p).replace(/^\/+/, ''); // remove leading slash
      const filePath = path.join(process.cwd(), upload.dir, normalized);
      return {
        path: p,
        filePath,
        exists: fs.existsSync(filePath),
        url: `${req.protocol}://${req.get('host')}${p}`,
      };
    });

    res.json({ property, images });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
