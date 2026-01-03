'use client'
import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../context/ClerkAuthContext'
import { getPincodeServiceability } from '../lib/pincode-data'
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react'

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
    // We can use a real toast here or just console for now since we have inline errors
    console.log(`${title}: ${description}`)
  }, [])

  const handleSave = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    const a: Omit<Address, 'id'> = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.replace(/\s/g, ''),
        pincode: formData.pincode.trim(),
        line1: formData.line1.trim(),
        line2: formData.line2.trim(), // keeping empty or hidden
        city: formData.city.trim(),
        state: formData.state.trim(),
        landmark: formData.landmark.trim(), // keeping empty or hidden
        default: false,
    }

    const newErrors: Record<string, string> = {}
    if (!required(a.fullName)) newErrors.fullName = "Name is required"
    if (!/^[0-9]{10}$/.test(a.phone)) newErrors.phone = "Valid 10-digit number required"
    
    if (!isDropshipper) {
      if (!required(a.pincode)) newErrors.pincode = "Pincode is required"
      if (!required(a.line1)) newErrors.line1 = "Address is required"
    } else {
      if (!required(a.line1)) newErrors.line1 = "Address is required"
      if (!required(formData.sellingPrice) || parseInt(formData.sellingPrice) < 1) {
        newErrors.sellingPrice = "Valid selling price is required"
      }
    }
    
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        await action(a)
      } catch (error) {
        console.error('Address save error:', error)
      }
    }
    
    setIsSubmitting(false)
  }, [action, formData, isSubmitting, isDropshipper])

  const updateField = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  if (isDropshipper) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input 
                className={`w-full h-12 rounded-xl border-2 px-4 font-bold text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
                placeholder="Enter Recipient Name" 
                value={formData.fullName}
                type="text"
                onChange={(e) => updateField('fullName', e.target.value)}
              />
              {errors.fullName && <div className="mt-1 text-xs font-bold text-red-500">{errors.fullName}</div>}
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">+91</span>
              <input 
                className={`w-full h-12 pl-12 rounded-xl border-2 px-4 font-bold text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
                placeholder="00000 00000" 
                value={formData.phone}
                type="tel"
                maxLength={10}
                onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {errors.phone && <div className="mt-1 text-xs font-bold text-red-500">{errors.phone}</div>}
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Delivery Address</label>
            <textarea 
              className={`w-full rounded-xl border-2 p-4 font-medium text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.line1 ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
              placeholder="House No, Building, Street, Area" 
              value={formData.line1}
              rows={3}
              onChange={(e) => updateField('line1', e.target.value)}
            />
            {errors.line1 && <div className="mt-1 text-xs font-bold text-red-500">{errors.line1}</div>}
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Selling Price</label>
            <input 
              className={`w-full h-12 rounded-xl border-2 px-4 font-bold text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.sellingPrice ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
              placeholder="₹ Amount" 
              value={formData.sellingPrice}
              type="number"
              onChange={(e) => updateField('sellingPrice', e.target.value)}
            />
            {errors.sellingPrice && <div className="mt-1 text-xs font-bold text-red-500">{errors.sellingPrice}</div>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-2">
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 active:scale-95 transition-all"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </button>
          {onCancel && <button type="button" onClick={onCancel} className="px-6 h-12 rounded-xl border-2 border-slate-100 font-black text-slate-500 hover:bg-slate-50">Cancel</button>}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 gap-4">
        {/* Row 1: Name */}
        <div>
          <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Full Name</label>
          <input 
            className={`w-full h-10 md:h-12 rounded-xl border-2 px-3 md:px-4 font-bold text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
            placeholder="Ex: Rahul Sharma" 
            value={formData.fullName}
            type="text"
            onChange={(e) => updateField('fullName', e.target.value)}
          />
          {errors.fullName && <div className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.fullName}</div>}
        </div>
        
        {/* Row 2: Phone & Pincode */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Mobile Number</label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs md:text-sm">+91</span>
                <input 
                    className={`w-full h-10 md:h-12 pl-9 md:pl-10 rounded-xl border-2 px-3 md:px-4 font-bold text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
                    placeholder="0000000000" 
                    value={formData.phone}
                    type="tel"
                    maxLength={10}
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
                />
                </div>
                {errors.phone && <div className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.phone}</div>}
            </div>

            <div>
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Pincode</label>
                <input 
                    className={`w-full h-10 md:h-12 rounded-xl border-2 px-3 md:px-4 font-bold text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all ${errors.pincode ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
                    placeholder="Ex: 110001" 
                    value={formData.pincode}
                    type="tel"
                    maxLength={6}
                    onChange={(e) => {
                    const pincode = e.target.value.replace(/\D/g, '')
                    updateField('pincode', pincode)
                    
                    if (pincode.length === 6) {
                        try {
                        const result = getPincodeServiceability(pincode)
                        if (result.serviceable && result.data) {
                            setFormData(prev => ({
                            ...prev,
                            city: result.data!.city,
                            state: result.data!.state,
                            pincode: pincode
                            }))
                            setErrors(prev => ({ ...prev, pincode: '' }))
                        }
                        } catch (err) {}
                    }
                    }}
                />
                {formData.city && formData.state && (
                    <div className="mt-1 flex items-center gap-1 ml-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-wide">{formData.city}, {formData.state}</span>
                    </div>
                )}
                {errors.pincode && <div className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.pincode}</div>}
            </div>
        </div>
        
        {/* Row 3: Address Textarea */}
        <div>
           <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">Complete Address</label>
           <textarea 
             className={`w-full rounded-xl border-2 p-3 md:p-4 font-medium text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all resize-none ${errors.line1 ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-brand focus:bg-brand/5'}`} 
             placeholder="House No, Building, Street, Area" 
             value={formData.line1}
             rows={2}
             onChange={(e) => updateField('line1', e.target.value)}
           />
           {errors.line1 && <div className="mt-1 text-[10px] font-bold text-red-500 ml-1">{errors.line1}</div>}
        </div>

      </div>
      
      <div className="flex items-center gap-3 pt-2">
        <button 
          type="button" 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-xl bg-brand text-white text-lg font-black shadow-xl shadow-brand/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isSubmitting ? 'Saving...' : 'Save Address & Pay'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="px-6 h-14 rounded-xl border-2 border-slate-100 font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>}
      </div>
    </div>
  )
}