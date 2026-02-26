import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Phone, MapPin, Calendar, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const AdminTenants = () => {
  const [tenants, setTenants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      // For now, we reuse the applications endpoint and filter just the 'approved' ones to act as the permanent tenant record
      const res = await axios.get(`${API_URL}/applications/admin?status=approved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTenants(res.data.applications || [])
    } catch (err) {
      toast.error('Failed to load tenants')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTenants = tenants.filter(t => 
    t.first_name.toLowerCase().includes(search.toLowerCase()) ||
    t.last_name.toLowerCase().includes(search.toLowerCase()) ||
    t.property_title?.toLowerCase().includes(search.toLowerCase()) ||
    t.assigned_unit?.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  )

  const downloadCSV = () => {
    if (tenants.length === 0) return
    
    // Create CSV headers
    const headers = ['First Name', 'Last Name', 'ID Number', 'Phone', 'Property', 'Unit', 'Approved Date', 'Legal Consent Given']
    
    // Create CSV rows
    const rows = filteredTenants.map(t => [
      t.first_name,
      t.last_name,
      t.id_number,
      t.phone,
      `"${t.property_title || 'N/A'}"`, // Quotes to handle commas in names
      t.assigned_unit || 'N/A',
      new Date(t.updated_at).toLocaleDateString(),
      t.digital_consent ? 'Yes' : 'No'
    ])
    
    // Combine and download
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n")
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `victorsprings_tenants_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Tenants Directory</h1>
          <p className="text-gray-500 mt-1">Permanent record of all approved tenants and their assigned units.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Input 
            placeholder="Search name, phone, unit..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={downloadCSV} variant="outline" className="shrink-0 flex items-center pr-3 border-gray-300">
            <Download className="mr-2 h-4 w-4 text-gray-500" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading tenants...</div>
        ) : filteredTenants.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Tenants Found</h3>
            <p className="text-gray-500 mt-1">
              {search ? 'No tenants match your current search.' : 'There are no approved tenants currently on record.'}
            </p>
          </div>
        ) : (
          filteredTenants.map(tenant => (
            <Card key={tenant.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-2 w-full bg-victor-green" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                       {tenant.first_name[0]}{tenant.last_name[0]}
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-gray-900 leading-tight">{tenant.first_name} {tenant.last_name}</h3>
                       <p className="text-xs text-gray-500">Nat ID: {tenant.id_number}</p>
                     </div>
                   </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{tenant.property_title || 'Unknown Property'}</p>
                      <Badge variant="secondary" className="mt-1 font-mono">{tenant.assigned_unit || 'Unit Not Recorded'}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${tenant.phone}`} className="hover:text-victor-green hover:underline">{tenant.phone}</a>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Approved: {formatDate(tenant.updated_at)}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                   {tenant.signed_agreement_url && (
                      <Button variant="outline" size="sm" className="w-full text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => window.open(tenant.signed_agreement_url, '_blank')}>
                         <FileText className="h-3 w-3 mr-1.5" /> View Agreement
                      </Button>
                   )}
                   <Button variant="outline" size="sm" className="w-full text-xs h-8 text-gray-600" onClick={() => window.open(tenant.id_document_front, '_blank')}>
                      <User className="h-3 w-3 mr-1.5" /> View ID
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminTenants
