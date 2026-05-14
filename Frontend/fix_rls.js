import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fixRLS() {
  try {
    await client.connect();
    console.log('Connected to DB');

    await client.query(`
      -- Allow admins to see everything
      CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      );
      CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      );
      CREATE POLICY "Admins can view all providers" ON providers FOR SELECT USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      );
      
      -- Also allow users to see their own profiles
      CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (
        id = auth.uid()
      );
      
      -- Also allow providers to see their own bookings
      CREATE POLICY "Providers can view own bookings" ON bookings FOR SELECT USING (
        provider_id IN (SELECT id FROM providers WHERE profile_id = auth.uid())
      );
    `);

    console.log('Successfully updated RLS policies!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

fixRLS();
