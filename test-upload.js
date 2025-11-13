// Test script to check CSV upload API
const testProducts = [
  {
    Handle: 'test-product-1',
    Title: 'Test Product 1',
    'Body (HTML)': 'This is a test product description',
    Vendor: 'Test Brand',
    Type: 'Electronics',
    'Variant Price': '999',
    'Variant Compare At Price': '1299',
    'Variant Grams': '500',
    'Image Src 1': 'https://via.placeholder.com/300x300?text=Product1',
    'Image Src 2': 'https://via.placeholder.com/300x300?text=Product1-2',
    Published: 'TRUE'
  },
  {
    Handle: 'test-product-2',
    Title: 'Test Product 2',
    'Body (HTML)': 'Another test product with features',
    Vendor: 'Test Brand 2',
    Type: 'Home & Garden',
    'Variant Price': '1999',
    'Variant Compare At Price': '2499',
    'Variant Grams': '750',
    'Image Src 1': 'https://via.placeholder.com/300x300?text=Product2',
    'Image Src 2': 'https://via.placeholder.com/300x300?text=Product2-2',
    Published: 'TRUE'
  }
];

async function testUpload() {
  try {
    const response = await fetch('http://localhost:3000/api/vendor/import-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorId: 1,
        products: testProducts
      })
    });
    
    const result = await response.json();
    console.log('Upload result:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

testUpload();