import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, Check, X, ShieldCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const AdminKyc = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [allKyc, setAllKyc] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const token = localStorage.getItem('victorsprings_token')
        const headers = { Authorization: `Bearer ${token}` }
        const { data } = await axios.get(`${API_URL}/users/kyc/all`, { headers })
        setAllKyc(data.requests || [])
      } catch (error) {
        console.error('Error fetching KYC:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchKyc()
  }, [API_URL])

  const handleApproveKyc = async (userId) => {
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.post(`${API_URL}/users/kyc/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllKyc(prev => prev.map(req => {
        if (req.user.id === userId) {
          return { ...req, user: { ...req.user, verification_status: 'verified' } }
        }
        return req
      }))
      toast.success('KYC Approved')
    } catch (error) {
      console.error('Failed to approve KYC', error)
      toast.error('Failed to approve KYC')
    }
  }

  const handleRejectKyc = async (userId) => {
    const reason = prompt("Reason for rejection:")
    if (!reason) return
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.post(`${API_URL}/users/kyc/${userId}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllKyc(prev => prev.map(req => {
        if (req.user.id === userId) {
          return { ...req, user: { ...req.user, verification_status: 'rejected' } }
        }
        return req
      }))
      toast.success('KYC Rejected')
    } catch (error) {
      console.error('Failed to reject KYC', error)
      toast.error('Failed to reject KYC')
    }
  }

  const exportKycToCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'ID Number', 'Consent Log']
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + allKyc.map(req => {
          const u = req.user
          const consentDoc = req.documents?.find(d => d.document_type === 'legal_document')
          let consentUrl = consentDoc ? consentDoc.file_url : 'N/A'
          if (consentUrl !== 'N/A' && !consentUrl.startsWith('http')) {
             consentUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${consentUrl}`
          }
          return `"${u.name}","${u.email}","${u.phone}","${u.role}","${u.verification_status}","${u.id_number || ''}","${consentUrl}"`
      }).join('\n')
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "victor_springs_kyc_logs.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-victor-green" />
        <h1 className="text-2xl font-bold text-gray-900">KYC Verifications</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Verification Logs</CardTitle>
          <Button variant="outline" onClick={exportKycToCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-4 animate-pulse">Loading KYC records...</p>
            ) : allKyc.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No KYC records found.</p>
            ) : (
              allKyc.map(({ user, documents }) => (
                <div key={user.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{user.name} <span className="text-gray-400 text-sm font-normal">({user.email})</span></h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600"><span className="font-medium mr-2">ID Number:</span> {user.id_number || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium mr-2">Phone:</span> {user.phone}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted {documents && documents.length > 0 ? formatDate(documents[0].created_at) : 'recently'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        user.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                        user.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {user.verification_status === 'verified' ? 'Verified' : 
                         user.verification_status === 'rejected' ? 'Rejected' : 'Pending Review'}
                      </Badge>
                      
                      {user.verification_status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => handleApproveKyc(user.id)} className="bg-victor-green hover:bg-victor-green-dark">
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" onClick={() => handleRejectKyc(user.id)} variant="outline" className="text-red-600 hover:bg-red-50">
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                      {documents && documents.map((doc, idx) => {
                        let fileUrl = doc.file_url;
                        if (fileUrl && !fileUrl.startsWith('http')) {
                          fileUrl = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${fileUrl}`;
                        }
                        return (
                        <Button 
                          key={doc.id}
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View {doc.name || `Document ${idx + 1}`}
                        </Button>
                      )})}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminKyc
