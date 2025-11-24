'use client'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { X, Upload, User, Phone, MapPin, CreditCard, FileText } from 'lucide-react'

interface DropshipperRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  loading: boolean
}

export default function DropshipperRegistrationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading
}: DropshipperRegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    photo: null as File | null,
    name: '',
    phone: '',
    address: '',
    accountNumber: '',
    ifsc: '',
    bankName: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-[95vw] sm:w-[90vw] md:w-[85vw] lg:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h2 className="text-base sm:text-lg font-bold">🚀 Become a Dropshipper</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 text-center">
            Step {step} of 3
          </div>
        </div>

        {/* Form Content */}
        <div className="p-3 sm:p-4">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Demo Video & Price Comparison Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                {/* Video Button */}
                <button
                  onClick={() => window.open('https://youtu.be/1uBBLhBGjPg', '_blank')}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] mb-4 flex items-center justify-center gap-3"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-lg">🎥 Watch How It Works</span>
                </button>

                {/* Price Comparison */}
                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2 text-center">Why Join? See the Difference! 👇</h4>
                  <div className="flex items-center justify-between gap-2 text-center">
                    <div className="flex-1 p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Customer Price</div>
                      <div className="font-bold text-gray-900 text-lg">₹1,999</div>
                      <div className="text-[10px] text-gray-400">For Normal Users</div>
                    </div>
                    <div className="font-bold text-xl text-blue-500">VS</div>
                    <div className="flex-1 p-2 bg-green-50 rounded border border-green-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-bl">WIN</div>
                      <div className="text-xs text-green-600 mb-1 font-semibold">Your Price</div>
                      <div className="font-bold text-green-700 text-lg">₹499</div>
                      <div className="text-[10px] text-green-600 font-medium">Save ₹1,500! 🤑</div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold flex items-center gap-2 border-t pt-4">
                <User className="h-4 w-4" />
                Personal Information
              </h3>
              
              {/* Profile Photo */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2 overflow-hidden bg-gray-50">
                  {formData.photo ? (
                    <img src={URL.createObjectURL(formData.photo)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 inline-flex items-center gap-2 transition-colors shadow-sm">
                  <Upload className="w-4 h-4" />
                  Upload Profile Photo *
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="min-h-[48px]"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Complete Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete address with pincode"
                  className="w-full px-3 py-3 border rounded-lg resize-none min-h-[80px]"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Bank Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Bank Account Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name *</label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Enter bank name"
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Number *</label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code *</label>
                <Input
                  value={formData.ifsc}
                  onChange={(e) => handleInputChange('ifsc', e.target.value)}
                  placeholder="Enter IFSC code"
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
                <p className="text-sm text-green-800">
                  ✅ Complete your registration to start earning with exclusive dropshipper prices!
                </p>
              </div>
            </div>
          )}


        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t flex justify-between gap-2">
          <Button 
            onClick={handlePrev} 
            variant="outline" 
            disabled={step === 1}
            className="min-h-[48px] flex-1 sm:flex-initial"
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext} className="min-h-[48px] flex-1 sm:flex-initial">
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !formData.photo}
              className="bg-green-600 hover:bg-green-700 min-h-[48px] flex-1 sm:flex-initial"
            >
              {loading ? 'Processing...' : 'Complete Registration'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}