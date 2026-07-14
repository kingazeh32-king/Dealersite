const slugify = require('slugify');
const db = require('../db/queries');

function toSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

async function uniquePropertySlug(name, excludeId = null) {
  let base = toSlug(name);
  if (!base) base = 'property';

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db.properties.findBySlug(slug);
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    slug = `${base}-${counter++}`;
  }
}

async function uniqueResourceSlug(title, excludeId = null) {
  let base = toSlug(title);
  if (!base) base = 'resource';

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db.resources.findBySlug(slug, { publishedOnly: false });
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    slug = `${base}-${counter++}`;
  }
}

module.exports = { toSlug, uniquePropertySlug, uniqueResourceSlug };
