-- Fix for existing database: Delete old sample videos and add new one

-- Step 1: Delete old fake sample videos
DELETE FROM videos WHERE youtube_url IN (
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/jNQXAC9IVRw'
);

-- Step 2: Add a real sample video (your Shorts URL)
INSERT INTO videos (youtube_url, title, description, display_order, is_active) VALUES
('https://youtube.com/shorts/dCIcz1Dc-5A?si=FRFIrbz4GApopiBY', 'Sample Shorts Video', 'This is a real YouTube Shorts video for testing', 1, true)
ON CONFLICT DO NOTHING;
