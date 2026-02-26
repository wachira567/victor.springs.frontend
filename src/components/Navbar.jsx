import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Menu, 
  Home, 
  Building2, 
  User, 
  LogOut, 
  LayoutDashboard,
  Shield,
  PlusCircle,
  Phone,
  Info
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

const Navbar = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const tenantLinks = isAuthenticated ? [
    { path: '/properties', label: 'Properties', icon: Building2 },
  ] : [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Phone },
    { path: '/properties', label: 'Properties', icon: Building2 },
  ]

  const landlordLinks = [
    { path: '/landlord', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const displayLinks = hasRole('landlord') ? landlordLinks : tenantLinks

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const getDashboardLink = () => {
    if (hasRole('super_admin')) return '/admin'
    if (hasRole('landlord')) return '/landlord'
    return '/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-victor-green to-victor-blue">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Victor Springs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {displayLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-victor-green nav-active'
                    : 'text-gray-600 hover:text-victor-green hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {hasRole(['landlord', 'super_admin']) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => navigate('/submit-property')}
                  >
                    <PlusCircle className="h-4 w-4" />
                    List Property
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar} alt={user?.firstName} />
                        <AvatarFallback className="bg-victor-green text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-victor-green capitalize">{user?.role?.replace('_', ' ')}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {hasRole('super_admin') && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="bg-victor-green hover:bg-victor-green-dark"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6">
                {/* Mobile Logo */}
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-victor-green to-victor-blue">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text">Victor Springs</span>
                </Link>

                {/* Mobile User Info */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                      <AvatarFallback className="bg-victor-green text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}

                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-1">
                  {displayLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive(link.path)
                          ? 'bg-victor-green/10 text-victor-green'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-victor-green'
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Actions */}
                <div className="flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          navigate(getDashboardLink())
                          setIsOpen(false)
                        }}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                      {hasRole(['landlord', 'super_admin']) && (
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => {
                            navigate('/submit-property')
                            setIsOpen(false)
                          }}
                        >
                          <PlusCircle className="h-4 w-4" />
                          List Property
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate('/login')
                          setIsOpen(false)
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-victor-green hover:bg-victor-green-dark"
                        onClick={() => {
                          navigate('/register')
                          setIsOpen(false)
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
