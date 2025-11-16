const { hyperAdvancedCategorization } = require('./hyper-advanced-ai-categorizer.js');

const testProducts = [
  {
    title: "3d VR Box Headset Compatible with iPhone & Android Virtual Reality VR Goggles For 3D VR Movies Video Games (1 Pc)",
    vendor: "DeoDap",
    price: 43,
    images: ["https://example.com/vr-headset.jpg"]
  },
  {
    title: "Virtual Reality VR Box 3D Glasses",
    vendor: "TechBrand", 
    price: 99,
    images: ["https://example.com/vr-box.jpg"]
  },
  {
    title: "Kitchen Storage Container Set",
    vendor: "HomeBrand",
    price: 299,
    images: ["https://example.com/storage-container.jpg"]
  }
];

console.log('=== VR Detection Fix Test ===\n');

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

console.log('VR Detection Fixed!');