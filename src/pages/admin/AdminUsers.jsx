import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { 
  Users, 
  MoreHorizontal,
  Search,
  Filter,
  Download,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Unlock,
  UserCog
} from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const AdminUsers = () => {
  const { user: currentUser } = useAuth()
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all') // all, tenant, landlord, admin
  const [sortOrder, setSortOrder] = useState('newest') // newest, oldest

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      const headers = { Authorization: `Bearer ${token}` }
      const res = await axios.get(`${API_URL}/users/`, { headers })
      setUsers(res.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role. Are you a Super Admin?')
    }
  }

  const handleStatusChange = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.put(`${API_URL}/users/${userId}/status`, { is_active: isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: isActive, status: isActive ? 'active' : 'suspended' } : u))
      toast.success(isActive ? 'User unbanned successfully' : 'User banned successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update user status')
    }
  }

  const getStatusBadge = (user) => {
    if (!user.is_active || user.status === 'suspended') {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-green-100 text-green-800'
  }

  const filteredUsers = users
    .filter(u => {
      const matchesSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = filterRole === 'all' || u.role === filterRole
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.joined || 0).getTime()
      const dateB = new Date(b.created_at || b.joined || 0).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <Users className="h-8 w-8 text-victor-green" />
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle>All Platform Users</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search name or email..."
                className="pl-9 w-[200px] sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Role: {filterRole === 'all' ? 'All' : filterRole}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterRole('all')}>All Roles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('tenant')}>Tenants</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('landlord')}>Landlords</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole('admin')}>Admins</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>Oldest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Joined Date</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y relative">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded w-48"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-4 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-8 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No users found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-victor-green text-white text-xs">
                              {getInitials(u.name || u.firstName || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{u.name || `${u.firstName} ${u.lastName}`}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-800 border-none">
                          {u.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${getStatusBadge(u)} border-none shadow-none`}>
                          {(!u.is_active || u.status === 'suspended') ? 'Banned' : 'Active'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(u.created_at || u.joined)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currentUser?.id !== u.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-200">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              
                              {/* ROLE CHANGING (Available strictly to Super Admins typically, or based on backend rules) */}
                              <DropdownMenuLabel className="flex items-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                <UserCog className="mr-2 h-4 w-4" /> Change Role
                              </DropdownMenuLabel>
                              {['tenant', 'landlord', 'admin', 'super_admin'].map(roleOption => (
                                u.role !== roleOption && (
                                  <DropdownMenuItem 
                                    key={roleOption} 
                                    onClick={() => handleRoleChange(u.id, roleOption)}
                                    className="cursor-pointer capitalize"
                                  >
                                    Promote to {roleOption.replace('_', ' ')}
                                  </DropdownMenuItem>
                                )
                              ))}
                              
                              <DropdownMenuSeparator />
                              
                              {/* BANNING/BLOCKING */}
                              <DropdownMenuLabel className="flex items-center font-semibold text-xs text-gray-500 uppercase tracking-wider mt-2">
                                <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> Moderation
                              </DropdownMenuLabel>
                              
                              {(!u.is_active || u.status === 'suspended') ? (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(u.id, true)}
                                  className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50"
                                >
                                  <Unlock className="mr-2 h-4 w-4 text-green-500" />
                                  Unban Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(u.id, false)}
                                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                >
                                  <Ban className="mr-2 h-4 w-4 text-red-500" />
                                  Ban Account (Block Access)
                                </DropdownMenuItem>
                              )}
                              
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {currentUser?.id === u.id && (
                           <span className="text-xs text-gray-400 italic">You</span>
                        )}
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

export default AdminUsers
