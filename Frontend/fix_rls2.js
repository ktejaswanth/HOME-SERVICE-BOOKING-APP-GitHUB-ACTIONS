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
    
    try {
      await client.query('CREATE POLICY "Anyone can view provider_services" ON provider_services FOR SELECT USING (true);');
      console.log('provider_services policy added');
    } catch(e) { console.log('provider_services:', e.message); }
    
    try {
      await client.query("CREATE POLICY \"Anyone can view provider profiles\" ON profiles FOR SELECT USING (role = 'provider');");
      console.log('profiles policy added');
    } catch(e) { console.log('profiles:', e.message); }

    try {
      await client.query('CREATE POLICY "Anyone can view providers" ON providers FOR SELECT USING (true);');
      console.log('providers policy added');
    } catch(e) { console.log('providers:', e.message); }
    
  } finally {
    await client.end();
  }
}

run();
