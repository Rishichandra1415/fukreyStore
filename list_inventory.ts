import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crxnjkxgceiolyqyggma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeG5qa3hnY2Vpb2x5cXlnZ21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjU1NDQsImV4cCI6MjA4ODA0MTU0NH0.mf-k7pOourdHVPIEqw2qRLxecSaxsdh8Fg4Pb4reOFA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllInventory() {
    const { data, error } = await supabase.from('inventory').select('*');

    if (error) {
        console.error('Error fetching all inventory:', error);
    } else {
        console.log('Total inventory records:', data?.length);
        console.log('Inventory Data:', JSON.stringify(data, null, 2));
    }
}

listAllInventory();
