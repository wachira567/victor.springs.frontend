import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const AdminReports = () => {
  // Placeholder until API endpoint is created
  const [reports, setReports] = useState({
    totalPayments: 1250000,
    recentTransactions: [],
    monthlyGrowth: 15.2,
    propertyCategories: {}
  })

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
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
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
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
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
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Payment History Analytics</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-1">Real-time payment data integration will appear here showcasing agreement fees and property payouts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminReports
