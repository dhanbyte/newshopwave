// Fix for New Arrivals search page issue
// This script will help debug and fix the New Arrivals category display

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkNewArrivalsProducts() {
  console.log('🔍 Checking New Arrivals products in database...');
  
  try {
    // Check regular products table
    const { data: regularProducts, error: regularError } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'New Arrivals');
    
    console.log('📦 Regular products with "New Arrivals" category:', regularProducts?.length || 0);
    if (regularProducts?.length > 0) {
      console.log('Sample regular products:', regularProducts.slice(0, 3).map(p => ({ id: p.id, name: p.name, category: p.category })));
    }
    
    // Check vendor products table
    const { data: vendorProducts, error: vendorError } = await supabase
      .from('vendor_products')
      .select('*')
      .eq('category', 'New Arrivals')
      .eq('status', 'active');
    
    console.log('🏪 Vendor products with "New Arrivals" category:', vendorProducts?.length || 0);
    if (vendorProducts?.length > 0) {
      console.log('Sample vendor products:', vendorProducts.slice(0, 3).map(p => ({ id: p.id, name: p.name, category: p.category })));
    }
    
    // Check all categories in regular products
    const { data: allRegularCategories } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    const regularCategorySet = new Set(allRegularCategories?.map(p => p.category) || []);
    console.log('📋 All categories in regular products:', Array.from(regularCategorySet));
    
    // Check all categories in vendor products
    const { data: allVendorCategories } = await supabase
      .from('vendor_products')
      .select('category')
      .eq('status', 'active')
      .not('category', 'is', null);
    
    const vendorCategorySet = new Set(allVendorCategories?.map(p => p.category) || []);
    console.log('🏪 All categories in vendor products:', Array.from(vendorCategorySet));
    
    // Test the API endpoint
    console.log('\n🌐 Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
      const apiProducts = await response.json();
      const newArrivalsFromAPI = apiProducts.filter(p => p.category === 'New Arrivals');
      console.log('📡 New Arrivals products from API:', newArrivalsFromAPI.length);
      
      if (newArrivalsFromAPI.length > 0) {
        console.log('Sample API New Arrivals:', newArrivalsFromAPI.slice(0, 3).map(p => ({ 
          id: p.id, 
          name: p.name, 
          category: p.category,
          isVendorProduct: p.isVendorProduct 
        })));
      }
    } else {
      console.log('❌ API request failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error checking New Arrivals products:', error);
  }
}

// Add some New Arrivals products to the database for testing
async function addSampleNewArrivalsProducts() {
  console.log('\n➕ Adding sample New Arrivals products to database...');
  
  const sampleProducts = [
    {
      name: 'Premium Astronaut Galaxy Projector Night Light',
      slug: 'premium-astronaut-galaxy-projector-night-light',
      description: 'Transform your space into a magical universe with this premium Astronaut Galaxy Projector.',
      category: 'New Arrivals',
      subcategory: 'LED Lights',
      price: 699,
      original_price: 1999,
      image: 'https://Shopwave.b-cdn.net/NEW%20ARIVALS/GalaxyProjector-04.webp',
      extra_images: [
        'https://Shopwave.b-cdn.net/NEW%20ARIVALS/GalaxyProjector-05%20(1).webp',
        'https://Shopwave.b-cdn.net/NEW%20ARIVALS/GalaxyProjector-05.webp'
      ],
      brand: 'DeoDap',
      quantity: 50,
      ratings: { average: 5.0, count: 5 },
      features: [
        'Astronaut-themed galaxy projector with stunning nebula and star effects',
        'Remote control operation for easy adjustment of brightness, colors, and modes',
        'Multiple color lighting effects including red, blue, green, and mixed nebula'
      ]
    },
    {
      name: 'Night Light Mushroom Lamp (Colorful)',
      slug: 'night-light-mushroom-lamp-colorful',
      description: 'Night Light Mushroom Lamp ideal for home (bedroom, living room, kitchen), bars, cafés, restaurants.',
      category: 'New Arrivals',
      subcategory: 'LED Lights',
      price: 249,
      original_price: 675,
      image: 'https://Shopwave.b-cdn.net/NEW%20ARIVALS/3_12e4cc87-a760-425d-badf-365f48f8677d.webp',
      extra_images: [
        'https://Shopwave.b-cdn.net/NEW%20ARIVALS/4_8beb67f3-fef6-44aa-b644-3f91f6ed6f65.webp',
        'https://Shopwave.b-cdn.net/NEW%20ARIVALS/5_17fb16e7-ecf4-415a-91a6-fa37c713113a.webp'
      ],
      brand: 'DeoDap',
      quantity: 100,
      ratings: { average: 4.3, count: 28 },
      features: [
        'LED intelligent light control sensor',
        'Automatic on/off with darkness/daylight',
        'Easy plug-in design'
      ]
    },
    {
      name: 'Adjustable Dashboard Car Mobile Holder',
      slug: 'adjustable-dashboard-car-mobile-holder',
      description: 'Adjustable Dashboard Car Mobile Holder with Strong Suction Cup – 360° Rotating Windshield Mount Stand.',
      category: 'New Arrivals',
      subcategory: 'Car Accessories',
      price: 199,
      original_price: 399,
      image: 'https://Shopwave.b-cdn.net/new%20arival/01_15d3c786-e22a-4818-8a49-d1c8c6662719.webp',
      extra_images: [
        'https://Shopwave.b-cdn.net/new%20arival/03_4e9256ae-89a1-4bc9-a2fc-32f6830a9795.webp',
        'https://Shopwave.b-cdn.net/new%20arival/02_f83d45eb-8d7b-418a-99d2-e95a5f9ba1c3.webp'
      ],
      brand: 'Velvet Wheels',
      quantity: 150,
      ratings: { average: 4.5, count: 28 },
      features: [
        'Strong suction base',
        '360° rotating head',
        'Universal compatibility'
      ]
    }
  ];
  
  try {
    for (const product of sampleProducts) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) {
        console.log('❌ Error inserting product:', product.name, error.message);
      } else {
        console.log('✅ Added product:', product.name);
      }
    }
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
  }
}

async function main() {
  console.log('🚀 Starting New Arrivals fix script...\n');
  
  // First check current state
  await checkNewArrivalsProducts();
  
  // Add sample products
  await addSampleNewArrivalsProducts();
  
  // Check again after adding
  console.log('\n🔄 Checking again after adding products...');
  await checkNewArrivalsProducts();
  
  console.log('\n✅ Fix script completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Restart your Next.js development server');
  console.log('2. Visit /search?category=New%20Arrivals to test');
  console.log('3. Check if products are now showing up');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkNewArrivalsProducts, addSampleNewArrivalsProducts };