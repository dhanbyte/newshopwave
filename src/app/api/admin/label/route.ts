import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  // Fetch Order Details
  const { data: order, error } = await supabase
    .from('admin_orders')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const shipping = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address;

  // Create PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [100, 150] // Common shipping label size
  });

  // Header - Box
  doc.setLineWidth(0.5);
  doc.rect(5, 5, 90, 140);
  
  // Brand / Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPING LABEL", 50, 15, { align: "center" });
  
  doc.setLineWidth(0.2);
  doc.line(5, 20, 95, 20);

  // Order Details
  doc.setFontSize(10);
  doc.text(`Order ID: #${orderId}`, 10, 28);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 10, 34);
  doc.text(`Method: ${order.payment_method || 'COD'}`, 10, 40);

  doc.line(5, 45, 95, 45);

  // SHIP TO
  doc.setFontSize(12);
  doc.text("SHIP TO:", 10, 52);
  doc.setFont("helvetica", "bold");
  doc.text(shipping.fullName || shipping.name || "Customer", 10, 60);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const addrLines = doc.splitTextToSize(shipping.line1 || shipping.address || "N/A", 80);
  doc.text(addrLines, 10, 66);
  doc.text(`${shipping.city || ""}, ${shipping.state || ""} - ${shipping.pincode || ""}`, 10, 78);
  doc.text(`Phone: ${shipping.phone || shipping.phoneNumber || "N/A"}`, 10, 84);

  doc.line(5, 90, 95, 90);

  // Items Summary
  doc.setFont("helvetica", "bold");
  doc.text("ITEMS:", 10, 98);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  let y = 104;
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
  items.slice(0, 5).forEach((item: any) => {
    doc.text(`• ${item.name} (x${item.qty || item.quantity})`, 10, y);
    y += 5;
  });

  // Footer / Total
  doc.line(5, 130, 95, 130);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL AMOUNT: RS. ${order.total_amount || order.total}`, 50, 138, { align: "center" });

  const pdfArrayBuffer = doc.output('arraybuffer');

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=label-${orderId}.pdf`
    }
  });
}
