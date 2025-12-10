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

    const { data, error } = await supabase
        .from('leads')
        .select('*');

    if (error) {
        console.error('❌ Error fetching leads:', error.message);
    } else {
        console.log(`✅ Found ${data.length} leads:`);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkLeads();
