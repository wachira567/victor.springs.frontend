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
  Clock,
  Trash2,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react'
import { getInitials, formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

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
  const [savedProperties, setSavedProperties] = useState([])
  const [applications, setApplications] = useState([])
  const [payments, setPayments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)

  // Filtering states
  const [appFilter, setAppFilter] = useState('all')
  const [payFilter, setPayFilter] = useState('all')
  const [notifFilter, setNotifFilter] = useState('all')

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const [savedRes, appsRes, paymentsRes, auditRes] = await Promise.all([
        axios.get(`${API_URL}/properties/liked`, { headers }),
        axios.get(`${API_URL}/applications/my`, { headers }),
        axios.get(`${API_URL}/payments/my-payments`, { headers }),
        axios.get(`${API_URL}/audit/my`, { headers })
      ])
      
      setSavedProperties(savedRes.data.properties || [])
      setApplications(appsRes.data.applications || [])
      setPayments(paymentsRes.data.payments || [])
      setNotifications(auditRes.data.logs || [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoadingDashboard(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleUnlike = async (e, propertyId) => {
    e.stopPropagation() // Prevent navigation to detail
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.post(`${API_URL}/properties/${propertyId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId))
      toast.success('Property removed from saved list')
    } catch (err) {
      toast.error('Failed to remove property')
    }
  }

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
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-victor-green">{savedProperties.length}</div>
                    <div className="text-xs text-gray-500">Saved Properties</div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'saved', label: 'Saved Properties', icon: Heart },
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
                <Card className="bg-gradient-to-r from-victor-green/10 to-transparent border-victor-green/20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      Welcome back, {user?.name || user?.firstName}!
                    </h2>
                    <p className="text-gray-600">
                      You have {applications.length} ongoing applications and 
                      {savedProperties.length} saved properties.
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Saved Properties</p>
                          <h3 className="text-2xl font-bold text-gray-900">{savedProperties.length}</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg"><Heart className="h-5 w-5 text-red-500" /></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Applications</p>
                          <h3 className="text-2xl font-bold text-gray-900">{applications.length}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg"><FileText className="h-5 w-5 text-blue-500" /></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Payments</p>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {payments.filter(p => p.status === 'completed').length}
                          </h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg"><CreditCard className="h-5 w-5 text-green-500" /></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow group border-dashed" onClick={() => navigate('/properties')}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-victor-green/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Home className="h-6 w-6 text-victor-green" />
                      </div>
                      <h3 className="font-medium">Find More Properties</h3>
                      <p className="text-sm text-gray-500 mt-1">Explore our verified listings</p>
                    </CardContent>
                  </Card>
                  {applications.some(a => a.status === 'confirmed') && (
                    <Card className="cursor-pointer hover:shadow-md transition-shadow group border-victor-green bg-victor-green/5">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-victor-green/20 flex items-center justify-center mx-auto mb-3">
                          <Shield className="h-6 w-6 text-victor-green" />
                        </div>
                        <h3 className="font-medium">Active Tenancy</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage your active rental unit</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Recent Notifications</CardTitle>
                    <Button variant="ghost" size="sm" className="text-victor-green" onClick={() => setActiveTab('notifications')}>View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="mt-1">
                              {log.action.includes('payment') ? <CreditCard className="h-4 w-4 text-green-500" /> :
                               log.action.includes('application') ? <FileText className="h-4 w-4 text-blue-500" /> :
                               <Bell className="h-4 w-4 text-gray-400" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(log.created_at)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-400">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No recent notifications</p>
                        </div>
                      )}
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
                    {savedProperties.map((property) => {
                      const isUnavailable = property.status !== 'approved' && property.status !== 'active'
                      return (
                        <div 
                          key={property.id} 
                          className={`group flex flex-col sm:flex-row gap-4 p-4 border rounded-lg transition-all relative ${
                            isUnavailable ? 'opacity-60 grayscale bg-gray-50' : 'hover:shadow-md hover:border-victor-green'
                          }`}
                        >
                          <div className="relative shrink-0 cursor-pointer" onClick={() => !isUnavailable && navigate(`/properties/${property.id}`)}>
                            <img
                              src={property.images?.[0]?.url || property.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                              alt={property.title}
                              className="w-full sm:w-28 h-20 object-cover rounded-lg"
                            />
                            {isUnavailable && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                <Badge variant="destructive" className="text-[10px]">Unavailable</Badge>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className={`font-medium truncate ${isUnavailable ? 'text-gray-500' : 'text-gray-900'}`}>{property.title}</h4>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                onClick={(e) => handleUnlike(e, property.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {property.city}
                            </p>
                            <div className="flex justify-between items-end mt-2">
                              <p className="text-victor-green font-bold">
                                {formatPrice(property.price)}/mo
                              </p>
                              {!isUnavailable && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="h-auto p-0 text-victor-green h-8" 
                                  onClick={() => navigate(`/properties/${property.id}`)}
                                >
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {isUnavailable && (
                            <div className="absolute top-2 right-12 z-10">
                              <div className="flex items-center gap-1 text-[10px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                <AlertTriangle className="h-3 w-3" /> Unlisted
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {isLoadingDashboard && <p className="col-span-full text-center py-4">Loading saved properties...</p>}
                    {!isLoadingDashboard && savedProperties.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <Heart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500">You haven't saved any properties yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}


            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>My Applications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={appFilter} onValueChange={setAppFilter}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications
                      .filter(a => appFilter === 'all' || a.status === appFilter)
                      .map((app) => (
                      <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 bg-white hover:border-gray-300 transition-colors">
                        <div>
                          <h4 className="font-medium text-gray-900">{app.property_title || 'Property Application'}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                             <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.property_city}</p>
                             <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Submitted {formatDate(app.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <Badge className={getStatusBadge(app.status)}>
                             {app.status.replace('_', ' ')}
                           </Badge>
                           <Button variant="ghost" size="sm" onClick={() => navigate(`/properties/${app.property_id}`)}>View Listing</Button>
                        </div>
                      </div>
                    ))}
                    {isLoadingDashboard && <p className="text-center py-4">Loading applications...</p>}
                    {!isLoadingDashboard && applications.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500">No applications found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Payment History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={payFilter} onValueChange={setPayFilter}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Results</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments
                      .filter(p => payFilter === 'all' || p.status === payFilter)
                      .map((p) => (
                      <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 bg-white hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            p.status === 'completed' ? 'bg-green-100 text-green-600' : 
                            p.status === 'failed' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                             <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{p.payment_type.replace(/_/g, ' ').toUpperCase()}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {p.mpesa_receipt ? `Receipt: ${p.mpesa_receipt}` : 'No Receipt'} • {formatDate(p.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <div className="font-bold text-gray-900">{formatPrice(p.amount)}</div>
                          <Badge variant="outline" className={
                            p.status === 'completed' ? 'text-green-700 border-green-200 bg-green-50' : 
                            p.status === 'failed' ? 'text-red-700 border-red-200 bg-red-50' :
                            'text-yellow-700 border-yellow-200 bg-yellow-50'
                          }>
                             {p.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {isLoadingDashboard && <p className="text-center py-4">Loading payment history...</p>}
                    {!isLoadingDashboard && payments.length === 0 && (
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500">No payment records found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Activity Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={notifFilter} onValueChange={setNotifFilter}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="All Activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activity</SelectItem>
                        <SelectItem value="payment">Payments</SelectItem>
                        <SelectItem value="application">Applications</SelectItem>
                        <SelectItem value="otp">Security/OTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications
                      .filter(n => notifFilter === 'all' || n.action.toLowerCase().includes(notifFilter))
                      .map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className={`mt-1 p-2 rounded-full ${
                          log.action.includes('payment') ? 'bg-green-100 text-green-600' :
                          log.action.includes('application') ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {log.action.includes('payment') ? <CreditCard className="h-4 w-4" /> :
                           log.action.includes('application') ? <FileText className="h-4 w-4" /> :
                           <Bell className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {log.action.replace(/_/g, ' ').toUpperCase()}
                            </h4>
                            <span className="text-[10px] uppercase font-bold text-gray-400">{formatDate(log.created_at)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {log.details?.message || `Your ${log.resource_type || 'request'} was ${log.action.replace(/_/g, ' ')}ed.`}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Shield className="h-2 w-2" /> ID: #{log.id}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock className="h-2 w-2" /> {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoadingDashboard && <p className="text-center py-4 text-sm text-gray-500">Loading notifications...</p>}
                    {!isLoadingDashboard && notifications.length === 0 && (
                      <div className="text-center py-16">
                        <Bell className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500">No notifications to show.</p>
                      </div>
                    )}
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
