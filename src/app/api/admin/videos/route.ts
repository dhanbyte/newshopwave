import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidYouTubeUrl } from '@/lib/youtubeUtils';

// GET - Fetch all videos (for admin panel)
export async function GET() {
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    console.error('Error in admin videos API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { youtube_url, title, description, display_order, is_active } = body;

    console.log('Received video data:', { youtube_url, title, description, display_order, is_active });

    // Validation
    if (!youtube_url || !title) {
      console.error('Validation failed: Missing required fields', { youtube_url, title });
      return NextResponse.json(
        { error: 'YouTube URL and title are required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(youtube_url)) {
      console.error('Validation failed: Invalid YouTube URL', { youtube_url });
      return NextResponse.json(
        { error: 'Invalid YouTube URL. Please use a valid YouTube link (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          youtube_url,
          title,
          description: description || '',
          display_order: display_order || 0,
          is_active: is_active !== undefined ? is_active : true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return NextResponse.json(
        { error: 'Failed to create video', details: error.message },
        { status: 500 }
      );
    }

    console.log('Video created successfully:', data);
    return NextResponse.json({ video: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in admin videos POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
