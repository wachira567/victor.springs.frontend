import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Home,
  Menu,
  X,
  LogOut,
  User,
  FileText,
  Heart,
  CreditCard,
  ChevronDown,
  Building2,
  LayoutDashboard
} from 'lucide-react'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const isTenant = isAuthenticated && user?.role === 'tenant'
  const isLandlord = isAuthenticated && user?.role === 'landlord'
  const isAdmin = isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin')

  // Guest links: Home, Properties, About, Contact
  const guestLinks = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  // Signed-in tenant links: Properties, Applications, Saved Properties, Payments
  const tenantLinks = [
    { label: 'Properties', path: '/properties', icon: Building2 },
    { label: 'Applications', path: '/dashboard?tab=applications', icon: FileText },
    { label: 'Saved Properties', path: '/dashboard?tab=saved', icon: Heart },
    { label: 'Payments', path: '/dashboard?tab=payments', icon: CreditCard },
  ]

  const links = isTenant ? tenantLinks : (!isAuthenticated ? guestLinks : [])

  const isActive = (path) => {
    if (path.includes('?tab=')) {
      const tabName = new URLSearchParams(path.split('?')[1]).get('tab')
      return location.pathname === '/dashboard' && location.search.includes(`tab=${tabName}`)
    }
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Home Icon */}
          <Link
            to={isTenant ? '/' : (isAdmin ? '/admin' : (isLandlord ? '/landlord' : '/'))}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-victor-green to-victor-blue transition-transform group-hover:scale-105">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-victor-green to-victor-blue bg-clip-text text-transparent hidden sm:inline">
              Victor Springs
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'bg-victor-green/10 text-victor-green'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Auth Buttons or User Menu */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              /* Guest: Login / Register */
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="sm" className="bg-victor-green hover:bg-victor-green/90 text-white" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            ) : (
              /* Signed in: User dropdown */
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-victor-green to-victor-blue flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-victor-green/10 text-victor-green capitalize">
                          {user?.role?.replace('_', ' ')}
                        </span>
                      </div>

                      {isTenant && (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          My Dashboard
                        </Link>
                      )}

                      <Link
                        to={isTenant ? '/dashboard?tab=profile' : (isLandlord ? '/landlord' : '/admin/profile')}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Profile Settings
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-in slide-in-from-top-1">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-victor-green/10 text-victor-green'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Button variant="outline" className="w-full justify-center" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="w-full justify-center bg-victor-green hover:bg-victor-green/90 text-white" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {isTenant && (
              <div className="pt-3 border-t border-gray-100">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
