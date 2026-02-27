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
      gradient: 'from-rose-400/80 to-orange-300/80',
      iconBg: 'bg-rose-500',
      decorColor: 'bg-orange-200',
    },
    {
      icon: FileText,
      title: 'Apply Online',
      description: 'Found a place you love? Submit your application digitally with all the required documents. No paperwork, no queues — just a smooth, contactless process.',
      gradient: 'from-violet-400/80 to-purple-300/80',
      iconBg: 'bg-violet-500',
      decorColor: 'bg-purple-200',
    },
    {
      icon: Phone,
      title: 'Book Site Visits',
      description: 'Interested in seeing a property in person? Call or WhatsApp our team directly to schedule a convenient viewing at a time that works for you.',
      gradient: 'from-cyan-400/80 to-sky-300/80',
      iconBg: 'bg-cyan-500',
      decorColor: 'bg-sky-200',
    },
    {
      icon: CreditCard,
      title: 'Pay via M-Pesa',
      description: 'Pay your agreement fees and deposits securely through M-Pesa with instant confirmation. No cash, no bank visits — just tap and go.',
      gradient: 'from-emerald-400/80 to-teal-300/80',
      iconBg: 'bg-emerald-500',
      decorColor: 'bg-teal-200',
    },
  ]

  const landlordFeatures = [
    {
      icon: Home,
      title: 'List Your Property',
      description: 'Showcase your property to thousands of verified tenants. Add photos, set your price, and let our team handle tenant inquiries for you.',
      gradient: 'from-violet-400/80 to-purple-300/80',
      iconBg: 'bg-violet-500',
      decorColor: 'bg-purple-200',
    },
    {
      icon: Users,
      title: 'Get Quality Tenants',
      description: 'We verify every applicant so you don\'t have to. Receive applications from pre-screened tenants ready to move in and pay on time.',
      gradient: 'from-rose-400/80 to-orange-300/80',
      iconBg: 'bg-rose-500',
      decorColor: 'bg-orange-200',
    },
    {
      icon: BarChart3,
      title: 'Track Performance',
      description: 'See how your listing is performing with real-time analytics — views, likes, inquiries, and engagement stats all in your dashboard.',
      gradient: 'from-cyan-400/80 to-sky-300/80',
      iconBg: 'bg-cyan-500',
      decorColor: 'bg-sky-200',
    },
    {
      icon: Shield,
      title: 'Secure Agreements',
      description: 'Upload tenant agreements, collect fees via M-Pesa, and manage signed documents — all handled digitally through our secure platform.',
      gradient: 'from-emerald-400/80 to-teal-300/80',
      iconBg: 'bg-emerald-500',
      decorColor: 'bg-teal-200',
    },
  ]

  const features = activeTab === 'tenants' ? tenantFeatures : landlordFeatures

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
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
          <div className="inline-flex rounded-full bg-gray-900 p-1.5 shadow-xl">
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'tenants'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              For Tenants
            </button>
            <button
              onClick={() => setActiveTab('landlords')}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'landlords'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              For Landlords
            </button>
          </div>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-8">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0
            const stepNumber = String(index + 1).padStart(2, '0')

            return (
              <div
                key={feature.title}
                className="group relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`} />

                {/* Decorative Circle */}
                <div className={`absolute ${isReversed ? '-left-20 -bottom-20' : '-right-20 -top-20'} w-72 h-72 rounded-full ${feature.decorColor} opacity-40 blur-2xl`} />
                <div className={`absolute ${isReversed ? '-right-10 -top-10' : '-left-10 -bottom-10'} w-48 h-48 rounded-full ${feature.decorColor} opacity-30 blur-xl`} />

                {/* Content */}
                <div className={`relative flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 p-8 md:p-14`}>

                  {/* Icon Card */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* Step Number */}
                      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center z-10">
                        <span className="text-sm font-bold text-gray-900">{stepNumber}</span>
                      </div>
                      {/* Icon Container */}
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-lg`}>
                          <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className={`flex-1 text-center ${isReversed ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-sm">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-lg" style={{ marginLeft: isReversed ? 'auto' : undefined }}>
                      {feature.description}
                    </p>
                    <a
                      href="/properties"
                      className={`inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/30 transition-colors border border-white/30`}
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
