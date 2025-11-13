// Complete Subcategory Mapping - All 137 Subcategories Properly Set

const COMPLETE_SUBCATEGORY_MAPPING = {
  // Tech Category (16 subcategories)
  'Tech': {
    'VR Headsets': ['vr.*box', 'vr.*headset', 'virtual.*reality', '3d.*vr', 'vr.*goggles'],
    'Headphones': ['headphone', 'earphone', 'earbud', 'headset', 'wireless.*earphone', 'bluetooth.*headphone'],
    'Speakers': ['speaker', 'bluetooth.*speaker', 'wireless.*speaker', 'portable.*speaker'],
    'Watches': ['smart.*watch', 'fitness.*watch', 'digital.*watch', 'wearable.*watch'],
    'Computer Accessories': ['laptop.*stand', 'computer.*accessory', 'pc.*accessory', 'desktop.*accessory'],
    'Keyboard & Mouse': ['keyboard', 'mouse', 'wireless.*keyboard', 'gaming.*keyboard', 'computer.*mouse'],
    'Mobile Chargers': ['mobile.*charger', 'phone.*charger', 'charging.*cable', 'usb.*cable', 'power.*bank'],
    'Mobile Accessories': ['mobile.*stand', 'phone.*holder', 'mobile.*accessory', 'phone.*accessory'],
    'Waterproof Mobile Cover': ['waterproof.*cover', 'water.*resistant.*cover', 'waterproof.*case'],
    'Viral Gadget': ['viral.*gadget', 'trending.*gadget', 'popular.*gadget'],
    'Personal Care Gadgets': ['personal.*care.*gadget', 'grooming.*gadget', 'beauty.*gadget'],
    'Kitchen Gadgets': ['kitchen.*gadget', 'cooking.*gadget', 'smart.*kitchen'],
    'Security Cameras': ['security.*camera', 'cctv', 'surveillance.*camera', 'ip.*camera'],
    'Wearable Devices': ['fitness.*band', 'activity.*tracker', 'wearable.*device', 'smart.*band'],
    'Laptop Stands': ['laptop.*stand', 'notebook.*stand', 'laptop.*holder'],
    'Mobile Holder & Mobile Stand': ['mobile.*holder', 'phone.*stand', 'mobile.*stand', 'phone.*mount']
  },

  // Home Category (31 subcategories)
  'Home': {
    'Kitchen Storage & Container': ['kitchen.*storage', 'kitchen.*container', 'food.*storage', 'kitchen.*organizer'],
    'Storage Baskets': ['storage.*basket', 'storage.*rack', 'organizer.*basket', 'multipurpose.*storage'],
    'Water Bottles': ['water.*bottle', 'steel.*bottle', 'insulated.*bottle', 'sipper', 'drinking.*bottle'],
    'Kitchen Tools': ['kitchen.*tool', 'cooking.*utensil', 'kitchen.*utensil', 'cooking.*tool'],
    'Spoons': ['spoon', 'ladle', 'serving.*spoon', 'table.*spoon', 'tea.*spoon'],
    'Plates': ['plate', 'dinner.*plate', 'serving.*plate', 'dish', 'platter'],
    'Glassware': ['glass', 'tumbler', 'drinking.*glass', 'water.*glass', 'juice.*glass'],
    'Blender': ['blender', 'mixer.*grinder', 'food.*processor', 'smoothie.*maker'],
    'Kitchen Appliances': ['pressure.*cooker', 'rice.*cooker', 'electric.*cooker', 'kitchen.*appliance'],
    'Fry Pan': ['fry.*pan', 'frying.*pan', 'non.*stick.*pan', 'cooking.*pan'],
    'Kettle': ['kettle', 'electric.*kettle', 'tea.*kettle', 'water.*kettle'],
    'Chopping Board': ['chopping.*board', 'cutting.*board', 'kitchen.*board'],
    'Knives': ['knife', 'kitchen.*knife', 'cutting.*knife', 'chef.*knife'],
    'Water Jugs': ['water.*jug', 'pitcher', 'water.*pitcher', 'serving.*jug'],
    'Kitchen Basket & Bowl': ['kitchen.*basket', 'kitchen.*bowl', 'serving.*bowl', 'mixing.*bowl'],
    'Spice Rack & Box': ['spice.*rack', 'spice.*box', 'masala.*box', 'spice.*container'],
    'Lunch Box & Tiffin': ['lunch.*box', 'tiffin', 'food.*container', 'meal.*box'],
    'Ice Cube Trays': ['ice.*cube.*tray', 'ice.*tray', 'ice.*maker'],
    'Baking Tools': ['baking.*tool', 'cake.*mould', 'baking.*tray', 'oven.*tray'],
    'Silicone Moulds': ['silicone.*mould', 'baking.*mould', 'cake.*mould', 'ice.*mould'],
    'Oven Accessories': ['oven.*accessory', 'baking.*accessory', 'oven.*tray'],
    'Pressure Cooker': ['pressure.*cooker', 'cooker', 'steam.*cooker'],
    'Mixer/Griender': ['mixer', 'grinder', 'wet.*grinder', 'spice.*grinder'],
    'Sandwich Maker': ['sandwich.*maker', 'grill', 'panini.*maker'],
    'Roasting Pans': ['roasting.*pan', 'baking.*pan', 'oven.*pan'],
    'Kitchen Tongs': ['tong', 'kitchen.*tong', 'serving.*tong'],
    'Strainers': ['strainer', 'sieve', 'colander', 'filter'],
    'Whisks': ['whisk', 'beater', 'egg.*beater'],
    'Knife Sharpener': ['knife.*sharpener', 'sharpener', 'blade.*sharpener'],
    'Choppers & Slicers': ['chopper', 'slicer', 'vegetable.*chopper', 'onion.*chopper'],
    'Oil Dispenser': ['oil.*dispenser', 'oil.*bottle', 'cooking.*oil.*bottle']
  },

  // Fashion Category (49 subcategories)
  'Fashion': {
    'Jewelry': ['jewelry', 'jewellery', 'necklace', 'earring', 'bracelet', 'ring', 'pendant'],
    'Men\'s T-Shirts': ['men.*t-shirt', 'male.*t-shirt', 'boys.*t-shirt', 'gents.*t-shirt'],
    'Men\'s Shirts': ['men.*shirt', 'male.*shirt', 'boys.*shirt', 'gents.*shirt'],
    'Women\'s Dresses': ['women.*dress', 'ladies.*dress', 'female.*dress', 'girls.*dress'],
    'Women\'s Tops': ['women.*top', 'ladies.*top', 'female.*top', 'girls.*top'],
    'Women\'s Kurtis': ['kurti', 'kurta', 'women.*kurti', 'ladies.*kurti'],
    'Women\'s Sarees': ['saree', 'sari', 'women.*saree', 'ladies.*saree'],
    'Kids Boys Clothing': ['boys.*cloth', 'kids.*boys', 'children.*boys'],
    'Kids Girls Clothing': ['girls.*cloth', 'kids.*girls', 'children.*girls'],
    'Baby Clothing': ['baby.*cloth', 'infant.*cloth', 'newborn.*cloth'],
    'Bags': ['bag', 'handbag', 'shoulder.*bag', 'tote.*bag'],
    'Wallets': ['wallet', 'purse', 'money.*bag'],
    'Belts': ['belt', 'leather.*belt', 'fashion.*belt'],
    'Watches': ['watch', 'wrist.*watch', 'fashion.*watch'],
    'Sunglasses': ['sunglass', 'sun.*glass', 'eyewear'],
    'Hair Accessories': ['hair.*accessory', 'hair.*band', 'hair.*clip'],
    'Caps & Hats': ['cap', 'hat', 'baseball.*cap'],
    'Scarves': ['scarf', 'stole', 'dupatta'],
    'Gloves': ['glove', 'hand.*glove', 'winter.*glove'],
    'Ties': ['tie', 'neck.*tie', 'bow.*tie'],
    'Socks': ['sock', 'ankle.*sock', 'cotton.*sock'],
    'Fashion Accessories': ['fashion.*accessory', 'style.*accessory'],
    'Men\'s Jeans': ['men.*jean', 'male.*jean', 'boys.*jean'],
    'Men\'s Trousers': ['men.*trouser', 'male.*trouser', 'men.*pant'],
    'Men\'s Shorts': ['men.*short', 'male.*short', 'boys.*short'],
    'Men\'s Jackets': ['men.*jacket', 'male.*jacket', 'boys.*jacket'],
    'Men\'s Hoodies': ['men.*hoodie', 'male.*hoodie', 'boys.*hoodie'],
    'Men\'s Ethnic Wear': ['men.*ethnic', 'male.*ethnic', 'kurta.*pajama'],
    'Men\'s Innerwear': ['men.*inner', 'male.*inner', 'underwear'],
    'Men\'s Sleepwear': ['men.*sleep', 'male.*sleep', 'pajama'],
    'Men\'s Shoes': ['men.*shoe', 'male.*shoe', 'boys.*shoe'],
    'Women\'s Jeans': ['women.*jean', 'ladies.*jean', 'female.*jean'],
    'Women\'s Trousers': ['women.*trouser', 'ladies.*trouser', 'women.*pant'],
    'Women\'s Skirts': ['skirt', 'women.*skirt', 'ladies.*skirt'],
    'Women\'s Jackets': ['women.*jacket', 'ladies.*jacket', 'female.*jacket'],
    'Women\'s Ethnic Wear': ['women.*ethnic', 'ladies.*ethnic', 'ethnic.*wear'],
    'Women\'s Innerwear': ['women.*inner', 'ladies.*inner', 'bra'],
    'Women\'s Sleepwear': ['women.*sleep', 'ladies.*sleep', 'night.*dress'],
    'Women\'s Leggings': ['legging', 'women.*legging', 'ladies.*legging'],
    'Women\'s Palazzo': ['palazzo', 'women.*palazzo', 'ladies.*palazzo'],
    'Women\'s Blouses': ['blouse', 'women.*blouse', 'ladies.*blouse'],
    'Women\'s Shoes': ['women.*shoe', 'ladies.*shoe', 'female.*shoe'],
    'Kids Footwear': ['kids.*shoe', 'children.*shoe', 'baby.*shoe'],
    'Kids Accessories': ['kids.*accessory', 'children.*accessory', 'baby.*accessory'],
    'Sports Shoes': ['sports.*shoe', 'running.*shoe', 'athletic.*shoe'],
    'Casual Shoes': ['casual.*shoe', 'everyday.*shoe', 'comfort.*shoe'],
    'Formal Shoes': ['formal.*shoe', 'office.*shoe', 'dress.*shoe'],
    'Sandals': ['sandal', 'flip.*flop', 'slipper'],
    'Slippers': ['slipper', 'house.*slipper', 'bathroom.*slipper']
  },

  // New Arrivals Category (21 subcategories)
  'New Arrivals': {
    'Just Arrived': ['new.*arrival', 'just.*arrived', 'latest.*product'],
    'Best Seller': ['best.*seller', 'top.*selling', 'popular.*product'],
    'Clock': ['clock', 'alarm.*clock', 'wall.*clock', 'table.*clock'],
    'Gift Items': ['gift.*item', 'present', 'gift.*product'],
    'Office Supplies': ['office.*supply', 'stationery', 'pen', 'pencil', 'notebook'],
    'Baby Products': ['baby.*product', 'infant.*product', 'baby.*care'],
    'Car Accessories': ['car.*accessory', 'vehicle.*accessory', 'auto.*accessory'],
    'Garden & Outdoor': ['garden', 'outdoor', 'plant', 'fertilizer', 'agriculture'],
    'Health & Personal': ['health.*product', 'personal.*care', 'wellness'],
    'Hair Accessories': ['hair.*accessory', 'hair.*product'],
    'Fragrance': ['perfume', 'fragrance', 'deodorant', 'body.*spray'],
    'Beauty Products': ['beauty.*product', 'cosmetic', 'makeup'],
    'Travel Accessories': ['travel.*accessory', 'luggage', 'travel.*bag'],
    'Outdoor Gear': ['outdoor.*gear', 'sports.*equipment', 'fitness.*equipment'],
    'Latest Gadgets': ['latest.*gadget', 'new.*gadget', 'tech.*gadget'],
    'Trending Products': ['trending.*product', 'viral.*product', 'popular.*item'],
    'Corporate Gift': ['corporate.*gift', 'business.*gift', 'office.*gift'],
    'Brand Gellery': ['brand.*product', 'branded.*item'],
    'Shopwave Choice Products': ['shopwave.*choice', 'recommended.*product'],
    'Shopwave': ['shopwave.*product', 'exclusive.*product'],
    'Jewellery': ['jewelry.*item', 'jewellery.*product']
  },

  // Customizable Category (20 subcategories)
  'Customizable': {
    'Mugs & Bottles': ['mug', 'coffee.*mug', 'tea.*mug', 'custom.*mug'],
    'Personalized Gifts': ['personalized.*gift', 'custom.*gift', 'photo.*gift'],
    'T-Shirts': ['custom.*t-shirt', 'printed.*t-shirt', 'personalized.*t-shirt'],
    'Photo Products': ['photo.*product', 'photo.*frame', 'photo.*album'],
    'Custom Prints': ['custom.*print', 'personalized.*print', 'photo.*print'],
    'Keychains': ['keychain', 'key.*ring', 'custom.*keychain'],
    'Phone Cases': ['custom.*phone.*case', 'personalized.*cover'],
    'Notebooks': ['custom.*notebook', 'personalized.*diary'],
    'Calendars': ['custom.*calendar', 'personalized.*calendar'],
    'Photo Frames': ['photo.*frame', 'picture.*frame', 'custom.*frame'],
    'Cushions': ['custom.*cushion', 'personalized.*pillow'],
    'Bags & Pouches': ['custom.*bag', 'personalized.*pouch'],
    'Stickers': ['custom.*sticker', 'personalized.*sticker'],
    'Magnets': ['custom.*magnet', 'personalized.*magnet'],
    'Badges': ['custom.*badge', 'personalized.*badge'],
    'Drinkware': ['custom.*drinkware', 'personalized.*bottle'],
    'Kitchen Items': ['custom.*kitchen', 'personalized.*kitchen'],
    'Gift Hampers': ['gift.*hamper', 'custom.*hamper'],
    'Accessories': ['custom.*accessory', 'personalized.*accessory']
  }
};

function getProperSubcategory(category, title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const categoryMap = COMPLETE_SUBCATEGORY_MAPPING[category];
  
  if (!categoryMap) return 'Just Arrived';
  
  // Check each subcategory pattern
  for (const [subcategory, patterns] of Object.entries(categoryMap)) {
    for (const pattern of patterns) {
      if (text.match(new RegExp(pattern, 'i'))) {
        return subcategory;
      }
    }
  }
  
  // Default subcategory for each category
  const defaults = {
    'Tech': 'Computer Accessories',
    'Home': 'Kitchen Tools', 
    'Fashion': 'Fashion Accessories',
    'New Arrivals': 'Just Arrived',
    'Customizable': 'Personalized Gifts'
  };
  
  return defaults[category] || 'Just Arrived';
}

module.exports = {
  COMPLETE_SUBCATEGORY_MAPPING,
  getProperSubcategory
};