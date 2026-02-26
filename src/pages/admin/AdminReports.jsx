import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import axios from 'axios'

const AdminReports = () => {
  const [reports, setReports] = useState({
    totalPayments: 0,
    recentTransactions: [],
    monthlyGrowth: 0,
    activeLandlords: 0,
    agreementConversions: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      const res = await axios.get(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports({
        ...reports,
        totalPayments: res.data.totalPayments || 0,
        activeLandlords: res.data.activeLandlords || 0,
        agreementConversions: res.data.agreementConversions || 0,
        recentTransactions: res.data.recentTransactions || [],
        monthlyGrowth: res.data.monthlyGrowth || 0
      })
    } catch (err) {
      console.error('Failed to fetch reports', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-victor-green" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Business insights, payment tracking, and platform performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-victor-green to-victor-blue text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-white/80 mb-1">Total Payment Volume</p>
                <h3 className="text-3xl font-bold">{formatPrice(reports.totalPayments)}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1 text-green-300" />
              <span className="text-green-200">+{reports.monthlyGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-500 mb-1">Active Landlords</p>
                <h3 className="text-3xl font-bold text-gray-900">{reports.activeLandlords}</h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Platform adoption rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-500 mb-1">Agreement Conversions</p>
                <h3 className="text-3xl font-bold text-gray-900">{reports.agreementConversions}</h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Completed KYC verifications</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Recent Transactions</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-1">Payment data integration will appear here showcasing agreement fees and property payouts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">{tx.transaction_id || 'N/A'}</td>
                      <td className="px-6 py-4">{formatPrice(tx.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{tx.created_at ? formatDate(tx.created_at) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminReports
