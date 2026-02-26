import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
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
  Dog
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const isLandlordView = hasRole('landlord')

  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        const response = await axios.get(`${API_URL}/properties/${id}`)
        setProperty(response.data.property)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperty()
  }, [id])

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
      {/* Landlord View Banner */}
      {isLandlordView && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2 text-yellow-800">
            <Shield className="h-4 w-4" />
            <p className="font-medium text-sm">
              You are viewing this property as a Landlord. Booking actions and applications are disabled.
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
              onClick={() => isLandlordView ? navigate('/landlord') : navigate(-1)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? 'text-red-500' : ''}
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
                  <Badge className="mb-2">{property.property_type}</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="h-5 w-5 text-victor-green" />
                    <span>{property.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-victor-green">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-gray-500">per month</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 py-4 border-y">
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
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">Available: {property.available_from ? new Date(property.available_from).toDateString() : 'Immediate'}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="bg-white rounded-xl shadow-sm">
              <TabsList className="w-full justify-start rounded-t-xl border-b bg-transparent p-0">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-6 py-4"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="amenities"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-6 py-4"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger 
                  value="features"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-6 py-4"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="location"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-victor-green data-[state=active]:bg-transparent px-6 py-4"
                >
                  Location
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-6">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {property.description}
                </p>
              </TabsContent>

              <TabsContent value="amenities" className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(property.amenities || []).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-victor-green/10 flex items-center justify-center">
                        <Check className="h-5 w-5 text-victor-green" />
                      </div>
                      <span className="text-gray-700">{typeof amenity === 'string' ? amenity : amenity.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="features" className="p-6">
                <ul className="space-y-3">
                  {(property.features || []).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-victor-green/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-victor-green" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {(!property.features || property.features.length === 0) && (
                     <li className="text-gray-500">No additional features listed.</li>
                  )}
                </ul>
              </TabsContent>

              <TabsContent value="location" className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">{property.address}</p>
                    <p className="text-sm text-gray-500 mt-1">Map integration coming soon</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {!isLandlordView && (
                <>
                  {/* Contact Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Contact Landlord</h3>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{landlord.name || 'Verifying Landlord'}</h4>
                            {landlord.name && (
                              <Shield className="h-4 w-4 text-victor-green" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Member since 2024</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-victor-green hover:bg-victor-green-dark" disabled={!landlord.phone}>
                              <Phone className="h-4 w-4 mr-2" />
                              Show Phone Number
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Contact Information</DialogTitle>
                            </DialogHeader>
                            <div className="text-center py-6">
                              <p className="text-lg font-semibold">{landlord.phone || 'N/A'}</p>
                              <p className="text-sm text-gray-500 mt-2">Mention you found this on Victor Springs</p>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule Viewing Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Schedule a Viewing</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Book a time to view this property in person. Our agents will show you around.
                      </p>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Viewing
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

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
    </div>
  )
}

export default PropertyDetail
