# Editable Tracking ID Feature - Setup Guide

## Overview
Admin ab manually **real courier tracking ID** add kar sakta hai orders mein, jo dropshippers ko share kiya ja sakta hai.

## Database Setup

### Step 1: Run SQL Migration
Apne Supabase Dashboard mein SQL Editor mein ye query run karein:

```sql
-- Add tracking_id column to admin_orders table
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_orders_tracking_id ON admin_orders(tracking_id);

-- Also add to vendor_orders if needed
ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_vendor_orders_tracking_id ON vendor_orders(tracking_id);
```

**File:** `add_tracking_id_column.sql`

## Features

### 1. **Two Types of IDs**
- **Order ID** (Auto-generated): System-generated unique ID
- **Courier Tracking ID** (Manual): Real tracking ID from courier company (DTDC, BlueDart, etc.)

### 2. **Admin Can:**
- ✅ View auto-generated Order ID
- ✅ Add/Edit real courier tracking ID
- ✅ Copy both IDs with one click
- ✅ Share tracking ID with dropshippers

### 3. **UI Features**
- **Blue Box**: Order ID (auto-generated, read-only)
- **Green Box**: Courier Tracking ID (editable)
- **Edit Button**: Click to add/edit tracking ID
- **Copy Buttons**: One-click copy for both IDs
- **Visual Indicator**: ✓ mark when tracking ID is set

## How to Use

### For Admin:

1. **Open Order Details**
   - Go to Admin Panel → Orders
   - Click on any order

2. **Add Tracking ID**
   - Scroll to "Courier Tracking ID" section (green box)
   - Click "Add Tracking ID" button
   - Enter real tracking ID (e.g., `DTDC123456789`)
   - Click "Save Tracking ID"

3. **Share with Dropshipper**
   - Click "Copy" button next to tracking ID
   - Send via WhatsApp/Email to dropshipper

4. **Edit Tracking ID**
   - Click "Edit Tracking ID" button
   - Update the ID
   - Click "Save"

## Example Tracking IDs

Different courier companies use different formats:

- **DTDC**: `DTDC123456789`
- **BlueDart**: `BD987654321`
- **Delhivery**: `DEL1234567890`
- **Ecom Express**: `ECM123456789`
- **India Post**: `RR123456789IN`

## Files Modified

1. **Frontend:**
   - `src/app/admin/orders/page.tsx` - Added editable tracking ID UI

2. **Backend:**
   - `src/app/api/admin/orders/route.ts` - Added trackingId to response
   - `src/app/api/admin/orders/tracking/route.ts` - New API to update tracking ID

3. **Database:**
   - `add_tracking_id_column.sql` - Migration to add tracking_id column

## Testing

1. Run the SQL migration
2. Restart your dev server (`npm run dev`)
3. Go to Admin → Orders
4. Click on any order
5. Try adding a tracking ID
6. Verify it saves and displays correctly
7. Test the copy functionality

## Benefits

✅ **For Admin:**
- Easy to add real tracking IDs
- Quick copy-paste functionality
- Clear visual distinction between auto-generated and manual IDs

✅ **For Dropshippers:**
- Get real courier tracking numbers
- Can track their orders on courier websites
- Professional experience

✅ **For Business:**
- Better order tracking
- Reduced customer support queries
- Improved transparency

## Notes

- Tracking ID is **optional** - orders work fine without it
- You can edit tracking ID anytime
- Old orders won't have tracking IDs (will show "Not set yet")
- Tracking ID is stored separately from Order ID
