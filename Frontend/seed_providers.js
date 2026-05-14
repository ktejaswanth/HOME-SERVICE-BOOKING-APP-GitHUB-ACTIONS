import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const professionals = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', exp: 5, rating: 4.8 },
  { name: 'Suresh Menon', email: 'suresh@example.com', exp: 8, rating: 4.9 },
  { name: 'Amit Sharma', email: 'amit@example.com', exp: 3, rating: 4.5 }
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres pooler');

    const { rows: services } = await client.query('SELECT id FROM services WHERE is_active = true');
    
    for (const pro of professionals) {
      // 1. Create Profile
      const profileResult = await client.query(`
        INSERT INTO profiles (full_name, email, role, password_hash, is_active, email_verified)
        VALUES ($1, $2, 'provider', 'dummyhash', true, true)
        ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
        RETURNING id
      `, [pro.name, pro.email]);
      
      const profileId = profileResult.rows[0].id;
      
      // 2. Create Provider
      const providerResult = await client.query(`
        INSERT INTO providers (profile_id, experience_years, rating, is_verified, is_available)
        VALUES ($1, $2, $3, true, true)
        ON CONFLICT (profile_id) DO UPDATE SET is_verified = true
        RETURNING id
      `, [profileId, pro.exp, pro.rating]);
      
      const providerId = providerResult.rows[0].id;
      
      // 3. Link to ALL services
      for (const svc of services) {
        await client.query(`
          INSERT INTO provider_services (provider_id, service_id)
          VALUES ($1, $2)
          ON CONFLICT (provider_id, service_id) DO NOTHING
        `, [providerId, svc.id]);
      }
      console.log(`Seeded professional: ${pro.name}`);
    }
    
    console.log('Professionals seeded successfully!');
  } catch (err) {
    console.error('Error seeding professionals:', err);
  } finally {
    await client.end();
  }
}

seed();
