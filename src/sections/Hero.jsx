import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MapPin, Home, Building } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchParams.location) params.append('location', searchParams.location)
    if (searchParams.propertyType) params.append('type', searchParams.propertyType)
    if (searchParams.priceRange) params.append('price', searchParams.priceRange)
    navigate(`/properties?${params.toString()}`)
  }


  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("https://res.cloudinary.com/dtbe44muv/image/upload/v1772186997/VictorspringsHomepage_vu2wjw.jpg")` }}
      />
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Kenya's #1 Rental Platform
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Home in Kenya
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Discover verified rental properties across Nairobi, Mombasa, Kisumu, and more. 
            Secure M-Pesa payments and trusted landlords.
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-4 shadow-2xl animate-fade-in-up animate-delay-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Enter location..."
                  className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-victor-green"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                />
              </div>

              {/* Property Type */}
              <Select
                value={searchParams.propertyType}
                onValueChange={(value) => setSearchParams({ ...searchParams, propertyType: value })}
              >
                <SelectTrigger className="h-12 border-0 bg-gray-50">
                  <Home className="h-5 w-5 text-gray-400 mr-2" />
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office Space</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select
                value={searchParams.priceRange}
                onValueChange={(value) => setSearchParams({ ...searchParams, priceRange: value })}
              >
                <SelectTrigger className="h-12 border-0 bg-gray-50">
                  <Building className="h-5 w-5 text-gray-400 mr-2" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-20000">Under KES 20,000</SelectItem>
                  <SelectItem value="20000-50000">KES 20,000 - 50,000</SelectItem>
                  <SelectItem value="50000-100000">KES 50,000 - 100,000</SelectItem>
                  <SelectItem value="100000+">Above KES 100,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button 
                type="submit"
                className="h-12 bg-victor-green hover:bg-victor-green-dark text-white font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-up animate-delay-300">
            <span className="text-white/60 text-sm">Popular:</span>
            {['Nairobi', 'Kiambu'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSearchParams({ ...searchParams, location: city })
                  navigate(`/properties?location=${city}`)
                }}
                className="text-sm text-white/80 hover:text-white underline underline-offset-2 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>


        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero
