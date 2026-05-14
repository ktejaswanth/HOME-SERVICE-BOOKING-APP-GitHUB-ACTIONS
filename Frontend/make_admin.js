import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgres://postgres.zpzbjvbuizpdqzgdywdt:0TQyhgACkUrLBGm6@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function makeAdmin() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // Update cmfphoneindia@gmail.com to be an admin
    const res = await client.query(`
      UPDATE public.profiles 
      SET role = 'admin' 
      WHERE email = 'cmfphoneindia@gmail.com'
      RETURNING *;
    `);

    if (res.rows.length > 0) {
      console.log('Successfully made cmfphoneindia@gmail.com an admin!');
    } else {
      console.log('User cmfphoneindia@gmail.com not found in profiles.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

makeAdmin();
