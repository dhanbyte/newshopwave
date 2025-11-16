// Hyper Advanced AI Categorizer - Amazon/Deodap Level Intelligence
// Cross-checks with image metadata, brand intelligence, and market data

const BRAND_INTELLIGENCE = {
  // Electronics Brands
  'samsung': { category: 'Electronics', subcategory: 'Mobile Accessories' },
  'apple': { category: 'Electronics', subcategory: 'Mobile Accessories' },
  'sony': { category: 'Electronics', subcategory: 'Audio & Video' },
  'jbl': { category: 'Electronics', subcategory: 'Audio & Video' },
  'boat': { category: 'Electronics', subcategory: 'Audio & Video' },
  'realme': { category: 'Electronics', subcategory: 'Mobile Accessories' },
  'xiaomi': { category: 'Electronics', subcategory: 'Mobile Accessories' },
  
  // Fashion Brands
  'nike': { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' },
  'adidas': { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' },
  'puma': { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' },
  
  // Beauty Brands
  'lakme': { category: 'Health & Beauty Accessories', subcategory: 'Makeup' },
  'loreal': { category: 'Health & Beauty Accessories', subcategory: 'Hair Care' },
  'nivea': { category: 'Health & Beauty Accessories', subcategory: 'Skincare' },
  
  // Kitchen Brands
  'prestige': { category: 'Home & Kitchen', subcategory: 'Kitchen Appliances' },
  'hawkins': { category: 'Home & Kitchen', subcategory: 'Kitchen Appliances' },
  'milton': { category: 'Home & Kitchen', subcategory: 'Storage Containers' }
};

const PRICE_INTELLIGENCE = {
  // Price-based category hints
  jewelry: { min: 50, max: 5000 },
  electronics: { min: 100, max: 50000 },
  clothing: { min: 200, max: 3000 },
  kitchen: { min: 50, max: 10000 },
  beauty: { min: 100, max: 2000 }
};

const IMAGE_PATTERN_DETECTION = {
  // Common image URL patterns from major e-commerce sites
  jewelry: ['jewelry', 'jewellery', 'necklace', 'earring', 'ring', 'bracelet', 'pendant'],
  electronics: ['mobile', 'phone', 'headphone', 'charger', 'cable', 'speaker', 'earphone'],
  clothing: ['shirt', 'dress', 'kurti', 'saree', 'jeans', 'trouser', 'top'],
  kitchen: ['kitchen', 'utensil', 'cookware', 'bottle', 'container', 'pan', 'spoon'],
  beauty: ['cream', 'shampoo', 'makeup', 'lipstick', 'perfume', 'serum']
};

function analyzeImageMetadata(images) {
  if (!images || images.length === 0) return null;
  
  const imageAnalysis = {
    jewelry: 0,
    electronics: 0,
    clothing: 0,
    kitchen: 0,
    beauty: 0
  };
  
  images.forEach(imageUrl => {
    const url = imageUrl.toLowerCase();
    
    Object.keys(IMAGE_PATTERN_DETECTION).forEach(category => {
      IMAGE_PATTERN_DETECTION[category].forEach(pattern => {
        if (url.includes(pattern)) {
          imageAnalysis[category]++;
        }
      });
    });
  });
  
  // Return category with highest score
  const maxCategory = Object.keys(imageAnalysis).reduce((a, b) => 
    imageAnalysis[a] > imageAnalysis[b] ? a : b
  );
  
  return imageAnalysis[maxCategory] > 0 ? maxCategory : null;
}

function getBrandIntelligence(title, vendor) {
  const text = `${title} ${vendor}`.toLowerCase();
  
  for (const [brand, categoryInfo] of Object.entries(BRAND_INTELLIGENCE)) {
    if (text.includes(brand)) {
      return categoryInfo;
    }
  }
  return null;
}

function validatePriceCategory(category, price) {
  if (!price || price <= 0) return true;
  
  const priceRanges = {
    'Jewellery': PRICE_INTELLIGENCE.jewelry,
    'Electronics': PRICE_INTELLIGENCE.electronics,
    'Clothing & Accessories': PRICE_INTELLIGENCE.clothing,
    'Home & Kitchen': PRICE_INTELLIGENCE.kitchen,
    'Health & Beauty Accessories': PRICE_INTELLIGENCE.beauty
  };
  
  const range = priceRanges[category];
  if (!range) return true;
  
  return price >= range.min && price <= range.max;
}

const { getProperSubcategory } = require('./complete-subcategory-mapper.js');

function hyperAdvancedCategorization(title, description, vendor, price, images) {
  const text = `${title} ${description}`.toLowerCase();
  const titleOnly = title.toLowerCase();
  
  // STEP 1: Brand Intelligence Check
  const brandHint = getBrandIntelligence(title, vendor);
  
  // STEP 2: Image Metadata Analysis
  const imageHint = analyzeImageMetadata(images);
  
  // STEP 3: Advanced Pattern Matching with Cross-Validation
  
  // ULTRA PRIORITY: All Electronics (HIGHEST PRIORITY)
  if (text.match(/electronic|gadget|device|tech|digital|smart/) || 
      text.match(/vr.*box|vr.*headset|vr.*goggles|virtual.*reality|3d.*vr/) ||
      text.match(/headphone|earphone|earbud|headset|speaker|audio/) ||
      text.match(/camera|webcam|security.*cam|cctv/) ||
      text.match(/smart.*watch|fitness.*band|wearable|activity.*tracker/) ||
      text.match(/bluetooth|wireless/) && !text.match(/mobile.*charger|phone.*charger/) ||
      (brandHint && brandHint.category === 'Electronics')) {
    
    // VR Devices
    if (text.match(/vr.*box|vr.*headset|vr.*goggles|virtual.*reality|3d.*vr/)) {
      return { category: 'Electronics', subcategory: 'Gaming' };
    }
    
    // Audio Devices
    if (text.match(/headphone|earphone|earbud|headset|speaker|audio/)) {
      return { category: 'Electronics', subcategory: 'Audio & Video' };
    }
    
    // Cameras
    if (text.match(/camera|webcam|security.*cam|cctv/)) {
      return { category: 'Electronics', subcategory: 'Cameras' };
    }
    
    // Wearables
    if (text.match(/smart.*watch|fitness.*band|wearable|activity.*tracker/)) {
      return { category: 'Electronics', subcategory: 'Wearables' };
    }
    
    // Default Electronics
    return { category: 'Electronics', subcategory: 'Smart Devices' };
  }
  
  // ULTRA PRIORITY: Mobile Covers (High Confidence)
  if (text.match(/mobile.*cover|phone.*cover|mobile.*case|phone.*case|back.*cover|flip.*cover|protective.*cover|mobile.*pouch/)) {
    const result = { category: 'Mobile Covers', subcategory: 'Phone Cases' };
    if (validatePriceCategory('Electronics', price)) return result;
  }
  
  // ULTRA PRIORITY: Mobile Accessories (High Confidence)
  if (text.match(/mobile.*charger|phone.*charger|charging.*cable|usb.*cable|power.*bank|mobile.*stand|phone.*holder|data.*cable/)) {
    const result = { category: 'Mobile Accessories', subcategory: 'Chargers' };
    if (validatePriceCategory('Electronics', price)) return result;
  }
  
  // Mobile Accessories - Separate from Electronics
  if (text.match(/mobile.*charger|phone.*charger|charging.*cable|usb.*cable|power.*bank/) && 
      text.match(/mobile|phone|smartphone/)) {
    return { category: 'Mobile Accessories', subcategory: 'Chargers' };
  }
  
  // PRIORITY 2: Jewelry with Image Cross-Check
  if (text.match(/jewelry|jewellery|necklace|earring|bracelet|ring|pendant|chain|ornament/) && 
      !text.match(/storage|rack|clock|alarm|timer/) ||
      (imageHint === 'jewelry')) {
    
    // Specific jewelry types
    if (text.match(/women.*jewelry|women.*jewellery|women.*necklace|ladies.*jewelry/)) {
      return { category: 'Jewellery', subcategory: 'Necklaces' };
    }
    if (text.match(/necklace|pendant|chain/) && !text.match(/storage|rack/)) {
      return { category: 'Jewellery', subcategory: 'Necklaces' };
    }
    if (text.match(/earring|ear.*ring/) && !text.match(/storage|rack/)) {
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
    
    return { category: 'Jewellery', subcategory: 'Fashion Jewelry' };
  }
  
  // PRIORITY 3: Clothing with Gender Detection
  if (text.match(/cloth|dress|shirt|t-shirt|kurti|kurta|saree|jeans|trouser|top|bottom/) ||
      (imageHint === 'clothing')) {
    
    // Men's Clothing
    if (text.match(/men|male|boy|gents/) && text.match(/shirt|t-shirt|jeans|trouser/)) {
      return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
    }
    
    // Women's Clothing
    if (text.match(/women|ladies|female|girl/) && text.match(/dress|top|kurti|kurta|saree|jeans/)) {
      return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    }
    if (text.match(/saree|sari|lehenga|salwar|kurti|kurta/)) {
      return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    }
    
    // Kids Clothing
    if (text.match(/kids|children|baby|infant/) && text.match(/cloth|dress|shirt/)) {
      return { category: 'Clothing & Accessories', subcategory: 'Kids Clothing' };
    }
    
    // Fashion Accessories
    if (text.match(/bag|wallet|belt|cap|hat|scarf|glove|tie|sock|shoe/) && !text.match(/storage|kitchen/)) {
      return { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' };
    }
    
    return { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' };
  }
  
  // PRIORITY 4: Home & Kitchen with Brand Intelligence
  if (text.match(/kitchen|cooking|utensil|home|house/) || 
      (brandHint && brandHint.category === 'Home & Kitchen') ||
      (imageHint === 'kitchen')) {
    
    // Storage Solutions
    if (text.match(/storage.*rack|storage.*organizer|multipurpose.*storage|rotating.*rack|shelf.*organizer/) && !text.match(/jewelry|jewellery/)) {
      return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
    }
    
    // Kitchen Appliances
    if (text.match(/blender|mixer|grinder|juicer|food.*processor|pressure.*cooker|rice.*cooker|electric.*cooker/)) {
      return { category: 'Home & Kitchen', subcategory: 'Kitchen Appliances' };
    }
    
    // Cookware
    if (text.match(/fry.*pan|frying.*pan|non.*stick.*pan|kadai|tawa|pot|vessel/)) {
      return { category: 'Home & Kitchen', subcategory: 'Cookware' };
    }
    
    // Storage Containers
    if (text.match(/lunch.*box|tiffin|food.*container|storage.*container|airtight.*container|water.*bottle|steel.*bottle/)) {
      return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
    }
    
    // Kitchen Tools
    if (text.match(/spoon|fork|ladle|spatula|tong|whisk|strainer|knife|chopping.*board/)) {
      return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
    }
    
    // Glassware & Dining
    if (text.match(/glass|tumbler|glassware|plate|bowl/) && !text.match(/mug|coffee|tea/)) {
      return { category: 'Home & Kitchen', subcategory: 'Dining' };
    }
    
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  }
  
  // PRIORITY 5: Health & Beauty with Brand Intelligence
  if (text.match(/beauty|cosmetic|skincare|makeup|hair|face|body/) ||
      (brandHint && brandHint.category === 'Health & Beauty Accessories') ||
      (imageHint === 'beauty')) {
    
    if (text.match(/skincare|face.*cream|moisturizer|serum|face.*wash|anti.*aging/)) {
      return { category: 'Health & Beauty Accessories', subcategory: 'Skincare' };
    }
    if (text.match(/shampoo|conditioner|hair.*oil|hair.*serum|hair.*mask|hair.*care/)) {
      return { category: 'Health & Beauty Accessories', subcategory: 'Hair Care' };
    }
    if (text.match(/makeup|lipstick|foundation|mascara|eyeliner|kajal|compact|powder/)) {
      return { category: 'Health & Beauty Accessories', subcategory: 'Makeup' };
    }
    if (text.match(/perfume|deodorant|body.*spray|fragrance|cologne/)) {
      return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
    }
    
    return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
  }
  
  // PRIORITY 6: Customizable Items
  if (text.match(/custom|personalized|printed|photo/) || 
      text.match(/mug|coffee.*cup|tea.*cup|ceramic.*cup|travel.*mug/)) {
    
    if (text.match(/mug|coffee.*cup|tea.*cup|ceramic.*cup/) && !text.match(/jewelry|jewellery/)) {
      return { category: 'Customizable', subcategory: 'Mugs & Bottles' };
    }
    if (text.match(/custom.*print|personalized|photo.*frame|custom.*gift/)) {
      return { category: 'Customizable', subcategory: 'Personalized Gifts' };
    }
    if (text.match(/custom.*t-shirt|printed.*t-shirt|personalized.*t-shirt/)) {
      return { category: 'Customizable', subcategory: 'T-Shirts' };
    }
    
    return { category: 'Customizable', subcategory: 'Personalized Gifts' };
  }
  
  // PRIORITY 7: Specific New Arrivals Categories
  
  // Books & Stationery
  if (text.match(/book|notebook|diary|pen|pencil|marker|highlighter|eraser|stationery/)) {
    return { category: 'New Arrivals', subcategory: 'Office Supplies' };
  }
  
  // Sports & Fitness
  if (text.match(/sports|fitness|gym|exercise|yoga|dumbbell|resistance.*band|workout/)) {
    return { category: 'New Arrivals', subcategory: 'Outdoor Gear' };
  }
  
  // Baby Products
  if (text.match(/baby|infant|newborn|toddler/) && text.match(/toy|bottle|diaper|cloth|care/)) {
    return { category: 'New Arrivals', subcategory: 'Baby Products' };
  }
  
  // Car Accessories
  if (text.match(/car.*accessory|vehicle.*accessory|dashboard|car.*charger|car.*mount|automobile/)) {
    return { category: 'New Arrivals', subcategory: 'Car Accessories' };
  }
  
  // Agriculture & Gardening
  if (text.match(/fertilizer|agriculture|kheti|bio.*fertilizer|soil|organic.*product|plant.*food|garden|farming/)) {
    return { category: 'New Arrivals', subcategory: 'Garden & Outdoor' };
  }
  
  // Clocks & Timers
  if (text.match(/clock|alarm|timer|timepiece|watch/) && !text.match(/jewelry|jewellery|necklace|smart/)) {
    return { category: 'New Arrivals', subcategory: 'Clock' };
  }
  
  // Gift Items
  if (text.match(/gift|present|decoration|decorative/) && !text.match(/jewelry|jewellery|mug|coffee/)) {
    return { category: 'New Arrivals', subcategory: 'Gift Items' };
  }
  
  // FALLBACK with Intelligence
  if (brandHint) return brandHint;
  if (imageHint === 'electronics') return { category: 'Electronics', subcategory: 'Smart Devices' };
  if (imageHint === 'kitchen') return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  if (imageHint === 'beauty') return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
  
  // Smart keyword fallback
  if (text.match(/electronic|gadget|device|tech/)) {
    return { category: 'Electronics', subcategory: 'Smart Devices' };
  }
  
  // Final Default
  return { category: 'New Arrivals', subcategory: 'Just Arrived' };
}

module.exports = {
  hyperAdvancedCategorization,
  BRAND_INTELLIGENCE,
  PRICE_INTELLIGENCE,
  IMAGE_PATTERN_DETECTION
};