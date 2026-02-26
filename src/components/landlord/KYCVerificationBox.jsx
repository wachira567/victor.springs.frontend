import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert, ShieldCheck, ShieldStop, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const KYCVerificationBox = ({ user, onVerificationSubmit }) => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    idNumber: '',
    phone: user?.phone || '',
    idDocument: null,
    otp: '',
    otpToken: '',
    signatureMethod: 'electronic' // 'electronic' or 'manual'
  })

  // Determine status
  const status = user?.verification_status || 'unsubmitted' // pending, verified, rejected, unsubmitted

  if (status === 'verified') {
    return null; // Don't show if verified
  }

  if (status === 'pending') {
    return (
      <Card className="mb-8 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-900">Verification Under Review</h3>
            <p className="text-yellow-800 mt-1">
              Your identity documents and legal consent are currently being reviewed by Victor Springs Administrators. You will be notified via email once approved.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'rejected') {
    return (
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <ShieldStop className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Verification Rejected</h3>
            <p className="text-red-800 mt-1 mb-4">
              Your previous identity verification attempt was rejected by our administrators. Please review your details and submit valid documentation.
            </p>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100" onClick={() => setStep(1)}>
              Restart Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, idDocument: e.target.files[0] }))
  }

  const handleSendOtp = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.phone) {
        toast.error('Please fill in all required personal details.')
        return
      }
      if (!formData.idDocument) {
        toast.error('Please upload a scan of your National ID or Passport.')
        return
      }
      
      setIsSubmitting(true)
      try {
        const token = localStorage.getItem('victorsprings_token')
        const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        
        const res = await axios.post(`${API_URL}/auth/kyc/send-otp`, {
          phone: formData.phone
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        setFormData(prev => ({ ...prev, otpToken: res.data.otp_token }))
        toast.success(res.data.message || 'Verification code sent to your phone!')
        setStep(1.5)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send verification code. Please check your phone number.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append('first_name', formData.firstName)
      data.append('middle_name', formData.middleName)
      data.append('last_name', formData.lastName)
      data.append('id_number', formData.idNumber)
      data.append('phone', formData.phone)
      data.append('signature_method', formData.signatureMethod)
      data.append('otp', formData.otp)
      data.append('otp_token', formData.otpToken)
      if (formData.idDocument) {
        data.append('id_document', formData.idDocument)
      }

      const token = localStorage.getItem('victorsprings_token')
      const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      
      await axios.post(`${API_URL}/auth/kyc/submit`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Verification submitted! An admin will review it shortly.')
      if (onVerificationSubmit) onVerificationSubmit()
    } catch (error) {
      console.error('KYC Submit Error:', error)
      toast.error(error.response?.data?.message || 'Failed to submit verification request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-8 border-victor-green shadow-md overflow-hidden">
      <div className="bg-victor-green text-white p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <h2 className="text-lg font-bold">Action Required: Identity Verification (KYC)</h2>
        </div>
        <p className="text-victor-green-light mt-1 text-sm">
          To protect our community and tenants from fraud, all landlords must be verifying before listing properties. 
          Your properties will remain hidden until verification is complete.
        </p>
      </div>
      
      <CardContent className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>First Name <span className="text-red-500">*</span></Label>
                <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Doe" />
              </div>
              <div>
                <Label>Last Name <span className="text-red-500">*</span></Label>
                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Smith" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>National ID / Passport Number <span className="text-red-500">*</span></Label>
                <Input name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="12345678" />
              </div>
              <div>
                <Label>Contact Phone Number <span className="text-red-500">*</span></Label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+254 700 000000" />
              </div>
            </div>

            <div>
              <Label>Upload National ID / Passport Copy <span className="text-red-500">*</span></Label>
              <div className="mt-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <Input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {formData.idDocument ? formData.idDocument.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (Max 5MB)</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSendOtp} disabled={isSubmitting} className="bg-victor-green hover:bg-victor-green-dark">
                {isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </div>
          </div>
        )}

        {step === 1.5 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border text-center">
              <ShieldCheck className="h-12 w-12 text-victor-green mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 text-lg">Verify Your Phone Number</h4>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                We've sent a 6-digit verification code to <span className="font-medium text-gray-900">{formData.phone}</span>. Please enter it below.
              </p>
              
              <div className="mt-6 max-w-xs mx-auto">
                <Label className="text-left block mb-2">Verification Code</Label>
                <Input 
                  name="otp" 
                  value={formData.otp} 
                  onChange={handleInputChange} 
                  placeholder="123456" 
                  className="text-center text-2xl tracking-widest py-4"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t mt-8">
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (formData.otp.length < 5) {
                    toast.error('Please enter a valid OTP code.')
                    return
                  }
                  setStep(2)
                }} 
                className="bg-victor-green hover:bg-victor-green-dark"
              >
                Verify & Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border flex items-start gap-4 mb-6">
              <FileText className="h-6 w-6 text-gray-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Landlord Representation & Consent Agreement</h4>
                <p className="text-sm text-gray-600 mt-1">
                  By signing this agreement, you attest under penalty of perjury that the information provided is accurate and that you are the legal owner or authorized manager of the properties you list.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">How would you like to sign this document?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.signatureMethod === 'electronic' ? 'border-victor-green bg-victor-green/5' : 'border-gray-200 hover:border-victor-green/50'}`}
                  onClick={() => setFormData(prev => ({...prev, signatureMethod: 'electronic'}))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">Electronic Signature</h5>
                    {formData.signatureMethod === 'electronic' && <CheckCircle2 className="h-5 w-5 text-victor-green" />}
                  </div>
                  <p className="text-sm text-gray-500">Fastest method. Securely sign online using Firma.dev integration.</p>
                </div>

                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.signatureMethod === 'manual' ? 'border-victor-green bg-victor-green/5' : 'border-gray-200 hover:border-victor-green/50'}`}
                  onClick={() => setFormData(prev => ({...prev, signatureMethod: 'manual'}))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">Manual (Wet Signature)</h5>
                    {formData.signatureMethod === 'manual' && <CheckCircle2 className="h-5 w-5 text-victor-green" />}
                  </div>
                  <p className="text-sm text-gray-500">Download the PDF, physically sign it, scan, and upload it back.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t mt-8">
              <Button variant="outline" onClick={() => setStep(1.5)} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handleSubmit} className="bg-victor-green hover:bg-victor-green-dark" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : (formData.signatureMethod === 'electronic' ? 'Proceed to E-Sign' : 'Submit for Review')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default KYCVerificationBox
