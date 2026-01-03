// Google Apps Script Code for Shopwave Automation
// Copy and paste this into script.google.com

/**
 * POST Handler - Receives data from Shopwave
 */
function doPost(e) {
    try {
        // 1. Parse Data
        var data = JSON.parse(e.postData.contents);
        var sheetName = data.type || 'Logs'; // 'Orders', 'Carts', 'Users'

        // 2. Get or Create Sheet
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(sheetName);

        if (!sheet) {
            sheet = ss.insertSheet(sheetName);
            // Create Header Row based on data keys if new sheet
            var headers = Object.keys(data);
            sheet.appendRow(headers);
        }

        // 3. Prepare Row Data (ensure order matches headers)
        // For simplicity in this v1, we just append values in generic order or specific logic
        // A better approach for production is mapping headers dynamically.

        var timestamp = new Date();
        var row = [timestamp];

        // Quick dumping of common fields
        if (data.userId) row.push(data.userId);
        if (data.phone) row.push("'" + data.phone); // Force string for phone
        if (data.name) row.push(data.name);
        if (data.action) row.push(data.action);
        if (data.amount) row.push(data.amount);
        if (data.product) row.push(data.product);
        if (data.message) row.push(data.message);

        // 4. Append to Sheet
        sheet.appendRow(row);

        // 5. Return Success
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Initial Setup Helper
 */
function setup() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Create default sheets if they don't exist
    ['Orders', 'Abandoned_Carts', 'Leads'].forEach(function (name) {
        if (!ss.getSheetByName(name)) {
            ss.insertSheet(name);
            ss.getSheetByName(name).appendRow(['Timestamp', 'User ID', 'Phone', 'Name', 'Action', 'Amount', 'Product', 'Message']);
        }
    });
}
