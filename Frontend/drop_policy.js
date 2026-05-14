import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    await client.query('DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;');
    console.log('Policy dropped!');
  } catch(e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

run();
