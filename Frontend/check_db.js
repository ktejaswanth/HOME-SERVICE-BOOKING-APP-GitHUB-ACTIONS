import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkData() {
  try {
    await client.connect();
    
    // Check if providers exist
    const pRes = await client.query(`SELECT id, is_verified, is_available FROM providers`);
    console.log('Providers:', pRes.rows);

    // Check RLS policies on profiles
    const rlsRes = await client.query(`
      CREATE POLICY "Anyone can view provider profiles" ON profiles FOR SELECT USING (role = 'provider');
    `);
    console.log('Added profile RLS for providers');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkData();
