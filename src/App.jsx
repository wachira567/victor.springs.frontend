import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import LandlordDashboard from './pages/LandlordDashboard'
import SubmitProperty from './pages/SubmitProperty'
import About from './pages/About'
import Contact from './pages/Contact'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import './App.css'

const NonLandlordRoute = ({ children }) => {
  const { hasRole, isAuthenticated } = useAuth()
  if (isAuthenticated && hasRole('landlord')) {
    return <Navigate to="/landlord" replace />
  }
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<NonLandlordRoute><Home /></NonLandlordRoute>} />
              <Route path="/properties" element={<NonLandlordRoute><Properties /></NonLandlordRoute>} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<NonLandlordRoute><Dashboard /></NonLandlordRoute>} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/landlord" element={<LandlordDashboard />} />
              <Route path="/submit-property" element={<SubmitProperty />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<NonLandlordRoute><About /></NonLandlordRoute>} />
              <Route path="/contact" element={<NonLandlordRoute><Contact /></NonLandlordRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
