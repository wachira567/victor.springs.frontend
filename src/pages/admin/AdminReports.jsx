import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  Filter
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AdminReports = () => {
  const [reports, setReports] = useState({
    totalPayments: 0,
    recentTransactions: [],
    monthlyGrowth: 0,
    activeLandlords: 0,
    agreementConversions: 0,
    distribution: {}
  })
  const [timeRange, setTimeRange] = useState('month')
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  const fetchReports = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      const res = await axios.get(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { range: timeRange }
      })
      setReports(res.data)
    } catch (err) {
      console.error('Failed to fetch reports', err)
    } finally {
      setIsLoading(false)
    }
  }, [API_URL, timeRange])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 mb-4`}>
            <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          {trend && (
            <div className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-victor-green rounded-xl shadow-lg shadow-victor-green/20">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Business Intelligence</h1>
            <p className="text-sm text-gray-500">Real-time platform performance & financial metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 mr-1" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Current Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Full Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gross Revenue" 
          value={formatPrice(reports.totalPayments)} 
          icon={DollarSign}
          trend={reports.monthlyGrowth}
          colorClass="bg-green-500"
        />
        <StatCard 
          title="Active Landlords" 
          value={reports.activeLandlords} 
          icon={Users}
          trend={5.2}
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Verified Tenants" 
          value={reports.agreementConversions} 
          icon={ShieldCheck}
          trend={12.8}
          colorClass="bg-purple-500"
        />
        <StatCard 
          title="New Properties" 
          value="24" 
          icon={Building2}
          trend={-2.4}
          colorClass="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Mix Chart (Simulated with simple bars) */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-gray-400" /> Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-4">
            {Object.entries(reports.distribution || {}).map(([type, count]) => (
              <div key={type} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <span>{count} Tx</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${type === 'agreement_fee' ? 'bg-victor-green' : 'bg-blue-500'}`} 
                    style={{ width: `${Math.min(100, (count / reports.agreementConversions) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(reports.distribution || {}).length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                    No data available for this range
                </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-base">Latest Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 bg-white uppercase border-b">
                  <tr>
                    <th className="px-6 py-4">Receipt</th>
                    <th className="px-6 py-4">Tenant</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {reports.recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{tx.mpesa_receipt || '---'}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{tx.tenant_name}</td>
                      <td className="px-6 py-4 text-xs capitalize text-gray-500">{tx.payment_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(tx.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {reports.recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 animate-pulse">
                        Awaiting new transaction data...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Simple Icon fallback
const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
)

export default AdminReports
