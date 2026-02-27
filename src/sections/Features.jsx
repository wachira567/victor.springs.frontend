import { useState } from 'react'
import {
  Search,
  FileText,
  Phone,
  CreditCard,
  Home,
  Users,
  BarChart3,
  Shield
} from 'lucide-react'

const Features = () => {
  const [activeTab, setActiveTab] = useState('tenants')

  const tenantFeatures = [
    {
      icon: Search,
      title: 'Browse Verified Listings',
      description: 'Explore hundreds of quality-checked properties across Nairobi, Kiambu, and Kajiado. Filter by price, location, and amenities to find your perfect match. Every listing is verified by our team so you can browse with confidence.',
    },
    {
      icon: FileText,
      title: 'Apply Online',
      description: 'Found a place you love? The next step in your rental journey is to apply online. Submit your documents, ID, and details digitally. It\'s contactless, easy, and fast — all you need to ensure your home will not flee while you\'re occupied with paperwork!',
    },
    {
      icon: CreditCard,
      title: 'Pay via M-Pesa',
      description: 'Cash payments are yesterday. Pay your agreement fees and deposits digitally in mere minutes thanks to our M-Pesa integration! Enjoy instant confirmation, full payment history records, and more, all backed by world-class digital security.',
    },
  ]

  const landlordFeatures = [
    {
      icon: Home,
      title: 'List a Property',
      description: 'Time to showcase your property! Add quality photos, set your price, pick amenities, and craft a compelling description. Our platform makes it easy to create a listing that attracts quality tenants within 24 hours.',
    },
    {
      icon: Users,
      title: 'Get Quality Tenants',
      description: 'We verify every applicant so you don\'t have to. Receive applications from pre-screened tenants ready to move in and pay on time. Review their details, documents, and approve or decline with one click.',
    },
    {
      icon: BarChart3,
      title: 'Track Performance',
      description: 'See how your listing is performing with real-time analytics. Track views, likes, WhatsApp clicks, call inquiries, and engagement stats — all in your dashboard. Know exactly which properties tenants love most.',
    },
    {
      icon: Shield,
      title: 'Secure Agreements',
      description: 'Upload tenant agreements, collect fees via M-Pesa, and manage signed documents — all handled digitally through our secure platform. No need to run across town to sign a paper contract.',
    },
  ]

  const features = activeTab === 'tenants' ? tenantFeatures : landlordFeatures

  // Alternating warm gradients like Rentberry
  const gradients = [
    'from-[#fdc9a6] via-[#f9b4a0] to-[#f7a199]', // warm peach/salmon
    'from-[#d4bcf7] via-[#c5a8f5] to-[#b694f0]', // soft purple/lavender
    'from-[#fdc9a6] via-[#f9b4a0] to-[#f7a199]', // warm peach/salmon
    'from-[#d4bcf7] via-[#c5a8f5] to-[#b694f0]', // soft purple/lavender
  ]

  return (
    <section className="relative">
      {/* Sticky Tab Toggle */}
      <div className="sticky top-16 z-30 flex justify-center py-6">
        <div className="inline-flex rounded-full bg-gray-800 p-1.5 shadow-2xl">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === 'tenants'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            For Tenants
          </button>
          <button
            onClick={() => setActiveTab('landlords')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === 'landlords'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            For Landlords
          </button>
        </div>
      </div>

      {/* Feature Sections — full-bleed, no gaps */}
      {features.map((feature, index) => {
        const isReversed = index % 2 !== 0
        return (
          <div
            key={feature.title}
            className={`bg-gradient-to-br ${gradients[index]} transition-all duration-500`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16 py-16 md:py-24`}>

                {/* Card / Icon Side */}
                <div className="flex-shrink-0 w-full md:w-[380px]">
                  <div className="relative mx-auto w-fit">
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[280px] md:w-[320px]">
                      <div className="flex items-center justify-center mb-5">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <feature.icon className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
                        </div>
                      </div>
                      <h4 className="text-center text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <div className="flex justify-center gap-1 mt-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
                        ))}
                      </div>
                    </div>
                    {/* Floating accent card */}
                    <div className={`absolute ${isReversed ? '-left-6' : '-right-6'} -bottom-4 bg-white rounded-xl shadow-lg px-4 py-3`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Victor Springs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className={`flex-1 ${isReversed ? 'md:text-right' : 'md:text-left'} text-center`}>
                  <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-800 mb-5 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700/80 text-base md:text-lg leading-relaxed max-w-lg" style={{ marginLeft: isReversed ? 'auto' : undefined }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Features
