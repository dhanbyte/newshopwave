'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface SafeImagePreviewProps {
  src: string
  alt: string
  className?: string
}

export default function SafeImagePreview({ src, alt, className = '' }: SafeImagePreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
    // Try fallback to placeholder
    const img = new Image()
    img.src = '/images/placeholder.svg'
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-xs">Image failed to load</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}