// Enhanced CSV Processor with Proper Category Mapping
// Maps products to correct website categories instead of using CSV categories

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

// Hyper Advanced AI with Cross-Platform Intelligence
const { hyperAdvancedCategorization } = require('./hyper-advanced-ai-categorizer.js');

function mapToWebsiteCategory(title, description, csvCategory, vendor, price, images) {
  return hyperAdvancedCategorization(title, description, vendor || '', price || 0, images || []);
}earring|ear.*ring/) && !text.match(/storage|rack/)) {
    return { category: 'Jewellery', subcategory: 'Earrings' };
  }
  if (text.match(/bracelet|bangle|wristband/) && !text.match(/fitness|smart/)) {
    return { category: 'Jewellery', subcategory: 'Bracelets' };
  }
  if (text.match(/\bring\b|finger.*ring/) && !text.match(/storage|rack|organizer|multipurpose/)) {
    return { category: 'Jewellery', subcategory: 'Rings' };
  }
  if (text.match(/mala|beads|crystal.*bead|meditation.*bead|healing.*bead|spiritual.*bead/)) {
    return { category: 'Jewellery', subcategory: 'Bracelets' };
  }
  
  // General Jewelry
  if (text.match(/jewelry|jewellery|ornament/) && !text.match(/storage|rack|clock|alarm|timer/)) {
    return { category: 'Jewellery', subcategory: 'Fashion Jewelry' };
  }
  
  // PRIORITY 3: Clothing & Fashion
  
  // Men's Clothing
  if (text.match(/men.*shirt|male.*shirt|boys.*shirt|gents.*shirt/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
  }
  if (text.match(/men.*t-shirt|male.*t-shirt|boys.*t-shirt|gents.*t-shirt/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
  }
  
  // Women's Clothing
  if (text.match(/women.*dress|ladies.*dress|female.*dress|girls.*dress/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
  }
  if (text.match(/women.*top|ladies.*top|female.*top|kurti|kurta/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
  }
  if (text.match(/saree|sari|lehenga|salwar/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
  }
  
  // Kids Clothing
  if (text.match(/kids.*cloth|children.*cloth|baby.*cloth|infant.*cloth/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Kids Clothing' };
  }
  
  // Fashion Accessories
  if (text.match(/bag|wallet|belt|cap|hat|scarf|glove|tie|sock/) && !text.match(/storage|kitchen/)) {
    return { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' };
  }
  
  // PRIORITY 4: Home & Kitchen
  
  // Storage Solutions
  if (text.match(/storage.*rack|storage.*organizer|multipurpose.*storage|rotating.*rack|shelf.*organizer/) && !text.match(/jewelry|jewellery/)) {
    return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
  }
  
  // Kitchen Appliances
  if (text.match(/blender|mixer|grinder|juicer|food.*processor/)) {
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Appliances' };
  }
  if (text.match(/pressure.*cooker|rice.*cooker|electric.*cooker/)) {
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Appliances' };
  }
  
  // Kitchen Tools & Utensils
  if (text.match(/kitchen.*knife|chopping.*board|cutting.*board/)) {
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  }
  if (text.match(/spoon|fork|ladle|spatula|tong|whisk|strainer/)) {
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  }
  
  // Cookware
  if (text.match(/fry.*pan|frying.*pan|non.*stick.*pan|kadai|tawa/)) {
    return { category: 'Home & Kitchen', subcategory: 'Cookware' };
  }
  
  // Storage Containers
  if (text.match(/lunch.*box|tiffin|food.*container|storage.*container|airtight.*container/)) {
    return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
  }
  
  // Water Bottles & Glassware
  if (text.match(/water.*bottle|steel.*bottle|insulated.*bottle|sipper/)) {
    return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
  }
  if (text.match(/glass|tumbler|glassware/) && !text.match(/mug|coffee|tea/)) {
    return { category: 'Home & Kitchen', subcategory: 'Dining' };
  }
  
  // PRIORITY 5: Health & Beauty
  
  if (text.match(/skincare|face.*cream|moisturizer|serum|face.*wash/)) {
    return { category: 'Health & Beauty Accessories', subcategory: 'Skincare' };
  }
  if (text.match(/shampoo|conditioner|hair.*oil|hair.*serum|hair.*mask/)) {
    return { category: 'Health & Beauty Accessories', subcategory: 'Hair Care' };
  }
  if (text.match(/makeup|lipstick|foundation|mascara|eyeliner|kajal/)) {
    return { category: 'Health & Beauty Accessories', subcategory: 'Makeup' };
  }
  if (text.match(/perfume|deodorant|body.*spray|fragrance/)) {
    return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
  }
  
  // PRIORITY 6: Customizable Items
  
  // Mugs & Drinkware
  if (text.match(/mug|coffee.*cup|tea.*cup|ceramic.*cup|travel.*mug/) && !text.match(/jewelry|jewellery/)) {
    return { category: 'Customizable', subcategory: 'Mugs & Bottles' };
  }
  
  // Custom Prints
  if (text.match(/custom.*print|personalized|photo.*frame|custom.*gift/)) {
    return { category: 'Customizable', subcategory: 'Personalized Gifts' };
  }
  
  // T-Shirts (Customizable)
  if (text.match(/custom.*t-shirt|printed.*t-shirt|personalized.*t-shirt/)) {
    return { category: 'Customizable', subcategory: 'T-Shirts' };
  }
  
  // PRIORITY 7: Specific Categories
  
  // Books & Stationery
  if (text.match(/book|notebook|diary|pen|pencil|marker|highlighter|eraser/)) {
    return { category: 'New Arrivals', subcategory: 'Office Supplies' };
  }
  
  // Sports & Fitness
  if (text.match(/sports|fitness|gym|exercise|yoga|dumbbell|resistance.*band/)) {
    return { category: 'New Arrivals', subcategory: 'Outdoor Gear' };
  }
  
  // Baby Products
  if (text.match(/baby|infant|newborn|toddler/) && text.match(/toy|bottle|diaper|cloth/)) {
    return { category: 'New Arrivals', subcategory: 'Baby Products' };
  }
  
  // Car Accessories
  if (text.match(/car.*accessory|vehicle.*accessory|dashboard|car.*charger|car.*mount/)) {
    return { category: 'New Arrivals', subcategory: 'Car Accessories' };
  }
  
  // Agriculture & Gardening
  if (text.match(/fertilizer|agriculture|kheti|bio.*fertilizer|soil|organic.*product|plant.*food|garden/)) {
    return { category: 'New Arrivals', subcategory: 'Garden & Outdoor' };
  }
  
  // Clocks & Timers
  if (text.match(/clock|alarm|timer|timepiece/) && !text.match(/jewelry|jewellery|necklace/)) {
    return { category: 'New Arrivals', subcategory: 'Clock' };
  }
  
  // Gift Items
  if (text.match(/gift|present|decoration|decorative/) && !text.match(/jewelry|jewellery|mug|coffee/)) {
    return { category: 'New Arrivals', subcategory: 'Gift Items' };
  }
  
  // FALLBACK: Smart Default Based on Keywords
  if (text.match(/kitchen|cooking|utensil/)) {
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  }
  if (text.match(/beauty|cosmetic/)) {
    return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
  }
  if (text.match(/electronic|gadget|device/)) {
    return { category: 'Electronics', subcategory: 'Smart Devices' };
  }
  
  // Final Default
  return { category: 'New Arrivals', subcategory: 'Just Arrived' };
}

// Enhanced product processing with proper categorization
function processProductsWithProperCategories(csvData, logger) {
  logger('[ENHANCED] Starting enhanced category mapping...');
  
  const processedProducts = csvData.map((product, index) => {
    const title = product.Title || '';
    const description = product['Body (HTML)'] || '';
    const csvCategory = product.Type || '';
    
    // Map to proper website category with advanced intelligence
    const categoryMapping = mapToWebsiteCategory(title, description, csvCategory, product.Vendor, parseFloat(product['Variant Price'] || 0), images);
    
    // Extract and validate images
    const images = [];
    Object.keys(product).forEach(key => {
      if (key.includes('Image Src') && product[key] && product[key].trim()) {
        images.push(product[key].trim());
      }
    });
    
    // Validate and clean weight
    let weight = product['Variant Grams'] || 0;
    if (typeof weight === 'string') {
      weight = parseInt(weight.replace(/[^0-9]/g, '')) || 0;
    }
    
    // Validate prices
    const price = parseFloat(product['Variant Price']) || 0;
    const comparePrice = parseFloat(product['Variant Compare At Price']) || 0;
    
    const processedProduct = {
      Handle: product.Handle || `product-${index}`,
      Title: title,
      'Body (HTML)': description,
      Vendor: product.Vendor || 'BBJ',
      Type: categoryMapping.category,
      Subcategory: categoryMapping.subcategory,
      'Variant Price': price,
      'Variant Compare At Price': comparePrice > price ? comparePrice : '',
      'Variant Grams': weight,
      Published: 'TRUE',
      Images: images,
      ImageCount: images.length
    };
    
    // Add individual image columns
    images.forEach((img, idx) => {
      processedProduct[`Image Src ${idx + 1}`] = img;
    });
    
    logger(`[HYPER_AI] ${title} -> ${categoryMapping.category}/${categoryMapping.subcategory}`);
    
    // Log intelligence used
    if (product.Vendor && product.Vendor !== 'BBJ') {
      logger(`[BRAND_AI] Brand: ${product.Vendor}`);
    }
    if (images.length > 0) {
      logger(`[IMAGE_AI] Images: ${images.length}`);
    }
    
    return processedProduct;
  });
  
  logger(`[ENHANCED] Processed ${processedProducts.length} products with proper categories`);
  return processedProducts;
}

module.exports = {
  WEBSITE_CATEGORIES,
  mapToWebsiteCategory,
  processProductsWithProperCategories
};