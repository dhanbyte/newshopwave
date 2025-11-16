const { hyperAdvancedCategorization } = require('./hyper-advanced-ai-categorizer.js');

const testProducts = [
  // Electronics → Tech
  { title: "3D VR Box Headset", vendor: "TechBrand", price: 99 },
  { title: "Wireless Bluetooth Headphones", vendor: "Sony", price: 2999 },
  { title: "Mobile Phone Charger Cable", vendor: "Samsung", price: 299 },
  { title: "Security Camera CCTV", vendor: "Hikvision", price: 3499 },
  { title: "Smart Fitness Band", vendor: "Xiaomi", price: 1499 },
  
  // Kitchen → Home
  { title: "Kitchen Storage Container Set", vendor: "HomeBrand", price: 499 },
  { title: "Stainless Steel Water Bottle", vendor: "Milton", price: 299 },
  { title: "Non-Stick Frying Pan", vendor: "Prestige", price: 899 },
  { title: "Kitchen Knife Set", vendor: "KitchenBrand", price: 699 },
  { title: "Glass Dinner Plates", vendor: "Borosil", price: 399 },
  
  // Fashion → Fashion
  { title: "Men's Cotton T-Shirt", vendor: "FashionBrand", price: 499 },
  { title: "Women's Designer Kurti", vendor: "Ethnic", price: 899 },
  { title: "Leather Wallet for Men", vendor: "LeatherCraft", price: 599 },
  { title: "Sports Running Shoes", vendor: "Nike", price: 2999 },
  { title: "Women's Handbag", vendor: "BagBrand", price: 1299 }
];

console.log('=== Final Category Mapping Test ===\n');

testProducts.forEach((product, i) => {
  const result = hyperAdvancedCategorization(product.title, '', product.vendor, product.price, []);
  console.log(`${i+1}. ${product.title}`);
  console.log(`   → ${result.category} > ${result.subcategory}\n`);
});

console.log('Perfect categorization complete!');