import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const AdminSettings = () => {
  const { user } = useAuth()
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  
  const [settings, setSettings] = useState({
    contact_number: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings`)
      if (data.settings) {
        setSettings(prev => ({
          ...prev,
          ...data.settings
        }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.put(`${API_URL}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(error.response?.data?.message || 'Failed to update settings. Super Admin access required.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-victor-green" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500">Manage global configuration for Victor Springs.</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Configure official contact details for notifications and display.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1 block">Global Public Contact (WhatsApp/Call)</label>
                <Input 
                  placeholder="e.g. +254712345678"
                  value={settings.contact_number || ''}
                  onChange={(e) => setSettings({ ...settings, contact_number: e.target.value })}
                  disabled={user?.role !== 'super_admin'}
                />
                <p className="text-xs text-gray-400 mt-1">Displayed publicly on property pages.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Admin Email</label>
                  <Input 
                    type="email"
                    placeholder="admin@victorsprings.com"
                    value={settings.primary_admin_email || ''}
                    onChange={(e) => setSettings({ ...settings, primary_admin_email: e.target.value })}
                    disabled={user?.role !== 'super_admin'}
                  />
                  <p className="text-xs text-gray-400 mt-1">Receives payment notifications.</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Admin Phone</label>
                  <Input 
                    placeholder="+254712345678"
                    value={settings.primary_admin_phone || ''}
                    onChange={(e) => setSettings({ ...settings, primary_admin_phone: e.target.value })}
                    disabled={user?.role !== 'super_admin'}
                  />
                  <p className="text-xs text-gray-400 mt-1">Receives SMS alerts.</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || user?.role !== 'super_admin'}
                  className="w-full bg-victor-green hover:bg-victor-green-dark"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save All Settings'}
                </Button>
                {user?.role !== 'super_admin' && (
                  <p className="text-xs text-red-500 mt-2 text-center">Only Super Admins can modify global settings.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSettings
