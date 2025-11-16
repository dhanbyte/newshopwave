'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxSizePerImage?: number // in MB
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10, 
  maxSizePerImage = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const uploadToImageKit = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', `product_${Date.now()}_${file.name}`)
      formData.append('folder', '/products/')

      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('ImageKit upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      // Fallback: Create a local URL for preview (temporary)
      console.warn('ImageKit upload failed, using local preview:', error)
      return URL.createObjectURL(file)
    }
  }

  const handleFiles = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    const newImages: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image`,
            variant: "destructive"
          })
          continue
        }

        // Validate file size
        if (file.size > maxSizePerImage * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds ${maxSizePerImage}MB limit`,
            variant: "destructive"
          })
          continue
        }

        try {
          const imageUrl = await uploadToImageKit(file)
          newImages.push(imageUrl)
        } catch (error) {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          })
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
        toast({
          title: "Success",
          description: `${newImages.length} image(s) uploaded successfully`
        })
      }
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, maxSizePerImage, onImagesChange, toast])

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
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder.jpg'
                  }}
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
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
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
              {uploading ? 'Uploading images...' : 'Drop Images Here'}
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
            📁 JPG/PNG, up to {maxSizePerImage}MB each • {images.length}/{maxImages} files
          </p>
        </div>
      </div>

      {/* URL Input Alternative */}
      <div className="border-t pt-4">
        <p className="text-xs text-gray-600 mb-2">Or add image URL directly:</p>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const input = e.target as HTMLInputElement
                const url = input.value.trim()
                if (url && images.length < maxImages) {
                  onImagesChange([...images, url])
                  input.value = ''
                }
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
              const url = input.value.trim()
              if (url && images.length < maxImages) {
                onImagesChange([...images, url])
                input.value = ''
              }
            }}
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
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