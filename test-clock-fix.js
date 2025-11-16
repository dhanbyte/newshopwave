const { mapToWebsiteCategory } = require('./enhanced-csv-processor.js');

const testProducts = [
  {
    title: "Yellow Smiley Face Twin Bell Alarm Clock for Kids",
    description: "Cute Cartoon Expression Table Clock | Loud Alarm, Easy-to-Read Numbers, Battery Operated Decorative Desk & Bedside Clock for Home, Study, Bedroom & Gifts"
  },
  {
    title: "360° Rotating Multipurpose Storage Rack with Handles",
    description: "Storage organizer for home"
  },
  {
    title: "Crystal Mala Beads for Healing",
    description: "Meditation beads for spiritual practice"
  }
];

testProducts.forEach((product, i) => {
  const result = mapToWebsiteCategory(product.title, product.description, '');
  console.log(`${i+1}. ${product.title}`);
  console.log(`   Mapped to: ${result.category} > ${result.subcategory}\n`);
});