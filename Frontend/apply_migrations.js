import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

// Supabase Connection String
const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres pooler');

    const migrationsDir = path.join(process.cwd(), '..', 'supabase', 'migrations');
    
    // List of migration files in order
    const files = [
      '001_create_schema.sql',
      '002_rls_policies.sql',
      '003_seed_data.sql',
      '004_auth_triggers.sql'
    ];

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Executing ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`Successfully executed ${file}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    }
    
    console.log('All migrations and seed data applied successfully!');
  } catch (err) {
    console.error('Error applying migrations:', err);
  } finally {
    await client.end();
  }
}

runMigrations();
