import { useCart } from '../lib/cartStore'
import { useAuth } from '../context/ClerkAuthContext'
import { useMemo } from 'react'

export function useCartWithUser() {
  const cart = useCart()
  const { user } = useAuth()
  
  // Recalculate totals with dropshipper status
  const cartWithUserContext = useMemo(() => {
    if (!user) return cart
    
    const isDropshipper = user.is_dropshipper === true
    
    // Recalculate delivery charges for dropshippers
    const cartTotal = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0)
    
    const deliveryCharge = isDropshipper ? 40 : (cartTotal >= 399 ? 0 : 40)
    const codCharge = cart.paymentMethod === 'COD' ? (isDropshipper ? 25 : 19) : 0
    const isFreeDelivery = isDropshipper ? false : cartTotal >= 399
    
    const giftTier = isDropshipper ? 0 : cart.deliveryInfo.giftTier
    const gifts = isDropshipper ? [] : cart.deliveryInfo.gifts
    
    const total = cartTotal + deliveryCharge + codCharge
    
    return {
      ...cart,
      total,
      deliveryInfo: {
        ...cart.deliveryInfo,
        deliveryCharge,
        codCharge,
        isFreeDelivery,
        giftTier,
        gifts
      }
    }
  }, [cart, user])
  
  return cartWithUserContext
}