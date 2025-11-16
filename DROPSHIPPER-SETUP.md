# 🚀 Dropshipper System Setup & Test

## Quick Setup (5 minutes)

### Step 1: Database Update
Go to Supabase Dashboard > SQL Editor and run:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT 'inactive';

CREATE INDEX IF NOT EXISTS idx_users_dropshipper ON users(is_dropshipper);
CREATE INDEX IF NOT EXISTS idx_users_dropshipper_id ON users(dropshipper_id);
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Test System
Visit: `http://localhost:3000/test-dropshipper`

## How It Works

### 🏷️ Price Logic
- **Admin adds product:** ₹100
- **Dropshipper sees:** ₹100 (wholesale price)
- **Normal user sees:** ₹150 (50% markup)

### 💳 Payment Flow
1. User clicks "Become Dropshipper" in footer
2. Pays ₹99 via Razorpay
3. Auto-generates ID from phone number
4. User becomes dropshipper instantly

### 🎯 Features Added
- ✅ Footer dropshipper banner
- ✅ ₹99 payment integration
- ✅ Auto ID generation (phone-based)
- ✅ Account page dropshipper section
- ✅ Price differentiation system
- ✅ Complete API backend

## Test Checklist

### Before Testing
- [ ] Database fields added
- [ ] Server running
- [ ] User logged in

### Test Steps
1. [ ] Visit `/test-dropshipper`
2. [ ] Check user status (should show "No" for dropshipper)
3. [ ] Test price logic (should show calculations)
4. [ ] Test ₹1 payment (for testing)
5. [ ] Check user status again (should show "Yes")
6. [ ] Verify price differences in demo products
7. [ ] Test real ₹99 payment in footer

### Production Test
1. [ ] Go to homepage footer
2. [ ] Click "Join Now - ₹99"
3. [ ] Complete payment
4. [ ] Check account page for dropshipper dashboard
5. [ ] Browse products to see wholesale prices

## Troubleshooting

### Database Issues
- Make sure SQL commands ran successfully
- Check Supabase logs for errors

### Payment Issues
- Verify Razorpay keys in .env.local
- Check browser console for errors

### Price Issues
- Ensure user data loads properly
- Check PriceTag component logic

## Files Modified
- `src/components/Footer.tsx` - Dropshipper banner
- `src/app/account/page.tsx` - Dropshipper dashboard
- `src/components/PriceTag.tsx` - Price logic
- `src/context/ClerkAuthContext.tsx` - User interface
- `src/app/api/dropshipper/register/route.ts` - Registration API

## Success Indicators
- ✅ Footer shows dropshipper banner (when not dropshipper)
- ✅ Payment completes successfully
- ✅ Account page shows dropshipper dashboard
- ✅ Products show different prices for dropshippers
- ✅ Dropshipper ID generated from phone number

Ready to test! 🎉