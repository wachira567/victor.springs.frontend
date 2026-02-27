import Hero from '@/sections/Hero'
import FeaturedCities from '@/sections/FeaturedCities'
import FeaturedProperties from '@/sections/FeaturedProperties'
import Features from '@/sections/Features'
import HowItWorks from '@/sections/HowItWorks'

const Home = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <FeaturedCities />
      <FeaturedProperties />
      <Features />
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-victor-green to-victor-blue" />
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of satisfied tenants and landlords on Kenya's premier rental platform. 
                Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-victor-green font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Properties
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
