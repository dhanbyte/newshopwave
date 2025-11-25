'use client'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, Gift as GiftIcon } from 'lucide-react'
import Image from 'next/image'

interface GiftCardProps {
  id: number
  name: string
  value: number
  image: string
  threshold: number
  unlocked: boolean
}

export default function GiftCard({ name, value, image, threshold, unlocked }: GiftCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      className="relative group cursor-pointer"
    >
      <div className={`rounded-2xl p-4 border-2 transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg'
          : 'bg-gray-50 border-gray-200'
      }`}>
        
        {/* Gift Image Container */}
        <div className="relative h-32 mb-3 rounded-xl overflow-hidden bg-white">
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-all ${
              unlocked ? 'grayscale-0' : 'grayscale opacity-40'
            }`}
          />
          
          {/* Lock Overlay */}
          {!unlocked && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-xs text-white font-medium bg-black/30 px-2 py-1 rounded">
                  Locked
                </div>
              </div>
            </div>
          )}

          {/* Unlocked Badge */}
          {unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </div>

        {/* Gift Details */}
        <div className="space-y-2">
          <h4 className={`font-bold text-sm ${
            unlocked ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {name}
          </h4>

          <div className="flex items-center justify-between">
            <div className={`text-xs font-semibold ${
              unlocked ? 'text-purple-600' : 'text-gray-400'
            }`}>
              Worth ₹{value}
            </div>
            
            {unlocked && (
              <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                FREE!
              </div>
            )}
          </div>
        </div>

        {/* Unlock Threshold Badge */}
        {!unlocked && (
          <div className="mt-3 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-lg text-center font-medium">
            <Lock className="w-3 h-3 inline mr-1" />
            Unlock at ₹{threshold}
          </div>
        )}

        {/* Unlocked Shine Effect */}
        {unlocked && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ width: '50%' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Gift Gallery Component
interface GiftGalleryProps {
  cartValue: number
}

export function GiftGallery({ cartValue }: GiftGalleryProps) {
  const gifts = [
    {
      id: 1,
      name: 'Phone Ring Holder',
      value: 99,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
      threshold: 399,
      unlocked: cartValue >= 399,
    },
    {
      id: 2,
      name: 'Wireless Earbuds Case',
      value: 149,
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop',
      threshold: 699,
      unlocked: cartValue >= 699,
    },
    {
      id: 3,
      name: 'Fast Charger Cable',
      value: 99,
      image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=300&h=300&fit=crop',
      threshold: 999,
      unlocked: cartValue >= 999,
    },
  ]

  const unlockedGifts = gifts.filter(g => g.unlocked)
  const totalGiftValue = unlockedGifts.reduce((sum, g) => sum + g.value, 0)

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 mb-6 shadow-lg border-2 border-purple-200">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-3">
          <GiftIcon className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
            Your Free Gifts
          </h3>
        </div>
        <p className="text-sm text-purple-700">
          Prepaid Payment Only - Choose wisely!
        </p>
      </div>

      {/* Gift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {gifts.map((gift) => (
          <GiftCard key={gift.id} {...gift} />
        ))}
      </div>

      {/* Total Value Display */}
      {unlockedGifts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-center shadow-lg"
        >
          <div className="text-white">
            <div className="text-3xl font-bold mb-1">₹{totalGiftValue}</div>
            <div className="text-sm opacity-90">Total Gift Value - Absolutely FREE!</div>
            <div className="text-xs mt-2 bg-white/20 inline-block px-3 py-1 rounded-full">
              📦 Shipped with your order
            </div>
          </div>
        </motion.div>
      )}

      {/* All Locked Message */}
      {unlockedGifts.length === 0 && (
        <div className="text-center text-purple-600">
          <Lock className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Add items to unlock free gifts!</p>
        </div>
      )}
    </div>
  )
}
