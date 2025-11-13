// Test Category Mapping
const { intelligentCategoryMapping } = require('./comprehensive-category-mapper.js');

// Sample products for testing
const testProducts = [
  {
    title: "Serenity Crystal Mala - Healing & Meditation Beads",
    description: "Handcrafted with natural crystals known for their healing and energy-balancing properties",
    brand: "BBJ"
  },
  {
    title: "Crystal Mala Beads for Healing and Meditation", 
    description: "Beautifully crafted mala beads made from high-quality crystals",
    brand: "BBJ"
  },
  {
    title: "Mobile Phone Charger USB Cable",
    description: "Fast charging cable for smartphones",
    brand: "TechBrand"
  },
  {
    title: "Bluetooth Wireless Headphones",
    description: "High quality wireless earphones with noise cancellation",
    brand: "AudioTech"
  },
  {
    title: "Kitchen Storage Container Set",
    description: "Airtight containers for kitchen storage",
    brand: "HomeBrand"
  },
  {
    title: "Water Bottle Stainless Steel",
    description: "Insulated water bottle for daily use",
    brand: "HydroBrand"
  }
];

console.log('=== Category Mapping Test Results ===\n');

testProducts.forEach((product, index) => {
  const mapping = intelligentCategoryMapping(product.title, product.description, product.brand);
  console.log(`${index + 1}. ${product.title}`);
  console.log(`   Brand: ${product.brand}`);
  console.log(`   Mapped to: ${mapping.category} > ${mapping.subcategory}`);
  console.log('');
});

console.log('=== Test Complete ===');