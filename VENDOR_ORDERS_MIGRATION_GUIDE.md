# 🔧 Fix Delivery Address Issue - Migration Guide

## Problem
The `vendor_orders` table is missing critical columns needed to store and display order information:
- ❌ No `shipping_address` column
- ❌ No `items` column  
- ❌ No `customer_total` column
- ❌ No `customer_name`, `customer_phone` columns

This is why delivery addresses show as "N/A, N/A, N/A N/A"

## Solution: Add Missing Columns

### Option 1: Run SQL in Supabase Dashboard (RECOMMENDED)

1. **Go to Supabase Dashboard**
   - Visit: https://nczdoszfndzqyhawpahz.supabase.co
   - Navigate to: **SQL Editor** (left sidebar)

2. **Copy and paste this SQL:**

```sql
-- Add missing columns to vendor_orders table
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS items JSONB;

ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS customer_total DECIMAL(10,2) DEFAULT 0;

ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);

ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Set defaults for existing records
UPDATE vendor_orders 
SET items = '[]'::jsonb 
WHERE items IS NULL;

UPDATE vendor_orders 
SET shipping_address = '{}'::jsonb 
WHERE shipping_address IS NULL;
```

3. **Click "Run"**

4. **Verify** - You should see: "Success. No rows returned"

### Option 2: Manual Column Addition

If SQL Editor doesn't work, add columns manually:

1. Go to **Table Editor** → **vendor_orders**
2. Click **"+ Add Column"** for each:
   - `shipping_address` - Type: `jsonb`
   - `items` - Type: `jsonb`
   - `customer_total` - Type: `numeric(10,2)`, Default: `0`
   - `customer_name` - Type: `text`
   - `customer_phone` - Type: `text`
   - `payment_method` - Type: `text`, Default: `'COD'`

## After Migration

Once columns are added, the orders API will automatically:
- ✅ Store shipping addresses when orders are created
- ✅ Display full delivery address instead of "N/A"
- ✅ Show customer name and phone
- ✅ Calculate dropshipper profit correctly

## Verification

Run this to check if columns were added:

```bash
node check-order-data.js
```

Look for these fields in the output:
- `shipping_address`
- `items`
- `customer_total`
- `customer_name`
- `customer_phone`

## Next Steps

After adding columns, **restart your dev server**:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

Then refresh the orders page - delivery addresses should now display correctly!

## Files Created

- `add_vendor_orders_columns.sql` - The migration SQL
- `run-vendor-migration.js` - Automated migration script (requires RPC setup)
- This guide - `VENDOR_ORDERS_MIGRATION_GUIDE.md`
