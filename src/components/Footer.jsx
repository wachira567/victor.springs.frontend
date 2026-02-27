import { Link } from 'react-router-dom'
import { Home, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Properties', path: '/properties' },
    ],
    tenants: [
      { label: 'Search Properties', path: '/properties' },
      { label: 'How It Works', path: '/' },
      { label: 'Register', path: '/register' },
    ],
    landlords: [
      { label: 'List Your Property', path: '/submit-property' },
      { label: 'Landlord Portal', path: '/landlord' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms-of-service' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-victor-green to-victor-blue">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Victor Springs</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Kenya's premier rental platform connecting quality tenants with verified landlords. 
              Find your perfect home with secure M-Pesa payments.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-victor-green" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-victor-green" />
                <a href="tel:+254717849484" className="hover:text-white transition-colors">+254 717 849 484</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-victor-green" />
                <a href="mailto:victorspringsltd@gmail.com" className="hover:text-white transition-colors">victorspringsltd@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-victor-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tenants Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Tenants</h3>
            <ul className="space-y-2">
              {footerLinks.tenants.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-victor-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mb-4 mt-6">For Landlords</h3>
            <ul className="space-y-2">
              {footerLinks.landlords.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-victor-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-victor-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} Victor Springs Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
