import { 
  Shield, 
  CreditCard, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Headphones,
  Zap,
  Lock
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Every property is thoroughly verified by our team to ensure accuracy and legitimacy. No fake listings, no surprises.',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: CreditCard,
      title: 'M-Pesa Payments',
      description: 'Pay your rent securely using M-Pesa. Fast, convenient, and trusted by millions of Kenyans every day.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get approved for your dream home in as little as 24 hours. Our streamlined process saves you time.',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: MapPin,
      title: 'Prime Locations',
      description: 'Access properties in Kenya\'s most desirable neighborhoods, from Kilimani to Nyali and beyond.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assured',
      description: 'Properties meet our quality standards for safety, cleanliness, and amenities before listing.',
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you with any questions or concerns.',
      color: 'from-cyan-400 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book viewings and apply for properties instantly through our easy-to-use platform.',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: Lock,
      title: 'Secure Process',
      description: 'Your data and transactions are protected with bank-level security encryption.',
      color: 'from-red-400 to-red-600',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Victor Springs Advantage
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing the rental experience in Kenya with cutting-edge technology, 
            verified listings, and unmatched customer service.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-victor-green mb-1">100%</div>
              <div className="text-sm text-gray-600">Verified Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-victor-blue mb-1">24h</div>
              <div className="text-sm text-gray-600">Average Response</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-victor-orange mb-1">0%</div>
              <div className="text-sm text-gray-600">Hidden Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-victor-purple mb-1">4.9</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
