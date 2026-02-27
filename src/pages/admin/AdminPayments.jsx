import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [paymentType, setPaymentType] = useState('all')
  const [page, setPage] = useState(1)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  const fetchPayments = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      const params = {
        page,
        per_page: 15,
        status: status === 'all' ? '' : status,
        payment_type: paymentType === 'all' ? '' : paymentType,
        search
      }
      
      const res = await axios.get(`${API_URL}/payments/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })
      
      setPayments(res.data.payments || [])
      setPagination(res.data.pagination)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to load payments')
    } finally {
      setIsLoading(false)
    }
  }, [API_URL, page, status, paymentType, search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPayments()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [fetchPayments])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 flex gap-1 items-center"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 flex gap-1 items-center"><XCircle className="h-3 w-3" /> Failed</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 flex gap-1 items-center"><Clock className="h-3 w-3" /> Processing</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 flex gap-1 items-center"><Clock className="h-3 w-3" /> Pending</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-500 text-sm">Monitor and filter all platform transactions</p>
        </div>
        <Button variant="outline" className="flex gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search name, email, receipt..." 
                className="pl-10"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            
            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentType} onValueChange={(val) => { setPaymentType(val); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="agreement_fee">Agreement Fee</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="deposit">Security Deposit</SelectItem>
                <SelectItem value="service_fee">Service Fee</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => { setSearch(''); setStatus('all'); setPaymentType('all'); setPage(1); }}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
                <tr>
                  <th className="px-6 py-4">Tenant / User</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">M-Pesa Receipt</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="7" className="px-6 py-4 bg-gray-50/50"></td>
                    </tr>
                  ))
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No payments found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{payment.user?.name || 'Unknown User'}</span>
                          <span className="text-xs text-gray-500">{payment.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-gray-600">{payment.payment_type.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{formatPrice(payment.amount)}</span>
                      </td>
                      <td className="px-6 py-4 italic font-mono text-xs">
                        {payment.mpesa_receipt_number || '---'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && pagination.pages > 1 && (
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing page <span className="font-medium text-gray-900">{pagination.page}</span> of <span className="font-medium text-gray-900">{pagination.pages}</span> ({pagination.total} total)
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPayments
