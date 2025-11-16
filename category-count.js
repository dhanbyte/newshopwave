// Count Categories and Subcategories

const WEBSITE_CATEGORIES = {
  'Tech': {
    subcategories: [
      'Wearable Devices', 'Headphones', 'Watches', 'VR Headsets',
      'Computer Accessories', 'Laptop Stands', 'Keyboard & Mouse', 'Speakers',
      'Mobile Accessories', 'Mobile Chargers', 'Mobile Holder & Mobile Stand',
      'Waterproof Mobile Cover', 'Viral Gadget', 'Personal Care Gadgets',
      'Kitchen Gadgets', 'Security Cameras'
    ]
  },
  'Home': {
    subcategories: [
      'Kitchen Storage & Container', 'Water Jugs', 'Kitchen Basket & Bowl',
      'Glassware', 'Spice Rack & Box', 'Lunch Box & Tiffin', 'Ice Cube Trays',
      'Storage Baskets', 'Water Bottles', 'Baking Tools', 'Silicone Moulds',
      'Oven Accessories', 'Kitchen Appliances', 'Blender', 'Pressure Cooker',
      'Mixer/Griender', 'Fry Pan', 'Sandwich Maker', 'Kettle', 'Kitchen Tools',
      'Chopping Board', 'Roasting Pans', 'Kitchen Tongs', 'Strainers', 'Whisks',
      'Knives', 'Knife Sharpener', 'Choppers & Slicers', 'Spoons', 'Plates', 'Oil Dispenser'
    ]
  },
  'New Arrivals': {
    subcategories: [
      'Shopwave', 'Just Arrived', 'Best Seller', 'Jewellery', 'Garden & Outdoor',
      'Latest Gadgets', 'Trending Products', 'Clock', 'Corporate Gift',
      'Health & Personal', 'Hair Accessories', 'Car Accessories', 'Gift Items',
      'Fragrance', 'Brand Gellery', 'Beauty Products', 'Travel Accessories',
      'Office Supplies', 'Shopwave Choice Products', 'Baby Products', 'Outdoor Gear'
    ]
  },
  'Customizable': {
    subcategories: [
      'Drinkware', 'Kitchen Items', 'Gift Hampers', 'Accessories', 'Jewelry',
      'Personalized Gifts', 'Custom Prints', 'Photo Products', 'Mugs & Bottles',
      'T-Shirts', 'Keychains', 'Phone Cases', 'Notebooks', 'Calendars',
      'Photo Frames', 'Cushions', 'Bags & Pouches', 'Stickers', 'Magnets', 'Badges'
    ]
  },
  'Fashion': {
    subcategories: [
      'Men\'s T-Shirts', 'Men\'s Shirts', 'Men\'s Jeans', 'Men\'s Trousers', 'Men\'s Shorts',
      'Men\'s Jackets', 'Men\'s Hoodies', 'Men\'s Ethnic Wear', 'Men\'s Innerwear', 'Men\'s Sleepwear', 'Men\'s Shoes',
      'Women\'s Tops', 'Women\'s Dresses', 'Women\'s Jeans', 'Women\'s Trousers', 'Women\'s Skirts',
      'Women\'s Jackets', 'Women\'s Ethnic Wear', 'Women\'s Innerwear', 'Women\'s Sleepwear', 'Women\'s Sarees',
      'Women\'s Kurtis', 'Women\'s Leggings', 'Women\'s Palazzo', 'Women\'s Blouses', 'Women\'s Shoes',
      'Kids Boys Clothing', 'Kids Girls Clothing', 'Baby Clothing', 'Kids Footwear', 'Kids Accessories',
      'Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals', 'Slippers',
      'Bags', 'Wallets', 'Belts', 'Watches', 'Sunglasses', 'Jewelry', 'Hair Accessories',
      'Caps & Hats', 'Scarves', 'Gloves', 'Ties', 'Socks', 'Fashion Accessories'
    ]
  }
};

// Count categories and subcategories
const categories = Object.keys(WEBSITE_CATEGORIES);
let totalSubcategories = 0;

console.log('=== WEBSITE CATEGORIES COUNT ===\n');

categories.forEach((category, index) => {
  const subcategoryCount = WEBSITE_CATEGORIES[category].subcategories.length;
  totalSubcategories += subcategoryCount;
  
  console.log(`${index + 1}. ${category}`);
  console.log(`   Subcategories: ${subcategoryCount}`);
  console.log(`   List: ${WEBSITE_CATEGORIES[category].subcategories.join(', ')}\n`);
});

console.log('=== SUMMARY ===');
console.log(`Total Categories: ${categories.length}`);
console.log(`Total Subcategories: ${totalSubcategories}`);