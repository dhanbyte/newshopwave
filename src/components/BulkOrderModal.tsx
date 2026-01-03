'use client'
import React, { useState } from 'react'
import { Upload, X, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import Papa from 'papaparse'
import { Button } from './ui/button'

interface BulkOrderModalProps {
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export default function BulkOrderModal({ onClose, onSuccess, userId }: BulkOrderModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseFile(selectedFile)
    }
  }

  const parseFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const mappedData = results.data.map((row: any) => ({
          orderName: row['Name'],
          email: row['Email'],
          quantity: parseInt(row['Lineitem quantity']),
          productName: row['Lineitem name'],
          customerName: row['Shipping Name'],
          address: row['Shipping Address1'],
          city: row['Shipping City'],
          zip: row['Shipping Zip'],
          province: row['Shipping Province'],
          phone: row['Shipping Phone'],
          total: parseFloat(row['Total'])
        })).filter(o => o.orderName && o.productName);
        
        setPreview(mappedData)
      },
      error: (err) => {
        setError("Failed to parse CSV: " + err.message)
      }
    })
  }

  const [results, setResults] = useState<{count: number, totalDeducted: number} | null>(null)

  const handleUpload = async () => {
    if (preview.length === 0) return
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/bulk-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, orders: preview })
      })
      const data = await res.json()
      if (data.success) {
        setResults({
          count: data.count,
          totalDeducted: data.totalDeducted
        })
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      setError(err.message || "Bulk upload failed")
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Upload Successful!</h2>
          <p className="text-gray-500 text-sm mb-8 font-medium">Your bulk orders have been processed and added to your history.</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
              <p className="text-xl font-black text-gray-900">{results.count}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deducted</p>
              <p className="text-xl font-black text-brand">₹{results.totalDeducted.toLocaleString()}</p>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base font-bold rounded-xl"
            onClick={() => {
              onSuccess();
              onClose();
            }}
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            Bulk Order Upload (Shopify)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-brand/40 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-lg font-bold">Select Shopify CSV Export</h3>
                <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-brand font-medium bg-brand/5 px-3 py-1.5 rounded-full">
                  <FileText className="w-3.5 h-3.5" />
                  Supports .csv files only
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{preview.length} orders found</p>
                  </div>
                </div>
                <button onClick={() => {setFile(null); setPreview([])}} className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
              </div>

              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700">
                    {preview.slice(0, 10).map((order, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-medium text-brand">{order.orderName}</td>
                        <td className="px-4 py-3">{order.customerName}</td>
                        <td className="px-4 py-3 line-clamp-1">{order.productName}</td>
                        <td className="px-4 py-3">{order.city}</td>
                        <td className="px-4 py-3">{order.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 10 && (
                  <div className="p-3 bg-gray-50 text-center text-[10px] text-gray-400 font-medium">
                    + {preview.length - 10} more orders
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 items-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            disabled={loading || preview.length === 0}
            className="px-8 shadow-lg shadow-brand/20"
          >
            {loading ? 'Processing...' : `Place ${preview.length} Orders`}
          </Button>
        </div>
      </div>
    </div>
  )
}
