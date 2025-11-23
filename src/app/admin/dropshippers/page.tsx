'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserPlus, X } from 'lucide-react';

interface Dropshipper {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  dropshipper_id: string;
  dropshipper_status: string;
  dropshipper_earnings: number;
  dropshipper_phone: string;
  dropshipper_address: string;
  dropshipper_payment_id: string;
  dropshipper_account_number: string;
  dropshipper_ifsc: string;
  dropshipper_bank_name: string;
  dropshipper_aadhar_number: string;
  dropshipper_photo: string | null;
  dropshipper_aadhar_photo: string | null;
  created_at: string;
  updated_at: string;
}

const DropshipperPage: React.FC = () => {
  const router = useRouter();
  const [dropshippers, setDropshippers] = useState<Dropshipper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addMessage, setAddMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    phone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    aadharNumber: '',
    photo: '',
    photoPreview: ''
  });

  const fetchDropshippers = async () => {
    try {
      console.log('🔄 Fetching dropshippers...');
      setLoading(true);
      const res = await fetch('/api/admin/dropshippers');
      const data = await res.json();
      console.log('📦 Received data:', data);
      if (data.success) {
        console.log(`✅ Setting ${data.dropshippers?.length || 0} dropshippers to state`);
        setDropshippers(data.dropshippers || []);
        console.log('✅ State updated successfully');
      } else {
        console.error('❌ API returned error:', data.error);
        setError(data.error || 'Failed to load dropshippers');
      }
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropshippers();
  }, []);

  const handleAddDropshipper = async () => {
    if (!formData.userId.trim()) {
      setAddMessage({type: 'error', text: 'User ID/Email is required'});
      return;
    }
    setAddLoading(true);
    setAddMessage(null);
    try {
      const response = await fetch('/api/admin/customers/make-dropshipper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setAddMessage({type: 'success', text: `User upgraded! Dropshipper ID: ${data.dropshipperId}`});
        setFormData({
          userId: '',
          name: '',
          phone: '',
          address: '',
          bankName: '',
          accountNumber: '',
          ifsc: '',
          aadharNumber: '',
          photo: '',
          photoPreview: ''
        });
        // Refresh the dropshippers list immediately
        await fetchDropshippers();
        // Close modal after 1.5 seconds
        setTimeout(() => {
          setShowModal(false);
          setAddMessage(null);
        }, 1500);
      } else {
        setAddMessage({type: 'error', text: data.error || 'Failed to add dropshipper'});
      }
    } catch (err: any) {
      setAddMessage({type: 'error', text: err.message || 'Unexpected error'});
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading dropshippers...</p></div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  console.log('🎨 Rendering page with dropshippers:', dropshippers.length);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Dropshippers ({dropshippers.length})</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <UserPlus size={20} />
          Add Dropshipper
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add Free Dropshipper (1 Year)</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({
                    userId: '',
                    name: '',
                    phone: '',
                    address: '',
                    bankName: '',
                    accountNumber: '',
                    ifsc: '',
                    aadharNumber: '',
                    photo: '',
                    photoPreview: ''
                  });
                  setAddMessage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Fill in the details to upgrade a user to dropshipper with 1-year free subscription.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {formData.photoPreview && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                      <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded border border-blue-300 transition-colors">
                    <span>{formData.photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={addLoading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              ...formData,
                              photo: reader.result as string,
                              photoPreview: reader.result as string
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {formData.photoPreview && (
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, photo: '', photoPreview: ''})}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={addLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* User ID/Email - Required */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email or ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="user@example.com or user_123"
                  value={formData.userId}
                  onChange={e => setFormData({...formData, userId: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                <textarea
                  placeholder="Street, City, State, Pincode"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                  disabled={addLoading}
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="State Bank of India"
                  value={formData.bankName}
                  onChange={e => setFormData({...formData, bankName: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={formData.accountNumber}
                  onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  placeholder="SBIN0001234"
                  value={formData.ifsc}
                  onChange={e => setFormData({...formData, ifsc: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                />
              </div>

              {/* Aadhar Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012"
                  value={formData.aadharNumber}
                  onChange={e => setFormData({...formData, aadharNumber: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={addLoading}
                />
              </div>
            </div>

            <button
              onClick={handleAddDropshipper}
              disabled={addLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
            >
              {addLoading ? 'Processing…' : 'Add as Free Dropshipper (1 Year)'}
            </button>
            
            {addMessage && (
              <div className={`mt-4 p-3 rounded ${addMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {addMessage.text}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {console.log('🎨 Rendering dropshippers. Count:', dropshippers.length)}
        {dropshippers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-xl mb-2">No dropshippers found</p>
            <p className="text-sm">Click "Add Dropshipper" to add your first dropshipper</p>
          </div>
        ) : (
          dropshippers.map((d) => {
            console.log('🎨 Rendering card for:', d.name, 'ID:', d.dropshipper_id);
            return (
              <div key={d.dropshipper_id || d.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-48 w-full bg-gray-200">
                  {d.dropshipper_photo ? (
                    <Image src={d.dropshipper_photo} alt={d.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">No Photo</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{d.name || 'Unnamed Dropshipper'}</h2>
                  <p className="text-sm text-gray-600 mb-1"><strong>ID:</strong> {d.dropshipper_id}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Status:</strong> {d.dropshipper_status}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Earnings:</strong> ₹{d.dropshipper_earnings || 0}</p>
                  <p className="text-sm text-gray-600"><strong>Phone:</strong> {d.dropshipper_phone || 'N/A'}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DropshipperPage;