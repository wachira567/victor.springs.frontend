import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const AdminProfile = () => {
  const { user, login } = useAuth() // Assuming login updates context if we pass new token/user data, or we just rely on local state
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '' // Usually email isn't directly editable without verification, so we'll make it readonly
      })
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const token = localStorage.getItem('victorsprings_token')
      const res = await axios.put(`${API_URL}/users/profile`, { name: formData.name }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Profile updated successfully')
      
      // Update local storage user data to reflect new name everywhere
      const existingUserStr = localStorage.getItem('victorsprings_user')
      if (existingUserStr) {
        const existingUser = JSON.parse(existingUserStr)
        existingUser.name = formData.name
        localStorage.setItem('victorsprings_user', JSON.stringify(existingUser))
        // Note: Full reactive context update might require a page reload or a specific context method
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="pl-10 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500">Contact support to change your email address.</p>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" disabled={isSaving || !formData.name.trim()} className="bg-victor-green hover:bg-victor-green-dark">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminProfile
