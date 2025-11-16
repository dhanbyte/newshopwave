'use client'
import { useAuth } from '../context/ClerkAuthContext'

export default function DropshipperDebug() {
  const { user } = useAuth()

  // Only show for dropshippers
  if (!user || !user.is_dropshipper) return null

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white p-2 rounded text-xs z-50 max-w-xs">
      <div><strong>🏷️ Dropshipper Info:</strong></div>
      <div>Email: {user.email}</div>
      <div>Status: ✅ ACTIVE</div>
      <div>ID: {user.dropshipper_id}</div>
      <div>Wholesale Prices: ON</div>
    </div>
  )
}