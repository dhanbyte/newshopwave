const { hyperAdvancedCategorization } = require('./hyper-advanced-ai-categorizer.js');

const testProducts = [
  {
    title: "Samsung Galaxy S24 Mobile Back Cover",
    vendor: "Samsung",
    price: 299,
    images: ["https://example.com/mobile-cover-samsung.jpg"]
  },
  {
    title: "Apple iPhone Fast Charging Cable",
    vendor: "Apple", 
    price: 1299,
    images: ["https://example.com/iphone-charger.jpg"]
  },
  {
    title: "Sony WH-1000XM4 Wireless Headphones",
    vendor: "Sony",
    price: 15999,
    images: ["https://example.com/sony-headphones.jpg"]
  },
  {
    title: "Women's Gold Plated Necklace Set",
    vendor: "Jewellery Brand",
    price: 899,
    images: ["https://example.com/jewelry-necklace-women.jpg"]
  },
  {
    title: "Prestige Pressure Cooker 5L",
    vendor: "Prestige",
    price: 2499,
    images: ["https://example.com/kitchen-pressure-cooker.jpg"]
  },
  {
    title: "Lakme Absolute Foundation",
    vendor: "Lakme",
    price: 650,
    images: ["https://example.com/makeup-foundation.jpg"]
  },
  {
    title: "Custom Photo Printed Coffee Mug",
    vendor: "PrintShop",
    price: 199,
    images: ["https://example.com/custom-mug-photo.jpg"]
  }
];

console.log('=== Hyper Advanced AI with Intelligence Test ===\n');

testProducts.forEach((product, i) => {
  const result = hyperAdvancedCategorization(
    product.title, 
    '', 
    product.vendor, 
    product.price, 
    product.images
  );
  
  console.log(`${i+1}. ${product.title}`);
  console.log(`   Brand: ${product.vendor} | Price: ₹${product.price}`);
  console.log(`   → ${result.category} > ${result.subcategory}`);
  console.log('');
});

console.log('Hyper Advanced AI with Brand & Price Intelligence Complete!');