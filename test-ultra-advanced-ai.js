const { mapToWebsiteCategory } = require('./enhanced-csv-processor.js');

const testProducts = [
  "Timeless Elegance Women's Necklace",
  "Samsung Galaxy Mobile Back Cover",
  "iPhone Fast Charging Cable USB",
  "Sony Wireless Bluetooth Headphones",
  "Men's Cotton Casual T-Shirt",
  "Women's Designer Kurti",
  "Kids Baby Clothing Set",
  "Kitchen Storage Container Set",
  "Stainless Steel Water Bottle",
  "Non-Stick Frying Pan",
  "Face Moisturizer Cream",
  "Hair Shampoo Conditioner",
  "Custom Photo Printed Mug",
  "Personalized Gift T-Shirt",
  "Notebook Pen Set Stationery",
  "Fitness Gym Equipment",
  "Baby Toy Rattle",
  "Car Dashboard Mount",
  "Organic Fertilizer Agriculture",
  "Digital Alarm Clock",
  "Gift Decoration Items"
];

console.log('=== Ultra Advanced AI Category Test ===\n');

testProducts.forEach((title, i) => {
  const result = mapToWebsiteCategory(title, '', '');
  console.log(`${i+1}. ${title}`);
  console.log(`   → ${result.category} > ${result.subcategory}\n`);
});

console.log('Ultra Advanced AI categorization complete!');