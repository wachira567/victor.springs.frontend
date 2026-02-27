import { Card, CardContent } from '@/components/ui/card'
import { 
  Home, 
  Shield, 
  Users, 
  Heart, 
  CheckCircle,
  TrendingUp
} from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Every listing and landlord goes through our verification process to ensure a safe rental experience for tenants.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We build lasting relationships between responsible tenants and reliable landlords across Kenya.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'We are always working to improve our platform and make finding a home easier and faster.',
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Your needs drive everything we do — from listing quality to support responsiveness.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-victor-green to-victor-blue py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm mb-6">
            <Home className="h-4 w-4" />
            About Victor Springs
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Making Rentals in Kenya
            <span className="block text-yellow-300">Simple & Secure</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We connect tenants with verified properties and make the entire rental process 
            straightforward, transparent, and stress-free.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Quality Housing, Made Accessible
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Victor Springs was created to solve a real problem — finding a rental property in Kenya 
                was often stressful, full of fake listings and unreliable agents. We set out to change that 
                by building a platform where every listing is verified and every landlord is accountable.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Whether you're a tenant searching for your next home or a landlord looking to reach quality 
                tenants, Victor Springs makes the connection simple, secure, and efficient. Based in Ruaka, 
                Nairobi, we serve tenants and landlords across Nairobi, Kiambu, and Kajiado counties.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-victor-green" />
                  <span className="text-gray-700">Verified Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-victor-green" />
                  <span className="text-gray-700">Secure M-Pesa Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-victor-green" />
                  <span className="text-gray-700">Trusted Landlords</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=500&fit=crop"
                alt="Modern apartment building"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-victor-green/10 flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-victor-green" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-victor-green to-victor-blue rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Victor Springs Community
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Whether you're looking for your next home or want to list your property, 
              we're here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/properties"
                className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-white text-victor-green font-semibold hover:bg-gray-100 transition-colors"
              >
                Find a Home
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3 rounded-md border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                List Your Property
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
