-- Create vendors table in Supabase
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  vendor_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  brand_name VARCHAR(255),
  phone VARCHAR(20),
  business_type VARCHAR(50) DEFAULT 'Individual',
  gst_number VARCHAR(50),
  pan_number VARCHAR(50),
  aadhar_number VARCHAR(50),
  profile_photo TEXT,
  address JSONB DEFAULT '{}',
  bank_details JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending',
  commission DECIMAL(5,2) DEFAULT 15.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  pending_payments DECIMAL(10,2) DEFAULT 0.00,
  total_revenue DECIMAL(10,2) DEFAULT 0.00,
  total_products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_id ON vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);