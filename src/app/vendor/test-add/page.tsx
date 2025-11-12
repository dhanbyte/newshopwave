'use client'

export default function TestAddProduct() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Add Product Page</h1>
      <p>If you can see this, the routing works.</p>
      <div className="mt-4">
        <a href="/vendor/add-product" className="bg-blue-500 text-white px-4 py-2 rounded">
          Go to Real Add Product
        </a>
      </div>
      <div className="mt-4">
        <p>Check browser console for any JavaScript errors.</p>
        <button 
          onClick={() => console.log('Button clicked!')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Console
        </button>
      </div>
    </div>
  )
}