# WhatsApp Automation Setup Guide 🚀

## Overview
This system uses **Google Sheets** as your database and simple **AI Logic** to generate WhatsApp messages. It costs ₹0 and relies on `wa.me` links and Google Apps Script.

---

## Step 1: Set Up Google Sheets (The Backend)
1. Go to [sheet.new](https://sheet.new) to create a new Google Sheet.
2. Name it `Shopwave Automation DB`.
3. Rename the first tab to `Logs` (or let the script do it).
4. Go to **Extensions > Apps Script**.

## Step 2: Deploy the Script
1. Delete any code in the `Code.gs` file.
2. Copy the code from `src/lib/google-apps-script.js`.
3. Paste it into the Apps Script editor.
4. Click the **Save** icon (disk).
5. Run the `setup` function once:
   - Select `setup` from the dropdown menu (top bar).
   - Click **Run**.
   - Grant permissions (Review Permissions > Choose Account > Advanced > Go to Untitled (unsafe) > Allow).
6. **Deploy as Web App**:
   - Click **Deploy** (blue button) > **New deployment**.
   - Select type: **Web app**.
   - Description: `V1`.
   - **Execute as**: `Me`.
   - **Who has access**: `Anyone` (Important! so your website can send data).
   - Click **Deploy**.
7. **Copy the Web App URL** (starts with `https://script.google.com/macros/s/...`).

## Step 3: Connect to Shopwave
1. Open `src/lib/shopwave-integration.ts` in your code editor.
2. Replace `'YOUR_GOOGLE_SCRIPT_WEB_APP_URL'` with the URL you just copied.
   ```typescript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/......./exec';
   ```

## Step 4: How It Works
1. **Event Logging**: When users add items to cart or checkout, the system silently sends data to your Google Sheet.
2. **Message Generation**: The `antigravity-ai.ts` file generates optimized Hinglish messages.
3. **Manual Trigger**: You can add buttons in your Admin Panel to "Send WhatsApp Reminder" which will open the generated `wa.me` link.

## Step 5: Testing
1. Add an item to cart on your localhost.
2. Check your Google Sheet - you should see a new row appear in `Abandoned_Carts` or `Logs`.
3. If not, check the browser console for errors.

---

**✅ Done! Your Free WhatsApp Automation System is ready.**
