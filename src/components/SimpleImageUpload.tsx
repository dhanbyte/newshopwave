'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import SafeImagePreview from './SafeImagePreview'

interface SimpleImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function SimpleImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10
}: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    const newImages: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image`)
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} exceeds 5MB limit`)
          continue
        }

        try {
          // Try to upload via API first
          const formData = new FormData()
          formData.append('file', file)
          
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const data = await response.json()
            newImages.push(data.url)
          } else {
            // Fallback to local preview
            const imageUrl = URL.createObjectURL(file)
            newImages.push(imageUrl)
          }
        } catch (error) {
          // Fallback to local preview
          const imageUrl = URL.createObjectURL(file)
          newImages.push(imageUrl)
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
      }
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, onImagesChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const addUrlImage = () => {
    if (urlInput.trim() && images.length < maxImages) {
      onImagesChange([...images, urlInput.trim()])
      setUrlInput('')
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Product Images *
        </label>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {images.length}/{maxImages} files • Auto-upload to BunnyCDN
        </span>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <SafeImagePreview
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                Product {index + 1}×
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400 hover:bg-gray-50 cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">
              📸 {uploading ? 'Processing images...' : 'Drop Images Here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drag and drop your product images
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="flex items-center justify-center">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Product {num}×
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading || images.length >= maxImages}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            📁 Choose Files
          </button>

          <p className="text-xs text-gray-500">
            📁 JPG/PNG, up to 5MB each • {images.length}/{maxImages} files
          </p>
        </div>
      </div>

      {/* URL Input Alternative */}
      <div className="border-t pt-4">
        <p className="text-xs text-gray-600 mb-2">Or add image URL directly:</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrlImage()
              }
            }}
          />
          <button
            type="button"
            onClick={addUrlImage}
            disabled={!urlInput.trim() || images.length >= maxImages}
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm disabled:opacity-50"
          >
            Add URL
          </button>
        </div>
      </div>

      {images.length === 0 && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          ⚠️ At least one image is required
        </p>
      )}
    </div>
  )
}