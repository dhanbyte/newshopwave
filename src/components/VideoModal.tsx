'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from '@/lib/youtubeUtils';

interface Video {
  id: number;
  youtube_url: string;
  title: string;
  description?: string;
}

interface VideoModalProps {
  videos: Video[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function VideoModal({ videos, currentIndex, onClose, onNavigate }: VideoModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentVideo = videos[currentIndex];
  const videoId = extractYouTubeVideoId(currentVideo?.youtube_url);
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId, true, false) : null;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < videos.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length, onClose, onNavigate]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < videos.length - 1) {
      onNavigate(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) onNavigate(currentIndex + 1);
  };

  if (!embedUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Video Counter */}
      <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
        {currentIndex + 1} / {videos.length}
      </div>

      {/* Main Content */}
      <div
        className={`relative ${
          isMobile ? 'w-full h-full' : 'max-w-5xl w-full mx-4'
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Video Container */}
        <div className={`relative ${isMobile ? 'h-full' : 'aspect-video'} bg-black rounded-lg overflow-hidden`}>
          <iframe
            src={embedUrl}
            title={currentVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info - Desktop */}
        {!isMobile && (
          <div className="mt-4 text-white">
            <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
            {currentVideo.description && (
              <p className="text-gray-300">{currentVideo.description}</p>
            )}
          </div>
        )}

        {/* Navigation Arrows - Desktop */}
        {!isMobile && videos.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {currentIndex < videos.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </>
        )}

        {/* Navigation Dots - Mobile */}
        {isMobile && videos.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Swipe Indicator - Mobile */}
        {isMobile && videos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            Swipe left or right for more videos
          </div>
        )}
      </div>
    </div>
  );
}
