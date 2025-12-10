const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLeads() {
    console.log('🔍 Checking leads table...');

    // 1. Try to fetch
    const { data, error } = await supabase
        .from('leads')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('❌ Error fetching count:', error.message);
    } else {
        // Note: data is null when using head: true, count has the number
        console.log(`✅ COUNT of leads in DB: ${data === null ? 'null (check count prop)' : data.length}`);
        // Re-fetch actual data
        const { data: rows, count } = await supabase.from('leads').select('*', { count: 'exact' });
        console.log('✅ Actual Count:', count);
        console.log('✅ First row ID:', rows && rows.length > 0 ? rows[0].id : 'None');
    }
}

checkLeads();
