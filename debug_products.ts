import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crxnjkxgceiolyqyggma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeG5qa3hnY2Vpb2x5cXlnZ21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjU1NDQsImV4cCI6MjA4ODA0MTU0NH0.mf-k7pOourdHVPIEqw2qRLxecSaxsdh8Fg4Pb4reOFA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProductSchema() {
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log('Sample Product Data:', JSON.stringify(data[0], null, 2));
        console.log('Product Columns:', Object.keys(data[0] || {}));
    }
}

checkProductSchema();
