import { Search, Phone, FileCheck, Key } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Search Properties',
      description: 'Browse verified listings across Nairobi, Kiambu, and Kajiado. Filter by location, price, property type, and amenities to find your perfect match.',
      color: 'from-victor-green to-emerald-500',
    },
    {
      number: '02',
      icon: Phone,
      title: 'Contact Us',
      description: 'Interested in a property? Call or WhatsApp us directly to ask questions, get more details, or schedule a convenient site visit.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'Apply & Sign Agreement',
      description: 'Submit your application online with your documents and ID. Pay the agreement fee via M-Pesa, download the tenant agreement, sign, and upload it back.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      number: '04',
      icon: Key,
      title: 'Get Approved & Move In',
      description: 'Once your application is reviewed and approved by the admin, you\'ll be assigned your unit. Collect your keys and start enjoying your new home!',
      color: 'from-purple-500 to-violet-500',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
                  <div className="h-full w-3/4 mx-auto bg-gradient-to-r from-gray-300 to-gray-200 rounded-full" />
                </div>
              )}

              <div className="text-center">
                {/* Step Number & Icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  {/* Number Background */}
                  <div className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center z-10">
                    <span className="text-sm font-bold text-gray-500">{step.number}</span>
                  </div>
                  
                  {/* Icon Circle */}
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-4">Ready to find your perfect home?</p>
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-victor-green hover:bg-victor-green/90 text-white font-semibold transition-colors shadow-lg shadow-victor-green/30"
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
