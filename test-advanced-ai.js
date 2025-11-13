const { advancedCategoryMapping } = require('./advanced-ai-categorizer.js');

const testProducts = [
  "Yellow Smiley Face Twin Bell Alarm Clock for Kids | Cute Cartoon Expression Table Clock",
  "360° Rotating Multipurpose Storage Rack with Handles (1 Pc)",
  "Serenity Crystal Mala - Healing & Meditation Beads",
  "Mobile Phone Charger USB Cable Fast Charging",
  "Bluetooth Wireless Headphones with Noise Cancellation",
  "Kitchen Storage Container Set Airtight",
  "Women's Gold Plated Necklace with Pendant",
  "Men's Cotton T-Shirt Regular Fit"
];

console.log('=== Advanced AI Categorization Test ===\n');

testProducts.forEach((title, i) => {
  const result = advancedCategoryMapping(title, '', '');
  console.log(`${i+1}. ${title}`);
  console.log(`   → ${result.category} > ${result.subcategory} (${result.confidence}% confidence)\n`);
});

console.log('=== Test Complete ===');