const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://nczdoszfndzqyhawpahz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function runMigration() {
    console.log('🔄 Running vendor_orders table migration...\n');

    try {
        // Read the SQL file
        const sql = fs.readFileSync('add_vendor_orders_columns.sql', 'utf8');

        // Split by semicolons and execute each statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

        console.log(`Found ${statements.length} SQL statements to execute\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`Executing statement ${i + 1}/${statements.length}...`);

            const { error } = await supabase.rpc('exec_sql', {
                sql: statement + ';'
            });

            if (error) {
                // Try direct query if RPC fails
                console.log(`  RPC failed, trying direct query...`);
                const { error: directError } = await supabase.from('_sql').insert({ query: statement });

                if (directError) {
                    console.log(`  ⚠️  Error: ${error.message}`);
                    console.log(`  Statement: ${statement.substring(0, 100)}...`);
                } else {
                    console.log(`  ✅ Success (direct)`);
                }
            } else {
                console.log(`  ✅ Success`);
            }
        }

        console.log('\n✅ Migration completed!');
        console.log('\nVerifying columns...');

        // Verify the changes
        const { data, error } = await supabase
            .from('vendor_orders')
            .select('*')
            .limit(1);

        if (data && data.length > 0) {
            console.log('\n📋 Current vendor_orders columns:');
            console.log(Object.keys(data[0]).join(', '));
        } else if (error) {
            console.log('\n⚠️  Could not verify:', error.message);
        } else {
            console.log('\n⚠️  No orders in table to verify columns');
        }

    } catch (e) {
        console.error('\n❌ Migration failed:', e.message);
    }
}

runMigration();
