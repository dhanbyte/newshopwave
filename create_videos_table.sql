-- Videos Table for YouTube Video Showcase
-- Run this script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  youtube_url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active, display_order);

-- Add sample data with REAL YouTube URL (optional - you can delete this after testing)
-- DELETE this sample video after you add your own videos!
INSERT INTO videos (youtube_url, title, description, display_order, is_active) VALUES
('https://youtube.com/shorts/dCIcz1Dc-5A?si=FRFIrbz4GApopiBY', 'Sample Shorts Video', 'This is a sample YouTube Shorts video for testing', 1, true)
ON CONFLICT DO NOTHING;
