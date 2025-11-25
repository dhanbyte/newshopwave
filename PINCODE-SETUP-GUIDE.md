# 📍 Pincode Data Setup Guide

## Step 1: Open Excel Files

आपके पास 2 files हैं:
- `cod-pincode (2).xlsx` - COD delivery allowed pincodes
- `prepaid-pincode (1).xlsx` - Prepaid delivery allowed pincodes

## Step 2: Excel Format Expected

Excel में ये columns होने चाहिए:
```
Pincode | City | District | State
110001  | New Delhi | Central Delhi | Delhi
400001  | Mumbai | Mumbai City | Maharashtra
```

## Step 3: Convert to Code

### Example से समझो:

```typescript
// अगर Excel में ye data है:
// Pincode: 110001
// City: New Delhi
// District: Central Delhi  
// State: Delhi

// To code में aise लिखो:
{ pincode: '110001', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', deliveryType: 'COD' }
```

## Step 4: File में Paste करो

### For COD Pincodes:
Open: `src/lib/pincode-data.ts`

Find: `export const COD_PINCODES: PincodeData[] = [`

Replace sample data with your Excel data:
```typescript
export const COD_PINCODES: PincodeData[] = [
  { pincode: '110001', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', deliveryType: 'COD' },
  { pincode: '110002', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', deliveryType: 'COD' },
  // ... सभी COD pincodes
]
```

### For Prepaid Pincodes:
Find: `export const PREPAID_PINCODES: PincodeData[] = [`

```typescript
export const PREPAID_PINCODES: PincodeData[] = [
  { pincode: '560001', city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', deliveryType: 'PREPAID' },
  { pincode: '560002', city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', deliveryType: 'PREPAID' },
  // ... सभी Prepaid pincodes
]
```

---

## ✨ Features Working Now:

### 1. Auto-Fill (Ready!)
```
User enters: 110001
↓
City automatically fills: "New Delhi"
State automatically fills: "Delhi"
Message shows: "✅ Both COD and Prepaid available in New Delhi"
```

### 2. Delivery Validation
```
User enters: 999999 (not serviceable)
↓
Message: "❌ Delivery not available to this pincode"
Order cannot be placed
```

### 3. Payment Method Control
```
Pincode: 400001 (COD only)
↓
- COD option shown
- Prepaid disabled with message
```

---

## 🎯 Next Steps:

1. **Open Excel files**
2. **Copy pincode data**
3. **Paste into `src/lib/pincode-data.ts`**
4. **Test on website!**

---

## Quick Copy-Paste Template:

```typescript
{ pincode: 'XXXXXX', city: 'CityName', district: 'DistrictName', state: 'StateName', deliveryType: 'COD' },
```

Replace:
- `XXXXXX` → Pincode from Excel
- `CityName` → City from Excel
- `DistrictName` → District from Excel
- `StateName` → State from Excel
- `COD` → Keep as is for COD file, use `PREPAID` for prepaid file

---

**Excel data chahiye to batao, main help karूंगा!** 📊
