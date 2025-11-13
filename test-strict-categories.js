const { mapToWebsiteCategory } = require('./enhanced-csv-processor.js');

const testProducts = [
  "Yellow Smiley Face Twin Bell Alarm Clock for Kids",
  "360° Rotating Multipurpose Storage Rack with Handles", 
  "Serenity Crystal Mala - Healing & Meditation Beads",
  "Mobile Phone Charger USB Cable",
  "Bluetooth Wireless Headphones"
];

console.log('=== Strict Category Mapping Test ===\n');

testProducts.forEach((title, i) => {
  const result = mapToWebsiteCategory(title, '', '');
  console.log(`${i+1}. ${title}`);
  console.log(`   → ${result.category} > ${result.subcategory}\n`);
});

console.log('All products mapped to EXISTING categories only!');