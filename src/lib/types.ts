
export type Money = { original: number; discounted?: number; currency?: string }
export type Rating = { average: number; count: number }
export type Variant = { color?: string; size?: string; price?: number; quantity?: number; sku?: string }

export type Product = {
  id: string
  _id?: string // Legacy MongoDB ID
  slug: string
  name: string
  brand: string
  category: string
  subcategory?: string
  tertiaryCategory?: string
  image: string
  extraImages?: string[]
  video?: string
  quantity: number
  stock?: number
  price: Money
  price_original?: number // Legacy field for backward compatibility
  price_discounted?: number // Legacy field for backward compatibility
  weight?: number // Weight in grams
  specifications?: Record<string, string>
  shortDescription?: string
  description: string
  features?: string[]
  tags?: string[]
  sku?: string
  variants?: Variant[]
  shippingCost?: number;
  taxPercent?: number;
  inventory?: { inStock: boolean; lowStockThreshold?: number }
  ratings?: Rating
  status?: 'active'|'inactive'|'out_of_stock'|'discontinued'
  returnPolicy?: { eligible?: boolean; duration?: number }
  codAvailable?: boolean
  warranty?: string
  isCustomizable?: boolean
  isVendorProduct?: boolean // Flag to identify vendor products
}

export type Address = {
  id?: string;
  fullName: string
  phone: string
  pincode: string
  line1: string
  line2?: string
  city: string
  state: string
  landmark?: string
  default?: boolean
}

export type PaymentMethod = 'COD' | 'UPI' | 'Card' | 'NetBanking';

export type ShippingRate = {
  minWeight: number // in grams
  maxWeight: number // in grams
  rate: number // in rupees
  codCharge?: number // additional COD charge
}

export type TrackingUpdate = {
  status: string
  location: string
  timestamp: string | number
}

export type Order = {
  id: string
  userId: string
  createdAt: number
  updatedAt: number
  items: { productId: string; qty: number; price: number, name: string, image: string, customName?: string }[]
  total: number
  originalTotal?: number
  discountAmount?: number
  referralCode?: string | null
  address: Address
  payment: PaymentMethod
  status: 'Pending'|'Processing'|'Shipped'|'Delivered'
  trackingStatus?: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned'
  trackingNumber?: string
  estimatedDelivery?: string
  trackingUpdates?: TrackingUpdate[]
  isDropshipperOrder?: boolean
  dropshipperId?: string
  dropshipperSellingPrice?: number
  dropshipperOrderType?: 'prepaid' | 'cod'
  confirmationType?: 'direct' | 'call'
  orderNote?: string
}

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
}

export type NotificationItem = {
    productId: string;
    notifiedAt: number;
}
