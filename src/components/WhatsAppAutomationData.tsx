'use client';

import { useShopwaveAutomation } from '../lib/shopwave-integration';

/**
 * Headless component that activates the WhatsApp Automation System.
 * It tracks cart activity and syncs data to Google Sheets in the background.
 */
export default function WhatsAppAutomationData() {
  // Activate the automation hook
  // This will listen for cart changes and log data to the configured Google Sheet
  useShopwaveAutomation();

  // Render nothing as this is a logic-only component
  return null;
}
