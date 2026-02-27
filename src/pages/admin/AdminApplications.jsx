import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText, CheckCircle, XCircle, FileDown, User, Navigation,
  CreditCard, Clock, Phone, LayoutGrid, LayoutList, Download,
  Activity, ChevronDown, ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const AdminApplications = () => {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('card') // 'card' or 'list'

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  // Approval Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [assignedUnit, setAssignedUnit] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Expanded rows for list view
  const [expandedId, setExpandedId] = useState(null)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const token = localStorage.getItem('victorsprings_token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_URL}/applications/admin?status=${filter}`, { headers })
      setApplications(res.data.applications || [])
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true)
    try {
      const res = await axios.get(`${API_URL}/audit/`, { headers })
      setAuditLogs(res.data.logs || [])
    } catch (err) {
      toast.error('Failed to load audit logs')
    } finally {
      setIsLoadingLogs(false)
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
      await axios.put(`${API_URL}/applications/${id}/status`, {
        status,
        ...extraData
      }, { headers })

      toast.success(`Application ${status} successfully`)
      setApplications(prev =>
        prev.map(a => a.id === id
          ? { ...a, status, assigned_unit: extraData.assigned_unit || a.assigned_unit }
          : a
        )
      )
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
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending_approval': return 'Pending'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const isPending = (status) => {
    return status === 'pending' || status === 'pending_approval'
  }

  // --- Export Helpers ---
  const exportApplicationsCSV = () => {
    if (applications.length === 0) { toast.info('No data to export'); return }
    const csvHeaders = ['ID', 'Name', 'Phone', 'ID Number', 'Property', 'Status', 'Payment Ref', 'Unit', 'Submitted']
    const csvRows = applications.map(a => [
      a.id, `${a.first_name} ${a.last_name}`, a.phone, a.id_number,
      a.property_title, getStatusLabel(a.status), a.payment_id || 'N/A',
      a.assigned_unit || 'N/A', formatDate(a.created_at)
    ])
    downloadCSV([csvHeaders, ...csvRows], 'tenant_applications.csv')
  }

  const exportLogsCSV = () => {
    if (auditLogs.length === 0) { toast.info('No logs to export'); return }
    const csvHeaders = ['ID', 'User', 'Email', 'Action', 'Resource', 'IP Address', 'Details', 'Date']
    const csvRows = auditLogs.map(l => [
      l.id, l.user_name, l.user_email || 'N/A', l.action,
      l.resource_type ? `${l.resource_type}#${l.resource_id}` : 'N/A',
      l.ip_address || 'N/A',
      JSON.stringify(l.details || {}),
      formatDate(l.created_at)
    ])
    downloadCSV([csvHeaders, ...csvRows], 'audit_logs.csv')
  }

  const downloadCSV = (rows, filename) => {
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success(`Exported ${filename}`)
  }

  // --- Card View for an Application ---
  const renderCardView = (app) => (
    <Card key={app.id} className="overflow-hidden">
      <div className={`h-1.5 w-full ${isPending(app.status) ? 'bg-yellow-400' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Left Column: Tenant Info */}
          <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r bg-gray-50/50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{app.first_name} {app.last_name}</h3>
                <p className="text-sm text-gray-500">ID: {app.id_number}</p>
              </div>
              <Badge className={getStatusBadge(app.status)}>{getStatusLabel(app.status)}</Badge>
            </div>
            <div className="space-y-2.5 mt-3 text-sm">
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-gray-400 shrink-0" /> {app.phone}
              </div>
              <div className="flex items-center text-gray-700">
                <Navigation className="h-4 w-4 mr-2 text-gray-400 shrink-0" /> <span>Property: <strong>{app.property_title}</strong></span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-gray-400 shrink-0" /> Submitted: {formatDate(app.created_at)}
              </div>
              {app.payment_id && (
                <div className="flex items-center text-green-700 bg-green-50 p-2 rounded border border-green-100">
                  <CreditCard className="h-4 w-4 mr-2 shrink-0" /> Fee Paid (Ref: #{app.payment_id})
                </div>
              )}
              {app.assigned_unit && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="outline" className="text-victor-green border-victor-green bg-green-50">
                    Assigned: {app.assigned_unit}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column: Documents */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-victor-green" /> Documents
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <a href={app.id_document_front} target="_blank" rel="noreferrer" className="block border rounded p-2.5 text-center hover:bg-gray-50 transition-colors">
                <User className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-xs font-medium text-blue-600">ID Front</span>
              </a>
              <a href={app.id_document_back} target="_blank" rel="noreferrer" className="block border rounded p-2.5 text-center hover:bg-gray-50 transition-colors">
                <User className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <span className="text-xs font-medium text-blue-600">ID Back</span>
              </a>
            </div>
            {app.signed_agreement_url && (
              <a href={app.signed_agreement_url.replace('/upload/', '/upload/fl_attachment/')} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-blue-200 bg-blue-50 p-2.5 rounded hover:bg-blue-100 transition-colors">
                <div className="flex items-center text-blue-800 text-sm font-medium">
                  <FileDown className="h-4 w-4 mr-2" /> Signed Agreement
                </div>
              </a>
            )}
            {app.digital_consent && (
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-2 bg-gray-50 p-2 rounded">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span>Legally consented to Terms & Accuracy.</span>
              </div>
            )}
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-3 p-5 flex flex-col justify-center gap-2.5">
            {isPending(app.status) ? (
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
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </>
            ) : (
              <div className="text-center text-gray-500 text-sm space-y-1">
                <p className="font-medium">{getStatusLabel(app.status)}</p>
                {app.reviewer && <p className="text-xs">By: {app.reviewer}</p>}
                {app.reviewed_at && <p className="text-xs">{formatDate(app.reviewed_at)}</p>}
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  )

  // --- List View for a Row ---
  const renderListRow = (app) => (
    <div key={app.id} className="border rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
        className="w-full text-left p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${isPending(app.status) ? 'bg-yellow-400' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-semibold text-gray-900 truncate">{app.first_name} {app.last_name}</span>
          <span className="text-sm text-gray-500 hidden sm:inline">— {app.property_title}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusBadge(app.status)} text-xs`}>{getStatusLabel(app.status)}</Badge>
          <span className="text-xs text-gray-400 hidden md:inline">{formatDate(app.created_at)}</span>
          {expandedId === app.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {expandedId === app.id && (
        <div className="border-t p-4 bg-gray-50/50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500 block text-xs">Phone</span>{app.phone}</div>
            <div><span className="text-gray-500 block text-xs">ID Number</span>{app.id_number}</div>
            <div><span className="text-gray-500 block text-xs">Property</span>{app.property_title}</div>
            <div><span className="text-gray-500 block text-xs">Payment</span>{app.payment_id ? `Ref #${app.payment_id}` : 'None'}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {app.id_document_front && (
              <a href={app.id_document_front} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline border rounded px-2 py-1 bg-white">View ID Front</a>
            )}
            {app.id_document_back && (
              <a href={app.id_document_back} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline border rounded px-2 py-1 bg-white">View ID Back</a>
            )}
            {app.signed_agreement_url && (
              <a href={app.signed_agreement_url.replace('/upload/', '/upload/fl_attachment/')} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline border rounded px-2 py-1 bg-white">Download Agreement</a>
            )}
          </div>

          {isPending(app.status) && (
            <div className="flex gap-2 pt-2 border-t">
              <Button size="sm" className="bg-victor-green hover:bg-victor-green-dark text-white" onClick={() => handleActionClick(app, 'approve')}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleActionClick(app, 'reject')}>
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
            </div>
          )}

          {app.assigned_unit && (
            <Badge variant="outline" className="text-victor-green border-victor-green bg-green-50 text-xs">
              Assigned: {app.assigned_unit}
            </Badge>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Tabs defaultValue="applications" onValueChange={(val) => { if (val === 'logs') fetchAuditLogs() }}>

        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenant Applications</h1>
            <p className="text-gray-500 mt-1 text-sm">Review agreements, inspect IDs, and manage tenancies.</p>
          </div>
          <TabsList className="bg-gray-100 rounded-lg">
            <TabsTrigger value="applications" className="text-xs sm:text-sm">
              <FileText className="h-4 w-4 mr-1" /> Applications
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs sm:text-sm">
              <Activity className="h-4 w-4 mr-1" /> Audit Logs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ===== Applications Tab ===== */}
        <TabsContent value="applications">
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending_approval">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${viewMode === 'card' ? 'bg-victor-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('card')}
                  title="Card View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-victor-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={exportApplicationsCSV} className="gap-1.5">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>

          <div className={viewMode === 'card' ? 'grid grid-cols-1 gap-5' : 'space-y-2'}>
            {isLoading ? (
              <div className="text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No Applications Found</h3>
                <p className="text-gray-500 mt-1">No tenant applications match your current filter.</p>
              </div>
            ) : (
              applications.map(app =>
                viewMode === 'card' ? renderCardView(app) : renderListRow(app)
              )
            )}
          </div>
        </TabsContent>

        {/* ===== Audit Logs Tab ===== */}
        <TabsContent value="logs">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">{auditLogs.length} log entries</p>
            <Button variant="outline" size="sm" onClick={exportLogsCSV} className="gap-1.5">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>

          {isLoadingLogs ? (
            <div className="text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No Audit Logs</h3>
              <p className="text-gray-500 mt-1">No activity has been recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3 hidden md:table-cell">Resource</th>
                      <th className="px-4 py-3 hidden lg:table-cell">IP Address</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Details</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 text-xs">{log.user_name}</div>
                          {log.user_email && <div className="text-xs text-gray-400">{log.user_email}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs font-mono">{log.action}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">
                          {log.resource_type ? `${log.resource_type} #${log.resource_id}` : '—'}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 font-mono">{log.ip_address || '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 max-w-[200px] truncate">
                          {log.details && Object.keys(log.details).length > 0
                            ? Object.entries(log.details).map(([k, v]) => `${k}: ${v}`).join(', ')
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve & Assign Unit Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Assign a specific unit to {selectedApp?.first_name} for "{selectedApp?.property_title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="unit" className="text-gray-700 font-semibold mb-2 block">Assigned Unit *</Label>
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
              {isProcessing ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminApplications
