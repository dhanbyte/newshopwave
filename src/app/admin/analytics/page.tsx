'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, Users, DollarSign, ShoppingCart, Calendar } from 'lucide-react'
import { format, subDays } from 'date-fns'

interface AnalyticsData {
  summary: {
    total_revenue: number
    total_orders: number
    total_products: number
    total_customers: number
    revenue_growth: number
    orders_growth: number
  }
  sales_trend: Array<{
    date: string
    revenue: number
    orders: number
  }>
  top_products: Array<{
    name: string
    sales: number
    revenue: number
  }>
  top_dropshippers: Array<{
    name: string
    dropshipper_id: string
    orders: number
    revenue: number
  }>
  category_sales: Array<{
    category: string
    value: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?days=${dateRange}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Analytics Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-600" size={20} />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">₹{data.summary.total_revenue.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${data.summary.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.summary.revenue_growth >= 0 ? '↑' : '↓'} {Math.abs(data.summary.revenue_growth)}% vs last period
              </p>
            </div>
            <DollarSign className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{data.summary.total_orders}</p>
              <p className={`text-sm mt-1 ${data.summary.orders_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.summary.orders_growth >= 0 ? '↑' : '↓'} {Math.abs(data.summary.orders_growth)}% vs last period
              </p>
            </div>
            <ShoppingCart className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">{data.summary.total_products}</p>
              <p className="text-sm text-gray-500 mt-1">Active listings</p>
            </div>
            <Package className="text-purple-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800">{data.summary.total_customers}</p>
              <p className="text-sm text-gray-500 mt-1">Registered users</p>
            </div>
            <Users className="text-yellow-500" size={40} />
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">📈 Sales Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.sales_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🏆 Top Products</h2>
          <div className="space-y-4">
            {data.top_products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} units sold</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Dropshippers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">👥 Top Dropshippers</h2>
          <div className="space-y-4">
            {data.top_dropshippers.map((ds, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{ds.name}</p>
                    <p className="text-sm text-gray-600">{ds.dropshipper_id} • {ds.orders} orders</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">₹{ds.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Sales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Sales by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.category_sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Revenue (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
