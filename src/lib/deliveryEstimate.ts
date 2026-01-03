/**
 * Utility to calculate delivery estimate
 * Returns delivery date 6 days from now
 */
export function getDeliveryEstimate(): {
  estimatedDate: string
  daysToDeliver: number
  orderByTime: string
} {
  const now = new Date()
  const deliveryDate = new Date(now)
  deliveryDate.setDate(deliveryDate.getDate() + 6)
  
  // Calculate hours remaining today for "Order within X hours"
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  const hoursRemaining = Math.ceil((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60))
  
  return {
    estimatedDate: deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    daysToDeliver: 6,
    orderByTime: `${hoursRemaining} hours`
  }
}

/**
 * Format delivery estimate for display
 */
export function formatDeliveryMessage(): string {
  const { estimatedDate, orderByTime } = getDeliveryEstimate()
  return `Get it by ${estimatedDate} | Order within ${orderByTime}`
}
