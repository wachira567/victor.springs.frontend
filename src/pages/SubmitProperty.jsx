import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Upload, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize,
  Car,
  Waves,
  Dumbbell,
  Shield,
  Dog,
  TreePine,
  Wifi,
  Check,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Info,
  Plus,
  Trash2,
  Home,
  Search,
  Crosshair,
  Map as MapIcon,
  Navigation
} from 'lucide-react'
import { toast } from 'sonner'
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

const SubmitProperty = () => {
  const navigate = useNavigate()
  const { hasRole, user } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    tenantAgreementFee: '',
    tenantAgreementFile: null,
    city: '',
    address: '',
    locationDescription: '',
    latitude: -1.2921, // Nairobi default
    longitude: 36.8219,
    units: []
  })

  const [viewState, setViewState] = useState({
    longitude: 36.8219,
    latitude: -1.2921,
    zoom: 12
  })

  const [locationMethod, setLocationMethod] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Redirect if not landlord
  if (!hasRole(['landlord', 'super_admin'])) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Info className="h-16 w-16 mx-auto mb-4 text-victor-green" />
            <h2 className="text-xl font-bold mb-2">Landlord Account Required</h2>
            <p className="text-gray-600 mb-4">
              You need a landlord account to list properties. Upgrade your account to get started.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Redirect if unverified landlord
  if (hasRole('landlord') && !hasRole('super_admin') && user?.verification_status !== 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-bold mb-2">Identity Verification Required</h2>
            <p className="text-gray-600 mb-6">
              To protect our community from fraud, all landlords must complete identity verification (KYC) before listing properties.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/landlord')} className="bg-victor-green hover:bg-victor-green-dark">
                Verify Identity in Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const amenitiesList = [
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'petFriendly', label: 'Pet Friendly', icon: Dog },
    { id: 'garden', label: 'Garden', icon: TreePine },
    { id: 'wifi', label: 'WiFi Ready', icon: Wifi },
  ]

  const handleUnitAmenityToggle = (unitIndex, amenityId) => {
    const newUnits = [...formData.units]
    const unit = newUnits[unitIndex]
    if (unit.amenities.includes(amenityId)) {
      unit.amenities = unit.amenities.filter(a => a !== amenityId)
    } else {
      unit.amenities.push(amenityId)
    }
    setFormData({ ...formData, units: newUnits })
  }

  const addUnit = () => {
    setFormData({
      ...formData,
      units: [
        ...formData.units,
        {
          id: Date.now().toString(),
          type: '',
          vacantCount: 1,
          price: '',
          bedrooms: 1,
          bathrooms: 1,
          area: '',
          amenities: []
        }
      ]
    })
  }

  const removeUnit = (index) => {
    const newUnits = [...formData.units]
    newUnits.splice(index, 1)
    setFormData({ ...formData, units: newUnits })
  }

  const updateUnit = (index, field, value) => {
    const newUnits = [...formData.units]
    newUnits[index][field] = value
    setFormData({ ...formData, units: newUnits })
  }

  const handleMapClick = (evt) => {
    setFormData(prev => ({
      ...prev,
      longitude: evt.lngLat.lng,
      latitude: evt.lngLat.lat
    }))
  }

  const handleSearchLocation = async () => {
    if (!searchQuery) return
    setIsSearching(true)
    try {
      const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=KE`)
      const data = await resp.json()
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        setFormData(prev => ({ ...prev, longitude: lng, latitude: lat }))
        setViewState({ longitude: lng, latitude: lat, zoom: 14 })
        toast.success('Location found!')
      } else {
        toast.error('Location not found in Kenya.')
      }
    } catch (error) {
      toast.error('Error searching location.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleApplyCoordinates = () => {
    const lat = parseFloat(formData.latitude)
    const lng = parseFloat(formData.longitude)
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Invalid coordinates entered. They do not exist.')
      return
    }
    setViewState({ longitude: lng, latitude: lat, zoom: 14 })
    toast.success('Coordinates applied!')
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    toast.info('Detecting location...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
        setViewState({ longitude: lng, latitude: lat, zoom: 15 })
        toast.success('Current location detected!')
      },
      () => {
        toast.error('Unable to retrieve your location. Please check your permissions.')
      }
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + uploadedImages.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    const newImages = files.map(file => URL.createObjectURL(file))
    setUploadedImages(prev => [...prev, ...newImages])
    setImageFiles(prev => [...prev, ...files])
    toast.success(`${files.length} image(s) uploaded`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('victorsprings_token') || localStorage.getItem('token')
      if (!token) {
        toast.error('You must be logged in to submit a property.')
        navigate('/login')
        return
      }

      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('propertyType', formData.propertyType)
      submitData.append('tenant_agreement_fee', formData.tenantAgreementFee)
      submitData.append('city', formData.city)
      submitData.append('address', formData.address)
      submitData.append('locationDescription', formData.locationDescription)
      submitData.append('latitude', formData.latitude)
      submitData.append('longitude', formData.longitude)
      submitData.append('units', JSON.stringify(formData.units))
      
      if (formData.tenantAgreementFile) {
        submitData.append('tenant_agreement_file', formData.tenantAgreementFile)
      }

      imageFiles.forEach(file => {
        submitData.append('images', file)
      })

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit property')
      }

      toast.success('Property submitted successfully! It will be reviewed shortly.')
      navigate('/landlord')
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit property')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Units' },
    { number: 4, title: 'Photos' },
    { number: 5, title: 'Review' },
  ]

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.propertyType && formData.description
      case 2:
        return formData.city && formData.address
      case 3:
        return formData.units.length > 0 && formData.units.every(u => u.type && u.price && u.area)
      case 4:
        return uploadedImages.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">List Your Property</h1>
          <p className="text-gray-600">Fill in the precise unit details to list on Victor Springs</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  step >= s.number ? 'text-victor-green' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= s.number ? 'bg-victor-green text-white' : 'bg-gray-200'
                  }`}>
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    step > s.number ? 'bg-victor-green' : 'bg-gray-200'
                  }`} style={{ width: '60px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the general details of the building/property wrapper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Sunrise Apartments Complex"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Property/Building Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment Building</SelectItem>
                      <SelectItem value="house">Single Family House</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial Plaza</SelectItem>
                      <SelectItem value="office">Office Block</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="hostel">Hostel / Student Housing</SelectItem>
                      <SelectItem value="gated">Gated Community</SelectItem>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tenantAgreementFee">Tenant Agreement Fee (Optional, KES)</Label>
                  <Input
                    id="tenantAgreementFee"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.tenantAgreementFee}
                    onChange={(e) => setFormData({ ...formData, tenantAgreementFee: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if not applicable.</p>
                </div>

                <div>
                  <Label htmlFor="tenantAgreementFile">Blank Tenant Agreement (PDF)</Label>
                  <div className="mt-2 border border-dashed rounded bg-gray-50 p-3 text-center cursor-pointer relative overflow-hidden h-20 flex items-center justify-center">
                    <Input 
                      type="file" 
                      id="tenantAgreementFile"
                      onChange={(e) => setFormData(prev => ({ ...prev, tenantAgreementFile: e.target.files[0] }))} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept=".pdf" 
                    />
                    {formData.tenantAgreementFile ? (
                      <span className="text-sm font-medium text-victor-green line-clamp-2">{formData.tenantAgreementFile.name}</span>
                    ) : (
                       <div className="text-gray-400"><Upload className="mx-auto h-5 w-5 mb-1"/> Upload Template PDF</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tenants will download this, sign it, and re-upload when applying.</p>
                </div>

                <div>
                  <Label htmlFor="description">General Property Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the overall building, neighborhood, and shared amenities..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location (Mapbox) */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Location & Map</CardTitle>
                <CardDescription>Pinpoint your property and provide directions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City/Area *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Nairobi, Kilimani"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Argwings Kodhek Rd"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t mt-4">
                  <Label>How would you like to pinpoint the map location?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button 
                      type="button" 
                      variant={locationMethod === 'search' ? 'default' : 'outline'}
                      className={locationMethod === 'search' ? 'bg-victor-green hover:bg-victor-green-dark' : ''}
                      onClick={() => setLocationMethod('search')}
                    >
                      <Search className="h-4 w-4 mr-2 hidden sm:block delay-150" /> Search Place
                    </Button>
                    <Button 
                      type="button" 
                      variant={locationMethod === 'coordinates' ? 'default' : 'outline'}
                      className={locationMethod === 'coordinates' ? 'bg-victor-green hover:bg-victor-green-dark' : ''}
                      onClick={() => setLocationMethod('coordinates')}
                    >
                      <MapIcon className="h-4 w-4 mr-2 hidden sm:block delay-150" /> Coordinates
                    </Button>
                    <Button 
                      type="button" 
                      variant={locationMethod === 'currentLocation' ? 'default' : 'outline'}
                      className={locationMethod === 'currentLocation' ? 'bg-victor-green hover:bg-victor-green-dark' : ''}
                      onClick={() => setLocationMethod('currentLocation')}
                    >
                      <Crosshair className="h-4 w-4 mr-2 hidden sm:block delay-150" /> Detect Current
                    </Button>
                  </div>

                  {locationMethod === 'search' && (
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Search for a building, street, or area in Kenya..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSearchLocation()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleSearchLocation} disabled={isSearching} className="bg-victor-green hover:bg-victor-green-dark shrink-0">
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                      </Button>
                    </div>
                  )}

                  {locationMethod === 'coordinates' && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Latitude</Label>
                        <Input 
                          type="number" 
                          step="any"
                          value={formData.latitude}
                          onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Longitude</Label>
                        <Input 
                          type="number" 
                          step="any"
                          value={formData.longitude}
                          onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                        />
                      </div>
                      <Button type="button" onClick={handleApplyCoordinates} variant="outline" className="shrink-0">
                        Locate Pin
                      </Button>
                    </div>
                  )}

                  {locationMethod === 'currentLocation' && (
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100 mt-2">
                      <span className="text-sm text-blue-800">Use your device's GPS to find your exact location.</span>
                      <Button type="button" onClick={handleGetCurrentLocation} className="shrink-0 ml-4">
                        <Navigation className="h-4 w-4 mr-2" /> Detect Now
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2 mb-2">You can also manually click anywhere on the map to drop the property pin.</p>
                  
                  <div className="h-[400px] w-full rounded-lg overflow-hidden border mt-2">
                    <Map
                      {...viewState}
                      onMove={evt => setViewState(evt.viewState)}
                      onClick={handleMapClick}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      mapboxAccessToken={mapboxToken}
                    >
                      <NavigationControl position="top-right" />
                      <Marker 
                        longitude={formData.longitude} 
                        latitude={formData.latitude} 
                        color="red"
                      />
                    </Map>
                  </div>
                </div>

                <div>
                  <Label htmlFor="locationDescription">Location Directions / Landmarks (Optional)</Label>
                  <Textarea
                    id="locationDescription"
                    placeholder="e.g., Opposite the big supermarket, blue gate..."
                    rows={2}
                    value={formData.locationDescription}
                    onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Units Config */}
          {step === 3 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Unit Configuration</CardTitle>
                  <CardDescription>Add the specific vacant units available in this property</CardDescription>
                </div>
                <Button type="button" onClick={addUnit} variant="outline" className="border-victor-green text-victor-green hover:bg-victor-green/10">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit Type
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.units.length === 0 ? (
                  <div className="text-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
                    <Home className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No units added</h3>
                    <p className="text-sm text-gray-500 mb-4">Please add at least one unit type to continue.</p>
                    <Button type="button" onClick={addUnit}>Add First Unit</Button>
                  </div>
                ) : (
                  formData.units.map((unit, index) => (
                    <div key={unit.id} className="p-4 border border-gray-200 rounded-lg bg-white relative shadow-sm">
                      <div className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer p-1" onClick={() => removeUnit(index)}>
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-lg mb-4 text-victor-green">Unit {index + 1}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label>Unit Type *</Label>
                          <Select value={unit.type} onValueChange={(val) => updateUnit(index, 'type', val)}>
                            <SelectTrigger>
                              <SelectValue placeholder="e.g. 1 Bedroom" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bedsitter">Bedsitter</SelectItem>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                              <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
                              <SelectItem value="3 Bedroom">3 Bedroom</SelectItem>
                              <SelectItem value="4+ Bedroom">4+ Bedroom</SelectItem>
                              <SelectItem value="Commercial Space">Commercial Space</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Rent Price (KES) *</Label>
                          <Input type="number" value={unit.price} onChange={(e) => updateUnit(index, 'price', e.target.value)} placeholder="e.g. 25000" />
                        </div>
                        <div>
                          <Label>Number of Vacant Units *</Label>
                          <Input type="number" min="1" value={unit.vacantCount} onChange={(e) => updateUnit(index, 'vacantCount', parseInt(e.target.value) || 1)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label>Bedrooms</Label>
                          <Input type="number" value={unit.bedrooms} onChange={(e) => updateUnit(index, 'bedrooms', parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <Label>Bathrooms</Label>
                          <Input type="number" value={unit.bathrooms} onChange={(e) => updateUnit(index, 'bathrooms', parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <Label>Area (sq ft / m²)</Label>
                          <Input type="number" value={unit.area} onChange={(e) => updateUnit(index, 'area', e.target.value)} placeholder="e.g. 45" />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Label className="mb-2 block">Specific Amenities for this Unit Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {amenitiesList.map(amenity => {
                            const isSelected = unit.amenities.includes(amenity.id)
                            return (
                              <Badge
                                key={amenity.id}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer border py-1.5 ${isSelected ? 'bg-victor-green hover:bg-victor-green-dark border-transparent' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => handleUnitAmenityToggle(index, amenity.id)}
                              >
                                {amenity.label}
                                {isSelected && <Check className="h-3 w-3 ml-1" />}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Property Photos</CardTitle>
                <CardDescription>Upload general property photos and photos of the units (max 10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Upload Photos</p>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop or click to select files</p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={handleImageUpload}
                  />
                  <Label htmlFor="photo-upload">
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                      Select Photos
                    </div>
                  </Label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-3">
                      Uploaded Photos ({uploadedImages.length}/10)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative aspect-video">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Listing</CardTitle>
                <CardDescription>Verify all details before submitting to Victor Springs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wide">Property Title</span>
                    <p className="font-semibold text-gray-900 text-base">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wide">Type</span>
                    <p className="font-medium text-gray-900 capitalize">{formData.propertyType}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide">Location</span>
                    <p className="font-medium text-gray-900">{formData.address}, {formData.city}</p>
                  </div>
                  {formData.tenantAgreementFee && (
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wide">Tenant Agreement Fee</span>
                      <p className="font-medium text-gray-900">KES {formData.tenantAgreementFee}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mb-4 text-victor-green">Unit Breakdown ({formData.units.length})</h4>
                  <div className="space-y-3">
                    {formData.units.map((unit, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between p-3 border rounded-lg bg-white shadow-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{unit.vacantCount}x {unit.type}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {unit.bedrooms}</span>
                            <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {unit.bathrooms}</span>
                            {unit.area && <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {unit.area}</span>}
                          </div>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="font-bold text-victor-green">KES {unit.price}<span className="text-xs text-gray-500 font-normal">/mo per unit</span></p>
                          <p className="text-xs text-gray-400 mt-1">{unit.amenities.length} amenities</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900">What happens next?</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Your property will be reviewed by Victor Springs admins to ensure all details are correct. 
                        Once approved, it will be listed to generate leads. We will handle tenant inquiries for you.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {step < 5 ? (
              <Button
                type="button"
                className="bg-victor-green hover:bg-victor-green-dark text-white"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-brand hover:bg-brand/90 text-white min-w-[150px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Submit Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitProperty
