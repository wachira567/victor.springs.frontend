import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Users, 
  Building2, 
  Shield, 
  TrendingUp, 
  MoreHorizontal,
  Check,
  X,
  Eye,
  Trash2,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { getInitials, formatPrice, formatDate } from '@/lib/utils'

// Simple Table components since we don't have the full shadcn table
const SimpleTable = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">{children}</table>
  </div>
)

const SimpleTableHeader = ({ children }) => (
  <thead className="bg-gray-50 border-b">{children}</thead>
)

const SimpleTableBody = ({ children }) => (
  <tbody className="divide-y">{children}</tbody>
)

const SimpleTableRow = ({ children, className }) => (
  <tr className={className}>{children}</tr>
)

const SimpleTableHead = ({ children, className }) => (
  <th className={`px-4 py-3 text-left font-medium text-gray-500 ${className}`}>{children}</th>
)

const SimpleTableCell = ({ children, className }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Redirect if not admin
  if (!hasRole('super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <Button onClick={() => navigate('/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [recentUsers, setRecentUsers] = useState([])
  const [allProperties, setAllProperties] = useState([])
  const [pendingProperties, setPendingProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const headers = { Authorization: `Bearer ${token}` }
        
        const [usersRes, propertiesRes, pendingRes] = await Promise.all([
          axios.get(`${API_URL}/users/`, { headers }),
          axios.get(`${API_URL}/properties/?per_page=1000`, { headers }),
          axios.get(`${API_URL}/properties/pending`, { headers })
        ])
        
        setRecentUsers(usersRes.data.users || [])
        setAllProperties(propertiesRes.data.properties || [])
        setPendingProperties(pendingRes.data.properties || [])
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const stats = {
    totalUsers: recentUsers.length,
    totalProperties: allProperties.length,
    pendingApprovals: pendingProperties.length,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-victor-green" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, properties, and platform settings</p>
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
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.monthlyRevenue)}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+15% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals
              {stats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Users</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-victor-green text-white text-sm">
                              {getInitials(user.name || user.firstName || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || `${user.firstName} ${user.lastName}`}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pending Approvals</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('approvals')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingProperties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium line-clamp-1">{property.title}</p>
                          <p className="text-sm text-gray-500">by {property.landlord?.name || property.landlord?.firstName || 'Unknown'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SimpleTable>
                  <SimpleTableHeader>
                    <SimpleTableRow>
                      <SimpleTableHead>User</SimpleTableHead>
                      <SimpleTableHead>Role</SimpleTableHead>
                      <SimpleTableHead>Status</SimpleTableHead>
                      <SimpleTableHead>Joined</SimpleTableHead>
                      <SimpleTableHead>Actions</SimpleTableHead>
                    </SimpleTableRow>
                  </SimpleTableHeader>
                  <SimpleTableBody>
                    {recentUsers.map((user) => (
                      <SimpleTableRow key={user.id}>
                        <SimpleTableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-victor-green text-white text-xs">
                                {getInitials(user.name || user.firstName || 'U')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name || `${user.firstName} ${user.lastName}`}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </SimpleTableCell>
                        <SimpleTableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </SimpleTableCell>
                        <SimpleTableCell>{user.status || (user.is_active ? 'active' : 'inactive')}</SimpleTableCell>
                        <SimpleTableCell>{formatDate(user.created_at || user.joined)}</SimpleTableCell>
                        <SimpleTableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SimpleTableCell>
                      </SimpleTableRow>
                    ))}
                  </SimpleTableBody>
                </SimpleTable>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>All Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Property management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Property Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingProperties.map((property) => (
                    <div key={property.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{property.title}</h4>
                          <p className="text-sm text-gray-500">Landlord: {property.landlord?.name || property.landlord?.firstName || 'Unknown'}</p>
                          <p className="text-victor-green font-medium mt-1">
                            {formatPrice(property.price)}/month
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Submitted {formatDate(property.created_at || property.submittedAt)}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(property.status)}>
                          {property.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-victor-green hover:bg-victor-green-dark">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50">
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
