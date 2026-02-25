import { Search, Calendar, FileCheck, Key } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Search Properties',
      description: 'Browse thousands of verified listings across Kenya. Filter by location, price, amenities, and more to find your perfect match.',
      color: 'bg-blue-500',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Schedule a Viewing',
      description: 'Book a property tour at your convenience. Our agents will show you around and answer all your questions.',
      color: 'bg-green-500',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'Apply Online',
      description: 'Submit your application with required documents through our secure platform. Get approved in as little as 24 hours.',
      color: 'bg-orange-500',
    },
    {
      number: '04',
      icon: Key,
      title: 'Move In',
      description: 'Pay your deposit and first month\'s rent via M-Pesa. Collect your keys and start enjoying your new home!',
      color: 'bg-purple-500',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-green-400 text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Finding your dream home has never been easier. Follow these simple steps 
            and move into your new place in no time.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5">
                  <div className="step-connector h-full w-3/4 mx-auto opacity-30" />
                </div>
              )}

              <div className="text-center">
                {/* Step Number & Icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  {/* Number Background */}
                  <div className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{step.number}</span>
                  </div>
                  
                  {/* Icon Circle */}
                  <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-lg shadow-${step.color}/30`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Ready to find your perfect home?</p>
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-victor-green hover:bg-victor-green-dark text-white font-semibold transition-colors"
          >
            Start Your Search
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
