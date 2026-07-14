const fs   = require('fs');
const path = require('path');
const pool = require('./pool');
const createDatabase = require('./createDatabase');

async function runSQL(filename) {
  const filepath = path.join(__dirname, filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  await pool.query(sql);
  console.log(`✅ Ran: ${filename}`);
}

async function init() {
  console.log('🚀 Initializing database...\n');

  try {
    await createDatabase();
    await runSQL('schema.sql');
    await runSQL('seed.sql');
    console.log('\n🎉 Database initialized successfully!');
    console.log('   Tables: admins, site_settings, site_pages, testimonials, team_members, properties, inquiries, resources, faqs, leads');
    console.log('   Admin login: admin@dealersite.com / admin123');
  } catch (err) {
    console.error('\n❌ Database initialization failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
