import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText, CheckCircle, XCircle, FileDown, User, Navigation,
  CreditCard, Clock, Phone, LayoutGrid, LayoutList, Download,
  Activity, ChevronDown, ChevronUp, Filter, Search
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
  const [viewMode, setViewMode] = useState('card')

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [logFilters, setLogFilters] = useState({ action: 'all', date_from: '', date_to: '' })
  const [distinctActions, setDistinctActions] = useState([])

  // Approval Modal
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedUnitType, setSelectedUnitType] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Expandable rows
  const [expandedId, setExpandedId] = useState(null)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const token = localStorage.getItem('victorsprings_token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { fetchApplications() }, [filter])

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

  const fetchAuditLogs = async (filters = logFilters) => {
    setIsLoadingLogs(true)
    try {
      const params = new URLSearchParams()
      if (filters.action && filters.action !== 'all') params.set('action', filters.action)
      if (filters.date_from) params.set('date_from', filters.date_from)
      if (filters.date_to) params.set('date_to', filters.date_to)
      params.set('per_page', '100')

      const res = await axios.get(`${API_URL}/audit/?${params.toString()}`, { headers })
      setAuditLogs(res.data.logs || [])
      setDistinctActions(res.data.distinct_actions || [])
    } catch (err) {
      toast.error('Failed to load audit logs')
    } finally {
      setIsLoadingLogs(false)
    }
  }

  const handleActionClick = (app, action) => {
    if (action === 'approve') {
      setSelectedApp(app)
      setSelectedUnitType('')
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
      const res = await axios.put(`${API_URL}/applications/${id}/status`, {
        status,
        ...extraData
      }, { headers })

      toast.success(`Application ${status} successfully`)
      // Update local state with response
      setApplications(prev =>
        prev.map(a => a.id === id
          ? {
              ...a,
              status,
              assigned_unit: extraData.assigned_unit || a.assigned_unit,
              property_units: res.data.updated_units || a.property_units
            }
          : a
        )
      )
      setIsApproveModalOpen(false)

      if (res.data.property_status === 'rented') {
        toast.info('All units are now occupied — property has been marked as rented and removed from public listings.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (s) => {
    switch (s) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  const getStatusLabel = (s) => {
    switch (s) {
      case 'pending_approval': return 'Pending'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return s
    }
  }
  const isPending = (s) => s === 'pending' || s === 'pending_approval'

  // Available units for approval
  const getAvailableUnits = () => {
    if (!selectedApp?.property_units) return []
    return selectedApp.property_units.filter(u => (u.vacantCount || 0) > 0)
  }

  // --- Export ---
  const exportCSV = (rows, filename) => {
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success(`Downloaded ${filename}`)
  }

  const exportApplicationsCSV = () => {
    if (!applications.length) { toast.info('No data'); return }
    const h = ['ID', 'Name', 'Phone', 'ID Number', 'Property', 'Status', 'Payment Ref', 'Unit', 'Submitted']
    const r = applications.map(a => [
      a.id, `${a.first_name} ${a.last_name}`, a.phone, a.id_number,
      a.property_title, getStatusLabel(a.status), a.payment_id || 'N/A',
      a.assigned_unit || 'N/A', formatDate(a.created_at)
    ])
    exportCSV([h, ...r], 'tenant_applications.csv')
  }

  const exportLogsCSV = () => {
    if (!auditLogs.length) { toast.info('No logs'); return }
    const h = ['ID', 'User', 'Email', 'Action', 'Resource', 'IP', 'User Agent', 'Details', 'Date']
    const r = auditLogs.map(l => [
      l.id, l.user_name, l.user_email || '', l.action,
      l.resource_type ? `${l.resource_type}#${l.resource_id}` : '',
      l.ip_address || '', l.user_agent || '',
      JSON.stringify(l.details || {}), l.created_at
    ])
    exportCSV([h, ...r], 'audit_logs.csv')
  }

  // --- Card View ---
  const renderCard = (app) => (
    <Card key={app.id} className="overflow-hidden">
      <div className={`h-1.5 w-full ${isPending(app.status) ? 'bg-yellow-400' : app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Tenant Info */}
          <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r bg-gray-50/50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{app.first_name} {app.last_name}</h3>
                <p className="text-sm text-gray-500">ID: {app.id_number}</p>
              </div>
              <Badge className={getStatusBadge(app.status)}>{getStatusLabel(app.status)}</Badge>
            </div>
            <div className="space-y-2.5 mt-3 text-sm">
              <div className="flex items-center text-gray-700"><Phone className="h-4 w-4 mr-2 text-gray-400 shrink-0" /> {app.phone}</div>
              <div className="flex items-center text-gray-700"><Navigation className="h-4 w-4 mr-2 text-gray-400 shrink-0" /> <span>Property: <strong>{app.property_title}</strong></span></div>
              <div className="flex items-center text-gray-700"><Clock className="h-4 w-4 mr-2 text-gray-400 shrink-0" /> {formatDate(app.created_at)}</div>
              {app.payment_id && (
                <div className="flex items-center text-green-700 bg-green-50 p-2 rounded border border-green-100">
                  <CreditCard className="h-4 w-4 mr-2 shrink-0" /> Fee Paid (Ref: #{app.payment_id})
                </div>
              )}
              {app.assigned_unit && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="outline" className="text-victor-green border-victor-green bg-green-50">Assigned: {app.assigned_unit}</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-victor-green" /> Documents
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <a href={app.id_document_front} target="_blank" rel="noreferrer" className="block border rounded p-2.5 text-center hover:bg-gray-50 transition-colors">
                <User className="h-5 w-5 text-gray-400 mx-auto mb-1" /><span className="text-xs font-medium text-blue-600">ID Front</span>
              </a>
              <a href={app.id_document_back} target="_blank" rel="noreferrer" className="block border rounded p-2.5 text-center hover:bg-gray-50 transition-colors">
                <User className="h-5 w-5 text-gray-400 mx-auto mb-1" /><span className="text-xs font-medium text-blue-600">ID Back</span>
              </a>
            </div>
            {app.signed_agreement_url && (
              <a href={app.signed_agreement_url} target="_blank" rel="noreferrer" className="flex items-center border border-blue-200 bg-blue-50 p-2.5 rounded hover:bg-blue-100 transition-colors">
                <FileDown className="h-4 w-4 mr-2 text-blue-800" />
                <span className="text-sm font-medium text-blue-800">Download Signed Agreement</span>
              </a>
            )}
            {app.digital_consent && (
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-2 bg-gray-50 p-2 rounded">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span>Legally consented to Terms & Accuracy.</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="lg:col-span-3 p-5 flex flex-col justify-center gap-2.5">
            {isPending(app.status) ? (
              <>
                <Button className="w-full bg-victor-green hover:bg-victor-green-dark text-white" onClick={() => handleActionClick(app, 'approve')}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve & Assign
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleActionClick(app, 'reject')}>
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

  // --- List View ---
  const renderRow = (app) => (
    <div key={app.id} className="border rounded-lg bg-white overflow-hidden">
      <button onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} className="w-full text-left p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
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
            {app.id_document_front && <a href={app.id_document_front} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline border rounded px-2 py-1 bg-white">View ID Front</a>}
            {app.id_document_back && <a href={app.id_document_back} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline border rounded px-2 py-1 bg-white">View ID Back</a>}
            {app.signed_agreement_url && <a href={app.signed_agreement_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline border rounded px-2 py-1 bg-white">Download Agreement</a>}
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
            <Badge variant="outline" className="text-victor-green border-victor-green bg-green-50 text-xs">Assigned: {app.assigned_unit}</Badge>
          )}
        </div>
      )}
    </div>
  )

  const availableUnits = getAvailableUnits()

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Tabs defaultValue="applications" onValueChange={(v) => { if (v === 'logs') fetchAuditLogs() }}>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenant Applications</h1>
            <p className="text-gray-500 mt-1 text-sm">Review agreements, manage tenancies, and view activity logs.</p>
          </div>
          <TabsList className="bg-gray-100 rounded-lg">
            <TabsTrigger value="applications" className="text-xs sm:text-sm"><FileText className="h-4 w-4 mr-1" /> Applications</TabsTrigger>
            <TabsTrigger value="logs" className="text-xs sm:text-sm"><Activity className="h-4 w-4 mr-1" /> Audit Logs</TabsTrigger>
          </TabsList>
        </div>

        {/* ===== Applications ===== */}
        <TabsContent value="applications">
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending_approval">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg overflow-hidden">
                <button className={`p-2 ${viewMode === 'card' ? 'bg-victor-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('card')} title="Card View"><LayoutGrid className="h-4 w-4" /></button>
                <button className={`p-2 ${viewMode === 'list' ? 'bg-victor-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('list')} title="List View"><LayoutList className="h-4 w-4" /></button>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={exportApplicationsCSV} className="gap-1.5"><Download className="h-4 w-4" /> Export CSV</Button>
          </div>

          <div className={viewMode === 'card' ? 'grid grid-cols-1 gap-5' : 'space-y-2'}>
            {isLoading ? (
              <div className="text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No Applications</h3>
                <p className="text-gray-500 mt-1">No applications match this filter.</p>
              </div>
            ) : applications.map(app => viewMode === 'card' ? renderCard(app) : renderRow(app))}
          </div>
        </TabsContent>

        {/* ===== Audit Logs ===== */}
        <TabsContent value="logs">
          {/* Filters */}
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Action</Label>
                <Select value={logFilters.action} onValueChange={(v) => { const nf = { ...logFilters, action: v }; setLogFilters(nf); fetchAuditLogs(nf) }}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {distinctActions.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">From</Label>
                <Input type="date" className="w-[150px]" value={logFilters.date_from} onChange={(e) => { const nf = { ...logFilters, date_from: e.target.value }; setLogFilters(nf); fetchAuditLogs(nf) }} />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">To</Label>
                <Input type="date" className="w-[150px]" value={logFilters.date_to} onChange={(e) => { const nf = { ...logFilters, date_to: e.target.value }; setLogFilters(nf); fetchAuditLogs(nf) }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{auditLogs.length} entries</span>
              <Button variant="outline" size="sm" onClick={exportLogsCSV} className="gap-1.5"><Download className="h-4 w-4" /> Export CSV</Button>
            </div>
          </div>

          {isLoadingLogs ? (
            <div className="text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No Audit Logs</h3>
              <p className="text-gray-500 mt-1">No activity recorded yet.</p>
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
                      <th className="px-4 py-3 hidden lg:table-cell">IP</th>
                      <th className="px-4 py-3 hidden xl:table-cell">User Agent</th>
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
                        <td className="px-4 py-3"><Badge variant="outline" className="text-xs font-mono">{log.action}</Badge></td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{log.resource_type ? `${log.resource_type} #${log.resource_id}` : '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 font-mono">{log.ip_address || '—'}</td>
                        <td className="px-4 py-3 hidden xl:table-cell text-xs text-gray-500 max-w-[200px] truncate" title={log.user_agent}>{log.user_agent || '—'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 max-w-[250px]">
                          {log.details && Object.keys(log.details).length > 0 ? (
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:underline">{Object.keys(log.details).length} fields</summary>
                              <pre className="mt-1 text-[10px] bg-gray-100 p-2 rounded max-h-32 overflow-auto whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                            </details>
                          ) : '—'}
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

      {/* ===== Approve & Assign Unit Modal ===== */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Assign a unit from <strong>{selectedApp?.property_title}</strong> to <strong>{selectedApp?.first_name} {selectedApp?.last_name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {availableUnits.length > 0 ? (
              <>
                <Label className="text-gray-700 font-semibold block">Select Available Unit Type *</Label>
                <div className="space-y-2">
                  {availableUnits.map((unit, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedUnitType(unit.type)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedUnitType === unit.type
                          ? 'border-victor-green bg-green-50 ring-1 ring-victor-green'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{unit.type}</p>
                          <p className="text-xs text-gray-500">
                            {unit.bedrooms && `${unit.bedrooms} bed`}
                            {unit.bathrooms && ` · ${unit.bathrooms} bath`}
                            {unit.area && ` · ${unit.area}m²`}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={`text-xs ${unit.vacantCount <= 2 ? 'border-amber-500 text-amber-700' : 'border-green-500 text-green-700'}`}>
                            {unit.vacantCount} vacant
                          </Badge>
                          {unit.price && <p className="text-xs text-gray-500 mt-1">Ksh {Number(unit.price).toLocaleString()}/mo</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6 bg-red-50 rounded-lg border border-red-100">
                <XCircle className="h-8 w-8 text-red-300 mx-auto mb-2" />
                <p className="text-red-700 font-medium">No vacant units available</p>
                <p className="text-xs text-red-500 mt-1">All units for this property are occupied.</p>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
            <Button
              type="button"
              className="bg-victor-green hover:bg-victor-green-dark"
              disabled={!selectedUnitType || isProcessing}
              onClick={() => processStatusUpdate(selectedApp.id, 'approved', { assigned_unit: selectedUnitType })}
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
