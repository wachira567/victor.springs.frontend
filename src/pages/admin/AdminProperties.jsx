import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { 
  Building2, 
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  EyeIcon,
  MessageSquare,
  Phone,
  MapPin,
  Heart
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const AdminProperties = () => {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, inactive, pending
  
  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      const headers = { Authorization: `Bearer ${token}` }
      // Get all properties regardless of status for Admins
      // The backend should return everything if it's an admin endpoint, but for now we might need to fetch pending + active
      const [allRes, pendingRes] = await Promise.all([
        axios.get(`${API_URL}/properties/?per_page=1000`, { headers }),
        axios.get(`${API_URL}/properties/pending`, { headers })
      ])
      
      const allProps = [...(allRes.data.properties || [])]
      const pendingProps = pendingRes.data.properties || []
      
      // Merge unique
      const merged = [...allProps]
      pendingProps.forEach(p => {
        if (!merged.find(m => m.id === p.id)) {
          merged.push(p)
        }
      })
      
      setProperties(merged)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (propertyId, newStatus) => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      // e.g. status could be 'active', 'inactive', 'approved', 'rejected'
      await axios.put(`${API_URL}/properties/${propertyId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setProperties(prev => prev.map(p => {
        if (p.id === propertyId) {
          return { ...p, status: newStatus === 'approved' ? 'active' : newStatus }
        }
        return p
      }))
      
      toast.success(`Property marked as ${newStatus}`)
    } catch (error) {
      console.error('Failed to update status', error)
      toast.error('Failed to update property status')
    }
  }

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to permanently delete this property?")) return
    
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.delete(`${API_URL}/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      toast.success('Property deleted successfully')
    } catch (error) {
      console.error('Failed to delete', error)
      toast.error('Failed to delete property')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredProperties = properties.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    // Simplistic filter matching for demonstration
    let matchesStatus = true
    if (filterStatus === 'active') matchesStatus = (p.status === 'active' || p.status === 'approved')
    if (filterStatus === 'pending') matchesStatus = (p.status === 'pending')
    if (filterStatus === 'inactive') matchesStatus = (p.status === 'inactive' || p.status === 'rejected')
      
    return matchesSearch && matchesStatus
  }).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-victor-green" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
            <p className="text-sm text-gray-500">View, edit, approve, or remove properties.</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/submit-property')} 
          className="bg-victor-green hover:bg-victor-green-dark"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New House
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle>All Houses</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search titles/locations..."
                className="pl-9 w-[200px] sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Properties</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>Active / Public</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending Approval</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>Inactive / Hidden</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Property</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Owner/Landlord</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Analytics</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500 animate-pulse">Loading properties...</td></tr>
                ) : filteredProperties.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No properties found.</td></tr>
                ) : (
                  filteredProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            {p.images && p.images.length > 0 ? (
                              <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover" />
                            ) : (
                              <Building2 className="h-6 w-6 m-auto text-gray-400 mt-2" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{p.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.landlord?.name || p.landlord?.firstName || 'Unknown'} 
                        <span className="block text-xs text-gray-400">{p.landlord?.email || ''}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-victor-green">
                        {formatPrice(p.price)}<span className="text-xs text-gray-500">/mo</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${getStatusBadge(p.status)} capitalize`}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1" title="Views"><EyeIcon className="h-3 w-3 text-gray-400"/> {p.view_count || 0}</span>
                          <span className="flex items-center gap-1" title="Likes"><Heart className="h-3 w-3 text-red-400"/> {p.like_count || 0}</span>
                          <span className="flex items-center gap-1" title="WhatsApp Clicks"><MessageSquare className="h-3 w-3 text-green-500"/> {p.whatsapp_clicks || 0}</span>
                          <span className="flex items-center gap-1" title="Call Clicks"><Phone className="h-3 w-3 text-blue-500"/> {p.call_clicks || 0}</span>
                          <span className="flex items-center gap-1" title="Map Interactions"><MapPin className="h-3 w-3 text-orange-500"/> {p.map_clicks || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            
                            <DropdownMenuItem asChild>
                              <Link to={`/properties/${p.id}`} className="cursor-pointer flex items-center">
                                <Eye className="mr-2 h-4 w-4" /> View Public Page
                              </Link>
                            </DropdownMenuItem>
                            
                            {/* Admins can edit ANY property */}
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuLabel className="text-xs text-gray-500">Visibility & Status</DropdownMenuLabel>
                            
                            {p.status === 'pending' && (
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(p.id, 'approved')}
                                className="cursor-pointer text-green-600 focus:text-green-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Approve Property
                              </DropdownMenuItem>
                            )}

                            {p.status !== 'inactive' ? (
                               <DropdownMenuItem 
                                 onClick={() => handleUpdateStatus(p.id, 'inactive')}
                                 className="cursor-pointer"
                               >
                                 <XCircle className="mr-2 h-4 w-4 text-gray-500" /> Deactivate (Hide)
                               </DropdownMenuItem>
                            ) : (
                               <DropdownMenuItem 
                                 onClick={() => handleUpdateStatus(p.id, 'active')}
                                 className="cursor-pointer text-green-600"
                               >
                                 <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Make Active (Show)
                               </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleDelete(p.id)}
                              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete Permanently
                            </DropdownMenuItem>
                            
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminProperties
