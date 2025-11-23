// src/app/admin/dropshipper-add/page.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
export default function AddFreeDropshipper() {
  const [emailOrId, setEmailOrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const handleAdd = async () => {
    if (!emailOrId.trim()) {
      setMessage({type: 'error', text: 'Please enter an email or user ID'});
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/customers/make-dropshipper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: emailOrId.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({type: 'success', text: 'User has been upgraded to a free dropshipper!'});
        setEmailOrId('');
      } else {
        setMessage({type: 'error', text: data.error || 'Failed to add dropshipper'});
      }
    } catch (err: any) {
      setMessage({type: 'error', text: err.message || 'Unexpected error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Free Dropshipper</h2>
        <p className="mb-4 text-gray-600">
          Upgrade any existing user to a dropshipper without any payment required.
        </p>
        <input
          type="text"
          placeholder="User email or ID"
          value={emailOrId}
          onChange={e => setEmailOrId(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
        >
          {loading ? 'Processing…' : 'Add as Free Dropshipper'}
        </button>
        {message && (
          <div className={`mt-4 flex items-center gap-2 text-sm p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}
      </div>
    </main>
  );
}
