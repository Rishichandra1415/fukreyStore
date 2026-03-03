import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crxnjkxgceiolyqyggma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeG5qa3hnY2Vpb2x5cXlnZ21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjU1NDQsImV4cCI6MjA4ODA0MTU0NH0.mf-k7pOourdHVPIEqw2qRLxecSaxsdh8Fg4Pb4reOFA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedInventory() {
    const { data: products, error: prodErr } = await supabase.from('products').select('id');
    if (prodErr || !products) {
        console.error('Failed to fetch products:', prodErr);
        return;
    }

    const sizes = ['S', 'M', 'L', 'XL'];
    const inventoryData = [];

    for (const product of products) {
        for (const size of sizes) {
            inventoryData.push({
                product_id: product.id,
                size: size,
                stock: Math.floor(Math.random() * 20) + 5 // stock between 5 and 24
            });
        }
    }

    const { error } = await supabase.from('inventory').insert(inventoryData);
    if (error) {
        console.error('Error seeding inventory:', error);
    } else {
        console.log('Successfully seeded inventory with options!');
    }
}

seedInventory();
