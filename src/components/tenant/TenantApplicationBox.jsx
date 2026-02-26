import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert, FileText, Upload, CheckCircle2, X, FileDown, Phone } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const TenantApplicationBox = ({ property, user, onClose }) => {
  const [step, setStep] = useState(property?.tenant_agreement_fee > 0 ? 'payment' : 'form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    idNumber: '',
    phone: user?.phone === 'Not Provided' ? '' : (user?.phone || ''),
    idDocumentFront: null,
    idDocumentBack: null,
    signedAgreement: null,
    digitalConsent: false,
    mpesaPhone: user?.phone === 'Not Provided' ? '' : (user?.phone || '')
  })
  const [paymentId, setPaymentId] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleFileChange = (e, name) => {
    setFormData(prev => ({ ...prev, [name]: e.target.files[0] }))
  }

  const initiatePayment = async () => {
    if (!formData.mpesaPhone.startsWith('+')) {
      toast.error('Your phone number MUST start with your country code (e.g., +254).')
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('victorsprings_token')
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      
      const res = await axios.post(`${API_URL}/payments/initiate`, {
        amount: property.tenant_agreement_fee,
        phone_number: formData.mpesaPhone,
        payment_type: 'agreement_fee',
        property_id: property.id,
        description: `Agreement fee for ${property.title}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setPaymentId(res.data.payment.id)
      toast.success(res.data.message || 'M-Pesa STK Push sent! Please check your phone.')
      pollPaymentStatus(res.data.payment.id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment.')
      setIsSubmitting(false)
    }
  }

  const pollPaymentStatus = async (txnId) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
    const token = localStorage.getItem('victorsprings_token')
    
    let attempts = 0
    const interval = setInterval(async () => {
      try {
        attempts++
        const res = await axios.get(`${API_URL}/payments/status/${txnId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (res.data.payment.status === 'completed') {
          clearInterval(interval)
          toast.success('Payment successful!')
          setStep('form')
          setIsSubmitting(false)
        } else if (res.data.payment.status === 'failed') {
          clearInterval(interval)
          toast.error('Payment failed or cancelled.')
          setIsSubmitting(false)
        } else if (attempts >= 12) { // 1 minute timeout
          clearInterval(interval)
          toast.error('Payment verification timed out. Please try again.')
          setIsSubmitting(false)
        }
      } catch (err) {
        console.error('Polling error', err)
      }
    }, 5000)
  }

  const handleSubmitApplication = async () => {
    if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.phone) {
      toast.error('Please fill in all personal details.')
      return
    }
    if (!formData.idDocumentFront || !formData.idDocumentBack) {
      toast.error('Please upload both sides of your ID.')
      return
    }
    // Only enforce signed agreement if property has one configured
    if (property.tenant_agreement_url && !formData.signedAgreement) {
      toast.error('Please upload a scanned/signed copy of the Tenant Agreement.')
      return
    }
    if (!formData.digitalConsent) {
      toast.error('You must agree to the Terms & Representation Agreement.')
      return
    }

    setIsSubmitting(true)
    try {
      const data = new FormData()
      data.append('property_id', property.id)
      data.append('first_name', formData.firstName)
      data.append('last_name', formData.lastName)
      data.append('id_number', formData.idNumber)
      data.append('phone', formData.phone)
      data.append('digital_consent', 'true')
      
      if (paymentId) data.append('payment_id', paymentId)
      if (formData.idDocumentFront) data.append('id_document_front', formData.idDocumentFront)
      if (formData.idDocumentBack) data.append('id_document_back', formData.idDocumentBack)
      if (formData.signedAgreement) data.append('signed_agreement', formData.signedAgreement)

      const token = localStorage.getItem('victorsprings_token')
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      
      await axios.post(`${API_URL}/applications/`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Your application was submitted successfully! We will contact you soon.')
      setStep('success')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
      <Card className="w-full max-w-2xl relative shadow-2xl border-0 overflow-hidden">
        
        {/* Header */}
        <div className="bg-victor-green text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-white/10 p-1.5 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-100" />
            <div>
              <h2 className="text-xl font-bold">Apply for Tenancy</h2>
              <p className="text-green-100 text-sm mt-1">{property?.title}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {step === 'payment' && (
            <div className="space-y-6 text-center py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="h-8 w-8 text-victor-green" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Tenant Agreement Fee Required</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Before uploading your documents, an agreement processing fee of <span className="font-bold text-gray-900">KES {property?.tenant_agreement_fee}</span> is required via M-Pesa.
              </p>

              <div className="max-w-sm mx-auto mt-6">
                <Label className="text-left block mb-2 font-medium">M-Pesa Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    name="mpesaPhone"
                    value={formData.mpesaPhone}
                    onChange={handleInputChange}
                    placeholder="+254700000000"
                    className="pl-10 h-12 text-lg"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={initiatePayment} 
                  disabled={isSubmitting || !formData.mpesaPhone}
                  className="w-full max-w-sm h-12 text-lg bg-[#25D366] hover:bg-[#1ebd5a] text-white"
                >
                  {isSubmitting ? 'Processing M-Pesa...' : `Pay KES ${property?.tenant_agreement_fee}`}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">You will receive an STK prompt on your phone.</p>
            </div>
          )}

          {step === 'form' && (
            <div className="space-y-6">
              
              {/* Optional: Agreement Download Area */}
              {property?.tenant_agreement_url && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-900">Step 1: Download & Sign Agreement</h4>
                    <p className="text-sm text-blue-800">Please download, print, read, and sign this agreement. You must upload the signed copy below.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="shrink-0 bg-white border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                    onClick={() => window.open(property.tenant_agreement_url, '_blank')}
                  >
                    <FileDown className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label>First Name *</Label>
                  <Input name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>National ID / Passport Number *</Label>
                  <Input name="idNumber" value={formData.idNumber} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Contact Phone Number *</Label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+254" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-900">Step 2: Upload Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold mb-2 block text-gray-600">ID / Passport (Front) *</Label>
                    <div className="border border-dashed rounded bg-gray-50 p-3 text-center cursor-pointer relative overflow-hidden h-24 flex items-center justify-center">
                      <Input type="file" onChange={(e) => handleFileChange(e, 'idDocumentFront')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                      {formData.idDocumentFront ? (
                        <span className="text-sm font-medium text-victor-green line-clamp-2">{formData.idDocumentFront.name}</span>
                      ) : (
                         <div className="text-gray-400"><Upload className="mx-auto h-5 w-5 mb-1"/> Upload Front</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-2 block text-gray-600">ID / Passport (Back) *</Label>
                    <div className="border border-dashed rounded bg-gray-50 p-3 text-center cursor-pointer relative overflow-hidden h-24 flex items-center justify-center">
                      <Input type="file" onChange={(e) => handleFileChange(e, 'idDocumentBack')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                      {formData.idDocumentBack ? (
                        <span className="text-sm font-medium text-victor-green line-clamp-2">{formData.idDocumentBack.name}</span>
                      ) : (
                         <div className="text-gray-400"><Upload className="mx-auto h-5 w-5 mb-1"/> Upload Back</div>
                      )}
                    </div>
                  </div>
                </div>

                {property?.tenant_agreement_url && (
                  <div>
                    <Label className="text-xs font-semibold mb-2 block text-gray-600">Scanned Signed Agreement *</Label>
                    <div className="border border-dashed border-victor-green/30 rounded bg-green-50/30 p-4 text-center cursor-pointer relative overflow-hidden">
                      <Input type="file" onChange={(e) => handleFileChange(e, 'signedAgreement')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
                      {formData.signedAgreement ? (
                        <div className="flex items-center justify-center gap-2 text-victor-green">
                          <CheckCircle2 className="h-5 w-5"/> <span className="font-medium line-clamp-1">{formData.signedAgreement.name}</span>
                        </div>
                      ) : (
                         <div className="text-victor-green-dark">
                           <FileText className="mx-auto h-8 w-8 mb-2 opacity-60"/>
                           <p className="font-medium">Upload Signed Agreement</p>
                           <p className="text-xs opacity-70 mt-1">PDF or Image</p>
                         </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Legal Consent */}
              <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600 mt-6">
                 <h4 className="font-bold text-gray-900 mb-2">Legal Consent & Representation</h4>
                 <p className="mb-3">By submitting this application, I attest and warrant under penalty of perjury that all uploaded documents and personal information are strictly accurate and belong to me. I acknowledge that falsifying my identity constitutes criminal fraud.</p>
                 <div className="flex items-start gap-3 mt-4">
                   <input 
                     type="checkbox" 
                     id="digitalConsent"
                     name="digitalConsent"
                     className="mt-1 w-4 h-4 text-victor-green border-gray-300 rounded focus:ring-victor-green cursor-pointer"
                     checked={formData.digitalConsent}
                     onChange={handleInputChange}
                   />
                   <label htmlFor="digitalConsent" className="font-medium text-gray-900 cursor-pointer">
                     I explicitly consent to the terms above and verify that my uploaded documents are truthful.
                   </label>
                 </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button 
                  onClick={handleSubmitApplication} 
                  disabled={isSubmitting || !formData.digitalConsent}
                  className="bg-victor-green hover:bg-victor-green-dark"
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Application'}
                </Button>
              </div>

            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Thank you! Your verified application and documents have been sent to our administrators. We will contact you soon.
              </p>
              <Button onClick={onClose} className="bg-victor-green hover:bg-victor-green-dark">
                Close Window
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TenantApplicationBox
