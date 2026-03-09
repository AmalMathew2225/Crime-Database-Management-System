// Run with: node scripts/seed_officer.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function main() {
  const {
    DATABASE_URL,
    SEED_OFFICER_UID = 'officer1',
    SEED_OFFICER_PASSWORD = 'Password123!',
    SEED_OFFICER_NAME = 'Test Officer',
    SEED_OFFICER_RANK = 'Sub Inspector',
    SEED_OFFICER_BADGE = 'B1234',
    SEED_OFFICER_STATION = null
  } = process.env;

  if (!DATABASE_URL) {
    console.error('Please set DATABASE_URL in your environment');
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    const hash = await bcrypt.hash(SEED_OFFICER_PASSWORD, 10);

    const res = await client.query(
      `INSERT INTO officers (name, rank, badge_number, station_id, uid, password_hash, role, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
       ON CONFLICT (uid) DO UPDATE SET name = EXCLUDED.name RETURNING id, uid;`,
      [SEED_OFFICER_NAME, SEED_OFFICER_RANK, SEED_OFFICER_BADGE, SEED_OFFICER_STATION, SEED_OFFICER_UID, hash, 'Duty Officer']
    );

    console.log('Seeded officer:', res.rows[0]);
  } catch (err) {
    console.error('Error seeding officer', err);
  } finally {
    await client.end();
  }
}

main();
