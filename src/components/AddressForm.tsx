'use client'
import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../context/ClerkAuthContext'
import { getPincodeServiceability } from '../lib/pincode-data'

type Address = {
  id: string
  fullName: string
  phone: string
  pincode: string
  line1: string
  line2: string
  city: string
  state: string
  landmark: string
  default: boolean
  sellingPrice?: string
}

const required = (s?: string) => !!(s && s.trim().length)

export default function AddressForm({ action, initial, onCancel }: { action: (a: Omit<Address, 'id'>) => void; initial?: Partial<Address>; onCancel?: () => void }) {
  
  const { user } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isDropshipper = user?.is_dropshipper === true
  
  // Initialize form data once
  const initialData = useMemo(() => ({
    fullName: initial?.fullName || '',
    phone: initial?.phone || '',
    pincode: initial?.pincode || '',
    line1: initial?.line1 || '',
    line2: initial?.line2 || '',
    city: initial?.city || '',
    state: initial?.state || '',
    landmark: initial?.landmark || '',
    sellingPrice: initial?.sellingPrice || ''
  }), [initial])
  
  const [formData, setFormData] = useState(initialData)

  const toast = useCallback(({ title, description }: any) => {
    alert(`${title}: ${description}`)
  }, [])

  const handleSave = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    const a: Omit<Address, 'id'> = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.replace(/\s/g, ''),
        pincode: formData.pincode.trim(),
        line1: formData.line1.trim(),
        line2: formData.line2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        landmark: formData.landmark.trim(),
        default: false,
    }

    const newErrors: Record<string, string> = {}
    if (!required(a.fullName)) newErrors.fullName = "Full name is required."
    if (!/^[0-9]{10}$/.test(a.phone)) newErrors.phone = "Must be a valid 10-digit phone number."
    
    // Dropshippers only need name, phone, address and selling price
    if (!isDropshipper) {
      if (!/^[0-9]{6}$/.test(a.pincode)) newErrors.pincode = "Must be a 6-digit pincode."
      if (!required(a.line1)) newErrors.line1 = "Building/Floor is required."
      if (!required(a.city)) newErrors.city = "City is required."
      if (!required(a.state)) newErrors.state = "State is required."
    } else {
      // For dropshippers, need address and selling price
      if (!required(a.line1)) newErrors.line1 = "Address is required."
      if (!required(formData.sellingPrice) || parseInt(formData.sellingPrice) < 1) {
        newErrors.sellingPrice = "Valid selling price is required."
      }
    }
    
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        await action(a)
        toast({
          title: "Address Saved",
          description: "Your address has been saved successfully.",
        })
      } catch (error) {
        console.error('Address save error:', error)
        toast({
          title: "Error",
          description: "Failed to save address. Please try again.",
        })
      }
    }
    
    setIsSubmitting(false)
  }, [action, formData, isSubmitting, toast])

  const updateField = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Simplified form for dropshippers
  if (isDropshipper) {
    return (
      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
          <p className="text-blue-800 text-sm font-medium">📦 Dropshipper Address Form</p>
          <p className="text-blue-600 text-xs">Basic details + your selling price for vendor</p>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <div>
            <input 
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Full Name*" 
              value={formData.fullName}
              type="text"
              autoComplete="off"
              onChange={(e) => updateField('fullName', e.target.value)}
            />
            {errors.fullName && <div className="mt-1 text-xs text-red-600">{errors.fullName}</div>}
          </div>
          
          <div>
            <input 
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Phone Number*" 
              value={formData.phone}
              type="tel"
              autoComplete="off"
              onChange={(e) => updateField('phone', e.target.value)}
            />
            {errors.phone && <div className="mt-1 text-xs text-red-600">{errors.phone}</div>}
          </div>
          
          <div>
            <textarea 
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.line1 ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Complete Address*" 
              value={formData.line1}
              rows={3}
              onChange={(e) => updateField('line1', e.target.value)}
            />
            {errors.line1 && <div className="mt-1 text-xs text-red-600">{errors.line1}</div>}
          </div>
          
          <div>
            <input 
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Your Selling Price (₹)*" 
              value={formData.sellingPrice}
              type="number"
              min="1"
              onChange={(e) => updateField('sellingPrice', e.target.value)}
            />
            {errors.sellingPrice && <div className="mt-1 text-xs text-red-600">{errors.sellingPrice}</div>}
            <p className="text-xs text-gray-500 mt-1">💡 Vendor will see your selling price for this order</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-2">
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </button>
          {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border px-5 py-2 text-sm font-semibold">Cancel</button>}
        </div>
      </div>
    )
  }

  const [isFetchingLocation, setIsFetchingLocation] = useState(false)

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation is not supported by your browser." })
      return
    }

    setIsFetchingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Using Nominatim (OpenStreetMap) for free reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
          const data = await response.json()
          
          if (data && data.address) {
            const addr = data.address
            setFormData(prev => ({
              ...prev,
              city: addr.city || addr.town || addr.village || '',
              state: addr.state || '',
              pincode: addr.postcode || '',
              line1: addr.road || addr.suburb || '',
              line2: addr.neighbourhood || ''
            }))
            toast({ title: "Location Fetched", description: "Address fields updated." })
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error)
          toast({ title: "Error", description: "Could not fetch address details." })
        } finally {
          setIsFetchingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({ title: "Error", description: "Permission denied or location unavailable." })
        setIsFetchingLocation(false)
      }
    )
  }

  // Full form for normal users
  return (
    <div className="space-y-4">
      <button 
        type="button" 
        onClick={fetchLocation}
        disabled={isFetchingLocation}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 border-brand text-brand hover:bg-brand/5 transition-colors text-sm font-bold"
      >
        <span className="text-lg">📍</span> {isFetchingLocation ? 'Fetching Location...' : 'Use Current Location'}
      </button>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <input 
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Full Name*" 
            value={formData.fullName}
            type="text"
            autoComplete="off"
            onChange={(e) => updateField('fullName', e.target.value)}
          />
          {errors.fullName && <div className="mt-1 text-xs text-red-600">{errors.fullName}</div>}
        </div>
        
        <div>
          <input 
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Phone*" 
            value={formData.phone}
            type="tel"
            autoComplete="off"
            onChange={(e) => updateField('phone', e.target.value)}
          />
          {errors.phone && <div className="mt-1 text-xs text-red-600">{errors.phone}</div>}
        </div>
        
        <div>
          <input 
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Pincode (6 digits)*" 
            value={formData.pincode}
            type="text"
            maxLength={6}
            autoComplete="off"
            onChange={(e) => {
              const pincode = e.target.value
              updateField('pincode', pincode)
              
              // Auto-fill city/state when 6 digits entered
              if (pincode.length === 6) {
                try {
                  const result = getPincodeServiceability(pincode)
                  
                  if (result.serviceable && result.data) {
                    // Auto-fill city and state
                    setFormData(prev => ({
                      ...prev,
                      city: result.data!.city,
                      state: result.data!.state,
                      pincode: pincode
                    }))
                    
                    // Show serviceability message
                    toast({
                      title: result.message,
                      description: `${result.data.district}, ${result.data.state}`
                    })
                  } else {
                    // Clear city/state if not serviceable
                    toast({
                      title: result.message,
                      description: "Please check the pincode or contact support"
                    })
                  }
                } catch (err) {
                  console.error('Pincode lookup error:', err);
                }
              }
            }}
          />
          {errors.pincode && <div className="mt-1 text-xs text-red-600">{errors.pincode}</div>}
          {formData.pincode.length === 6 && (
            <div className="mt-1 text-xs text-blue-600">
              🔍 Checking delivery availability...
            </div>
          )}
        </div>
        
        <div>
          <input 
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.city ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="City*" 
            value={formData.city}
            type="text"
            autoComplete="off"
            onChange={(e) => updateField('city', e.target.value)}
          />
          {errors.city && <div className="mt-1 text-xs text-red-600">{errors.city}</div>}
        </div>
        
        <div className="md:col-span-2">
          <input 
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.line1 ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Building/Floor*" 
            value={formData.line1}
            type="text"
            autoComplete="off"
            onChange={(e) => updateField('line1', e.target.value)}
          />
          {errors.line1 && <div className="mt-1 text-xs text-red-600">{errors.line1}</div>}
        </div>
        
        <div className="md:col-span-2">
          <input 
            className="w-full rounded-lg border px-3 py-2 text-sm border-gray-300" 
            placeholder="Street/Area (optional)" 
            value={formData.line2}
            type="text"
            autoComplete="off"
            onChange={(e) => updateField('line2', e.target.value)}
          />
        </div>
        
        <div>
          <select 
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            title="Select State"
          >
            <option value="">Select State*</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Delhi">Delhi</option>
          </select>
          {errors.state && <div className="mt-1 text-xs text-red-600">{errors.state}</div>}
        </div>
        
        <div>
          <input 
            className="w-full rounded-lg border px-3 py-2 text-sm border-gray-300" 
            placeholder="Landmark (optional)" 
            value={formData.landmark}
            type="text"
            autoComplete="off"
            onChange={(e) => updateField('landmark', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 pt-2">
        <button 
          type="button" 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border px-5 py-2 text-sm font-semibold">Cancel</button>}
      </div>
    </div>
  )
}