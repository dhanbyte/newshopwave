# 🛒 Dropshipper Cart Price Issue - Troubleshooting Guide

## Problem
Cart shows customer price (₹899) instead of dropshipper/admin price for dropshippers.

## Root Cause
The price shown in cart is the price that was **saved when the item was added to cart**. If you added items to cart BEFORE becoming a dropshipper or BEFORE the dropshipper status was loaded, they will have the customer price.

## How Pricing Works

### When Adding to Cart (ProductCard.tsx):
```javascript
const adminPrice = getPriceValue(productData.price); // e.g., ₹599
const isDropshipper = user?.is_dropshipper === true;
const price = isDropshipper ? adminPrice : Math.round(adminPrice * 1.5);
// Dropshipper: ₹599
// Customer: ₹899 (599 * 1.5)
```

The calculated `price` is stored in the cart item.

## Solutions

### Solution 1: Clear Cart and Re-add Items (QUICKEST)

1. **Open browser console** (F12)
2. **Clear your cart:**
   - Remove all items from cart manually, OR
   - Run in console: `localStorage.clear()` then refresh

3. **Re-add items to cart**
   - The console will now show:
     ```
     🛒 Adding to cart: {
       productName: "USB Portable Mini Desk Fan...",
       adminPrice: 599,
       isDropshipper: true,
       finalPrice: 599,  ← Should be admin price
       userId: "user_..."
     }
     ```

4. **Verify** - Cart should now show ₹599 instead of ₹899

### Solution 2: Check Dropshipper Status

If clearing cart doesn't work, verify your dropshipper status:

1. **Open browser console** (F12)
2. **Check user status:**
   ```javascript
   // In console, type:
   localStorage.getItem('user')
   ```

3. **Look for:**
   ```json
   {
     "is_dropshipper": true,  ← Should be true
     "dropshipper_id": "DS...",
     "dropshipper_status": "active"
   }
   ```

4. **If `is_dropshipper` is false or missing:**
   - Go to `/admin/dropshippers`
   - Verify your account is listed as active dropshipper
   - Logout and login again
   - Check console for: `✅ User data loaded: { is_dropshipper: true, ... }`

### Solution 3: Force Refresh User Data

If status is not loading:

1. **Logout** (clear session)
2. **Login again**
3. **Wait for console message:**
   ```
   ✅ User data loaded: { is_dropshipper: true, dropshipper_id: 'DS...' }
   ```
4. **Then add items to cart**

## Verification Checklist

✅ **Check 1: User Status**
- Open Console → Look for: `✅ User data loaded`
- Verify `is_dropshipper: true`

✅ **Check 2: Add to Cart Log**
- Add item → Check console for: `🛒 Adding to cart`
- Verify `isDropshipper: true` and `finalPrice` equals `adminPrice`

✅ **Check 3: Cart Display**
- Item should show "Dropshipper Price" label (blue text)
- Price should be admin price (not 1.5x markup)

## Expected Prices

| Product | Admin Price | Customer Price | Dropshipper Sees |
|---------|-------------|----------------|------------------|
| USB Fan | ₹599 | ₹899 | ₹599 |
| Face Wash | ₹999 | ₹1,499 | ₹999 |

## Debug Commands

Run these in browser console:

```javascript
// Check current user
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));

// Check cart items
console.log('Cart:', JSON.parse(localStorage.getItem('cart') || '[]'));

// Clear cart
localStorage.removeItem('cart');
location.reload();
```

## Files Modified

1. `src/components/ProductCard.tsx` - Added debug logging
2. `src/app/cart/page.tsx` - Added "Dropshipper Price" label

## Next Steps

1. **Clear cart and re-add items** (easiest fix)
2. **Verify dropshipper status is loading** (check console)
3. **Check browser console** when adding items to see pricing calculation

The issue should be resolved once you re-add items to cart with proper dropshipper status loaded!
