// Run SQL migrations via Supabase JS client (using service role key)
// This bypasses IPv4/IPv6 direct connection issues

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local from root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const MIGRATIONS = [
  '001_create_crime_tables.sql',
  '002_seed_crime_data.sql',
  '003_add_officer_auth.sql',
  '004_add_accused_property.sql',
  '005_add_case_notes_evidence_notifications.sql',
];

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  console.log(`Using Supabase URL: ${supabaseUrl}`);
  console.log('Testing connection...');

  // Quick connection test
  const { data: testData, error: testError } = await supabase.rpc('version', {}).maybeSingle();
  if (testError) {
    console.log('Note: version() RPC not available, proceeding anyway...');
  } else {
    console.log('Connected successfully!');
  }

  console.log('\nRunning migrations...\n');

  for (const file of MIGRATIONS) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`WARNING: ${file} not found, skipping.`);
      continue;
    }
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running migration: ${file} ...`);
    
    try {
      // Use the Supabase SQL execution method
      const { data, error } = await supabase.rpc('exec_sql', { query: sql });
      if (error) {
        // If exec_sql RPC doesn't exist, we need to use a different approach
        throw error;
      }
      console.log(`  ✓ ${file} completed successfully.`);
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err.message || err);
    }
  }

  console.log('\nAll migrations processed.');
}

main().catch(err => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});
