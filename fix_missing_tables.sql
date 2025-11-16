-- Fix vendors table - add missing name field
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Create products table (missing)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description TEXT,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  image VARCHAR(500),
  extra_images TEXT[],
  features TEXT[],
  specifications JSONB DEFAULT '{}',
  ratings JSONB DEFAULT '{"average": 0, "count": 0}',
  quantity INTEGER DEFAULT 0,
  slug VARCHAR(255),
  brand VARCHAR(100) DEFAULT 'ShopWave',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fix vendor registration API by updating the register route
-- This will be handled in the API fix

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);