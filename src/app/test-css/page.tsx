export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">CSS Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Card 1</h2>
            <p className="text-gray-600">This is a test card with Tailwind CSS styling.</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Test Button
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Card 2</h2>
            <p className="text-gray-600">Another test card to verify CSS is working.</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Green Button
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Card 3</h2>
            <p className="text-gray-600">Third card with responsive design.</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Red Button
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">
            <strong>CSS Status:</strong> If you can see colors, spacing, and hover effects, Tailwind CSS is working!
          </p>
        </div>
      </div>
    </div>
  )
}