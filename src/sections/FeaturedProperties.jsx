import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart, 
  Share2,
  Calendar,
  Shield
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const FeaturedProperties = () => {
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        // Fetch fetching max properties to display natively instead of mock elements
        const response = await axios.get(`${API_URL}/properties/?per_page=6`)
        setProperties(response.data.properties || [])
      } catch (error) {
        console.error('Failed to fetch featured properties:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])


  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
              Featured Listings
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premium Properties
            </h2>
            <p className="text-gray-600 max-w-xl">
              Handpicked properties with verified listings, competitive prices, and ready for immediate move-in.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 border-victor-green text-victor-green hover:bg-victor-green hover:text-white"
            onClick={() => navigate('/properties')}
          >
            View All Properties
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <Card 
              key={property.id}
              className="overflow-hidden border-0 shadow-lg card-hover cursor-pointer"
              onClick={() => navigate(`/properties/${property.id}`)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop'}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.is_partner_property && (
                    <Badge className="bg-victor-orange text-white border-0">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {property.property_type}
                  </Badge>
                </div>

                {/* Verified Badge */}
                {property.is_partner_property && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-victor-green text-white text-xs">
                    <Shield className="h-3 w-3" />
                    Verified
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button 
                    className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle favorite
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-victor-blue transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle share
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg price-tag text-white">
                  <span className="font-bold">{formatPrice(property.price)}</span>
                  <span className="text-sm opacity-90">/month</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                  {property.title}
                </h3>
                
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 text-victor-green" />
                  <span className="line-clamp-1">{property.city}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 mb-4">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Maximize className="h-4 w-4" />
                    <span>{property.area} m²</span>
                  </div>
                </div>

                {/* Available From */}
                <div className="flex items-center gap-1 text-gray-500 text-sm pt-4 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>Available: {property.available_from ? new Date(property.available_from).toDateString() : 'Immediate'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
