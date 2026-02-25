import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Home, MailIcon } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      toast.success(response.data.message)
      setIsSent(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send password reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-victor-green to-victor-blue">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Victor Springs</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center mt-2">
              Enter your email address to receive a magic link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSent ? (
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="email">Email address</Label>
                   <Input
                     id="email"
                     type="email"
                     placeholder="you@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     disabled={isLoading}
                     required
                   />
                 </div>
                 
                 <Button 
                   type="submit" 
                   className="w-full bg-victor-green hover:bg-victor-green-dark"
                   disabled={isLoading}
                 >
                   {isLoading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Sending Link...
                     </>
                   ) : (
                     'Send Reset Link'
                   )}
                 </Button>
               </form>
            ) : (
                <div className="text-center space-y-4">
                    <div className="flex justify-center text-victor-green">
                      <MailIcon className="h-12 w-12" />
                    </div>
                    <p className="text-gray-700">Check your email for the reset link! If you do not see it soon, check your spam folder.</p>
                </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-victor-green hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword
