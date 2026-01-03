/**
 * Calculate delivery charges based on weight and payment method
 * 
 * Pricing Structure:
 * - Base weight: 500g
 * - COD: ₹80 for first 500g
 * - Prepaid: ₹55 for first 500g
 * - Additional: ₹40 per 500g unit above base weight
 * 
 * @param totalWeight - Total weight in grams
 * @param paymentMethod - 'COD' or 'PREPAID'
 * @returns Delivery charge in rupees
 */
export function calculateDeliveryCharge(
  totalWeight: number,
  paymentMethod: 'COD' | 'PREPAID'
): number {
  const baseWeight = 500 // grams
  const codBaseCharge = 80 // rupees
  const prepaidBaseCharge = 55 // rupees
  const additionalChargePerUnit = 40 // rupees per 500g

  // Base charge based on payment method
  const baseCharge = paymentMethod === 'COD' ? codBaseCharge : prepaidBaseCharge

  // If weight is less than or equal to base weight, return base charge
  if (totalWeight <= baseWeight) {
    return baseCharge
  }

  // Calculate extra weight beyond base
  const extraWeight = totalWeight - baseWeight
  
  // Calculate number of additional 500g units (round up)
  const extraUnits = Math.ceil(extraWeight / baseWeight)

  // Total charge = base + (extra units × additional charge)
  return baseCharge + (extraUnits * additionalChargePerUnit)
}

/**
 * Get delivery charge breakdown for display
 */
export function getDeliveryChargeBreakdown(
  totalWeight: number,
  paymentMethod: 'COD' | 'PREPAID'
): {
  baseCharge: number
  additionalCharge: number
  totalCharge: number
  weightBreakdown: string
} {
  const baseWeight = 500
  const codBaseCharge = 80
  const prepaidBaseCharge = 55
  const additionalChargePerUnit = 40

  const baseCharge = paymentMethod === 'COD' ? codBaseCharge : prepaidBaseCharge
  
  if (totalWeight <= baseWeight) {
    return {
      baseCharge,
      additionalCharge: 0,
      totalCharge: baseCharge,
      weightBreakdown: `${totalWeight}g (within ${baseWeight}g base)`
    }
  }

  const extraWeight = totalWeight - baseWeight
  const extraUnits = Math.ceil(extraWeight / baseWeight)
  const additionalCharge = extraUnits * additionalChargePerUnit

  return {
    baseCharge,
    additionalCharge,
    totalCharge: baseCharge + additionalCharge,
    weightBreakdown: `${baseWeight}g base + ${extraWeight}g extra (${extraUnits} × 500g units)`
  }
}

/**
 * Calculate total cart weight from items
 */
export function calculateCartWeight(items: Array<{ weight?: number; qty: number }>): number {
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 100 // Default 100g if not specified
    return total + (itemWeight * item.qty)
  }, 0)
}
