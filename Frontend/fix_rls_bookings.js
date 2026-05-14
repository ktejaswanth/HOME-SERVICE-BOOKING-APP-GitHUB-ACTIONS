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
    
    // Add INSERT policy for bookings
    try {
      await client.query("CREATE POLICY \"Users can insert own bookings\" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);");
      console.log('Bookings INSERT policy added');
    } catch(e) { console.log('Bookings INSERT:', e.message); }

    // Add SELECT policy for bookings
    try {
      await client.query("CREATE POLICY \"Users can view own bookings\" ON bookings FOR SELECT USING (auth.uid() = customer_id);");
      console.log('Bookings SELECT policy added');
    } catch(e) { console.log('Bookings SELECT:', e.message); }
    
    // Add UPDATE policy for bookings
    try {
      await client.query("CREATE POLICY \"Users can update own bookings\" ON bookings FOR UPDATE USING (auth.uid() = customer_id);");
      console.log('Bookings UPDATE policy added');
    } catch(e) { console.log('Bookings UPDATE:', e.message); }

  } finally {
    await client.end();
  }
}

run();
