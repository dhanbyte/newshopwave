# Complete Testing Checklist ✅

## Pre-Test: Migration Status

### Did you run the SQL?
```sql
-- This migration in Supabase
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
```

✅ Success message should show: "Success. No rows returned"

---

## Test 1: Hard Refresh Browser

**Do this first:**
```
Ctrl + Shift + R
```

Or completely restart browser

---

## Test 2: Dropshipper Order (Prepaid)

### Steps:
1. Login as dropshipper
2. Check wallet balance (should show actual amount)
3. Add product to cart (₹399 or any)
4. Go to Checkout
5. Select **"Prepaid (Wallet Pay)"**
6. Verify:
   - Shipping shows actual cost (NOT "Free")
   - Total is correct
   - Button says "Pay from Wallet & Place Order"
7. Click button

### Expected Result:
```
✅ "Processing Wallet Payment..."
✅ Order placed successfully
✅ Wallet balance updated
✅ No Razorpay popup
✅ Redirect to success/spin wheel
```

### Check Terminal:
```
✅ Wallet balance sufficient - will deduct AFTER order creation
✅ Order created successfully: ORD-xxx
✅ Wallet deduction successful
POST /api/place-order 200 ✅
```

---

## Test 3: Dropshipper Order (COD)

### Steps:
1. Add product to cart
2. Go to Checkout
3. Select **"COD (Wallet Pay + ₹25)"**
4. Verify:
   - COD charge ₹25 shown
   - Total includes ₹25
5. Click "Pay from Wallet & Place Order"

### Expected Result:
```
✅ Order placed
✅ Wallet deducted (product + shipping + ₹25)
✅ Success message
```

---

## Test 4: Regular Customer Order

### Steps:
1. Login as regular customer (NOT dropshipper)
2. Add product to cart
3. Go to Checkout
4. Should see ALL payment options:
   - UPI
   - Card
   - Net Banking
   - COD

### Test 4A: UPI Payment
5. Select UPI
6. Click "Pay ₹XXX"
7. **Expected:** Razorpay opens ✅

### Test 4B: COD
5. Select COD
6. Click "Place COD Order"
7. **Expected:** Order placed, NO Razorpay ✅

---

## Test 5: Insufficient Balance

### Steps:
1. Login as dropshipper
2. Check wallet balance (e.g., ₹100)
3. Add expensive item (e.g., ₹500)
4. Try to place order

### Expected Result:
```
❌ Error: Insufficient wallet balance
✅ NO money deducted
✅ Order NOT created
```

---

## Test 6: Wishlist

### Steps:
1. Go to any product page
2. Click heart ❤️ icon
3. Go to `/wishlist`

### Expected Result:
```
✅ Product appears in wishlist
✅ Saves to database
```

---

## Test 7: Wallet History

### Steps:
1. Go to Account → My Wallet
2. Check "Transaction History"

### Expected Result:
```
✅ Shows recharges
✅ Shows order deductions
✅ Shows withdrawals (if any)
```

---

## Troubleshooting

### If Order Fails:

**Check Terminal for errors:**

**Error 1: "Could not find column..."**
```
Solution: Migration not run properly
Action: Re-run COMPLETE_ORDERS_FIX.sql
```

**Error 2: "Insufficient balance"**
```
Solution: Recharge wallet first
Action: Go to Account → Recharge
```

**Error 3: "Wallet deduction failed"**
```
Solution: Database permission issue
Action: Check Supabase RLS policies
```

**Error 4: Order created but wallet not deducted**
```
Solution: Code rollback working
Action: Check terminal logs
```

---

## Success Indicators

### ✅ All Working:
```
1. Dropshipper Prepaid → Wallet payment ✅
2. Dropshipper COD → Wallet payment + ₹25 ✅
3. Customer UPI → Razorpay ✅
4. Customer COD → Direct order ✅
5. Shipping shows correct cost ✅
6. Wallet balance updates ✅
7. Transaction history shows ✅
8. Wishlist saves ✅
```

---

## Database Verification

### Check in Supabase:

**1. Orders Table:**
```sql
SELECT * FROM admin_orders 
ORDER BY created_at DESC 
LIMIT 5;
```

Should show:
- ✅ payment_id
- ✅ payment_method
- ✅ shipping_address (JSON)
- ✅ tracking_id (NULL for new orders)

**2. Users Table:**
```sql
SELECT clerk_user_id, dropshipper_earnings 
FROM users 
WHERE is_dropshipper = true;
```

Should show updated wallet balance

**3. Wallet Transactions:**
```sql
SELECT * FROM wallet_transactions 
ORDER BY created_at DESC 
LIMIT 10;
```

Should show order deductions

---

## Final Checklist

- [ ] Migration run successfully
- [ ] Browser hard refreshed
- [ ] Dropshipper prepaid order works
- [ ] Dropshipper COD order works
- [ ] Customer Razorpay works
- [ ] Customer COD works
- [ ] Wallet updates correctly
- [ ] Shipping shows proper cost
- [ ] Wishlist saves
- [ ] Transaction history visible
- [ ] No errors in terminal

---

## If Everything Works:

**Congratulations!** 🎉

Your system is now:
- ✅ Orders working
- ✅ Wallet payments safe
- ✅ Rollback mechanism active
- ✅ All features functional

---

## Next Steps:

1. **Test multiple orders** to ensure consistency
2. **Check admin panel** for order management
3. **Verify tracking ID** feature works
4. **Test vendor orders** if applicable
5. **Monitor wallet transactions** for accuracy

---

**AB TEST SHURU KARO!** 🚀

Report back the results! 💪
