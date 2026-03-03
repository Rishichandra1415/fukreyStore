import { supabase } from './lib/supabase';

async function checkInventorySchema() {
    const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching inventory:', error);
    } else {
        console.log('Inventory data sample:', data);
    }
}

checkInventorySchema();
