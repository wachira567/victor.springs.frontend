import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Home, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings,
  Bell,
  Heart,
  MessageSquare,
  Edit,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock
} from 'lucide-react'
import { getInitials, formatPrice, formatDate } from '@/lib/utils'

const Dashboard = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, updateProfile } = useAuth()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  })

  // Sync tab when URL changes (e.g. from navbar link)
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  // Replaced mock data with State arrays
  const savedProperties = []
  const applications = []
  const notifications = []
  const [scheduledViewings, setScheduledViewings] = useState([])
  const [isLoadingViewings, setIsLoadingViewings] = useState(true)

  useEffect(() => {
    const fetchViewings = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const response = await axios.get(`${API_URL}/visits/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setScheduledViewings(response.data.visits || [])
      } catch (error) {
        console.error('Error fetching viewings:', error)
      } finally {
        setIsLoadingViewings(false)
      }
    }
    fetchViewings()
  }, [])

  const handleSaveProfile = async () => {
    await updateProfile(profileData)
    setIsEditing(false)
  }

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Manage your rentals, viewings, and account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* Profile Summary */}
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-victor-green text-white text-xl">
                      {user ? getInitials(`${user.name || user.firstName}`) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{user?.name || (`${user?.firstName} ${user?.lastName}`)}</h3>
                  <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Shield className="h-4 w-4 text-victor-green" />
                    <span className="text-xs text-victor-green">Verified Account</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-victor-green">{savedProperties.length}</div>
                    <div className="text-xs text-gray-500">Saved</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-victor-blue">{scheduledViewings.length}</div>
                    <div className="text-xs text-gray-500">Viewings</div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'saved', label: 'Saved Properties', icon: Heart },
                    { id: 'viewings', label: 'My Viewings', icon: Calendar },
                    { id: 'applications', label: 'Applications', icon: FileText },
                    { id: 'payments', label: 'Payments', icon: CreditCard },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'profile', label: 'Profile Settings', icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === item.id
                          ? 'bg-victor-green text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      Welcome back, {user?.name || user?.firstName}!
                    </h2>
                    <p className="text-gray-600">
                      Here's what's happening with your rental journey.
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/properties')}>
                    <CardContent className="p-6 text-center">
                      <Home className="h-8 w-8 mx-auto mb-3 text-victor-green" />
                      <h3 className="font-medium">Browse Properties</h3>
                      <p className="text-sm text-gray-500 mt-1">Find your next home</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('saved')}>
                    <CardContent className="p-6 text-center">
                      <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
                      <h3 className="font-medium">Saved ({savedProperties.length})</h3>
                      <p className="text-sm text-gray-500 mt-1">View your favorites</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('viewings')}>
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-3 text-victor-blue" />
                      <h3 className="font-medium">Viewings ({scheduledViewings.length})</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage appointments</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-victor-green'}`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedProperties.map((property) => (
                      <div 
                        key={property.id} 
                        className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-24 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{property.title}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </p>
                          <p className="text-victor-green font-semibold mt-1">
                            {formatPrice(property.price)}/mo
                          </p>
                          <p className="text-xs text-gray-400">
                            Saved {formatDate(property.savedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Viewings Tab */}
            {activeTab === 'viewings' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Viewings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduledViewings.map((viewing) => (
                      <div key={viewing.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-victor-green/10 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-victor-green" />
                          </div>
                          <div>
                            <h4 className="font-medium">{viewing.property?.title || 'Unknown Property'}</h4>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {formatDate(viewing.visit_date)} at {viewing.visit_time}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusBadge(viewing.status)}>
                          {viewing.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                    {isLoadingViewings && <p className="text-center py-4">Loading viewings...</p>}
                    {!isLoadingViewings && scheduledViewings.length === 0 && (
                      <p className="text-center text-gray-500 py-4">You have no scheduled viewings.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{app.property}</h4>
                          <p className="text-sm text-gray-500">
                            Submitted {formatDate(app.submittedAt)}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(app.status)}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Settings</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? 'Save Changes' : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{user?.email}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
