import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Shield, 
  Users, 
  TrendingUp, 
  Target,
  Heart,
  Award,
  CheckCircle
} from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We verify every listing and landlord to ensure a safe rental experience.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a community of responsible tenants and reliable landlords.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'Constantly improving our platform with the latest technology.',
    },
    {
      icon: Heart,
      title: 'Customer Obsession',
      description: 'Putting our users needs at the center of everything we do.',
    },
  ]

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Victor Springs launched in Nairobi' },
    { year: '2021', title: '1,000 Properties', description: 'Reached 1,000 listed properties' },
    { year: '2022', title: 'M-Pesa Integration', description: 'Added secure M-Pesa payments' },
    { year: '2023', title: 'Nationwide Expansion', description: 'Expanded to Mombasa, Kisumu & more' },
    { year: '2024', title: '10,000+ Users', description: 'Celebrated 10,000 active users' },
  ]

  const team = [
    {
      name: 'Victor Mwangi',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      bio: 'Former real estate professional with a passion for technology.',
    },
    {
      name: 'Sarah Kimani',
      role: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      bio: 'Expert in operations and customer experience.',
    },
    {
      name: 'David Ochieng',
      role: 'Head of Technology',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      bio: 'Tech leader with 10+ years in software development.',
    },
    {
      name: 'Grace Muthoni',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
      bio: 'Marketing strategist driving brand growth.',
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
            Revolutionizing Rentals
            <span className="block text-yellow-300">in Kenya</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We're on a mission to make finding and renting properties in Kenya 
            simple, secure, and stress-free.
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
                Making Quality Housing Accessible to All Kenyans
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Victor Springs was born from a simple observation: finding a rental property 
                in Kenya was unnecessarily complicated. Fake listings, untrustworthy agents, 
                and endless paperwork made what should be an exciting journey into a frustrating ordeal.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We set out to change that. By combining cutting-edge technology with a 
                human-centered approach, we've created a platform that connects quality 
                tenants with verified landlords, making the rental process transparent, 
                secure, and efficient.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-victor-green" />
                  <span className="text-gray-700">Verified Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-victor-green" />
                  <span className="text-gray-700">Secure Payments</span>
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
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-victor-green">10K+</div>
                <div className="text-gray-600">Happy Tenants</div>
              </div>
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

      {/* Milestones Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Milestones
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-victor-green flex items-center justify-center text-white font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-victor-green/20 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-victor-green font-semibold">{milestone.year}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{milestone.title}</h3>
                  <p className="text-gray-600 mt-1">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the People Behind Victor Springs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-victor-green text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
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
              <Button 
                className="bg-white text-victor-green hover:bg-gray-100"
                onClick={() => window.location.href = '/properties'}
              >
                Find a Home
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '/register'}
              >
                List Your Property
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
