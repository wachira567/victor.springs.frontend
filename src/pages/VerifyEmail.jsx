import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your email address...')
  
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  
  // Use a ref to prevent strict mode from firing verification twice
  const hasVerified = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid or missing verification token.')
      return
    }

    if (hasVerified.current) return
    hasVerified.current = true

    const verifyToken = async () => {
      try {
        const response = await axios.post(`${API_URL}/auth/verify-email`, { token })
        setStatus('success')
        setMessage(response.data.message)
        
        // Store the newly retrieved token into local storage so they are automatically logged in!
        localStorage.setItem('victorsprings_user', JSON.stringify(response.data.user))
        localStorage.setItem('victorsprings_token', response.data.token)
        
        // Let them read the success for 2 seconds then bounce to dashboard
        setTimeout(() => {
          navigate('/')
          // Force a reload to have AuthContext pick up the newly mounted local storage
          window.location.reload()
        }, 2500)
        
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.')
      }
    }

    verifyToken()
  }, [token, API_URL, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {status === 'verifying' && <Loader2 className="h-12 w-12 text-victor-green animate-spin" />}
              {status === 'success' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
              {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            </div>
            <CardTitle className="text-2xl">
              {status === 'verifying' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Error'}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'error' && (
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full bg-victor-green hover:bg-victor-green-dark mt-4"
              >
                Go to Login
              </Button>
            )}
            {status === 'success' && (
              <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VerifyEmail
