import { NextRequest, NextResponse } from 'next/server'

const supplierPrices = {
  "vr-box-3d-glasses": {
    suppliers: [
      { name: "Alibaba Wholesale", price: 89, moq: 50, shipping: 15, delivery: "7-15 days" },
      { name: "IndiaMART Supplier", price: 125, moq: 20, shipping: 25, delivery: "3-7 days" },
      { name: "DHgate Direct", price: 95, moq: 10, shipping: 20, delivery: "10-20 days" },
      { name: "Local Wholesale", price: 150, moq: 5, shipping: 10, delivery: "1-3 days" },
      { name: "Meesho Supplier", price: 110, moq: 25, shipping: 0, delivery: "5-10 days" }
    ],
    currentSellingPrice: 299,
    recommendedPrice: 199
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productName = searchParams.get('product') || 'vr-box-3d-glasses'
  
  const data = supplierPrices[productName as keyof typeof supplierPrices]
  
  if (!data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const bestPrice = Math.min(...data.suppliers.map(s => s.price + s.shipping))
  const bestSupplier = data.suppliers.find(s => (s.price + s.shipping) === bestPrice)
  
  return NextResponse.json({
    success: true,
    product: productName,
    currentPrice: data.currentSellingPrice,
    recommendedPrice: data.recommendedPrice,
    suppliers: data.suppliers,
    bestDeal: bestSupplier,
    potentialProfit: data.recommendedPrice - bestPrice
  })
}