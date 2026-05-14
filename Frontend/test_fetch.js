import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: services } = await supabase.from('services').select('*').limit(1);
  const serviceData = services[0];
  console.log('Service:', serviceData.name);

  const { data: psData, error: psError } = await supabase
    .from('provider_services')
    .select('provider_id')
    .eq('service_id', serviceData.id);
    
  console.log('psData:', psData, 'error:', psError);

  if (psData && psData.length > 0) {
    const providerIds = psData.map(ps => ps.provider_id);
    const { data: providersData, error: pError } = await supabase
      .from('providers')
      .select('*, profiles(full_name, avatar_url, role)')
      .in('id', providerIds)
      .eq('is_verified', true)
      .eq('is_available', true);
      
    console.log('providersData:', providersData, 'error:', pError);
  }
}
test();
