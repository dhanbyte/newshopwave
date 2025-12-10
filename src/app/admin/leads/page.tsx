'use client'

import { useState, useEffect } from 'react'
import { Calendar, Search, User, Phone, Globe, Briefcase, ExternalLink, Loader2, Download } from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  selling_platforms: string
  market: string
  experience: string
  status: string
  created_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      console.log('Fetching leads...')
      const res = await fetch('/api/admin/leads', { cache: 'no-store' })
      const data = await res.json()
      console.log('Leads data:', data)
      setDebugInfo(JSON.stringify(data, null, 2))
      
      if (data.success) {
        setLeads(data.leads || [])
      } else {
        console.error('API Error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      setDebugInfo('Fetch error: ' + String(error))
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.selling_platforms.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Function to format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  const openWhatsApp = (lead: Lead) => {
    // Remove non-numeric characters and ensure it starts with country code if missing (assuming 91 for India)
    let cleanPhone = lead.phone.replace(/\D/g, '')
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone

    const message = `Hello ${lead.name},

Thank you for your interest in joining ShopWave as a Dropshipper!

Here are the details you submitted:
- Platforms: ${lead.selling_platforms}
- Market: ${lead.market}
- Experience: ${lead.experience}

We would like to proceed with your onboarding. Please let us know a good time to connect.`

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const exportToCSV = () => {
    if (leads.length === 0) return

    // Define CSV headers
    const headers = ['Date & Time', 'Name', 'Phone', 'Platforms', 'Market', 'Experience', 'Status']
    
    // Map data to CSV rows
    const rows = leads.map(lead => [
      `"${new Date(lead.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}"`, // Format: DD/MM/YYYY, HH:MM:SS am/pm
      `"${lead.name}"`, // Quote name to handle commas
      lead.phone,
      `"${lead.selling_platforms}"`, 
      lead.market,
      lead.experience,
      lead.status
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Filename: dropshipper_leads_[COUNT]_rows_[TIMESTAMP].csv
    // Example: dropshipper_leads_15_rows_2024-12-10_10-30-00.csv
    const now = new Date()
    const timestamp = now.toISOString().split('T')[0] + '_' + now.toTimeString().split(' ')[0].replace(/:/g, '-')
    const filename = `dropshipper_leads_${leads.length}_rows_${timestamp}.csv`

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dropshipper Leads</h1>
          <p className="text-gray-500 mt-1">Manage and track potential dropshippers</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLeads}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh Leads"
          >
            <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </button>

          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm text-gray-600">
            Total Leads: <span className="font-bold text-gray-900">{leads.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search by name, phone, or platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Name & Phone</th>
                <th className="px-6 py-4 font-medium">Platforms</th>
                <th className="px-6 py-4 font-medium">Market & Experience</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading leads...
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {lead.name}
                      </div>
                      <div className="text-gray-500 flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {lead.selling_platforms.split(',').map((p, i) => (
                          <span key={i} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {p.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {lead.market}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-gray-700">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {lead.experience} Experience
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openWhatsApp(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Chat on WA
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Debug Information:</h3>
        <pre className="text-xs text-gray-800 overflow-auto max-h-40 whitespace-pre-wrap">
          {debugInfo || 'No debug data yet...'}
        </pre>
      </div>
    </div>
  )
}
