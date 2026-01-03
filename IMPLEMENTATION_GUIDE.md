# ShopWave Enhancement Implementation Guide

## ✅ COMPLETED FEATURES

### 1. Price Markup for Normal Users
- **Status**: ✅ DONE
- **Change**: Normal users now see 10% markup (1.1x) instead of 50% (1.5x)
- **File**: `src/components/PriceTag.tsx`
- **Logic**: Dropshippers see wholesale price, normal users see +10%

### 2. Cashback Banner on Homepage
- **Status**: ✅ DONE
- **Location**: Between "New Arrivals" and "Dropshipper" sections
- **Features**: 
  - Eye-catching gradient banner
  - "Upload Photo & Get ₹50 Cashback"
  - Minimum purchase: ₹499
  - Links to `/orders` page

---

## 🚧 PENDING FEATURES (Requires Implementation)

### Feature 1: Enhanced Order Tracking

#### What's Needed:
1. **Database Schema Update** (Supabase `orders` table)
   ```sql
   ALTER TABLE orders ADD COLUMN tracking_status TEXT DEFAULT 'pending';
   ALTER TABLE orders ADD COLUMN tracking_number TEXT;
   ALTER TABLE orders ADD COLUMN estimated_delivery DATE;
   ALTER TABLE orders ADD COLUMN tracking_updates JSONB DEFAULT '[]';
   ```

2. **New Status Values**:
   - `pending` → Order placed
   - `processing` → Order confirmed
   - `in_transit` → In transit
   - `out_for_delivery` → Out for delivery
   - `delivered` → Delivered
   - `rto` → Return to origin
   - `cancelled` → Cancelled

3. **Tracking Timeline Component** (`src/components/OrderTrackingTimeline.tsx`)
   - Visual timeline showing order progress
   - Estimated delivery date
   - Real-time status updates

4. **API Endpoint** (`src/app/api/orders/[orderId]/tracking/route.ts`)
   - GET: Fetch tracking details
   - POST: Update tracking status (admin only)

---

### Feature 2: Photo Upload for Orders

#### What's Needed:

1. **Database Schema** (Supabase)
   ```sql
   CREATE TABLE order_photos (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     order_id TEXT NOT NULL,
     user_id TEXT NOT NULL,
     photo_url TEXT NOT NULL,
     uploaded_at TIMESTAMP DEFAULT NOW(),
     cashback_amount DECIMAL DEFAULT 50,
     cashback_credited BOOLEAN DEFAULT FALSE,
     FOREIGN KEY (order_id) REFERENCES orders(id)
   );
   
   ALTER TABLE users ADD COLUMN wallet_balance DECIMAL DEFAULT 0;
   ```

2. **File Upload API** (`src/app/api/orders/upload-photo/route.ts`)
   ```typescript
   // POST /api/orders/upload-photo
   // Body: { orderId, photo (File), userId }
   // Returns: { success, photoUrl, cashbackAmount }
   ```

3. **Photo Upload Component** (`src/components/OrderPhotoUpload.tsx`)
   - File input for image upload
   - Preview before upload
   - Upload progress indicator
   - Success message with cashback confirmation

4. **Cashback Logic**:
   - Check if order total >= ₹499
   - Check if photo not already uploaded for this order
   - Upload photo to cloud storage (Cloudinary/Supabase Storage)
   - Credit ₹50 to user's wallet
   - Mark cashback as credited

5. **Order ID Input Field**:
   - Allow users to enter order ID manually
   - Validate order belongs to user
   - Show order details before upload

---

### Feature 3: Invoice Display

#### What's Needed:

1. **Database Schema**
   ```sql
   ALTER TABLE orders ADD COLUMN invoice_url TEXT;
   ALTER TABLE orders ADD COLUMN invoice_number TEXT;
   ALTER TABLE orders ADD COLUMN invoice_uploaded_at TIMESTAMP;
   ```

2. **Admin Upload API** (`src/app/api/admin/orders/[orderId]/invoice/route.ts`)
   ```typescript
   // POST: Upload invoice (admin only)
   // Body: { orderId, invoiceFile }
   ```

3. **User View Component**:
   - Display invoice link in order details
   - Download/View invoice button
   - Invoice number display

---

### Feature 4: Dynamic Delivery Charges

#### What's Needed:

1. **Delivery Charge Calculation Function** (`src/lib/calculateDeliveryCharge.ts`)
   ```typescript
   export function calculateDeliveryCharge(
     totalWeight: number, // in grams
     paymentMethod: 'COD' | 'PREPAID'
   ): number {
     const baseWeight = 500 // grams
     const codBaseCharge = 80
     const prepaidBaseCharge = 55
     const additionalChargePerUnit = 40
     
     const baseCharge = paymentMethod === 'COD' ? codBaseCharge : prepaidBaseCharge
     
     if (totalWeight <= baseWeight) {
       return baseCharge
     }
     
     const extraWeight = totalWeight - baseWeight
     const extraUnits = Math.ceil(extraWeight / baseWeight)
     
     return baseCharge + (extraUnits * additionalChargePerUnit)
   }
   ```

2. **Update Checkout Page** (`src/app/checkout/page.tsx`)
   - Calculate total cart weight
   - Show delivery charge breakdown
   - Update total with delivery charges

3. **Product Weight Field**:
   - Ensure all products have weight field
   - Default weight if not specified

---

## 📋 IMPLEMENTATION PRIORITY

### Phase 1 (Critical - Do First):
1. ✅ Price markup change (DONE)
2. ✅ Cashback banner (DONE)
3. 🚧 Dynamic delivery charges (Affects checkout)

### Phase 2 (Important):
4. 🚧 Photo upload feature
5. 🚧 Enhanced order tracking

### Phase 3 (Nice to have):
6. 🚧 Invoice display

---

## 🔧 TECHNICAL REQUIREMENTS

### Environment Variables Needed:
```env
# For file uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Or use Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### NPM Packages to Install:
```bash
npm install cloudinary
# OR
npm install @supabase/storage-js
```

---

## 📝 NOTES

- All features require Supabase database access
- Photo uploads need cloud storage (Cloudinary or Supabase Storage)
- Wallet/cashback system needs transaction tracking
- Admin panel needs update for invoice uploads
- Order tracking needs integration with shipping partner API (optional)

---

## 🎯 NEXT STEPS

To implement these features, we need to:
1. Set up database tables in Supabase
2. Configure file upload service (Cloudinary/Supabase)
3. Create API endpoints one by one
4. Build frontend components
5. Test thoroughly

**Would you like me to start implementing any specific feature from the pending list?**
