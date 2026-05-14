import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function syncProfiles() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // Find users in auth.users that are NOT in public.profiles
    const res = await client.query(`
      SELECT id, email, raw_user_meta_data
      FROM auth.users
      WHERE id NOT IN (SELECT id FROM public.profiles)
    `);

    const missingUsers = res.rows;
    console.log(`Found ${missingUsers.length} missing profiles.`);

    for (const user of missingUsers) {
      const fullName = user.raw_user_meta_data?.full_name || 'cmfphoneindia Customer';
      const role = user.raw_user_meta_data?.role || 'customer';
      
      await client.query(`
        INSERT INTO public.profiles (id, full_name, email, role, password_hash)
        VALUES ($1, $2, $3, $4, 'supabase_managed')
      `, [user.id, fullName, user.email, role]);
      
      console.log(`Created profile for ${user.email}`);
    }

    console.log('Sync complete!');
  } catch (err) {
    console.error('Error syncing profiles:', err);
  } finally {
    await client.end();
  }
}

syncProfiles();
