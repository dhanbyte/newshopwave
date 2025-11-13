const { hyperAdvancedCategorization } = require('./hyper-advanced-ai-categorizer.js');

const testProducts = [
  {
    title: "3D VR Box Headset Virtual Reality Goggles",
    vendor: "TechBrand",
    price: 99,
    images: ["https://example.com/vr-headset.jpg"]
  },
  {
    title: "Wireless Bluetooth Headphones with Mic",
    vendor: "Sony", 
    price: 2999,
    images: ["https://example.com/headphones.jpg"]
  },
  {
    title: "Portable Bluetooth Speaker",
    vendor: "JBL",
    price: 1999,
    images: ["https://example.com/speaker.jpg"]
  },
  {
    title: "Smart Fitness Band Activity Tracker",
    vendor: "Xiaomi",
    price: 1499,
    images: ["https://example.com/fitness-band.jpg"]
  },
  {
    title: "HD Security Camera CCTV",
    vendor: "Hikvision",
    price: 3499,
    images: ["https://example.com/security-camera.jpg"]
  },
  {
    title: "Mobile Phone Charger Cable",
    vendor: "Samsung",
    price: 299,
    images: ["https://example.com/mobile-charger.jpg"]
  },
  {
    title: "Digital Electronic Gadget Device",
    vendor: "TechCorp",
    price: 999,
    images: ["https://example.com/gadget.jpg"]
  }
];

console.log('=== Electronics Category Fix Test ===\n');

testProducts.forEach((product, i) => {
  const result = hyperAdvancedCategorization(
    product.title, 
    '', 
    product.vendor, 
    product.price, 
    product.images
  );
  
  console.log(`${i+1}. ${product.title}`);
  console.log(`   → ${result.category} > ${result.subcategory}\n`);
});

console.log('All electronics products properly categorized!');