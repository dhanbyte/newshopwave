// WhatsApp message templates for order sharing

interface OrderDetails {
  orderId: string
  customerName?: string
  customerPhone?: string
  productName?: string
  quantity?: number
  amount: number
  address?: string
  city?: string
  state?: string
  pincode?: string
  trackingId?: string
  invoiceUrl?: string
  dropshipperId?: string
  dropshipperEarning?: number
}

/**
 * Generate WhatsApp message for customer
 */
export function generateCustomerMessage(order: OrderDetails): string {
  const message = `
🛍️ *Order Confirmation - ShopWave*

Dear ${order.customerName || 'Customer'},

Your order has been confirmed! 

📦 *Order Details:*
Order ID: #${order.orderId}
${order.productName ? `Product: ${order.productName}` : ''}
${order.quantity ? `Quantity: ${order.quantity}` : ''}
Amount: ₹${order.amount.toLocaleString()}

📍 *Delivery Address:*
${order.address || 'N/A'}
${order.city ? `${order.city}, ${order.state || ''}` : ''}
${order.pincode ? `Pincode: ${order.pincode}` : ''}

${order.trackingId ? `📦 *Tracking ID:* ${order.trackingId}` : ''}

${order.invoiceUrl ? `📄 *Invoice:* ${order.invoiceUrl}` : ''}

Track your order: https://www.shopwave.social/orders

Thank you for shopping with ShopWave! 🙏
  `.trim()

  return message
}

/**
 * Generate WhatsApp message for dropshipper
 */
export function generateDropshipperMessage(order: OrderDetails): string {
  const message = `
📦 *New Order Alert - ShopWave*

Order ID: #${order.orderId}

👤 *Customer Details:*
Name: ${order.customerName || 'N/A'}
Phone: ${order.customerPhone || 'N/A'}

📦 *Product:*
${order.productName || 'Product details'}
${order.quantity ? `Quantity: ${order.quantity}` : ''}

💰 *Your Earnings:* ₹${order.dropshipperEarning?.toLocaleString() || '0'}

📍 *Delivery Address:*
${order.address || 'N/A'}
${order.city ? `${order.city}, ${order.state || ''}` : ''}
${order.pincode ? `Pincode: ${order.pincode}` : ''}

${order.trackingId ? `📦 *Tracking ID:* ${order.trackingId}` : ''}

${order.invoiceUrl ? `📄 *Invoice:* ${order.invoiceUrl}` : ''}

Please process this order ASAP! ⚡

Dashboard: https://www.shopwave.social/dropshipper/dashboard
  `.trim()

  return message
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  // Remove any non-digit characters from phone
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Add country code if not present (assuming India +91)
  const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(message)
  
  // Return WhatsApp Web URL
  return `https://wa.me/${phoneWithCode}?text=${encodedMessage}`
}

/**
 * Open WhatsApp with message
 */
export function openWhatsApp(phone: string, message: string): void {
  const url = generateWhatsAppUrl(phone, message)
  window.open(url, '_blank')
}
