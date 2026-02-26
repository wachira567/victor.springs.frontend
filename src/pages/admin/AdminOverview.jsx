import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Building2, Shield, TrendingUp, Check, X } from 'lucide-react'
import { getInitials, formatPrice, formatDate } from '@/lib/utils'

const AdminOverview = () => {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [recentUsers, setRecentUsers] = useState([])
  const [allProperties, setAllProperties] = useState([])
  const [pendingProperties, setPendingProperties] = useState([])
  const [allKyc, setAllKyc] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const headers = { Authorization: `Bearer ${token}` }
        
        const [usersRes, propertiesRes, pendingRes, kycRes] = await Promise.all([
          axios.get(`${API_URL}/users/`, { headers }),
          axios.get(`${API_URL}/properties/?per_page=1000`, { headers }),
          axios.get(`${API_URL}/properties/pending`, { headers }),
          axios.get(`${API_URL}/users/kyc/all`, { headers })
        ])
        
        setRecentUsers(usersRes.data.users || [])
        setAllProperties(propertiesRes.data.properties || [])
        setPendingProperties(pendingRes.data.properties || [])
        setAllKyc(kycRes.data.requests || [])
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdminData()
  }, [API_URL])

  const pendingKycCount = allKyc.filter(req => req.user.verification_status === 'pending').length

  const stats = {
    totalUsers: recentUsers.length,
    totalProperties: allProperties.length,
    pendingApprovals: pendingProperties.length,
    pendingKyc: pendingKycCount,
    monthlyRevenue: 0,
    userGrowth: 12.5,
    propertyGrowth: 8.3,
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      pending_review: 'bg-blue-100 text-blue-800',
      fee_pending: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading overview data...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Quick insights into platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+{stats.userGrowth}% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Properties</p>
                <p className="text-2xl font-bold">{stats.totalProperties.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+{stats.propertyGrowth}% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Requires action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending KYC</p>
                <p className="text-2xl font-bold">{stats.pendingKyc}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Requires verification</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-victor-green text-white text-sm">
                        {getInitials(u.name || u.firstName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.name || `${u.firstName} ${u.lastName}`}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(u.status)}>
                    {u.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Needs Approval</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/properties')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProperties.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">All caught up!</p>
              ) : (
                pendingProperties.slice(0, 3).map((property) => (
                  <div key={property.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium line-clamp-1">{property.title}</p>
                      <p className="text-sm text-gray-500">by {property.landlord?.name || property.landlord?.firstName || 'Unknown'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8 text-green-600" onClick={() => navigate('/admin/properties')}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminOverview
