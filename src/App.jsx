import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProperties from './pages/admin/AdminProperties'
import AdminKyc from './pages/admin/AdminKyc'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import AdminApplications from './pages/admin/AdminApplications'
import AdminTenants from './pages/admin/AdminTenants'
import AdminProfile from './pages/admin/AdminProfile'
import LandlordDashboard from './pages/LandlordDashboard'
import SubmitProperty from './pages/SubmitProperty'
import About from './pages/About'
import Contact from './pages/Contact'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminLayout from './layouts/AdminLayout'
import './App.css'

const PublicLayout = () => (
  <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
)

const MarketingRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  if (isAuthenticated) {
    if (user?.role === 'super_admin' || user?.role === 'admin') return <Navigate to="/admin" replace />
    if (user?.role === 'landlord') return <Navigate to="/landlord" replace />
    // Tenants can access marketing pages (Home, About, Contact)
  }
  return children
}

const StandardPageRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  if (isAuthenticated) {
    if (user?.role === 'super_admin' || user?.role === 'admin') return <Navigate to="/admin" replace />
    if (user?.role === 'landlord') return <Navigate to="/landlord" replace />
  }
  return children
}

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'super_admin' && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Admin Routes with Sidebar Layout */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="tenants" element={<AdminTenants />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Public Routes with Navbar & Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<MarketingRoute><Home /></MarketingRoute>} />
            <Route path="/about" element={<MarketingRoute><About /></MarketingRoute>} />
            <Route path="/contact" element={<MarketingRoute><Contact /></MarketingRoute>} />
            
            <Route path="/properties" element={<StandardPageRoute><Properties /></StandardPageRoute>} />
            <Route path="/properties/:id" element={<StandardPageRoute><PropertyDetail /></StandardPageRoute>} />
            <Route path="/dashboard" element={<StandardPageRoute><Dashboard /></StandardPageRoute>} />
            
            <Route path="/login" element={<MarketingRoute><Login /></MarketingRoute>} />
            <Route path="/register" element={<MarketingRoute><Register /></MarketingRoute>} />
            <Route path="/verify-email" element={<MarketingRoute><VerifyEmail /></MarketingRoute>} />
            <Route path="/forgot-password" element={<MarketingRoute><ForgotPassword /></MarketingRoute>} />
            <Route path="/reset-password" element={<MarketingRoute><ResetPassword /></MarketingRoute>} />
            
            <Route path="/landlord" element={<LandlordDashboard />} />
            <Route path="/submit-property" element={<SubmitProperty />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
