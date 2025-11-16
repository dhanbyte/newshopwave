require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'test';
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    console.log('=== Checking New Database Products ===');
    
    // Check vendor products in different possible collections
    const vendorCollections = ['vendorproducts', 'vendorproductnews'];
    
    for (const collectionName of vendorCollections) {
      if (await db.collection(collectionName).countDocuments() > 0) {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`${collectionName}: ${count} products`);
        
        const activeCount = await db.collection(collectionName).countDocuments({ status: 'active' });
        console.log(`${collectionName} active: ${activeCount} products`);
        
        if (activeCount > 0) {
          const sample = await db.collection(collectionName).find({ status: 'active' }).limit(3).toArray();
          console.log(`Sample from ${collectionName}:`);
          sample.forEach((p, i) => {
            console.log(`${i+1}. ${p.name} - ${p.category} - Stock: ${p.stock}`);
          });
        }
      }
    }
    
    // Check all categories
    const allCategories = await db.collection('vendorproductnews').distinct('category', { status: 'active' });
    console.log('Categories in vendorproductnews:', allCategories);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
})();