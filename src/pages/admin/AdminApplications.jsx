import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle, XCircle, FileDown, User, Navigation, CreditCard, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const AdminApplications = () => {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  // Approval Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [assignedUnit, setAssignedUnit] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      const res = await axios.get(`${API_URL}/applications/admin?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApplications(res.data.applications || [])
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = (app, action) => {
    if (action === 'approve') {
      setSelectedApp(app)
      setAssignedUnit('')
      setIsApproveModalOpen(true)
    } else if (action === 'reject') {
       if (window.confirm("Are you sure you want to reject this application?")) {
          processStatusUpdate(app.id, 'rejected')
       }
    }
  }

  const processStatusUpdate = async (id, status, extraData = {}) => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      await axios.put(`${API_URL}/applications/${id}/status`, { 
        status, 
        ...extraData 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success(`Application ${status} successfully`)
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status, assigned_unit: extraData.assigned_unit || a.assigned_unit } : a))
      setIsApproveModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application status')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Applications</h1>
          <p className="text-gray-500 mt-1">Review tenant agreements, inspect IDs, and assign property units.</p>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Applications Found</h3>
            <p className="text-gray-500 mt-1">No tenant applications match your current filter.</p>
          </div>
        ) : (
          applications.map(app => (
            <Card key={app.id} className="overflow-hidden">
              <div className={`h-1.5 w-full ${app.status === 'pending' ? 'bg-yellow-400' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Column: Tenant Personal Info */}
                  <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r bg-gray-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{app.first_name} {app.last_name}</h3>
                        <p className="text-sm text-gray-500">ID: {app.id_number}</p>
                      </div>
                      <Badge className={getStatusBadge(app.status)}>{app.status}</Badge>
                    </div>
                    
                    <div className="space-y-3 mt-4 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" /> {app.phone}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Navigation className="h-4 w-4 mr-2 text-gray-400" /> Applying for: <strong>{app.property_title}</strong>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" /> Submitted: {formatDate(app.created_at)}
                      </div>
                      {app.payment_id && (
                        <div className="flex items-center text-green-700 mt-2 bg-green-50 p-2 rounded border border-green-100">
                          <CreditCard className="h-4 w-4 mr-2" /> Agreement Fee Paid (Ref: #{app.payment_id})
                        </div>
                      )}
                      {app.assigned_unit && (
                        <div className="mt-4 pt-4 border-t">
                          <Badge variant="outline" className="text-victor-green border-victor-green bg-green-50">
                            Assigned Unit: {app.assigned_unit}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Documents */}
                  <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-victor-green" /> Submitted Documents
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <a href={app.id_document_front} target="_blank" rel="noreferrer" className="block border rounded p-3 text-center hover:bg-gray-50 transition-colors">
                          <User className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-xs font-medium text-blue-600">View ID Front</span>
                       </a>
                       <a href={app.id_document_back} target="_blank" rel="noreferrer" className="block border rounded p-3 text-center hover:bg-gray-50 transition-colors">
                          <User className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-xs font-medium text-blue-600">View ID Back</span>
                       </a>
                    </div>
                    
                    {app.signed_agreement_url && (
                       <a href={app.signed_agreement_url} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-blue-200 bg-blue-50 p-3 rounded hover:bg-blue-100 transition-colors">
                          <div className="flex items-center text-blue-800 text-sm font-medium">
                            <FileDown className="h-4 w-4 mr-2" /> Signed Tenant Agreement
                          </div>
                       </a>
                    )}
                    
                    {app.digital_consent && (
                      <div className="mt-4 text-xs text-gray-500 flex items-start gap-2 bg-gray-50 p-2 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Legally consented to Terms & Accuracy.</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="lg:col-span-3 p-6 flex flex-col justify-center gap-3">
                    {app.status === 'pending' ? (
                      <>
                        <Button 
                          className="w-full bg-victor-green hover:bg-victor-green-dark text-white"
                          onClick={() => handleActionClick(app, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Approve & Assign
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                          onClick={() => handleActionClick(app, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Reject Application
                        </Button>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">
                        <p>Application is closed.</p>
                        <p className="mt-1">Reviewed by Admin #{app.reviewed_by}</p>
                      </div>
                    )}
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Approve & Assign Unit Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Assign a specific unit to {selectedApp?.first_name} for the property "{selectedApp?.property_title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <Label htmlFor="unit" className="text-gray-700 font-semibold mb-2 block">Assigned Unit Number / Identifier *</Label>
             <Input 
               id="unit"
               value={assignedUnit}
               onChange={(e) => setAssignedUnit(e.target.value)}
               placeholder="e.g. Block A, Apt 402"
               className="w-full"
             />
             <p className="text-xs text-gray-500 mt-2">This unit will be permanently recorded under their tenancy.</p>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-victor-green hover:bg-victor-green-dark" 
              disabled={!assignedUnit || isProcessing}
              onClick={() => processStatusUpdate(selectedApp.id, 'approved', { assigned_unit: assignedUnit })}
            >
              {isProcessing ? 'Saving...' : 'Confirm Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminApplications
