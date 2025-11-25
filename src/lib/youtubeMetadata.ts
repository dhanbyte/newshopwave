/**
 * Fetch YouTube video metadata (title, description)
 * Since we can't use YouTube API directly without API key,
 * we'll use oEmbed API which doesn't require authentication
 */

export async function fetchYouTubeMetadata(videoId: string) {
  try {
    // YouTube oEmbed API - no API key required
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch video metadata');
    }
    
    const data = await response.json();
    
    return {
      title: data.title || '',
      author: data.author_name || '',
      thumbnail: data.thumbnail_url || '',
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}
