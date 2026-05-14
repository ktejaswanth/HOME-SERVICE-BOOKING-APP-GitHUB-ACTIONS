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
    
    // Drop existing policies if any to avoid errors on retry
    await client.query("DROP POLICY IF EXISTS \"Users can insert own payments\" ON payments;");
    await client.query("DROP POLICY IF EXISTS \"Users can view own payments\" ON payments;");
    await client.query("DROP POLICY IF EXISTS \"Users can update own payments\" ON payments;");

    await client.query("CREATE POLICY \"Users can insert own payments\" ON payments FOR INSERT WITH CHECK (auth.uid() = customer_id);");
    await client.query("CREATE POLICY \"Users can view own payments\" ON payments FOR SELECT USING (auth.uid() = customer_id);");
    await client.query("CREATE POLICY \"Users can update own payments\" ON payments FOR UPDATE USING (auth.uid() = customer_id);");
    
    console.log('Payment RLS policies added successfully');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
