import { useAuth } from '../context/ClerkAuthContext'

export default function PriceTag({ original, discounted, currency = '₹', size = 'md' }: { original: number; discounted?: number; currency?: string; size?: 'sm' | 'md' | 'lg' }) {
  const { user } = useAuth()
  
  // Ensure we have valid numbers
  const adminOriginal = Number(original) || 0
  const adminDiscounted = discounted ? Number(discounted) : 0
  const isDropshipper = user?.is_dropshipper === true
  
  // Calculate display prices - 10% markup for normal users
  const displayOriginal = isDropshipper ? adminOriginal : Math.round(adminOriginal * 1.1)
  const displayDiscounted = adminDiscounted ? (isDropshipper ? adminDiscounted : Math.round(adminDiscounted * 1.1)) : 0
  
  const safeOriginal = displayOriginal
  const safeDiscounted = displayDiscounted
  const price = safeDiscounted || safeOriginal
  const off = safeDiscounted && safeOriginal > 0 ? Math.round(((safeOriginal - safeDiscounted) / safeOriginal) * 100) : 0
  const savings = safeDiscounted ? safeOriginal - safeDiscounted : 0;

  const sizeClasses = {
    sm: {
      price: 'text-sm font-bold text-gray-900',
      original: 'text-xs text-gray-400 line-through',
      discount: 'text-[9px] md:text-xs font-medium text-green-600 bg-green-50 px-0.5 md:px-1 rounded'
    },
    md: {
      price: 'text-lg font-bold text-gray-900',
      original: 'text-sm text-gray-400 line-through',
      discount: 'text-[9px] md:text-xs font-medium text-green-600 bg-green-50 px-0.5 md:px-1 rounded'
    },
    lg: {
      price: 'text-xl font-semibold',
      original: 'text-base text-gray-400 line-through',
      discount: 'text-xs md:text-sm font-medium text-green-600'
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className={sizeClasses[size].price}>{currency}{price.toLocaleString('en-IN')}</span>
        {safeDiscounted > 0 && safeOriginal > safeDiscounted && (
          <span className={sizeClasses[size].original}>{currency}{safeOriginal.toLocaleString('en-IN')}</span>
        )}
      </div>
      {safeDiscounted > 0 && safeOriginal > safeDiscounted && (
        <span className={sizeClasses[size].discount}>
          {off}% off • Save {currency}{savings.toLocaleString('en-IN')}
        </span>
      )}
    </div>
  )
}
