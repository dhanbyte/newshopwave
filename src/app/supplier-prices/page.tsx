'use client'
import { useState, useEffect } from 'react'

export default function SupplierPricesPage() {
  const [priceData, setPriceData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/supplier-prices?product=vr-box-3d-glasses')
      const data = await response.json()
      setPriceData(data)
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  if (loading) return <div className="p-8">Loading supplier prices...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🏷️ VR BOX Supplier Prices</h1>
      
      {priceData && (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current vs Recommended</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Selling</p>
                <p className="text-2xl font-bold text-red-600">₹{priceData.currentPrice}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Recommended</p>
                <p className="text-2xl font-bold text-green-600">₹{priceData.recommendedPrice}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Potential Profit</p>
                <p className="text-2xl font-bold text-blue-600">₹{priceData.potentialProfit}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">🏆 Best Deal</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-green-600">Supplier</p>
                <p className="font-semibold">{priceData.bestDeal.name}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Total Cost</p>
                <p className="font-semibold">₹{priceData.bestDeal.price + priceData.bestDeal.shipping}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">MOQ</p>
                <p className="font-semibold">{priceData.bestDeal.moq} pcs</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Delivery</p>
                <p className="font-semibold">{priceData.bestDeal.delivery}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">All Suppliers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Supplier</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Shipping</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">MOQ</th>
                    <th className="text-left p-2">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.suppliers.map((supplier: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{supplier.name}</td>
                      <td className="p-2">₹{supplier.price}</td>
                      <td className="p-2">₹{supplier.shipping}</td>
                      <td className="p-2 font-semibold">₹{supplier.price + supplier.shipping}</td>
                      <td className="p-2">{supplier.moq} pcs</td>
                      <td className="p-2">{supplier.delivery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}