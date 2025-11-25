'use client';

import { extractYouTubeVideoId, getYouTubeThumbnail } from '@/lib/youtubeUtils';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoCardProps {
  video: {
    id: number;
    youtube_url: string;
    title: string;
    description?: string;
  };
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const videoId = extractYouTubeVideoId(video.youtube_url);
  const [imgError, setImgError] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<'max' | 'hq' | 'mq' | 'sd'>('hq');

  if (!videoId) {
    console.error('Invalid video URL:', video.youtube_url);
    return null;
  }

  const thumbnail = getYouTubeThumbnail(videoId, currentQuality);

  const handleImageError = () => {
    console.log(`Thumbnail failed for quality: ${currentQuality}, trying fallback...`);
    // Try fallback qualities
    if (currentQuality === 'hq') {
      setCurrentQuality('mq');
    } else if (currentQuality === 'mq') {
      setCurrentQuality('sd');
    } else {
      setImgError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-40 h-72 md:w-48 md:h-[340px] rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Thumbnail */}
      {!imgError ? (
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center p-4">
            <Play className="w-16 h-16 text-white/60 mx-auto mb-2" />
            <p className="text-white/80 text-sm">Video ID: {videoId}</p>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
          <Play className="w-8 h-8 text-gray-800 group-hover:text-white ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-sm text-gray-200 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {video.description}
          </p>
        )}
      </div>

      {/* Glassmorphism effect on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 backdrop-blur-[1px] transition-all duration-300 pointer-events-none" />
    </div>
  );
}
