import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('victorsprings_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('victorsprings_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user: userData } = response.data
      
      setUser(userData)
      localStorage.setItem('victorsprings_user', JSON.stringify(userData))
      localStorage.setItem('victorsprings_token', token)
      
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true, user: userData }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (credential, role = null) => {
    setIsLoading(true)
    try {
      const payload = { credential }
      if (role) {
        payload.role = role
      }

      const response = await axios.post(`${API_URL}/auth/google`, payload)
      const { token, user: userData } = response.data
      
      setUser(userData)
      localStorage.setItem('victorsprings_user', JSON.stringify(userData))
      localStorage.setItem('victorsprings_token', token)
      
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true, user: userData }
    } catch (error) {
      const msg = error.response?.data?.message || 'Google login failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      const payload = {
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role || 'tenant'
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, payload)
      const { message, user: newUserData } = response.data
      
      toast.success(message || 'Account created! Please check your email to verify.')
      return { success: true, requiresVerification: true, user: newUserData }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('victorsprings_user')
    localStorage.removeItem('victorsprings_token')
    toast.success('Logged out successfully')
  }

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('victorsprings_user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to update profile')
      return { success: false, error: error.message }
    }
  }

  const hasRole = (roles) => {
    if (!user) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
