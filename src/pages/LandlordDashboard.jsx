import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  Plus, 
  TrendingUp, 
  Users, 
  Eye,
  Phone,
  Mail,
  Calendar,
  Check,
  Clock,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

const LandlordDashboard = () => {
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Redirect if not landlord
  if (!hasRole(['landlord', 'super_admin'])) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              This dashboard is only available for landlords.
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
  const inquiries = []
  const [myProperties, setMyProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const response = await axios.get(`${API_URL}/properties/my-properties`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMyProperties(response.data.properties || [])
      } catch (error) {
        console.error('Error fetching landlord properties:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMyProperties()
  }, [])

  const stats = {
    totalProperties: myProperties.length,
    activeListings: myProperties.filter(p => p.status === 'active' || p.status === 'approved').length,
    totalViews: myProperties.reduce((acc, p) => acc + (p.views || 0), 0),
    inquiries: myProperties.reduce((acc, p) => acc + (p.inquiries_count || 0), 0),
    occupancyRate: myProperties.length > 0 
      ? Math.round((myProperties.filter(p => p.status === 'rented').length / myProperties.length) * 100)
      : 0,
    monthlyIncome: myProperties
      .filter(p => p.status === 'rented')
      .reduce((acc, p) => acc + (p.price || 0), 0),
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rented: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
      new: 'bg-red-100 text-red-800',
      responded: 'bg-green-100 text-green-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
            <p className="text-gray-600">Manage your properties and tenant inquiries</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-victor-green hover:bg-victor-green-dark"
            onClick={() => navigate('/submit-property')}
          >
            <Plus className="h-4 w-4 mr-2" />
            List New Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">My Properties</p>
                  <p className="text-2xl font-bold">{stats.totalProperties}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {stats.activeListings} active listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12% this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inquiries</p>
                  <p className="text-2xl font-bold">{stats.inquiries}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                5 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monthly Income</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.monthlyIncome)}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Rate */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Occupancy Rate</h3>
                <p className="text-sm text-gray-500">{stats.occupancyRate}% of your properties are rented</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-victor-green">{stats.occupancyRate}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-victor-green h-2.5 rounded-full transition-all" 
                style={{ width: `${stats.occupancyRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="inquiries">
              Inquiries
              {inquiries.filter(i => i.status === 'new').length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {inquiries.filter(i => i.status === 'new').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Properties */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Properties</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('properties')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProperties.slice(0, 3).map((property) => (
                      <div 
                        key={property.id} 
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=150&fit=crop'}
                          alt={property.title}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1">{property.title}</h4>
                          <p className="text-sm text-gray-500">{property.city}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-victor-green font-semibold text-sm">
                              {formatPrice(property.price)}/mo
                            </p>
                            <Badge className={getStatusBadge(property.status)}>
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Inquiries */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Inquiries</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('inquiries')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{inquiry.tenant}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{inquiry.property}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">"{inquiry.message}"</p>
                          </div>
                          <Badge className={getStatusBadge(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{inquiry.receivedAt}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Properties</CardTitle>
                <Button onClick={() => navigate('/submit-property')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=150&fit=crop'}
                          alt={property.title}
                          className="w-full h-40 object-cover"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${getStatusBadge(property.status)}`}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold line-clamp-1">{property.title}</h4>
                        <p className="text-sm text-gray-500">{property.city}</p>
                        <p className="text-victor-green font-bold mt-2">
                          {formatPrice(property.price)}/mo
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {property.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {property.inquiries}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>All Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{inquiry.tenant}</h4>
                            <Badge className={getStatusBadge(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-victor-green mt-1">{inquiry.property}</p>
                          <p className="text-gray-600 mt-2">"{inquiry.message}"</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {inquiry.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {inquiry.email}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {inquiry.receivedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="bg-victor-green hover:bg-victor-green-dark">
                          <Check className="h-4 w-4 mr-2" />
                          Mark Responded
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
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

export default LandlordDashboard
