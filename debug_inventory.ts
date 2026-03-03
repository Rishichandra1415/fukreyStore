import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crxnjkxgceiolyqyggma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeG5qa3hnY2Vpb2x5cXlnZ21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjU1NDQsImV4cCI6MjA4ODA0MTU0NH0.mf-k7pOourdHVPIEqw2qRLxecSaxsdh8Fg4Pb4reOFA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProductInventory() {
    const productId = '8e06e49f-5b0d-47fa-846f-dd114e6ddd8d';
    console.log('Fetching inventory for ID:', productId);

    const { data, error } = await supabase.from('inventory').select('*').eq('product_id', productId);

    if (error) {
        console.error('Error fetching inventory:', error);
    } else {
        console.log('Inventory Data:', JSON.stringify(data, null, 2));
        if (data && data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]));
        } else {
            console.log('No inventory records found for this product ID.');
            // Let's try to list ANY inventory record to see columns
            const { data: allData } = await supabase.from('inventory').select('*').limit(1);
            if (allData && allData.length > 0) {
                console.log('Sample record (any):', allData[0]);
                console.log('Columns (any):', Object.keys(allData[0]));
            }
        }
    }
}

checkProductInventory();
