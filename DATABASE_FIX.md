# Database Not Created Fix

## Issue
Videos are not showing on the home page because the database table hasn't been created yet.

## Solution

You need to run the SQL migration in your **Supabase Dashboard**:

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://app.supabase.com

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run Migration**
   - Copy the entire contents of `create_videos_table.sql`
   - Paste it into the SQL Editor
   - Click "Run" button

4. **Verify Table Created**
   - Go to "Table Editor" in left sidebar
   - You should see a new table called "videos"

5. **Add Your First Video**
   - Go to `/admin/videos` in your app
   - Click "Add Video"
   - Paste YouTube URL: `https://youtube.com/shorts/dCIcz1Dc-5A`
   - Add title and click save

## Check Console

Open your browser console (F12) and you'll see:
```
Fetching videos from /api/videos...
Response status: 200
Videos data received: {videos: [...]}
Number of videos: 1
```

If you see an error about "relation videos does not exist", it means you need to run the migration!

## After Running Migration

1. Refresh your home page
2. Videos will appear in the footer area (before Business Opportunity Banner)
3. Videos will be in 9:16 vertical format (like Shorts/Reels)
