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
    bankName: '',
    aadharNumber: '',
    aadharPhoto: null as File | null
  })

  const totalAmount = 99
  const platformFee = Math.round(totalAmount * 0.14)
  const finalAmount = totalAmount + platformFee

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">🚀 Become a Dropshipper</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 text-center">
            Step {step} of 4
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h3>
              
              {/* Profile Photo */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                  {formData.photo ? (
                    <img src={URL.createObjectURL(formData.photo)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Upload Photo *
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
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
                  className="w-full px-3 py-2 border rounded-lg resize-none h-20"
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Number *</label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">IFSC Code *</label>
                <Input
                  value={formData.ifsc}
                  onChange={(e) => handleInputChange('ifsc', e.target.value)}
                  placeholder="Enter IFSC code"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Aadhar & Payment */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Aadhar & Payment
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aadhar Number *</label>
                <Input
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength={12}
                  required
                />
              </div>

              {/* Aadhar Photo */}
              <div>
                <label className="block text-sm font-medium mb-2">Aadhar Card Photo *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {formData.aadharPhoto ? (
                    <div>
                      <img 
                        src={URL.createObjectURL(formData.aadharPhoto)} 
                        alt="Aadhar" 
                        className="max-w-full h-32 mx-auto object-contain mb-2" 
                      />
                      <p className="text-sm text-green-600">✅ Aadhar photo uploaded</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Upload clear photo of Aadhar card</p>
                    </div>
                  )}
                  <label className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
                    {formData.aadharPhoto ? 'Change Photo' : 'Upload Aadhar'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('aadharPhoto', e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Registration Fee:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (14%):</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-800 border-t pt-1">
                    <span>Total Amount:</span>
                    <span>₹{finalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <Button 
            onClick={handlePrev} 
            variant="outline" 
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !formData.photo || !formData.aadharPhoto}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}