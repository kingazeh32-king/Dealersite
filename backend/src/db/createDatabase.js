const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'dealer_site';

  const client = new Client({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT, 10) || 5432,
    database: 'postgres',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await client.connect();

    const { rowCount } = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Created database: ${dbName}`);
    } else {
      console.log(`ℹ️  Database already exists: ${dbName}`);
    }
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  createDatabase().catch((err) => {
    console.error('❌ Failed to create database:', err.message);
    process.exit(1);
  });
}

module.exports = createDatabase;
