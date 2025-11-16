// Comprehensive Category Mapping based on fix-categories.sql
const COMPREHENSIVE_CATEGORIES = {
  'Baby Products': ['Baby Care', 'Baby Toys', 'Baby Clothing'],
  'Bags, Wallets and Luggage': ['Handbags', 'Wallets', 'Travel Bags', 'Backpacks', 'Luggage'],
  'Car & Motorbike': ['Car Accessories', 'Bike Accessories', 'Car Care', 'Bike Care'],
  'Car Accessories': ['Interior Accessories', 'Exterior Accessories', 'Car Electronics', 'Car Care Products'],
  'Chocolate': ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate', 'Gift Chocolates'],
  'Clothing & Accessories': ['Men Clothing', 'Women Clothing', 'Kids Clothing', 'Fashion Accessories'],
  'Computers & Accessories': ['Laptops', 'Desktop Computers', 'Computer Accessories', 'Storage Devices'],
  'Electronics': ['Mobile Accessories', 'Audio & Video', 'Cameras', 'Gaming', 'Smart Devices', 'Wearables'],
  'Garden & Outdoors': ['Gardening Tools', 'Plants & Seeds', 'Outdoor Furniture', 'Garden Decor'],
  'Gift': ['Gift Cards', 'Gift Boxes', 'Personalized Gifts', 'Corporate Gifts', 'Occasion Gifts'],
  'Gift Boxes': ['Wedding Gift Boxes', 'Birthday Gift Boxes', 'Festival Gift Boxes', 'Corporate Gift Boxes'],
  'Gift Cards': ['Digital Gift Cards', 'Physical Gift Cards', 'Occasion Gift Cards'],
  'Grocery & Gourmet Foods': ['Snacks', 'Beverages', 'Organic Foods', 'Gourmet Items'],
  'Hardware': ['Tools', 'Fasteners', 'Electrical Hardware', 'Plumbing Hardware'],
  'Health & Beauty Accessories': ['Skincare', 'Makeup', 'Hair Care', 'Personal Care', 'Beauty Tools'],
  'Health & Personal Care': ['Vitamins & Supplements', 'Personal Hygiene', 'Medical Supplies', 'Fitness Equipment'],
  'Home': ['Furniture', 'Home Decor', 'Bedding', 'Storage & Organization'],
  'Home & Kitchen': ['Kitchen Appliances', 'Cookware', 'Kitchen Tools', 'Dining', 'Storage Containers'],
  'Home Decor': ['Wall Art', 'Decorative Items', 'Candles', 'Vases', 'Photo Frames'],
  'Home Improvement': ['Tools', 'Hardware', 'Electrical', 'Plumbing', 'Paint & Supplies'],
  'Industrial & Scientific': ['Lab Equipment', 'Industrial Tools', 'Safety Equipment', 'Measuring Instruments'],
  'Jewellery': ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Watches', 'Fashion Jewelry'],
  'Kitchen & Home Appliances': ['Small Appliances', 'Large Appliances', 'Kitchen Gadgets', 'Home Appliances'],
  'Mobile Covers': ['Phone Cases', 'Screen Protectors', 'Mobile Stands', 'Waterproof Covers'],
  'New Arrivals': ['Latest Products', 'Trending Items', 'Just Launched', 'Featured Products'],
  'Office Products': ['Stationery', 'Office Supplies', 'Desk Accessories', 'Filing & Storage'],
  'Other': ['Miscellaneous', 'Uncategorized'],
  'Personal Care': ['Bath & Body', 'Oral Care', 'Hair Care', 'Skin Care', 'Grooming'],
  'Pooja Essentials': ['Idols', 'Incense', 'Diyas', 'Puja Items', 'Religious Books'],
  'Rakhi': ['Traditional Rakhi', 'Designer Rakhi', 'Rakhi Sets', 'Rakhi Gifts'],
  'Sports, Fitness & Outdoors': ['Fitness Equipment', 'Sports Gear', 'Outdoor Activities', 'Athletic Wear'],
  'Stationery': ['Pens & Pencils', 'Notebooks', 'Art Supplies', 'Office Stationery'],
  'Toys & Games': ['Educational Toys', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Electronic Toys'],
  'Travel': ['Travel Accessories', 'Luggage', 'Travel Comfort', 'Travel Electronics'],
  'Mobile Accessories': ['Chargers', 'Cables', 'Power Banks', 'Headphones', 'Mobile Stands']
};

function intelligentCategoryMapping(title, description, brand) {
  const text = `${title} ${description} ${brand}`.toLowerCase();
  
  // Jewelry & Accessories
  if (text.match(/jewelry|jewellery|necklace|earring|ring|bracelet|mala|beads|crystal|pendant|chain|locket/)) {
    if (text.match(/mala|beads|crystal|meditation|healing|spiritual/)) return { category: 'Jewellery', subcategory: 'Bracelets' };
    if (text.match(/necklace|pendant|chain|locket/)) return { category: 'Jewellery', subcategory: 'Necklaces' };
    if (text.match(/earring|ear ring/)) return { category: 'Jewellery', subcategory: 'Earrings' };
    if (text.match(/ring|finger ring/)) return { category: 'Jewellery', subcategory: 'Rings' };
    if (text.match(/watch|wrist watch/)) return { category: 'Jewellery', subcategory: 'Watches' };
    return { category: 'Jewellery', subcategory: 'Fashion Jewelry' };
  }
  
  // Electronics & Mobile
  if (text.match(/mobile|phone|smartphone|iphone|android|samsung|oneplus|xiaomi|realme|oppo|vivo/)) {
    if (text.match(/cover|case|back cover|flip cover|protective/)) return { category: 'Mobile Covers', subcategory: 'Phone Cases' };
    if (text.match(/screen guard|tempered glass|protector/)) return { category: 'Mobile Covers', subcategory: 'Screen Protectors' };
    if (text.match(/stand|holder|mount/)) return { category: 'Mobile Accessories', subcategory: 'Mobile Stands' };
    if (text.match(/charger|charging|cable|usb/)) return { category: 'Mobile Accessories', subcategory: 'Chargers' };
    if (text.match(/power bank|powerbank|battery/)) return { category: 'Mobile Accessories', subcategory: 'Power Banks' };
    if (text.match(/headphone|earphone|earbud|headset/)) return { category: 'Mobile Accessories', subcategory: 'Headphones' };
    return { category: 'Mobile Accessories', subcategory: 'Mobile Stands' };
  }
  
  // Electronics General
  if (text.match(/electronic|gadget|device|tech|bluetooth|wireless|smart/)) {
    if (text.match(/headphone|earphone|speaker|audio/)) return { category: 'Electronics', subcategory: 'Audio & Video' };
    if (text.match(/watch|smartwatch|fitness band/)) return { category: 'Electronics', subcategory: 'Wearables' };
    if (text.match(/camera|webcam|security cam/)) return { category: 'Electronics', subcategory: 'Cameras' };
    if (text.match(/gaming|game|controller/)) return { category: 'Electronics', subcategory: 'Gaming' };
    return { category: 'Electronics', subcategory: 'Smart Devices' };
  }
  
  // Storage & Organization - Check first to prevent misclassification
  if (text.match(/storage|rack|organizer|shelf|basket|holder|stand|rotating|multipurpose|organiser/)) {
    return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
  }
  
  // Home & Kitchen
  if (text.match(/kitchen|cooking|utensil|cookware|appliance|home|house/)) {
    if (text.match(/bottle|water bottle|sipper|flask/)) return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
    if (text.match(/container|storage|box|jar|canister/)) return { category: 'Home & Kitchen', subcategory: 'Storage Containers' };
    if (text.match(/glass|glassware|tumbler|mug|cup/)) return { category: 'Home & Kitchen', subcategory: 'Dining' };
    if (text.match(/spoon|fork|knife|cutlery|utensil/)) return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
    if (text.match(/plate|dish|bowl|serving/)) return { category: 'Home & Kitchen', subcategory: 'Dining' };
    if (text.match(/blender|mixer|grinder|juicer/)) return { category: 'Kitchen & Home Appliances', subcategory: 'Small Appliances' };
    if (text.match(/pan|pot|kadai|tawa|cookware/)) return { category: 'Home & Kitchen', subcategory: 'Cookware' };
    if (text.match(/appliance|electric|machine/)) return { category: 'Kitchen & Home Appliances', subcategory: 'Kitchen Gadgets' };
    return { category: 'Home & Kitchen', subcategory: 'Kitchen Tools' };
  }
  
  // Fashion & Clothing
  if (text.match(/fashion|clothing|wear|dress|shirt|pant|jean|trouser|jacket|hoodie|kurta|saree|legging/)) {
    if (text.match(/men|male|boy|gents/) && text.match(/shirt/)) return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
    if (text.match(/men|male|boy|gents/) && text.match(/t-shirt|tshirt/)) return { category: 'Clothing & Accessories', subcategory: 'Men Clothing' };
    if (text.match(/women|female|girl|ladies|woman/) && text.match(/dress|frock/)) return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    if (text.match(/women|female|girl|ladies|woman/) && text.match(/kurta|kurti|top/)) return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    if (text.match(/saree|sari/)) return { category: 'Clothing & Accessories', subcategory: 'Women Clothing' };
    if (text.match(/kids|child|baby|infant/)) return { category: 'Clothing & Accessories', subcategory: 'Kids Clothing' };
    return { category: 'Clothing & Accessories', subcategory: 'Fashion Accessories' };
  }
  
  // Beauty & Personal Care
  if (text.match(/beauty|cosmetic|makeup|skincare|hair|personal care|grooming/)) {
    if (text.match(/hair|shampoo|conditioner|oil|serum/)) return { category: 'Health & Beauty Accessories', subcategory: 'Hair Care' };
    if (text.match(/skin|face|cream|lotion|moisturizer/)) return { category: 'Health & Beauty Accessories', subcategory: 'Skincare' };
    if (text.match(/makeup|lipstick|foundation|mascara/)) return { category: 'Health & Beauty Accessories', subcategory: 'Makeup' };
    return { category: 'Health & Beauty Accessories', subcategory: 'Personal Care' };
  }
  
  // Health & Fitness
  if (text.match(/health|fitness|exercise|gym|yoga|sport|medical/)) {
    if (text.match(/vitamin|supplement|protein|medicine/)) return { category: 'Health & Personal Care', subcategory: 'Vitamins & Supplements' };
    if (text.match(/fitness|exercise|gym|workout/)) return { category: 'Health & Personal Care', subcategory: 'Fitness Equipment' };
    return { category: 'Health & Personal Care', subcategory: 'Medical Supplies' };
  }
  
  // Baby Products
  if (text.match(/baby|infant|newborn|toddler|child|kid/)) {
    if (text.match(/toy|play|game/)) return { category: 'Baby Products', subcategory: 'Baby Toys' };
    if (text.match(/cloth|dress|wear/)) return { category: 'Baby Products', subcategory: 'Baby Clothing' };
    return { category: 'Baby Products', subcategory: 'Baby Care' };
  }
  
  // Car & Automotive
  if (text.match(/car|auto|vehicle|bike|motorcycle|automotive/)) {
    if (text.match(/interior|seat|dashboard/)) return { category: 'Car Accessories', subcategory: 'Interior Accessories' };
    if (text.match(/exterior|bumper|light/)) return { category: 'Car Accessories', subcategory: 'Exterior Accessories' };
    return { category: 'Car & Motorbike', subcategory: 'Car Accessories' };
  }
  
  // Toys & Games
  if (text.match(/toy|game|play|puzzle|doll|action figure/)) {
    if (text.match(/educational|learning|study/)) return { category: 'Toys & Games', subcategory: 'Educational Toys' };
    if (text.match(/action figure|superhero/)) return { category: 'Toys & Games', subcategory: 'Action Figures' };
    if (text.match(/board game|card game/)) return { category: 'Toys & Games', subcategory: 'Board Games' };
    return { category: 'Toys & Games', subcategory: 'Educational Toys' };
  }
  
  // Office & Stationery
  if (text.match(/office|stationery|pen|pencil|notebook|paper|file/)) {
    if (text.match(/pen|pencil|marker|highlighter/)) return { category: 'Stationery', subcategory: 'Pens & Pencils' };
    if (text.match(/notebook|diary|journal|book/)) return { category: 'Stationery', subcategory: 'Notebooks' };
    return { category: 'Office Products', subcategory: 'Office Supplies' };
  }
  
  // Gift Items
  if (text.match(/gift|present|hamper|combo|set/)) {
    if (text.match(/box|hamper|basket/)) return { category: 'Gift Boxes', subcategory: 'Corporate Gift Boxes' };
    if (text.match(/card|voucher/)) return { category: 'Gift Cards', subcategory: 'Physical Gift Cards' };
    return { category: 'Gift', subcategory: 'Personalized Gifts' };
  }
  
  // Religious & Spiritual
  if (text.match(/pooja|puja|religious|spiritual|god|temple|prayer|worship/)) {
    if (text.match(/idol|statue|murti/)) return { category: 'Pooja Essentials', subcategory: 'Idols' };
    if (text.match(/incense|agarbatti|dhoop/)) return { category: 'Pooja Essentials', subcategory: 'Incense' };
    if (text.match(/diya|lamp|light/)) return { category: 'Pooja Essentials', subcategory: 'Diyas' };
    return { category: 'Pooja Essentials', subcategory: 'Puja Items' };
  }
  
  // Default fallback
  return { category: 'New Arrivals', subcategory: 'Latest Products' };
}

module.exports = {
  COMPREHENSIVE_CATEGORIES,
  intelligentCategoryMapping
};