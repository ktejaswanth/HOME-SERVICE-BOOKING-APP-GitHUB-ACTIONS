import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fix() {
  try {
    await client.connect();
    console.log('Connected');

    await client.query(`
      CREATE POLICY "Anyone can view provider_services" ON provider_services FOR SELECT USING (true);
      CREATE POLICY "Anyone can view provider profiles" ON profiles FOR SELECT USING (role = 'provider');
    `);
    
    console.log('RLS policies added for provider_services and profiles');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

fix();
