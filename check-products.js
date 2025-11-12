require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI_FALLBACK || process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'photos-test';
  
  if (!uri) {
    console.error('No MongoDB URI found');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Check collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check products collection
    const productsCount = await db.collection('products').countDocuments();
    console.log('Products count:', productsCount);
    
    if (productsCount > 0) {
      const sampleProducts = await db.collection('products').find({}).limit(3).toArray();
      console.log('Sample products:', sampleProducts.map(p => ({ name: p.name, category: p.category, quantity: p.quantity })));
    }
    
    // Check vendor products
    const vendorProductsCount = await db.collection('vendorproducts').countDocuments();
    console.log('Vendor products count:', vendorProductsCount);
    
    if (vendorProductsCount > 0) {
      const sampleVendorProducts = await db.collection('vendorproducts').find({}).limit(3).toArray();
      console.log('Sample vendor products:', sampleVendorProducts.map(p => ({ name: p.name, category: p.category, stock: p.stock })));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
})();