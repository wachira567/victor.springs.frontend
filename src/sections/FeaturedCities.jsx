import { useNavigate } from 'react-router-dom'
import { MapPin, Building2, TrendingUp } from 'lucide-react'

const FeaturedCities = () => {
  const navigate = useNavigate()

  const cities = [
    {
      name: 'Nairobi',
      image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=600&h=400&fit=crop',
      propertyCount: 4520,
      avgPrice: 'KES 45,000',
      growth: '+12%',
      description: 'The capital city with diverse neighborhoods',
    },
    {
      name: 'Mombasa',
      image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=600&h=400&fit=crop',
      propertyCount: 2150,
      avgPrice: 'KES 38,000',
      growth: '+8%',
      description: 'Coastal living with beautiful beaches',
    },
    {
      name: 'Kisumu',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      propertyCount: 980,
      avgPrice: 'KES 28,000',
      growth: '+15%',
      description: 'Lake-side city with growing opportunities',
    },
    {
      name: 'Nakuru',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      propertyCount: 750,
      avgPrice: 'KES 25,000',
      growth: '+10%',
      description: 'Scenic views near Lake Nakuru',
    },
    {
      name: 'Eldoret',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
      propertyCount: 520,
      avgPrice: 'KES 22,000',
      growth: '+7%',
      description: 'Athletic capital with affordable housing',
    },
    {
      name: 'Thika',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
      propertyCount: 680,
      avgPrice: 'KES 20,000',
      growth: '+14%',
      description: 'Fast-growing industrial town',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
            Explore Locations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Cities in Kenya
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover rental properties in Kenya's most sought-after locations. 
            From bustling Nairobi to coastal Mombasa, find your ideal neighborhood.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <div
              key={city.name}
              onClick={() => navigate(`/properties?location=${city.name}`)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 city-overlay" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Kenya</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                <p className="text-white/70 text-sm mb-4">{city.description}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-white/90 text-sm">
                    <Building2 className="h-4 w-4" />
                    <span>{city.propertyCount.toLocaleString()} properties</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>{city.growth}</span>
                  </div>
                </div>
              </div>

              {/* Price Tag */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                <span className="text-sm font-semibold text-gray-900">From {city.avgPrice}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-victor-green text-victor-green font-medium hover:bg-victor-green hover:text-white transition-colors"
          >
            View All Properties
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCities
