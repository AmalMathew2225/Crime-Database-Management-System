// Run all SQL migrations in order against the database
// Usage: node scripts/run_migrations.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load env from root .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const MIGRATIONS = [
  '001_create_crime_tables.sql',
  '002_seed_crime_data.sql',
  '003_add_officer_auth.sql',
  '004_add_accused_property.sql',
  '005_add_case_notes_evidence_notifications.sql',
];

async function main() {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set. Check your .env.local file.');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected successfully!\n');

  for (const file of MIGRATIONS) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`WARNING: ${file} not found, skipping.`);
      continue;
    }
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running migration: ${file} ...`);
    try {
      await client.query(sql);
      console.log(`  ✓ ${file} completed successfully.`);
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err.message);
      // Continue with remaining migrations
    }
  }

  console.log('\nAll migrations processed.');
  await client.end();
  console.log('Database connection closed.');
}

main().catch(err => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});
