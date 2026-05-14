import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Need to use service role key for inserting bypass RLS, or anon key if RLS allows it.
// Assuming the user has RLS policies disabled or allows insert for now. Let's check.
const supabase = createClient(supabaseUrl, supabaseKey);

const sampleServices = [
  {
    name: 'AC Repair & Service',
    description: 'Expert AC repair, servicing, and installation. Get your AC running like new in no time.',
    category: 'repairs',
    base_price: 499,
    duration_minutes: 60,
    icon_url: '❄️',
    popularity_score: 95,
    is_active: true
  },
  {
    name: 'Home Deep Cleaning',
    description: 'Intensive deep cleaning for your entire home, including hard-to-reach areas and stubborn stains.',
    category: 'cleaning',
    base_price: 1999,
    duration_minutes: 240,
    icon_url: '✨',
    popularity_score: 90,
    is_active: true
  },
  {
    name: 'Salon at Home for Women',
    description: 'Premium beauty and grooming services delivered at your doorstep by expert professionals.',
    category: 'beauty',
    base_price: 999,
    duration_minutes: 90,
    icon_url: '💅',
    popularity_score: 85,
    is_active: true
  },
  {
    name: 'Plumbing Services',
    description: 'Fix leaks, blockages, and pipe issues quickly with our verified plumbers.',
    category: 'repairs',
    base_price: 299,
    duration_minutes: 45,
    icon_url: '🔧',
    popularity_score: 88,
    is_active: true
  },
  {
    name: 'Electrical Repair',
    description: 'Safe and reliable electrical repairs, wiring, and appliance installation.',
    category: 'repairs',
    base_price: 249,
    duration_minutes: 30,
    icon_url: '⚡',
    popularity_score: 82,
    is_active: true
  },
  {
    name: 'Sofa Cleaning',
    description: 'Deep vacuuming and shampooing to restore the original look of your sofa.',
    category: 'cleaning',
    base_price: 799,
    duration_minutes: 120,
    icon_url: '🛋️',
    popularity_score: 75,
    is_active: true
  },
  {
    name: 'Men Haircut & Grooming',
    description: 'Professional haircut, beard styling, and grooming services for men at home.',
    category: 'beauty',
    base_price: 399,
    duration_minutes: 45,
    icon_url: '✂️',
    popularity_score: 80,
    is_active: true
  },
  {
    name: 'Carpentry Services',
    description: 'Custom furniture building, repairs, and woodwork by skilled carpenters.',
    category: 'home improvement',
    base_price: 499,
    duration_minutes: 120,
    icon_url: '🪚',
    popularity_score: 70,
    is_active: true
  }
];

async function seedServices() {
  console.log('Starting seed...');
  
  // Clear existing to avoid duplicates (optional, but good for idempotency)
  // await supabase.from('services').delete().neq('id', 0);
  
  for (const service of sampleServices) {
    const { data, error } = await supabase
      .from('services')
      .insert([service]);
      
    if (error) {
      console.error(`Failed to insert ${service.name}:`, error.message);
    } else {
      console.log(`Inserted: ${service.name}`);
    }
  }
  console.log('Seed complete!');
}

seedServices();
