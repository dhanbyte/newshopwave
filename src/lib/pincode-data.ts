// Pincode Database with City, District, State info
// Data structure from Excel files

export interface PincodeData {
  pincode: string
  city: string
  district: string
  state: string
  deliveryType: 'COD' | 'PREPAID' | 'BOTH'
}

// COD Serviceable Pincodes (from cod-pincode (2).xlsx)
// TODO: Replace with actual data from Excel
export const COD_PINCODES: PincodeData[] = [
  // Sample data - replace with your Excel data
  { pincode: '110001', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', deliveryType: 'COD' },
  { pincode: '400001', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', deliveryType: 'COD' },
  { pincode: '700001', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', deliveryType: 'COD' },
  // Add more from Excel...
]

// Prepaid Serviceable Pincodes (from prepaid-pincode (1).xlsx)
// TODO: Replace with actual data from Excel
export const PREPAID_PINCODES: PincodeData[] = [
  // Sample data - replace with your Excel data
  { pincode: '110001', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', deliveryType: 'PREPAID' },
  { pincode: '560001', city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', deliveryType: 'PREPAID' },
  { pincode: '600001', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', deliveryType: 'PREPAID' },
  // Add more from Excel...
]

// Combined pincode lookup map
const PINCODE_MAP = new Map<string, PincodeData>()

// Build lookup map
function buildPincodeMap() {
  // Add COD pincodes
  COD_PINCODES.forEach(data => {
    const existing = PINCODE_MAP.get(data.pincode)
    if (existing && existing.deliveryType !== data.deliveryType) {
      // Both COD and Prepaid available
      PINCODE_MAP.set(data.pincode, { ...data, deliveryType: 'BOTH' })
    } else {
      PINCODE_MAP.set(data.pincode, data)
    }
  })

  // Add Prepaid pincodes
  PREPAID_PINCODES.forEach(data => {
    const existing = PINCODE_MAP.get(data.pincode)
    if (existing && existing.deliveryType !== data.deliveryType) {
      // Both COD and Prepaid available
      PINCODE_MAP.set(data.pincode, { ...data, deliveryType: 'BOTH' })
    } else if (!existing) {
      PINCODE_MAP.set(data.pincode, data)
    }
  })
}

// Initialize map
buildPincodeMap()

/**
 * Lookup pincode and get city, district, state details
 */
export function lookupPincode(pincode: string): PincodeData | null {
  const normalized = pincode.trim()
  return PINCODE_MAP.get(normalized) || null
}

/**
 * Check if pincode is serviceable for given payment method
 */
export function isPincodeServiceable(
  pincode: string,
  paymentMethod: 'COD' | 'PREPAID'
): boolean {
  const data = lookupPincode(pincode)
  if (!data) return false

  if (data.deliveryType === 'BOTH') return true
  return data.deliveryType === paymentMethod
}

/**
 * Get serviceability info for pincode
 */
export function getPincodeServiceability(pincode: string): {
  serviceable: boolean
  data: PincodeData | null
  cod: boolean
  prepaid: boolean
  message: string
} {
  const data = lookupPincode(pincode)

  if (!data) {
    return {
      serviceable: false,
      data: null,
      cod: false,
      prepaid: false,
      message: '❌ Delivery not available to this pincode'
    }
  }

  const cod = data.deliveryType === 'COD' || data.deliveryType === 'BOTH'
  const prepaid = data.deliveryType === 'PREPAID' || data.deliveryType === 'BOTH'

  let message = ''
  if (data.deliveryType === 'BOTH') {
    message = `✅ Both COD and Prepaid available in ${data.city}`
  } else if (data.deliveryType === 'COD') {
    message = `📦 Only COD available in ${data.city}`
  } else {
    message = `💳 Only Prepaid available in ${data.city}`
  }

  return {
    serviceable: true,
    data,
    cod,
    prepaid,
    message
  }
}

/**
 * Get all unique states
 */
export function getAllStates(): string[] {
  const states = new Set<string>()
  PINCODE_MAP.forEach(data => states.add(data.state))
  return Array.from(states).sort()
}

/**
 * Get cities for a state
 */
export function getCitiesForState(state: string): string[] {
  const cities = new Set<string>()
  PINCODE_MAP.forEach(data => {
    if (data.state === state) {
      cities.add(data.city)
    }
  })
  return Array.from(cities).sort()
}

/**
 * Get pincodes for a city
 */
export function getPincodesForCity(city: string): string[] {
  const pincodes: string[] = []
  PINCODE_MAP.forEach(data => {
    if (data.city === city) {
      pincodes.push(data.pincode)
    }
  })
  return pincodes.sort()
}
