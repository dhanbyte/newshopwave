# 🚀 All Required Database Migrations - Run These Now!

## Problem
Website not working properly because database tables/columns are missing.

## ✅ Required Migrations (Run in Order)

### 1. User Data Table (For Wishlist & Cart)
**File:** `create_user_data_table.sql`
**Purpose:** Store wishlist, cart, addresses

```sql
CREATE TABLE IF NOT EXISTS user_data (
    id BIGSERIAL PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(userId, type)
);

CREATE INDEX IF NOT EXISTS idx_user_data_userId ON user_data(userId);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(type);
CREATE INDEX IF NOT EXISTS idx_user_data_userId_type ON user_data(userId, type);

ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON user_data
    FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own data" ON user_data
    FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update own data" ON user_data
    FOR UPDATE USING (auth.uid()::text = userId);

CREATE POLICY "Service role full access" ON user_data
    FOR ALL USING (true);
```

---

### 2. Wallet Transactions Table (For Transaction History)
**File:** `create_wallet_transactions_table.sql`
**Purpose:** Track wallet recharges, withdrawals, order deductions

```sql
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    description TEXT NOT NULL,
    reference_id TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can insert transactions" ON wallet_transactions
    FOR INSERT WITH CHECK (true);
```

---

### 3. Tracking ID Column (For Courier Tracking)
**File:** `add_tracking_id_column.sql`
**Purpose:** Store real courier tracking IDs

```sql
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_tracking_id ON admin_orders(tracking_id);

ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_vendor_orders_tracking_id ON vendor_orders(tracking_id);
```

---

### 4. Payment ID Column (CRITICAL - Fixes Current Error!)
**File:** `add_payment_id_column.sql`
**Purpose:** Store payment transaction IDs

```sql
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);
```

---

## 🎯 How to Run (Supabase Dashboard)

1. **Open Supabase Dashboard**
   - Go to your project
   - Click on "SQL Editor" in left sidebar

2. **Run Each Migration**
   - Copy the SQL from each section above
   - Paste into SQL Editor
   - Click "Run" button
   - Wait for "Success" message

3. **Verify**
   - Go to "Table Editor"
   - Check that all tables/columns exist

## ✅ Checklist

After running all migrations, verify:

- [ ] `user_data` table exists
- [ ] `wallet_transactions` table exists
- [ ] `admin_orders` has `tracking_id` column
- [ ] `admin_orders` has `payment_id` column
- [ ] `vendor_orders` has `tracking_id` column

## 🔍 Test After Migration

1. **Test Wishlist:**
   - Click heart icon on any product
   - Should turn red
   - Go to `/wishlist` - product should appear

2. **Test Wallet:**
   - Go to Account → My Wallet
   - Transaction history should load (empty is OK)

3. **Test Orders:**
   - Try placing an order
   - Should work without errors

4. **Test Tracking ID:**
   - Admin → Orders → Click any order
   - Should see "Add Tracking ID" button

## 🚨 Current Error Fix

The error you're seeing:
```
Could not find the 'payment_id' column of 'admin_orders'
```

**Is fixed by Migration #4** - Run it immediately!

## 📊 Migration Summary

| Migration | Priority | Fixes |
|-----------|----------|-------|
| user_data table | HIGH | Wishlist, Cart not saving |
| wallet_transactions | MEDIUM | Transaction history empty |
| tracking_id column | LOW | Admin tracking feature |
| payment_id column | **CRITICAL** | **Orders failing NOW** |

## ⚡ Quick Run (All at Once)

If you want to run all migrations at once, copy this entire block:

```sql
-- 1. User Data Table
CREATE TABLE IF NOT EXISTS user_data (
    id BIGSERIAL PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(userId, type)
);
CREATE INDEX IF NOT EXISTS idx_user_data_userId ON user_data(userId);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(type);
CREATE INDEX IF NOT EXISTS idx_user_data_userId_type ON user_data(userId, type);
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON user_data FOR SELECT USING (auth.uid()::text = userId);
CREATE POLICY "Users can insert own data" ON user_data FOR INSERT WITH CHECK (auth.uid()::text = userId);
CREATE POLICY "Users can update own data" ON user_data FOR UPDATE USING (auth.uid()::text = userId);
CREATE POLICY "Service role full access" ON user_data FOR ALL USING (true);

-- 2. Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    description TEXT NOT NULL,
    reference_id TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON wallet_transactions FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Service role can insert transactions" ON wallet_transactions FOR INSERT WITH CHECK (true);

-- 3. Tracking ID Columns
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_tracking_id ON admin_orders(tracking_id);
ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_vendor_orders_tracking_id ON vendor_orders(tracking_id);

-- 4. Payment ID Column (CRITICAL FIX)
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);
```

## ✅ After Running

1. Refresh your website (Ctrl + Shift + R)
2. Try clicking on products - should work now!
3. Test placing an order
4. Check wishlist functionality

## 🎉 Expected Result

After running all migrations:
- ✅ Products clickable
- ✅ Orders work
- ✅ Wishlist saves
- ✅ Wallet history shows
- ✅ Tracking IDs editable
- ✅ No more errors!
