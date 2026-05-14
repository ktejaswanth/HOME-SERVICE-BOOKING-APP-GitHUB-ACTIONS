import pkg from 'pg';
const { Client } = pkg;

// Supabase Connection String
const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function reloadSchema() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres pooler');

    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log('Successfully reloaded PostgREST schema cache!');
  } catch (err) {
    console.error('Error reloading schema:', err);
  } finally {
    await client.end();
  }
}

reloadSchema();
