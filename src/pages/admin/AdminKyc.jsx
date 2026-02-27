import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, Eye, Check, X, ShieldCheck, Search, Filter, ArrowUpDown, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const AdminKyc = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [allKyc, setAllKyc] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, verified, rejected
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, name_asc, name_desc
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const headers = { Authorization: `Bearer ${token}` }
        const { data } = await axios.get(`${API_URL}/users/kyc/all`, { headers })
        setAllKyc(data.requests || [])
      } catch (error) {
        console.error('Error fetching KYC:', error)
        toast.error('Failed to load KYC records')
      } finally {
        setIsLoading(false)
      }
    }
    fetchKyc()
  }, [API_URL])

  const handleApproveKyc = async (userId) => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.post(`${API_URL}/users/kyc/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllKyc(prev => prev.map(req => {
        if (req.user.id === userId) {
          return { ...req, user: { ...req.user, verification_status: 'verified' } }
        }
        return req
      }))
      toast.success('KYC Approved')
    } catch (error) {
      console.error('Failed to approve KYC', error)
      toast.error(error.response?.data?.message || 'Failed to approve KYC')
    }
  }

  const handleRejectKyc = async (userId) => {
    const reason = prompt("Reason for rejection:")
    if (!reason) return
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.post(`${API_URL}/users/kyc/${userId}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllKyc(prev => prev.map(req => {
        if (req.user.id === userId) {
          return { ...req, user: { ...req.user, verification_status: 'rejected' } }
        }
        return req
      }))
      toast.success('KYC Rejected')
    } catch (error) {
      console.error('Failed to reject KYC', error)
      toast.error(error.response?.data?.message || 'Failed to reject KYC')
    }
  }

  const exportKycToCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'ID Number', 'Submitted Date']
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + filteredKyc.map(req => {
          const u = req.user
          const submittedDate = req.documents?.length > 0 ? req.documents[0].created_at : ''
          return `"${u.name}","${u.email}","${u.phone}","${u.role}","${u.verification_status}","${u.id_number || ''}","${submittedDate}"`
      }).join('\n')
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "victor_springs_kyc_logs.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered + sorted records
  const filteredKyc = useMemo(() => {
    let result = [...allKyc]

    // Search by name or email
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(req => 
        (req.user.name || '').toLowerCase().includes(q) ||
        (req.user.email || '').toLowerCase().includes(q) ||
        (req.user.phone || '').toLowerCase().includes(q) ||
        (req.user.id_number || '').toLowerCase().includes(q)
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(req => req.user.verification_status === filterStatus)
    }

    // Filter by date range
    if (dateFrom) {
      const from = new Date(dateFrom)
      result = result.filter(req => {
        const submittedDate = req.documents?.length > 0 ? new Date(req.documents[0].created_at) : null
        return submittedDate && submittedDate >= from
      })
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      result = result.filter(req => {
        const submittedDate = req.documents?.length > 0 ? new Date(req.documents[0].created_at) : null
        return submittedDate && submittedDate <= to
      })
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest': {
          const dateA = a.documents?.length > 0 ? new Date(a.documents[0].created_at) : new Date(0)
          const dateB = b.documents?.length > 0 ? new Date(b.documents[0].created_at) : new Date(0)
          return dateA - dateB
        }
        case 'newest': {
          const dateA = a.documents?.length > 0 ? new Date(a.documents[0].created_at) : new Date(0)
          const dateB = b.documents?.length > 0 ? new Date(b.documents[0].created_at) : new Date(0)
          return dateB - dateA
        }
        case 'name_asc':
          return (a.user.name || '').localeCompare(b.user.name || '')
        case 'name_desc':
          return (b.user.name || '').localeCompare(a.user.name || '')
        default:
          return 0
      }
    })

    return result
  }, [allKyc, searchQuery, filterStatus, sortBy, dateFrom, dateTo])

  const statusCounts = useMemo(() => {
    const counts = { all: allKyc.length, pending: 0, verified: 0, rejected: 0 }
    allKyc.forEach(req => {
      if (req.user.verification_status === 'pending') counts.pending++
      else if (req.user.verification_status === 'verified') counts.verified++
      else if (req.user.verification_status === 'rejected') counts.rejected++
    })
    return counts
  }, [allKyc])

  const clearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setSortBy('newest')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || sortBy !== 'newest' || dateFrom || dateTo

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-victor-green" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC Verifications</h1>
            <p className="text-sm text-gray-500">Review and manage identity verification requests.</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportKycToCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Records', value: statusCounts.all, color: 'bg-blue-50 text-blue-700', filter: 'all' },
          { label: 'Pending Review', value: statusCounts.pending, color: 'bg-yellow-50 text-yellow-700', filter: 'pending' },
          { label: 'Verified', value: statusCounts.verified, color: 'bg-green-50 text-green-700', filter: 'verified' },
          { label: 'Rejected', value: statusCounts.rejected, color: 'bg-red-50 text-red-700', filter: 'rejected' },
        ].map((stat) => (
          <Card 
            key={stat.label} 
            className={`cursor-pointer transition-all ${filterStatus === stat.filter ? 'ring-2 ring-victor-green' : 'hover:shadow-md'}`}
            onClick={() => setFilterStatus(stat.filter)}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-xs font-medium mt-1 ${stat.color} px-2 py-0.5 rounded-full inline-block`}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle>Verification Records ({filteredKyc.length})</CardTitle>
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search name, email, phone, ID number..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('verified')}>Verified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>Oldest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name_asc')}>Name A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name_desc')}>Name Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                className="w-[140px] h-9 text-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
              />
              <span className="text-gray-400 text-sm">to</span>
              <Input
                type="date"
                className="w-[140px] h-9 text-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
              />
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-8 animate-pulse">Loading KYC records...</p>
            ) : filteredKyc.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {allKyc.length === 0 ? 'No KYC records found.' : 'No records match your filters.'}
              </p>
            ) : (
              filteredKyc.map(({ user, documents }) => (
                <div key={user.id} className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {user.name} 
                        <span className="text-gray-400 text-sm font-normal ml-2">({user.email})</span>
                      </h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600"><span className="font-medium mr-2">ID Number:</span> {user.id_number || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium mr-2">Phone:</span> {user.phone}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium mr-2">Role:</span> <span className="capitalize">{user.role}</span></p>
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted {documents && documents.length > 0 ? formatDate(documents[0].created_at) : 'recently'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        user.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                        user.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {user.verification_status === 'verified' ? 'Verified' : 
                         user.verification_status === 'rejected' ? 'Rejected' : 'Pending Review'}
                      </Badge>
                      
                      {user.verification_status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => handleApproveKyc(user.id)} className="bg-victor-green hover:bg-victor-green-dark">
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" onClick={() => handleRejectKyc(user.id)} variant="outline" className="text-red-600 hover:bg-red-50">
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}

                      {user.verification_status === 'rejected' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleApproveKyc(user.id)} 
                          className="text-green-600 hover:bg-green-50 mt-2"
                        >
                          <Check className="h-4 w-4 mr-1" /> Re-approve
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                      {documents && documents.map((doc, idx) => {
                        let fileUrl = doc.file_url;
                        if (fileUrl && !fileUrl.startsWith('http')) {
                          fileUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${fileUrl}`;
                        }
                        return (
                        <Button 
                          key={doc.id}
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View {doc.name || `Document ${idx + 1}`}
                        </Button>
                      )})}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminKyc
