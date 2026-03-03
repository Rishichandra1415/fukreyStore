import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkInventory() {
    const { data, error } = await supabase.from('inventory').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Sample Data:', data);
    }
}

checkInventory();
