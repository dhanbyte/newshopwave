# 🔍 Dropshipper Price Issue - Debug Checklist

## Problem
Cart mein dropshipper price sahi nahi dikh raha hai.

## ✅ Step-by-Step Debug Process

### Step 1: Check Dropshipper Status
**Browser Console mein (F12):**
```javascript
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));
```

**Dekhna hai:**
- `is_dropshipper: true` hona chahiye
- `dropshipper_id: "DS..."` hona chahiye
- `dropshipper_status: "active"` hona chahiye

**Agar `is_dropshipper: false` hai:**
1. Logout karo
2. Login karo dobara
3. Console mein dekho: `✅ User data loaded: { is_dropshipper: true, ... }`

---

### Step 2: Clear Old Cart Data
**Browser Console mein:**
```javascript
localStorage.removeItem('cart');
location.reload();
```

Yeh purane cart items ko delete kar dega.

---

### Step 3: Test Add to Cart
1. **Homepage pe jao**
2. **Koi product select karo** (example: "Waist Twisting Disc")
3. **Price note karo** jo homepage pe dikha raha hai
4. **F12 press karo** (Console open karo)
5. **"Add to Cart" click karo**

**Console mein yeh dikhna chahiye:**
```javascript
🛒 Adding to cart: {
  productName: "Waist Twisting Disc...",
  adminPrice: 366,           // ← Database price
  isDropshipper: true,       // ← Should be true
  finalPrice: 366,           // ← Should match adminPrice
  userId: "user_..."
}
```

**Agar `isDropshipper: false` dikha:**
- Dropshipper status load nahi hua
- Step 1 dobara karo

**Agar `finalPrice` ≠ `adminPrice`:**
- Code issue hai
- Mujhe batao console log kya dikha raha hai

---

### Step 4: Verify Cart Price
1. **Cart icon click karo**
2. **Item ka price dekho**
3. **Price match karna chahiye** homepage price se

**Agar price match nahi kar raha:**
- Console log mujhe bhejo
- Screenshot bhejo (homepage + cart)

---

## 🎯 Expected Behavior

### Homepage (Product Card):
```
Product: Waist Twisting Disc
Price: ₹366 (dropshipper price)
```

### Console (When Adding):
```
🛒 Adding to cart: {
  adminPrice: 366,
  isDropshipper: true,
  finalPrice: 366
}
```

### Cart:
```
Product: Waist Twisting Disc
₹366
Dropshipper Price ← Blue label
```

---

## 🐛 Common Issues & Fixes

### Issue 1: `is_dropshipper: false`
**Fix:**
1. Go to `/admin/dropshippers`
2. Verify your account is listed as "active"
3. Logout + Login again
4. Check console for: `✅ User data loaded`

### Issue 2: Old Cart Items
**Fix:**
```javascript
localStorage.removeItem('cart');
location.reload();
```

### Issue 3: Price Still Wrong After Clearing
**Debug:**
1. Add item to cart
2. Copy full console log
3. Send to me for analysis

---

## 📊 Price Calculation Logic

```javascript
// In ProductCard.tsx
const adminPrice = 366;  // From database
const isDropshipper = user?.is_dropshipper === true;
const price = isDropshipper ? adminPrice : Math.round(adminPrice * 1.5);
// Dropshipper: 366
// Customer: 549 (366 * 1.5)
```

---

## 🚨 If Still Not Working

**Send me these details:**

1. **Console log** when adding to cart:
   ```
   🛒 Adding to cart: { ... }
   ```

2. **User status** from localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```

3. **Cart data** from localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('cart'))
   ```

4. **Screenshots:**
   - Homepage product price
   - Cart price
   - Browser console

With this information, I can identify the exact issue! 🔍
