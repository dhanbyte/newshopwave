import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  // Fetch Order
  const { data: order, error } = await supabase
    .from('admin_orders')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Fetch Dropshipper Profile for Store Name
  let storeName = "NewShopWave";
  if (order.user_id) {
    const { data: userData } = await supabase
      .from('users')
      .select('dropshipper_profile')
      .eq('clerk_user_id', order.user_id)
      .maybeSingle();
    
    if (userData?.dropshipper_profile) {
      const profile = typeof userData.dropshipper_profile === 'string' 
        ? JSON.parse(userData.dropshipper_profile) 
        : userData.dropshipper_profile;
      storeName = profile.store_name || storeName;
    }
  }

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(storeName.toUpperCase(), 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Tax Invoice", 105, 26, { align: "center" });

  doc.line(20, 30, 190, 30);

  // Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 40);
  
  const shipping = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address;
    
  doc.setFont("helvetica", "normal");
  doc.text(shipping.fullName || shipping.name || "Customer", 20, 46);
  doc.setFontSize(10);
  doc.text(shipping.line1 || shipping.address || "N/A", 20, 51);
  doc.text(`${shipping.city || ""}, ${shipping.state || ""} - ${shipping.pincode || ""}`, 20, 56);
  doc.text(`Phone: ${shipping.phone || "N/A"}`, 20, 61);

  // Invoice Details
  doc.setFont("helvetica", "bold");
  doc.text("Invoice #:", 140, 40);
  doc.setFont("helvetica", "normal");
  doc.text(orderId, 165, 40);
  
  doc.setFont("helvetica", "bold");
  doc.text("Date:", 140, 46);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(order.created_at).toLocaleDateString(), 165, 46);

  // Table Header
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 75, 170, 8, 'F');
  doc.setFont("helvetica", "bold");
  doc.text("Description", 25, 80);
  doc.text("Qty", 140, 80);
  doc.text("Amount", 170, 80);

  // Table Body
  doc.setFont("helvetica", "normal");
  let y = 88;
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
  items.forEach((item: any) => {
    doc.text(item.name.substring(0, 40), 25, y);
    doc.text((item.qty || item.quantity).toString(), 142, y);
    doc.text(`Rs. ${item.price || 0}`, 170, y);
    y += 8;
  });

  doc.line(20, y, 190, y);
  y += 10;

  // Summary
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 120, y);
  doc.text(`Rs. ${order.total_amount || order.total}`, 170, y);

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for shopping with us!", 105, 280, { align: "center" });

  const pdfArrayBuffer = doc.output('arraybuffer');

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${orderId}.pdf`
    }
  });
}
