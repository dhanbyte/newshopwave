'use client'

import { useState } from 'react'
import { Upload, CheckCircle, XCircle, Loader2, Camera } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface OrderPhotoUploadProps {
  orderId: string
  userId: string
  orderTotal: number
  onUploadSuccess?: (cashbackAmount: number) => void
}

export default function OrderPhotoUpload({
  orderId,
  userId,
  orderTotal,
  onUploadSuccess
}: OrderPhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [cashbackAmount, setCashbackAmount] = useState(0)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      })
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    // Check minimum order value
    if (orderTotal < 499) {
      toast({
        title: 'Order Value Too Low',
        description: 'Cashback is only available on orders of ₹499 or more',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('orderId', orderId)
      formData.append('userId', userId)
      formData.append('photo', selectedFile)

      const response = await fetch('/api/orders/upload-photo', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setUploaded(true)
        setCashbackAmount(data.cashbackAmount)
        toast({
          title: '🎉 Success!',
          description: data.message || `₹${data.cashbackAmount} cashback credited to your wallet!`
        })
        onUploadSuccess?.(data.cashbackAmount)
      } else {
        toast({
          title: 'Upload Failed',
          description: data.error || 'Failed to upload photo',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreview(null)
  }

  if (uploaded) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">Photo Uploaded Successfully!</p>
            <p className="text-sm text-green-700">₹{cashbackAmount} cashback credited to your wallet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <Camera className="w-6 h-6 text-orange-600 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">
            📸 Upload Photo & Get ₹50 Cashback!
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Share a photo of your order and earn instant cashback
          </p>
          {orderTotal < 499 && (
            <p className="text-xs text-red-600 font-medium">
              ⚠️ Minimum order value: ₹499 (Your order: ₹{orderTotal})
            </p>
          )}
        </div>
      </div>

      {!preview ? (
        <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-white">
          <Upload className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-3">
            Click to upload or drag and drop
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              className="bg-orange-600 text-white hover:bg-orange-700"
              disabled={uploading}
            >
              Choose Photo
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG or GIF (max 5MB)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={300}
              className="w-full h-48 object-contain"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
              disabled={uploading}
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading || orderTotal < 499}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Get ₹50
                </>
              )}
            </Button>
            <Button
              onClick={handleRemove}
              disabled={uploading}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
