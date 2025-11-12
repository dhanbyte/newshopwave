require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI_FALLBACK || process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'photos-test';
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('=== Checking Fashion Products ===');
    
    // Check regular products
    const fashionProducts = await db.collection('products').find({ category: 'Fashion' }).toArray();
    console.log('Regular fashion products:', fashionProducts.length);
    
    // Check vendor products
    const vendorFashionProducts = await db.collection('vendorproducts').find({ 
      category: 'Fashion',
      status: 'active'
    }).toArray();
    console.log('Vendor fashion products:', vendorFashionProducts.length);
    
    if (vendorFashionProducts.length > 0) {
      console.log('Sample vendor fashion products:');
      vendorFashionProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Stock: ${product.stock} - Price: ${product.price}`);
      });
    }
    
    // Check all categories in vendor products
    const allCategories = await db.collection('vendorproducts').distinct('category', { status: 'active' });
    console.log('All vendor product categories:', allCategories);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
})();