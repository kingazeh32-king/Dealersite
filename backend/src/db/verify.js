const pool = require('./pool');

async function verify() {
  const tables = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  const counts = await pool.query(`
    SELECT 'admins' AS table_name, COUNT(*)::int AS rows FROM admins
    UNION ALL SELECT 'properties', COUNT(*)::int FROM properties
    UNION ALL SELECT 'inquiries', COUNT(*)::int FROM inquiries
    UNION ALL SELECT 'resources', COUNT(*)::int FROM resources
    UNION ALL SELECT 'faqs', COUNT(*)::int FROM faqs
    UNION ALL SELECT 'leads', COUNT(*)::int FROM leads
    UNION ALL SELECT 'site_settings', COUNT(*)::int FROM site_settings
    UNION ALL SELECT 'team_members', COUNT(*)::int FROM team_members
    UNION ALL SELECT 'site_pages', COUNT(*)::int FROM site_pages
    UNION ALL SELECT 'testimonials', COUNT(*)::int FROM testimonials
    ORDER BY table_name
  `);

  console.log('Tables:', tables.rows.map((r) => r.table_name).join(', '));
  console.table(counts.rows);
}

verify()
  .catch((err) => {
    console.error('Verification failed:', err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
