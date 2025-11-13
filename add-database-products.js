// Script to add sample products to database for Tech, Home, and Fashion categories
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nczdoszfndzqyhawpahz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample products for different categories
const sampleProducts = [
  // Tech Products
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless Bluetooth headphones with noise cancellation and long battery life.',
    category: 'Tech',
    subcategory: 'Headphones',
    price: 1299,
    original_price: 2499,
    image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_413ce869-b6ef-477c-8be8-b78545b87afb.webp?updatedAt=1757152313606',
    extra_images: [
      'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_413ce869-b6ef-477c-8be8-b78545b87afb.webp?updatedAt=1757152313606'
    ],
    brand: 'TechWave',
    quantity: 50,
    ratings: { average: 4.5, count: 25 },
    features: ['Wireless Bluetooth 5.0', 'Noise Cancellation', '20-hour battery life']
  },
  {
    name: 'USB-C Fast Charging Cable',
    slug: 'usb-c-fast-charging-cable',
    description: 'Durable USB-C fast charging cable with data transfer support.',
    category: 'Tech',
    subcategory: 'Mobile Accessories',
    price: 299,
    original_price: 599,
    image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/0260_otg_1.webp?updatedAt=1756627844923',
    extra_images: [],
    brand: 'TechWave',
    quantity: 100,
    ratings: { average: 4.2, count: 15 },
    features: ['Fast charging', 'Data transfer', 'Durable design']
  },
  {
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Compact portable Bluetooth speaker with powerful sound and waterproof design.',
    category: 'Tech',
    subcategory: 'Speakers',
    price: 899,
    original_price: 1799,
    image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_413ce869-b6ef-477c-8be8-b78545b87afb.webp?updatedAt=1757152313606',
    extra_images: [],
    brand: 'SoundMax',
    quantity: 30,
    ratings: { average: 4.7, count: 40 },
    features: ['Waterproof', 'Bluetooth 5.0', '12-hour battery']
  },

  // Home Products
  {
    name: 'Stainless Steel Kitchen Knife Set',
    slug: 'stainless-steel-kitchen-knife-set',
    description: '5-piece professional stainless steel kitchen knife set with wooden block.',
    category: 'Home',
    subcategory: 'Kitchenware',
    price: 1499,
    original_price: 2999,
    image: 'https://Shopwave.b-cdn.net/Homekichan/01_a4e3c239-73ae-4939-8b28-aa03ed6f760f.webp',
    extra_images: [],
    brand: 'ChefMaster',
    quantity: 25,
    ratings: { average: 4.6, count: 30 },
    features: ['Stainless steel', 'Sharp blades', 'Wooden block included']
  },
  {
    name: 'Non-Stick Cookware Set',
    slug: 'non-stick-cookware-set',
    description: '7-piece non-stick cookware set perfect for everyday cooking.',
    category: 'Home',
    subcategory: 'Kitchenware',
    price: 2499,
    original_price: 4999,
    image: 'https://Shopwave.b-cdn.net/Homekichan/02_13a215dc-07e6-4d05-98bc-dd30f55e92dc.webp',
    extra_images: [],
    brand: 'CookPro',
    quantity: 20,
    ratings: { average: 4.4, count: 22 },
    features: ['Non-stick coating', 'Heat resistant', 'Easy to clean']
  },
  {
    name: 'Premium Food Storage Containers',
    slug: 'premium-food-storage-containers',
    description: 'Set of 10 airtight food storage containers with leak-proof lids.',
    category: 'Home',
    subcategory: 'Food Storage',
    price: 799,
    original_price: 1599,
    image: 'https://Shopwave.b-cdn.net/Eltronicpart-2/storage-box-02.webp',
    extra_images: [],
    brand: 'FreshKeep',
    quantity: 40,
    ratings: { average: 4.3, count: 18 },
    features: ['Airtight seal', 'BPA-free', 'Microwave safe']
  },

  // Fashion Products
  {
    name: 'Cotton Casual T-Shirt',
    slug: 'cotton-casual-t-shirt',
    description: 'Comfortable 100% cotton casual t-shirt available in multiple colors.',
    category: 'Fashion',
    subcategory: 'T-Shirts',
    price: 499,
    original_price: 999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    extra_images: [],
    brand: 'StyleWear',
    quantity: 60,
    ratings: { average: 4.2, count: 35 },
    features: ['100% cotton', 'Comfortable fit', 'Multiple colors']
  },
  {
    name: 'Denim Jeans Regular Fit',
    slug: 'denim-jeans-regular-fit',
    description: 'Classic regular fit denim jeans made from premium quality fabric.',
    category: 'Fashion',
    subcategory: 'Jeans',
    price: 1299,
    original_price: 2599,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    extra_images: [],
    brand: 'DenimCraft',
    quantity: 35,
    ratings: { average: 4.5, count: 28 },
    features: ['Premium denim', 'Regular fit', 'Durable construction']
  },
  {
    name: 'Formal Shirt White',
    slug: 'formal-shirt-white',
    description: 'Classic white formal shirt perfect for office and formal occasions.',
    category: 'Fashion',
    subcategory: 'Shirts',
    price: 899,
    original_price: 1799,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    extra_images: [],
    brand: 'FormalWear',
    quantity: 45,
    ratings: { average: 4.4, count: 20 },
    features: ['Cotton blend', 'Wrinkle-free', 'Classic fit']
  }
];

async function addProductsToDatabase() {
  console.log('🚀 Adding sample products to database...');
  
  try {
    for (const product of sampleProducts) {
      console.log(`➕ Adding: ${product.name}`);
      
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) {
        console.log(`❌ Error adding ${product.name}:`, error.message);
      } else {
        console.log(`✅ Added: ${product.name} (ID: ${data.id})`);
      }
    }
    
    console.log('\n🎉 Finished adding products!');
    
    // Check what we have now
    const { data: allProducts } = await supabase
      .from('products')
      .select('category, count(*)')
      .not('category', 'is', null);
    
    console.log('\n📊 Products by category in database:');
    const categoryCount = {};
    if (allProducts) {
      allProducts.forEach(item => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      });
      
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`${category}: ${count} products`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function checkCurrentProducts() {
  console.log('🔍 Checking current products in database...');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category, subcategory')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`📦 Found ${products?.length || 0} recent products:`);
    products?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category} > ${product.subcategory})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  console.log('🏪 Database Products Setup Script\n');
  
  // Check current products
  await checkCurrentProducts();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Add new products
  await addProductsToDatabase();
  
  console.log('\n📝 Next steps:');
  console.log('1. Restart your Next.js development server');
  console.log('2. Visit these URLs to test:');
  console.log('   - /search?category=Tech');
  console.log('   - /search?category=Home');
  console.log('   - /search?category=Fashion');
  console.log('   - /search?category=New%20Arrivals');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addProductsToDatabase, checkCurrentProducts };