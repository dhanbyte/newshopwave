/**
 * YouTube Utility Functions
 * Helper functions for extracting video IDs, generating embed URLs, and getting thumbnails
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/v/, youtube.com/shorts/
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay = false, muted = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: '1',
    rel: '0',
    modestbranding: '1',
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate YouTube thumbnail URL from video ID
 * Quality options: maxresdefault, sddefault, hqdefault, mqdefault, default
 */
export function getYouTubeThumbnail(videoId: string, quality: 'max' | 'sd' | 'hq' | 'mq' | 'default' = 'hq'): string {
  const qualityMap = {
    max: 'maxresdefault',
    sd: 'sddefault',
    hq: 'hqdefault',
    mq: 'mqdefault',
    default: 'default',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Validate if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Get video ID from URL or return the input if it's already a video ID
 */
export function getVideoId(input: string): string | null {
  // Check if input is already a video ID (11 characters)
  if (input.length === 11 && !input.includes('/') && !input.includes('.')) {
    return input;
  }

  // Try to extract from URL
  return extractYouTubeVideoId(input);
}
