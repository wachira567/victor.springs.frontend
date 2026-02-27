import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Filter,
  Grid3X3,
  List,
  Heart,
  Shield,
  X
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const Properties = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'all',
    minPrice: 0,
    maxPrice: 500000,
    bedrooms: [],
    bathrooms: [],
    amenities: [],
  })

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [allProperties, setAllProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_URL}/properties/?per_page=100`)
        setAllProperties(response.data.properties)
        setFilteredProperties(response.data.properties)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProperties()
  }, [])

  useEffect(() => {
    if (allProperties.length === 0) return
    let result = [...allProperties]

    // Location filter
    if (filters.location) {
      const loc = filters.location.toLowerCase()
      result = result.filter(p => 
        (p.city && p.city.toLowerCase().includes(loc)) ||
        (p.address && p.address.toLowerCase().includes(loc)) ||
        (p.title && p.title.toLowerCase().includes(loc))
      )
    }

    // Property (House) Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(p => p.property_type && p.property_type.toLowerCase() === filters.type.toLowerCase())
    }

    // Price filter (checks both property-level price and unit-level prices)
    result = result.filter(p => {
      const minP = filters.minPrice
      const maxP = filters.maxPrice
      
      // If property has units, check if ANY unit is within range
      if (p.units && p.units.length > 0) {
        return p.units.some(u => {
          const uPrice = parseFloat(u.price) || 0
          return uPrice >= minP && uPrice <= maxP
        })
      }
      
      // Fallback to property-level price
      const pPrice = parseFloat(p.price) || 0
      return pPrice >= minP && pPrice <= maxP
    })

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      result = result.filter(p => {
        // If property has units, check if ANY unit matches
        if (p.units && p.units.length > 0) {
          return p.units.some(u => {
            const br = String(u.bedrooms)
            return filters.bedrooms.includes(br) || (br >= 5 && filters.bedrooms.includes('5+'))
          })
        }
        // Fallback to property-level
        const pBr = String(p.bedrooms)
        return filters.bedrooms.includes(pBr) || (pBr >= 5 && filters.bedrooms.includes('5+'))
      })
    }

    // Bathrooms filter
    if (filters.bathrooms.length > 0) {
      result = result.filter(p => {
        if (p.units && p.units.length > 0) {
          return p.units.some(u => filters.bathrooms.includes(String(u.bathrooms)))
        }
        return filters.bathrooms.includes(String(p.bathrooms))
      })
    }

    // Amenities filter (AND logic - must have all selected amenities)
    if (filters.amenities.length > 0) {
      result = result.filter(p => {
        // Check property-level amenities
        const propAmenities = p.amenities || []
        
        // Check if ANY part of the property (main or any unit) has each selected amenity
        return filters.amenities.every(selectedAmenity => {
          // Check if property has it
          if (propAmenities.includes(selectedAmenity)) return true
          
          // Check if any unit has it
          if (p.units && p.units.length > 0) {
            return p.units.some(u => (u.amenities || []).includes(selectedAmenity))
          }
          
          return false
        })
      })
    }

    setFilteredProperties(result)
  }, [filters, allProperties])

  const clearFilters = () => {
    setFilters({
      location: '',
      type: 'all',
      minPrice: 0,
      maxPrice: 500000,
      bedrooms: [],
      bathrooms: [],
      amenities: [],
    })
    setSearchParams({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Enter location..."
            className="pl-9"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Property Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
            <SelectItem value="Studio">Studio</SelectItem>
            <SelectItem value="Condo">Condo</SelectItem>
            <SelectItem value="Townhouse">Townhouse</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-4 block">
          Price Range: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
        </Label>
        <Slider
          defaultValue={[filters.maxPrice]}
          max={500000}
          step={5000}
          onValueChange={(value) => setFilters({ ...filters, maxPrice: value[0] })}
        />
      </div>

      {/* Bedrooms */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Unit Type (Bedrooms)</Label>
        <div className="grid grid-cols-2 gap-2">
          {['0', '1', '2', '3', '4', '5+'].map((num) => (
            <label key={num} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <Checkbox
                checked={filters.bedrooms.includes(num)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, bedrooms: [...filters.bedrooms, num] })
                  } else {
                    setFilters({ 
                      ...filters, 
                      bedrooms: filters.bedrooms.filter(b => b !== num) 
                    })
                  }
                }}
              />
              <span className="text-sm">{num === '0' ? 'Studio' : `${num} BR`}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Bathrooms</Label>
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4+'].map((num) => (
            <label key={num} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <Checkbox
                checked={filters.bathrooms.includes(num)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, bathrooms: [...filters.bathrooms, num] })
                  } else {
                    setFilters({ 
                      ...filters, 
                      bathrooms: filters.bathrooms.filter(b => b !== num) 
                    })
                  }
                }}
              />
              <span className="text-sm">{num}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Amenities</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'parking', label: 'Parking' },
            { id: 'pool', label: 'Swimming Pool' },
            { id: 'gym', label: 'Gym' },
            { id: 'security', label: '24/7 Security' },
            { id: 'petFriendly', label: 'Pet Friendly' },
            { id: 'garden', label: 'Garden' },
            { id: 'wifi', label: 'WiFi Ready' }
          ].map((amenity) => (
            <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <Checkbox
                checked={filters.amenities.includes(amenity.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, amenities: [...filters.amenities, amenity.id] })
                  } else {
                    setFilters({ 
                      ...filters, 
                      amenities: filters.amenities.filter(a => a !== amenity.id) 
                    })
                  }
                }}
              />
              <span className="text-sm">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Home
          </h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              <FilterContent />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredProperties.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-victor-green' : ''}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-victor-green' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Properties Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
              : 'space-y-4'
            }>
              {filteredProperties.map((property) => (
                <Card 
                  key={property.id}
                  className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[4/3]'
                  }`}>
                    <img
                      src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.isVerified && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-victor-green text-white text-xs">
                        <Shield className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                    <button 
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg price-tag text-white">
                      {property.units && property.units.length > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase opacity-90 leading-tight">Starting from</span>
                          <div>
                            <span className="font-bold text-lg">{formatPrice(Math.min(...property.units.map(u => u.price)))}</span>
                            <span className="text-xs opacity-90">/mo</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold">{formatPrice(property.price)}</span>
                          <span className="text-xs opacity-90">/mo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-victor-green/10 text-victor-green hover:bg-victor-green/20">
                        {property.property_type}
                      </Badge>
                      {property.units && property.units.length > 0 && (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {property.units.length} Unit Type{property.units.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                      <MapPin className="h-4 w-4 text-victor-green" />
                      <span className="line-clamp-1">{property.city}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Maximize className="h-4 w-4" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Properties
