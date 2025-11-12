require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const sampleProducts = [
  {
    vendorId: 'vendor1',
    productId: 'prod1',
    name: 'Premium Cotton T-Shirt',
    category: 'Fashion',
    subcategory: 'Men',
    price: 599,
    originalPrice: 799,
    discountPrice: 599,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    description: 'Premium quality cotton t-shirt for men',
    stock: 25,
    brand: 'ShopWave',
    status: 'active',
    createdAt: new Date()
  },
  {
    vendorId: 'vendor1',
    productId: 'prod2',
    name: 'Elegant Women Dress',
    category: 'Fashion',
    subcategory: 'Women',
    price: 899,
    originalPrice: 1299,
    discountPrice: 899,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    description: 'Beautiful elegant dress for women',
    stock: 15,
    brand: 'ShopWave',
    status: 'active',
    createdAt: new Date()
  },
  {
    vendorId: 'vendor1',
    productId: 'prod3',
    name: 'Wireless Bluetooth Headphones',
    category: 'Tech',
    subcategory: 'Audio',
    price: 999,
    originalPrice: 1299,
    discountPrice: 999,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    description: 'High-quality wireless Bluetooth headphones',
    stock: 20,
    brand: 'TechBrand',
    status: 'active',
    createdAt: new Date()
  },
  {
    vendorId: 'vendor1',
    productId: 'prod4',
    name: 'LED Desk Lamp',
    category: 'Home',
    subcategory: 'Lighting',
    price: 599,
    originalPrice: 799,
    discountPrice: 599,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    description: 'Modern LED desk lamp with adjustable brightness',
    stock: 12,
    brand: 'HomeBrand',
    status: 'active',
    createdAt: new Date()
  },
  {
    vendorId: 'vendor1',
    productId: 'prod5',
    name: 'Kitchen Knife Set',
    category: 'Home',
    subcategory: 'Kitchen Tools',
    price: 799,
    originalPrice: 999,
    discountPrice: 799,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
    description: 'Professional kitchen knife set',
    stock: 8,
    brand: 'KitchenPro',
    status: 'active',
    createdAt: new Date()
  }
];

(async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'test';
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('Adding sample products to vendorproductnews collection...');
    
    const result = await db.collection('vendorproductnews').insertMany(sampleProducts);
    console.log(`✅ Added ${result.insertedCount} sample products`);
    
    // Verify
    const count = await db.collection('vendorproductnews').countDocuments({ status: 'active' });
    console.log(`Total active products: ${count}`);
    
    const categories = await db.collection('vendorproductnews').distinct('category', { status: 'active' });
    console.log('Categories:', categories);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
})();