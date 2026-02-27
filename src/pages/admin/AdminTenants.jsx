import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User, Phone, MapPin, Calendar, FileText, Download,
  LayoutGrid, LayoutList, Search, ChevronDown, ChevronUp, Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { downloadFile } from '@/lib/downloadFile'

const AdminTenants = () => {
  const [tenants, setTenants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('card')
  const [expandedId, setExpandedId] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [filterUnit, setFilterUnit] = useState('all')
  const [filterProperty, setFilterProperty] = useState('all')

  // ID Viewer modal
  const [idViewer, setIdViewer] = useState(null) // { front, back, name }

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => { fetchTenants() }, [])

  const fetchTenants = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
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

  // Distinct values for filter dropdowns
  const allProperties = useMemo(() => [...new Set(tenants.map(t => t.property_title).filter(Boolean))], [tenants])
  const allUnits = useMemo(() => [...new Set(tenants.map(t => t.assigned_unit).filter(Boolean))], [tenants])

  const filteredTenants = useMemo(() => tenants.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      t.first_name?.toLowerCase().includes(q) ||
      t.last_name?.toLowerCase().includes(q) ||
      t.id_number?.includes(q) ||
      t.phone?.includes(q) ||
      t.property_title?.toLowerCase().includes(q) ||
      t.assigned_unit?.toLowerCase().includes(q)

    const matchProperty = filterProperty === 'all' || t.property_title === filterProperty
    const matchUnit = filterUnit === 'all' || t.assigned_unit === filterUnit

    return matchSearch && matchProperty && matchUnit
  }), [tenants, search, filterProperty, filterUnit])

  const downloadCSV = () => {
    if (!filteredTenants.length) { toast.info('No data'); return }
    const headers = ['First Name', 'Last Name', 'ID Number', 'Phone', 'Property', 'Unit', 'Approved Date', 'Consent']
    const rows = filteredTenants.map(t => [
      t.first_name, t.last_name, t.id_number, t.phone,
      `"${t.property_title || 'N/A'}"`, t.assigned_unit || 'N/A',
      new Date(t.updated_at).toLocaleDateString(),
      t.digital_consent ? 'Yes' : 'No'
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `tenants_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const renderAvatar = (t) => (
    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
      {t.first_name?.[0]}{t.last_name?.[0]}
    </div>
  )

  // ---------- Card View ----------
  const renderCard = (t) => (
    <Card key={t.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1.5 w-full bg-victor-green" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {renderAvatar(t)}
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{t.first_name} {t.last_name}</h3>
              <p className="text-xs text-gray-500">Nat ID: {t.id_number}</p>
            </div>
          </div>
          {t.digital_consent && <Badge className="text-xs bg-green-100 text-green-700">Consented</Badge>}
        </div>

        <div className="space-y-2.5 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-800 font-medium">{t.property_title || 'Unknown'}</span>
              {t.assigned_unit && <Badge variant="secondary" className="ml-2 font-mono text-xs">{t.assigned_unit}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" />
            <a href={`tel:${t.phone}`} className="hover:text-victor-green hover:underline">{t.phone}</a>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Calendar className="h-4 w-4 text-gray-400" />
            Approved: {formatDate(t.updated_at)}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
          <Button
            variant="outline" size="sm"
            className="text-xs h-8 flex-1 text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={() => setIdViewer({ front: t.id_document_front, back: t.id_document_back, name: `${t.first_name} ${t.last_name}` })}
          >
            <Eye className="h-3 w-3 mr-1.5" /> View ID (Both Sides)
          </Button>
          {t.signed_agreement_url && (
            <Button
              variant="outline" size="sm"
              className="text-xs h-8 flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => downloadFile(t.signed_agreement_url, `Agreement_${t.first_name}_${t.last_name}.pdf`)}
            >
              <FileText className="h-3 w-3 mr-1.5" /> Agreement
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // ---------- List View ----------
  const renderRow = (t) => (
    <div key={t.id} className="border rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
        className="w-full text-left p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {renderAvatar(t)}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{t.first_name} {t.last_name}</p>
            <p className="text-xs text-gray-500">{t.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700 truncate max-w-[140px]">{t.property_title}</p>
            {t.assigned_unit && <Badge variant="secondary" className="font-mono text-xs">{t.assigned_unit}</Badge>}
          </div>
          <span className="text-xs text-gray-400 hidden md:inline">{formatDate(t.updated_at)}</span>
          {expandedId === t.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {expandedId === t.id && (
        <div className="border-t p-4 bg-gray-50/50 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div><span className="text-xs text-gray-500 block">ID Number</span>{t.id_number}</div>
            <div><span className="text-xs text-gray-500 block">Phone</span>{t.phone}</div>
            <div><span className="text-xs text-gray-500 block">Property</span>{t.property_title}</div>
            <div><span className="text-xs text-gray-500 block">Unit</span>{t.assigned_unit || '—'}</div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline" size="sm"
              className="text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={() => setIdViewer({ front: t.id_document_front, back: t.id_document_back, name: `${t.first_name} ${t.last_name}` })}
            >
              <Eye className="h-3 w-3 mr-1.5" /> View ID (Both Sides)
            </Button>
            {t.signed_agreement_url && (
              <Button variant="outline" size="sm" className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => downloadFile(t.signed_agreement_url, `Agreement_${t.first_name}_${t.last_name}.pdf`)}
              >
                <FileText className="h-3 w-3 mr-1.5" /> Download Agreement
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Tenants Directory</h1>
        <p className="text-gray-500 mt-1 text-sm">Permanent record of all approved tenants and their assigned units.</p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name, ID, phone, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Property</Label>
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {allProperties.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Unit Type</Label>
          <Select value={filterUnit} onValueChange={setFilterUnit}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              {allUnits.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2 ml-auto">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'card' ? 'bg-victor-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setViewMode('card')} title="Card View"
            ><LayoutGrid className="h-4 w-4" /></button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-victor-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setViewMode('list')} title="List View"
            ><LayoutList className="h-4 w-4" /></button>
          </div>
          <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{filteredTenants.length} tenant{filteredTenants.length !== 1 ? 's' : ''} shown</p>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 animate-pulse bg-white rounded-xl border">Loading tenants...</div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Tenants Found</h3>
          <p className="text-gray-500 mt-1 text-sm">{search || filterProperty !== 'all' || filterUnit !== 'all' ? 'Try adjusting your filters.' : 'No approved tenants on record yet.'}</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTenants.map(renderCard)}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTenants.map(renderRow)}
        </div>
      )}

      {/* ID Viewer Modal */}
      <Dialog open={!!idViewer} onOpenChange={() => setIdViewer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ID Documents — {idViewer?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Front Side</p>
              {idViewer?.front ? (
                <img src={idViewer.front} alt="ID Front" className="w-full rounded-lg border object-contain max-h-64 bg-gray-50" />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">Not uploaded</div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Back Side</p>
              {idViewer?.back ? (
                <img src={idViewer.back} alt="ID Back" className="w-full rounded-lg border object-contain max-h-64 bg-gray-50" />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">Not uploaded</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminTenants
