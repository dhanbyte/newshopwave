# 🔒 Razorpay Manual Refund Setup Guide

## Problem
Razorpay automatically refund kar deta hai jab payment fail hoti hai ya order cancel hota hai. Aap chahte hain ki **manual control** ho.

## ✅ Solution: Manual Refund Enable Karo

### **Method 1: Razorpay Dashboard Settings (RECOMMENDED)**

#### Step 1: Login to Dashboard
- Visit: https://dashboard.razorpay.com
- Login with your credentials

#### Step 2: Payment Capture Settings
1. Click **Settings** (top right corner)
2. Go to **Payment Configuration**
3. Find **"Auto Capture Payments"**
4. **Turn OFF** this setting ❌
5. Click **Save**

**What this does:**
- Payments will be **authorized** but not **captured**
- You need to **manually capture** payment after order confirmation
- If you don't capture within 5 days, payment auto-refunds

#### Step 3: Refund Settings
1. Go to **Settings** → **Refunds**
2. Enable **"Manual Refund Approval"**
3. Disable **"Auto Refund on Failed Payments"**
4. Disable **"Instant Refunds"** (optional)
5. Click **Save**

**What this does:**
- All refunds need manual approval
- No automatic refunds
- You control when to refund

---

### **Method 2: Code-Level Control**

#### Option A: Disable Auto-Capture in Payment Creation

In your Razorpay payment creation code, add:

```javascript
const options = {
  amount: orderAmount * 100, // in paise
  currency: 'INR',
  receipt: orderId,
  payment_capture: 0  // ← Add this (0 = manual, 1 = auto)
};
```

#### Option B: Manual Capture API

After order confirmation, manually capture payment:

```javascript
// In your backend API
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Capture payment manually
razorpay.payments.capture(paymentId, amount, currency)
  .then(payment => {
    console.log('Payment captured:', payment);
  })
  .catch(error => {
    console.error('Capture failed:', error);
  });
```

---

### **Method 3: Webhook Control**

Handle refunds through webhooks:

```javascript
// src/app/api/razorpay/webhook/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  // Check event type
  if (body.event === 'payment.captured') {
    // Payment successful
    console.log('Payment captured:', body.payload.payment.entity);
  }
  
  if (body.event === 'refund.created') {
    // Refund initiated - you can block or approve here
    console.log('Refund requested:', body.payload.refund.entity);
    
    // Add your logic to approve/reject refund
    // You can check order status, admin approval, etc.
  }
  
  return new Response('OK', { status: 200 });
}
```

---

## 📋 **Recommended Setup for Your Use Case**

### **For E-commerce with Dropshipping:**

1. **Enable Manual Capture** ✅
   - Payments authorized but not captured
   - Capture only when order is confirmed

2. **Disable Auto-Refunds** ✅
   - All refunds need manual approval
   - You decide when to refund

3. **Set Capture Timeline** ✅
   - Capture within 24-48 hours of order
   - Before 5-day auto-refund deadline

4. **Order Flow:**
   ```
   Customer Places Order
   → Payment Authorized (not captured)
   → You Verify Order
   → Dropshipper Confirms
   → You Manually Capture Payment ✅
   → Order Processed
   ```

---

## 🔄 **Manual Refund Process**

### When Customer Requests Refund:

1. **Check Order Status**
   - Is product shipped?
   - Is it returned?
   - Valid refund reason?

2. **Admin Approval**
   - Review refund request
   - Approve or reject

3. **Process Refund**
   - Go to Razorpay Dashboard
   - Find payment
   - Click "Refund"
   - Enter amount
   - Add reason
   - Confirm

---

## ⚙️ **Environment Variables Needed**

Make sure you have:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

---

## 🚨 **Important Notes**

1. **Auto-Refund Timeline:**
   - If payment not captured in **5 days**, Razorpay auto-refunds
   - Make sure to capture within this period

2. **Partial Refunds:**
   - You can refund partial amounts
   - Useful for returns/cancellations

3. **Refund Speed:**
   - Manual refunds: 5-7 business days
   - Instant refunds: 30 minutes (if enabled)

4. **Testing:**
   - Test in **Test Mode** first
   - Use test cards to verify flow
   - Then enable in **Live Mode**

---

## ✅ **Quick Checklist**

- [ ] Login to Razorpay Dashboard
- [ ] Disable "Auto Capture Payments"
- [ ] Enable "Manual Refund Approval"
- [ ] Disable "Auto Refund on Failed Payments"
- [ ] Test with test payment
- [ ] Verify manual capture works
- [ ] Verify manual refund works
- [ ] Enable in production

---

## 📞 **Need Help?**

If you face issues:
1. Contact Razorpay Support: support@razorpay.com
2. Check Razorpay Docs: https://razorpay.com/docs/
3. Test in sandbox mode first

---

**Ab aap full control mein hain! Koi bhi refund aapki approval ke bina nahi hoga!** 🔒
