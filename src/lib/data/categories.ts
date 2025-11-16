// Category और Subcategory mapping - JSON fallback categories
export const CATEGORIES = {
  'Home': [
    'Puja-Essentials',
    'Bathroom-Accessories', 
    'Kitchenware',
    'Household-Appliances',
    'Kitchen Storage & Container',
    'Water Jugs',
    'Kitchen Basket & Bowl',
    'Glassware',
    'Spice Rack & Box',
    'Lunch Box & Tiffin',
    'Ice Cube Trays',
    'Storage Baskets',
    'Water Bottles',
    'Baking Tools',
    'Silicone Moulds',
    'Oven Accessories',
    'Kitchen Appliances',
    'Blender',
    'Pressure Cooker',
    'Mixer/Griender',
    'Fry Pan',
    'Sandwich Maker',
    'Kettle',
    'Kitchen Tools',
    'Chopping Board',
    'Roasting Pans',
    'Kitchen Tongs',
    'Strainers',
    'Whisks',
    'Knives',
    'Knife Sharpener',
    'Choppers & Slicers',
    'Spoons',
    'Plates',
    'Oil Dispenser'
  ],
  'Tech': [
    'Best Selling',
    'Accessories',
    'Decor & Lighting',
    'Audio',
    'Computer Accessories',
    'Kitchen Appliances',
    'Kitchen Tools',
    'Outdoor Lighting',
    'Hair',
    'Wearable Devices',
    'Headphones',
    'Watches',
    'VR Headsets',
    'Laptop Stands',
    'Keyboard & Mouse',
    'Speakers',
    'Mobile Accessories',
    'Mobile Chargers',
    'Mobile Holder & Mobile Stand',
    'Waterproof Mobile Cover',
    'Viral Gadget',
    'Personal Care Gadgets',
    'Kitchen Gadgets',
    'Security Cameras'
  ],
  'New Arrivals': [
    'LED Lights',
    'Best Selling',
    'Gifts',
    'Car Accessories',
    'Home Appliances',
    'Kitchen Appliances',
    'Cleaning Tools',
    'Health & Personal Care',
    'Cables & Chargers',
    'Home Organization',
    'Table Lamps',
    'Photo Frames',
    'Showpieces',
    'Kitchen & Dining',
    'Shopwave',
    'Just Arrived',
    'Best Seller',
    'Jewellery',
    'Garden & Outdoor',
    'Latest Gadgets',
    'Trending Products',
    'Clock',
    'Corporate Gift',
    'Health & Personal',
    'Hair Accessories',
    'Gift Items',
    'Fragrance',
    'Brand Gellery',
    'Beauty Products',
    'Travel Accessories',
    'Office Supplies',
    'Shopwave Choice Products',
    'Baby Products',
    'Outdoor Gear'
  ],
  'Customizable': [
    'Drinkware',
    'Kitchen',
    'Gift Hampers',
    'Accessories',
    'Jewelry',
    'Kitchen Items',
    'Personalized Gifts',
    'Custom Prints',
    'Photo Products',
    'Mugs & Bottles',
    'T-Shirts',
    'Keychains',
    'Phone Cases',
    'Notebooks',
    'Calendars',
    'Photo Frames',
    'Cushions',
    'Bags & Pouches',
    'Stickers',
    'Magnets',
    'Badges'
  ],
  'Fashion': [
    'Men',
    'Women',
    'Kids',
    'Top & Bottom Wear',
    'Dresses',
    'T-Shirts',
    'Jeans',
    'Shoes',
    'Accessories',
    'Jewelry'
  ]
} as const;

export type CategoryType = keyof typeof CATEGORIES;
export type SubcategoryType = typeof CATEGORIES[CategoryType][number];

// Function to get merged categories (database + JSON)
export const getMergedSubcategories = async (categoryName: string): Promise<string[]> => {
  try {
    // Get database categories
    const response = await fetch('/api/categories');
    if (response.ok) {
      const dbCategories = await response.json();
      const dbCategory = dbCategories.find((cat: any) => cat.name === categoryName);
      
      if (dbCategory && dbCategory.subcategories) {
        // Merge database subcategories with JSON subcategories
        const jsonSubcategories = CATEGORIES[categoryName as CategoryType] || [];
        const merged = [...new Set([...dbCategory.subcategories, ...jsonSubcategories])];
        return merged;
      }
    }
  } catch (error) {
    console.log('Database categories not available, using JSON fallback');
  }
  
  // Fallback to JSON categories
  return CATEGORIES[categoryName as CategoryType] || [];
};