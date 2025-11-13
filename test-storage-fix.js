const { mapToWebsiteCategory } = require('./enhanced-csv-processor.js');

const testProduct = {
  title: "360° Rotating Multipurpose Storage Rack with Handles (1 Pc)",
  description: "Multipurpose storage organizer for home and kitchen",
  brand: "DeoDap"
};

const result = mapToWebsiteCategory(testProduct.title, testProduct.description, '');
console.log(`Product: ${testProduct.title}`);
console.log(`Mapped to: ${result.category} > ${result.subcategory}`);