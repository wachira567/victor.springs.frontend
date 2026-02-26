import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Calendar, Phone, Mail, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const AdminEnquiries = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [enquiries, setEnquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const headers = { Authorization: `Bearer ${token}` }
        const { data } = await axios.get(`${API_URL}/enquiries/admin`, { headers })
        setEnquiries(data.enquiries || [])
      } catch (error) {
        console.error('Error fetching enquiries:', error)
        toast.error('Failed to load enquiries')
      } finally {
        setIsLoading(false)
      }
    }
    fetchEnquiries()
  }, [API_URL])

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-victor-green" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries & Leads</h1>
          <p className="text-sm text-gray-500">Centralized view of all property enquiries submitted by users.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <p className="text-center py-8 text-gray-500 animate-pulse">Loading enquiries...</p>
          ) : enquiries.length === 0 ? (
             <div className="text-center py-12">
               <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900">No Enquiries Yet</h3>
               <p className="text-gray-500 max-w-sm mx-auto mt-1">When users inquire about properties, those messages will be routed directly here for admins to handle.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg flex items-center">
                      {enq.property?.title} 
                      <Badge className="ml-3 bg-blue-100 text-blue-800 border-none shadow-none font-medium">New Lead</Badge>
                    </h4>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="mr-1 h-3 w-3" /> {formatDate(enq.created_at)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 bg-gray-50 p-3 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center"><Mail className="mr-2 h-4 w-4 text-gray-400" /> {enq.user?.name}</p>
                      <p className="text-gray-600 ml-6">{enq.user?.email}</p>
                      <p className="text-gray-600 ml-6 flex items-center mt-1"><Phone className="mr-1 h-3 w-3" /> {enq.user?.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 flex items-center"><Building2 className="mr-2 h-4 w-4 text-gray-400" /> Property Details</p>
                      <p className="text-gray-600 ml-6">Owner: {enq.property?.landlord?.name || 'Unknown'}</p>
                      <p className="text-gray-600 ml-6">Location: {enq.property?.location}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="font-medium text-sm text-gray-900 mb-1">Message:</p>
                    <p className="text-gray-700 text-sm bg-white p-3 border rounded-md whitespace-pre-wrap">
                      {enq.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminEnquiries
