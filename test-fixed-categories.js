const { mapToWebsiteCategory } = require('./enhanced-csv-processor.js');

const testProducts = [
  "Timeless Elegance Women's Necklace",
  "AgriVenture KHETI RAKSHAK ( Rhizobium ) Increase Soil Productivity And Fertility Bactericide Organic Product BIO FIRTILIZERS (1Ltr)",
  "Be Mine Mr. Black Ceramic Coffee Mug with Golden Lid and Bow Tie – Romantic Gift for Him, Stylish Tea Cup with Quote",
  "Yellow Smiley Face Twin Bell Alarm Clock for Kids",
  "360° Rotating Multipurpose Storage Rack with Handles"
];

console.log('=== Fixed Category Mapping Test ===\n');
console.log('=== Fixed Category Mapping Test ===\n');

testProducts.forEach((title, i) => {
  const result = mapToWebsiteCategory(title, '', '');
  console.log(`${i+1}. ${title}`);
  console.log(`   → ${result.category} > ${result.subcategory}\n`);
});

console.log('Categories fixed!');