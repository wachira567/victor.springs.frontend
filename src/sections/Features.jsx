import { useState } from 'react'
import {
  Search,
  FileText,
  Phone,
  CreditCard,
  Home,
  Users,
  BarChart3,
  Shield,
  ArrowRight
} from 'lucide-react'

const Features = () => {
  const [activeTab, setActiveTab] = useState('tenants')

  const tenantFeatures = [
    {
      icon: Search,
      title: 'Browse Verified Listings',
      description: 'Explore hundreds of quality-checked properties across Nairobi, Kiambu, and Kajiado. Filter by price, location, and amenities to find your perfect match.',
      bg: 'from-orange-200 via-rose-200 to-pink-200',
    },
    {
      icon: FileText,
      title: 'Apply Online',
      description: 'Found a place you love? Submit your application digitally with all the required documents. No paperwork, no queues — just a smooth, contactless process.',
      bg: 'from-violet-200 via-purple-200 to-indigo-200',
    },
    {
      icon: Phone,
      title: 'Book Site Visits',
      description: 'Interested in seeing a property in person? Call or WhatsApp our team directly to schedule a convenient viewing at a time that works for you.',
      bg: 'from-sky-200 via-cyan-200 to-teal-200',
    },
    {
      icon: CreditCard,
      title: 'Pay via M-Pesa',
      description: 'Pay your agreement fees and deposits securely through M-Pesa with instant confirmation. No cash, no bank visits — just tap and go.',
      bg: 'from-amber-200 via-yellow-200 to-lime-200',
    },
  ]

  const landlordFeatures = [
    {
      icon: Home,
      title: 'List Your Property',
      description: 'Showcase your property to thousands of verified tenants. Add photos, set your price, and let our team handle tenant inquiries for you.',
      bg: 'from-violet-200 via-purple-200 to-indigo-200',
    },
    {
      icon: Users,
      title: 'Get Quality Tenants',
      description: 'We verify every applicant so you don\'t have to. Receive applications from pre-screened tenants ready to move in and pay on time.',
      bg: 'from-orange-200 via-rose-200 to-pink-200',
    },
    {
      icon: BarChart3,
      title: 'Track Performance',
      description: 'See how your listing is performing with real-time analytics — views, likes, inquiries, and engagement stats all in your dashboard.',
      bg: 'from-sky-200 via-cyan-200 to-teal-200',
    },
    {
      icon: Shield,
      title: 'Secure Agreements',
      description: 'Upload tenant agreements, collect fees via M-Pesa, and manage signed documents — all handled digitally through our secure platform.',
      bg: 'from-amber-200 via-yellow-200 to-lime-200',
    },
  ]

  const features = activeTab === 'tenants' ? tenantFeatures : landlordFeatures

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need, All in One Place
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you're searching for a home or listing a property, Victor Springs makes the entire process simple and secure.
          </p>

          {/* Tab Toggle */}
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'tenants'
                  ? 'bg-victor-green text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Tenants
            </button>
            <button
              onClick={() => setActiveTab('landlords')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'landlords'
                  ? 'bg-victor-green text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Landlords
            </button>
          </div>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`rounded-3xl bg-gradient-to-br ${feature.bg} overflow-hidden transition-all duration-500`}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 p-8 md:p-12`}>
                {/* Icon Side */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg flex items-center justify-center">
                    <feature.icon className="h-14 w-14 md:h-16 md:w-16 text-gray-800" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Text Side */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                  <a
                    href="/properties"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-gray-900 hover:text-victor-green transition-colors"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
