const pool = require('./pool');
const db = require('./queries');
const bcrypt = require('bcryptjs');

async function smokeTest() {
  const featured = await db.properties.findFeatured(3);
  console.log('Featured properties:', featured.map((p) => p.name).join(', '));

  const { rows, total } = await db.properties.findAll({ category: 'new', limit: 5 });
  console.log(`New homes: ${rows.length} of ${total}`);

  const property = await db.properties.findBySlug('texas-ruby');
  console.log('Lookup by slug:', property?.name, `($${property?.price})`);

  const faqs = await db.faqs.findAll({ category: 'financing' });
  console.log(`Financing FAQs: ${faqs.length}`);

  const admin = await db.admins.findByEmail('admin@dealersite.com');
  const passwordOk = await bcrypt.compare('ChangeMeNow!2025', admin.password_hash);
  console.log('Admin password check:', passwordOk ? 'OK' : 'FAILED');

  const { total: resourceCount } = await db.resources.findAll({ type: 'buying-guide' });
  console.log(`Buying guides: ${resourceCount}`);
}

smokeTest()
  .then(() => console.log('\n✅ Query layer smoke test passed'))
  .catch((err) => {
    console.error('\n❌ Smoke test failed:', err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
