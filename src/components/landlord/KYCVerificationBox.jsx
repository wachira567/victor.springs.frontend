import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert, ShieldCheck, Upload, FileText, CheckCircle2, X } from 'lucide-react'
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
    phone: user?.phone === 'Not Provided' ? '' : (user?.phone || ''),
    idDocumentFront: null,
    idDocumentBack: null,
    otp: '',
    otpToken: '',
    digitalConsent: false
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
            <ShieldAlert className="h-6 w-6 text-red-600" />
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

  const handleFileChangeFront = (e) => {
    setFormData(prev => ({ ...prev, idDocumentFront: e.target.files[0] }))
  }

  const handleFileChangeBack = (e) => {
    setFormData(prev => ({ ...prev, idDocumentBack: e.target.files[0] }))
  }

  // Step Handlers
  const handleSendOtp = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.phone) {
        toast.error('Please fill in all required personal details.')
        return
      }
      
      // Enforce Country Code
      if (!formData.phone.startsWith('+')) {
        toast.error('Your phone number MUST start with your country code (e.g., +254).')
        return
      }
      
      if (!formData.idDocumentFront || !formData.idDocumentBack) {
        toast.error('Please upload both the front and back of your National ID or Passport.')
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
    if (!formData.digitalConsent) {
      toast.error('You must agree to the representation and consent agreement to proceed.')
      return
    }
    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append('first_name', formData.firstName)
      data.append('middle_name', formData.middleName)
      data.append('last_name', formData.lastName)
      data.append('id_number', formData.idNumber)
      data.append('phone', formData.phone)
      data.append('digital_consent', 'true')
      data.append('otp', formData.otp)
      data.append('otp_token', formData.otpToken)
      
      if (formData.idDocumentFront) {
        data.append('id_document_front', formData.idDocumentFront)
      }
      if (formData.idDocumentBack) {
        data.append('id_document_back', formData.idDocumentBack)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Upload ID / Passport (Front) <span className="text-red-500">*</span></Label>
                {formData.idDocumentFront ? (
                  <div className="mt-2 relative rounded-xl overflow-hidden border h-48 group">
                    {formData.idDocumentFront.type?.startsWith('image/') ? (
                      <img src={URL.createObjectURL(formData.idDocumentFront)} alt="Front ID Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
                        <FileText className="h-12 w-12 text-gray-400 mb-2 shrink-0" />
                        <span className="text-sm font-medium text-center break-words line-clamp-2">{formData.idDocumentFront.name}</span>
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, idDocumentFront: null}))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm opacity-90 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative h-48">
                    <Input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChangeFront}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900 text-center">
                      Upload Front Side
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (Max 5MB)</p>
                  </div>
                )}
              </div>

              <div>
                <Label>Upload ID / Passport (Back) <span className="text-red-500">*</span></Label>
                {formData.idDocumentBack ? (
                  <div className="mt-2 relative rounded-xl overflow-hidden border h-48 group">
                    {formData.idDocumentBack.type?.startsWith('image/') ? (
                      <img src={URL.createObjectURL(formData.idDocumentBack)} alt="Back ID Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
                        <FileText className="h-12 w-12 text-gray-400 mb-2 shrink-0" />
                        <span className="text-sm font-medium text-center break-words line-clamp-2">{formData.idDocumentBack.name}</span>
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, idDocumentBack: null}))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm opacity-90 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative h-48">
                    <Input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChangeBack}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900 text-center">
                      Upload Back Side
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (Max 5MB)</p>
                  </div>
                )}
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
                  Please read the following agreement carefully. By consenting below, you form a legally binding agreement under penalty of perjury.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white max-h-96 overflow-y-auto text-sm text-gray-700 space-y-4">
              <h5 className="font-bold text-gray-900">1. Representation of Ownership or Authority</h5>
              <p>I attest and warrant under penalty of perjury that I am the legal owner of the properties I list on Victor Springs Limited, or I have been explicitly, legally, and contractually authorized by the rightful owner to manage, lease, and collect payments for these properties.</p>
              
              <h5 className="font-bold text-gray-900">2. Accuracy and Truthfulness of Information</h5>
              <p>I certify that all information provided in this KYC (Know Your Customer) identity verification, including my full legal name, National Identification or Passport Number, and contact phone number, is strictly accurate, true, and belongs solely to me. I acknowledge that Victor Springs Limited reserves the right to independently verify this information through third-party agencies and government databases.</p>

              <h5 className="font-bold text-gray-900">3. Anti-Fraud, Indemnification & Legal Liability</h5>
              <p>I understand and agree that creating fraudulent property listings, collecting payments or deposits for properties I do not represent, or falsifying my identity constitutes criminal fraud and obtaining money by false pretenses. I expressly agree to indemnify, defend, and hold harmless Victor Springs Limited, its directors, employees, and affiliates from any claims, damages, liabilities, costs, and expenses (including legal fees) arising from my actions, misrepresentations, or breach of this agreement.</p>
              <p>By submitting this form and providing my digital signature/consent, I explicitly and irrevocably give Victor Springs Limited full consent to share my verified identity profile, transaction history, and digital audit trails (including IP addresses) with law enforcement agencies, cybercrime units, and relevant authorities in the event of any tenant disputes, scam allegations, suspected fraudulent activities, or as required by law.</p>

              <h5 className="font-bold text-gray-900">4. Data Processing Consent & Privacy</h5>
              <p>I consent to the collection, processing, and secure storage of my personal identification data as per the Data Protection Act (2019) of Kenya, strictly for the purposes of identity verification, compliance, fraud prevention, and platform security.</p>
              
              <h5 className="font-bold text-gray-900">5. Termination & Access</h5>
              <p>I acknowledge that Victor Springs Limited reserves the unilateral right to suspend, terminate, or restrict my access to the platform and withhold any pending payouts if I am found to have violated these terms, engaged in deceptive practices, or failed to maintain accurate KYC records.</p>
            </div>

            <div className="flex items-center space-x-3 mt-6 bg-gray-50 p-4 rounded-lg border">
              <input 
                type="checkbox" 
                id="digitalConsent"
                className="w-5 h-5 text-victor-green rounded focus:ring-victor-green border-gray-300"
                checked={formData.digitalConsent}
                onChange={(e) => setFormData(prev => ({ ...prev, digitalConsent: e.target.checked }))}
              />
              <label htmlFor="digitalConsent" className="font-medium text-gray-900 cursor-pointer">
                I have read and explicitly consent to the terms of the Landlord Representation Agreement.
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t mt-8">
              <Button variant="outline" onClick={() => setStep(1.5)} disabled={isSubmitting}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-victor-green hover:bg-victor-green-dark" 
                disabled={isSubmitting || !formData.digitalConsent}
              >
                {isSubmitting ? 'Submitting...' : 'Consent & Complete Verification'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default KYCVerificationBox
