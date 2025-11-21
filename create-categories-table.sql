-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  subcategories TEXT[] DEFAULT '{}',
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");

-- Insert default categories
INSERT INTO categories (name, slug, subcategories, image, is_active, "order") VALUES
(
  'Fashion',
  'fashion',
  ARRAY[
    '--- MEN''S SECTION ---',
    'Men''s T-Shirts', 'Men''s Shirts', 'Men''s Jeans', 'Men''s Trousers', 'Men''s Shorts',
    'Men''s Jackets', 'Men''s Hoodies', 'Men''s Ethnic Wear', 'Men''s Innerwear', 'Men''s Sleepwear', 'Men''s Shoes',
    '--- WOMEN''S SECTION ---',
    'Women''s Tops', 'Women''s Dresses', 'Women''s Jeans', 'Women''s Trousers', 'Women''s Skirts',
    'Women''s Jackets', 'Women''s Ethnic Wear', 'Women''s Innerwear', 'Women''s Sleepwear', 'Women''s Sarees',
    'Women''s Kurtis', 'Women''s Leggings', 'Women''s Palazzo', 'Women''s Blouses', 'Women''s Shoes',
    '--- KIDS SECTION ---',
    'Kids Boys Clothing', 'Kids Girls Clothing', 'Baby Clothing', 'Kids Footwear', 'Kids Accessories',
    '--- FOOTWEAR & ACCESSORIES ---',
    'Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals', 'Slippers',
    'Bags', 'Wallets', 'Belts', 'Watches', 'Sunglasses', 'Jewelry', 'Hair Accessories',
    'Caps & Hats', 'Scarves', 'Gloves', 'Ties', 'Socks', 'Fashion Accessories'
  ],
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  true,
  1
),
(
  'Tech',
  'tech',
  ARRAY[
    'Wearable Devices', 'Headphones', 'Watches', 'VR Headsets',
    'Computer Accessories', 'Laptop Stands', 'Keyboard & Mouse', 'Speakers',
    'Mobile Accessories', 'Mobile Chargers', 'Mobile Holder & Mobile Stand',
    'Waterproof Mobile Cover', 'Viral Gadget', 'Personal Care Gadgets',
    'Kitchen Gadgets', 'Security Cameras'
  ],
  'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/01_0748acd3-4797-400f-997d-6cecf6b22f5a.webp?updatedAt=1756628128432',
  true,
  4
),
(
  'New Arrivals',
  'new-arrivals',
  ARRAY[
    'Shopwave', 'Just Arrived', 'Best Seller', 'Jewellery', 'Garden & Outdoor',
    'Latest Gadgets', 'Trending Products', 'Clock', 'Corporate Gift',
    'Health & Personal', 'Hair Accessories', 'Car Accessories', 'Gift Items',
    'Fragrance', 'Brand Gellery', 'Beauty Products', 'Travel Accessories',
    'Office Supplies', 'Shopwave Choice Products', 'Baby Products', 'Outdoor Gear'
  ],
  'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20itams%20part%202/02_6d35b019-089f-4949-9571-7a7bd595fccd.webp',
  true,
  6
),
(
  'Home',
  'home',
  ARRAY[
    'Kitchen Storage & Container', 'Water Jugs', 'Kitchen Basket & Bowl',
    'Glassware', 'Spice Rack & Box', 'Lunch Box & Tiffin', 'Ice Cube Trays',
    'Storage Baskets', 'Water Bottles', 'Baking Tools', 'Silicone Moulds',
    'Oven Accessories', 'Kitchen Appliances', 'Blender', 'Pressure Cooker',
    'Mixer/Griender', 'Fry Pan', 'Sandwich Maker', 'Kettle', 'Kitchen Tools',
    'Chopping Board', 'Roasting Pans', 'Kitchen Tongs', 'Strainers', 'Whisks',
    'Knives', 'Knife Sharpener', 'Choppers & Slicers', 'Spoons', 'Plates', 'Oil Dispenser'
  ],
  'https://Shopwave.b-cdn.net/new%20arival/17865..1.webp',
  true,
  7
),
(
  'Customizable',
  'customizable',
  ARRAY[
    'Drinkware', 'Kitchen Items', 'Gift Hampers', 'Accessories', 'Jewelry',
    'Personalized Gifts', 'Custom Prints', 'Photo Products', 'Mugs & Bottles',
    'T-Shirts', 'Keychains', 'Phone Cases', 'Notebooks', 'Calendars',
    'Photo Frames', 'Cushions', 'Bags & Pouches', 'Stickers', 'Magnets', 'Badges'
  ],
  'https://Shopwave.b-cdn.net/Custom%20Print%20Products/6_6cbab775-d2f1-40aa-b598-5fe7c1943372.webp',
  true,
  8
)
ON CONFLICT (name) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at_trigger
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_categories_updated_at();