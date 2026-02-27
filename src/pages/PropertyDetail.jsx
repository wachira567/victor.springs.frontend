
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  User,
  Phone,
  Mail,
  Heart,
  Share2,
  ChevronLeft,
  Shield,
  Check,
  Car,
  Waves,
  Dumbbell,
  TreePine,
  Dog,
  Info,
  FileText,
  MessageSquare,
  Navigation,
  FileDown,
  Upload
} from 'lucide-react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { formatPrice, formatDate } from '@/lib/utils'
import TenantApplicationBox from '@/components/tenant/TenantApplicationBox'

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

// Helper: transform Cloudinary URL to force download via fl_attachment flag
const getCloudinaryDownloadUrl = (url) => {
  if (!url) return url
  // Insert fl_attachment after /upload/ to force browser download
  return url.replace('/upload/', '/upload/fl_attachment/')
}

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole, user: currentUser } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const isLandlordView = hasRole(['landlord', 'admin', 'super_admin'])

  // Settings State
  const [globalPhone, setGlobalPhone] = useState('')

  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPropertyAndSettings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        
        const [propRes, settingsRes] = await Promise.all([
          axios.get(`${API_URL}/properties/${id}`),
          axios.get(`${API_URL}/settings/`)
        ])
        
        setProperty(propRes.data.property)
        setIsFavorite(propRes.data.property.is_liked || false)
        if (settingsRes.data.settings?.contact_number) {
           setGlobalPhone(settingsRes.data.settings.contact_number)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPropertyAndSettings()
  }, [id])

  const handleInteract = async (type) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      await axios.post(`${API_URL}/properties/${id}/interact`, { type })
    } catch (err) {
      console.error('Failed to log interaction')
    }
  }

  const handleLikeToggle = async () => {
    if (!currentUser) {
       alert("Please log in to like properties.")
       return
    }
    try {
      if (isLandlordView) {
        toast.info("Management accounts cannot like properties.")
        return
      }
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('victorsprings_token')
      const headers = { Authorization: `Bearer ${token}` }
      const { data } = await axios.post(`${API_URL}/properties/${id}/like`, {}, { headers })
      
      setIsFavorite(data.liked)
      setProperty(prev => ({ ...prev, like_count: data.like_count }))
    } catch (err) {
       console.error("Failed to toggle like", err)
    }
  }

  const handleGetDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${property.latitude},${property.longitude}`
        window.open(url, '_blank')
        handleInteract('map')
      }, (error) => {
        console.error("Error getting location: ", error)
        const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`
        window.open(url, '_blank')
        toast.error("Could not get your current location. Opening directions with destination only.")
      })
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`
      window.open(url, '_blank')
      toast.error("Geolocation is not supported by your browser.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-victor-green"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Property not found</h2>
      </div>
    )
  }

  const defaultImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop'
  const displayImages = property.images && property.images.length > 0 ? property.images : [defaultImage]
  const landlord = property.landlord || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Landlord/Admin View Banner */}
      {isLandlordView && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2 text-yellow-800">
            <Shield className="h-4 w-4" />
            <p className="font-medium text-sm text-center">
              You are viewing this property as {hasRole('super_admin') ? 'a Super Admin' : hasRole('admin') ? 'an Admin' : 'a Landlord'}. 
              Booking actions and applications are disabled.
            </p>
          </div>
        </div>
      )}

      {/* Back Button & Actions */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                if (hasRole(['super_admin', 'admin'])) navigate('/admin/properties')
                else if (hasRole('landlord')) navigate('/landlord')
                else navigate(-1)
              }}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleLikeToggle}
                className={`${isFavorite ? 'text-red-500' : ''} ${isLandlordView ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isLandlordView ? "Cannot like as management" : "Like Property"}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={displayImages[selectedImage] || defaultImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.is_partner_property && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-victor-green text-white text-sm">
                    <Shield className="h-4 w-4" />
                    Verified Listing
                  </div>
                )}
                {property.isFeatured && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-victor-orange text-white text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-victor-green' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <Badge className="mb-2 bg-victor-green/10 text-victor-green border-transparent hover:bg-victor-green/20">{property.property_type}</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="h-5 w-5 text-victor-green" />
                    <span>{property.address ? `${property.address}, ${property.city}` : property.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  {property.units && property.units.length > 0 ? (
                    <>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Starting from</div>
                      <div className="text-3xl font-bold text-victor-green">
                        {formatPrice(Math.min(...property.units.map(u => u.price)))}
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-victor-green">
                      {formatPrice(property.price)}
                    </div>
                  )}
                  <div className="text-gray-500">per month</div>
                </div>
              </div>

              {/* Quick Summary Stats (derived from units if present) */}
              <div className="flex flex-wrap gap-6 py-4 border-y">
                {property.units && property.units.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.units.length} Unit Types Available</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{property.area} m²</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">Available: {property.available_from ? new Date(property.available_from).toDateString() : 'Immediate'}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="bg-white rounded-xl shadow-sm">
              <TabsList className="w-full justify-start rounded-t-xl border-b bg-transparent p-0 overflow-x-auto flex-nowrap">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm outline-none focus-visible:ring-0 whitespace-nowrap"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="units"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm outline-none focus-visible:ring-0 whitespace-nowrap"
                >
                  Units
                </TabsTrigger>
                <TabsTrigger 
                  value="amenities"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm outline-none focus-visible:ring-0 whitespace-nowrap"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="location"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm outline-none focus-visible:ring-0 whitespace-nowrap"
                >
                  Location
                </TabsTrigger>
                {currentUser && hasRole('tenant') && (
                  <TabsTrigger 
                    value="agreement"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm outline-none focus-visible:ring-0 whitespace-nowrap"
                  >
                    Agreement
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="description" className="p-6">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed mb-6">
                  {property.description}
                </p>
                {property.tenant_agreement_fee && (
                   <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                     <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                     <div>
                       <h4 className="font-semibold text-blue-900">Tenant Agreement Fee Required</h4>
                       <p className="text-sm text-blue-800">This landlord requires a one-time non-refundable agreement fee of <strong>KES {property.tenant_agreement_fee}</strong> before moving in.</p>
                     </div>
                   </div>
                )}
              </TabsContent>

              <TabsContent value="units" className="p-6">
                {property.units && property.units.length > 0 ? (
                  <div className="space-y-4">
                    {property.units.map((unit, idx) => (
                      <div key={idx} className="border rounded-xl p-5 hover:border-victor-green transition-colors bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{unit.type}</h3>
                            <p className="text-sm font-medium text-victor-green bg-victor-green/10 inline-flex px-2 py-0.5 rounded mt-1">
                              {unit.vacantCount} vacant unit{unit.vacantCount !== 1 ? 's' : ''} available
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="font-bold text-2xl text-gray-900">{formatPrice(unit.price)}</span>
                            <span className="text-gray-500 text-sm block">/month per unit</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4 pt-4 border-t">
                          {unit.bedrooms > 0 && <span className="flex items-center gap-1.5"><Bed className="h-4 w-4" /> {unit.bedrooms} Bed</span>}
                          {unit.bathrooms > 0 && <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {unit.bathrooms} Bath</span>}
                          {unit.area && <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4" /> {unit.area} </span>}
                        </div>
                        
                        {unit.amenities && unit.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {unit.amenities.map(am => (
                              <Badge key={am} variant="outline" className="font-normal text-gray-600 border-gray-200">
                                {am}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">This property does not have distinct units defined. It is rented as a whole.</p>
                )}
              </TabsContent>

              <TabsContent value="amenities" className="p-6">
                <h4 className="font-semibold text-lg mb-4">Shared Building Facilities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(property.amenities || []).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                      <Check className="h-4 w-4 text-victor-green" />
                      <span className="text-gray-700 text-sm font-medium">{typeof amenity === 'string' ? amenity : amenity.name}</span>
                    </div>
                  ))}
                  {(!property.amenities || property.amenities.length === 0) && (
                     <p className="text-gray-500 col-span-full">No shared building amenities listed.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="location" className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-lg">{property.address}, {property.city}</h4>
                  {property.location_description && (
                    <p className="text-gray-600 text-sm mt-1 mb-4 italic">"{property.location_description}"</p>
                  )}
                </div>
                
                {property.latitude && property.longitude ? (
                  <div className="space-y-4">
                    <div 
                      className="h-[400px] w-full rounded-xl overflow-hidden border shadow-sm relative"
                      onClick={() => handleInteract('map')}
                    >
                      <Map
                        initialViewState={{
                          longitude: parseFloat(property.longitude),
                          latitude: parseFloat(property.latitude),
                          zoom: 14
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxAccessToken={mapboxToken}
                      >
                        <NavigationControl position="top-right" />
                        <GeolocateControl 
                          position="top-right" 
                          positionOptions={{ enableHighAccuracy: true }}
                          trackUserLocation={true}
                          showUserHeading={true}
                        />
                        <Marker 
                          longitude={parseFloat(property.longitude)} 
                          latitude={parseFloat(property.latitude)} 
                          color="red"
                        />
                      </Map>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      onClick={handleGetDirections}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions from My Location
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-dashed">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Exact coordinates not provided by landlord.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="agreement" className="p-4 sm:p-6">
                <div className="max-w-xl mx-auto py-2 sm:py-4">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-victor-green/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-victor-green" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Official Tenant Agreement</h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
                      Review and sign the tenancy agreement for this property. 
                      Download it now and upload the signed copy when you're ready.
                    </p>
                  </div>

                  {property.tenant_agreement_url ? (
                    <div className="space-y-5 sm:space-y-6">
                      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-dashed border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-victor-green/10 rounded-lg shrink-0">
                               <FileDown className="h-7 w-7 sm:h-8 sm:w-8 text-victor-green" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">Tenancy_Agreement.pdf</p>
                              <p className="text-xs text-gray-500 uppercase">PDF Document</p>
                            </div>
                          </div>
                          <a
                            href={getCloudinaryDownloadUrl(property.tenant_agreement_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full sm:w-auto rounded-md px-4 py-2 text-sm font-medium bg-victor-green text-white hover:bg-victor-green-dark transition-colors"
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            Download PDF
                          </a>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center border-t pt-3 italic">
                          Document ID: {property.id}-TA-VS
                        </p>
                      </div>

                      <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500 font-medium">Ready to Proceed?</span>
                        </div>
                      </div>

                      <div className="bg-blue-50/80 rounded-xl p-4 sm:p-6 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">Instructions for Submission</h4>
                        <ol className="text-xs sm:text-sm text-blue-800 space-y-1.5 sm:space-y-2 list-decimal pl-4">
                          <li>Download the agreement above.</li>
                          <li>Read carefully and sign every required page.</li>
                          <li>Scan the signed document (PDF or clear Images).</li>
                          <li>Click the button below to pay the processing fee and upload.</li>
                        </ol>
                        
                        <Button 
                          className="w-full mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isLandlordView}
                          onClick={() => {
                            setShowApplicationForm(true)
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Pay Fee & Upload Signed Copy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12 bg-gray-50 rounded-xl border border-dashed">
                      <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium text-sm sm:text-base">Agreement not yet uploaded by landlord.</p>
                      <p className="text-xs text-gray-400 mt-1">Please contact property management for details.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Interested in this property?</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Get in touch with us to book a viewing or to inquire about moving in. We're here to help!
                  </p>

                  <div className="space-y-3">
                    <Button 
                      className={`w-full ${isLandlordView ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#1ebd5a]'} text-white`}
                      disabled={isLandlordView}
                      onClick={() => {
                         handleInteract('whatsapp')
                         if (globalPhone) {
                           window.open(`https://wa.me/${globalPhone.replace(/\\D/g, '')}?text=Hi, I am interested in ${property.title} (${window.location.href})`, '_blank')
                         }
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat on WhatsApp
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={isLandlordView}
                      onClick={() => {
                         handleInteract('call')
                         if (globalPhone) {
                           window.open(`tel:${globalPhone}`, '_self')
                         }
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us Now
                    </Button>

                    {currentUser && (
                      <>
                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or</span>
                          </div>
                        </div>
                        <Button 
                          className={`w-full ${isLandlordView ? 'bg-gray-400 cursor-not-allowed' : 'bg-victor-green hover:bg-victor-green-dark'} text-white`}
                          disabled={isLandlordView}
                          onClick={() => setShowApplicationForm(true)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Apply for Tenancy
                        </Button>
                      </>
                    )}
                    {!currentUser && !isLandlordView && (
                       <p className="text-xs text-gray-500 mt-2 text-center">Sign in to apply for this property directly.</p>
                    )}
                  </div>
                  
                  {!globalPhone && (
                    <p className="text-xs text-red-500 mt-3 text-center">Contact numbers are temporarily unavailable.</p>
                  )}
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-blue-900">Safety Tips</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Always view the property in person</li>
                    <li>• Never send money before viewing</li>
                    <li>• Verify the landlord's identity</li>
                    <li>• Use M-Pesa for secure payments</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <TenantApplicationBox 
          property={property} 
          user={currentUser} 
          onClose={() => setShowApplicationForm(false)} 
        />
      )}
    </div>
  )
}

export default PropertyDetail
