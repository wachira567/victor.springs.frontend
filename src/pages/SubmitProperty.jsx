import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Upload, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Maximize,
  Car,
  Waves,
  Dumbbell,
  Shield,
  Dog,
  TreePine,
  Wifi,
  Check,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

const SubmitProperty = () => {
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    price: '',
    location: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    availableFrom: '',
    minimumStay: '',
    deposit: '',
  })

  // Redirect if not landlord
  if (!hasRole(['landlord', 'super_admin'])) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Info className="h-16 w-16 mx-auto mb-4 text-victor-green" />
            <h2 className="text-xl font-bold mb-2">Landlord Account Required</h2>
            <p className="text-gray-600 mb-4">
              You need a landlord account to list properties. Upgrade your account to get started.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
              <Button className="bg-victor-green hover:bg-victor-green-dark">
                Become a Landlord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const amenitiesList = [
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'petFriendly', label: 'Pet Friendly', icon: Dog },
    { id: 'garden', label: 'Garden', icon: TreePine },
    { id: 'wifi', label: 'WiFi Ready', icon: Wifi },
  ]

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + uploadedImages.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    // Mock image upload - in real app, upload to Cloudinary
    const newImages = files.map(file => URL.createObjectURL(file))
    setUploadedImages(prev => [...prev, ...newImages])
    toast.success(`${files.length} image(s) uploaded`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Property submitted successfully! It will be reviewed shortly.')
    navigate('/landlord')
  }

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Amenities' },
    { number: 4, title: 'Photos' },
    { number: 5, title: 'Review' },
  ]

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.propertyType && formData.price && formData.location
      case 2:
        return formData.bedrooms && formData.bathrooms && formData.area && formData.description
      case 3:
        return true
      case 4:
        return uploadedImages.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">List Your Property</h1>
          <p className="text-gray-600">Fill in the details below to list your property on Victor Springs</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  step >= s.number ? 'text-victor-green' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= s.number 
                      ? 'bg-victor-green text-white' 
                      : 'bg-gray-200'
                  }`}>
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    step > s.number ? 'bg-victor-green' : 'bg-gray-200'
                  }`} style={{ width: '60px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Modern 3-Bedroom Apartment in Kilimani"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="office">Office Space</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Monthly Rent (KES) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location/Area *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="e.g., Kilimani, Nairobi"
                      className="pl-9"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Kilimani Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Provide more details about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="3"
                        className="pl-9"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="2"
                        className="pl-9"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="area">Area (m²) *</Label>
                    <div className="relative">
                      <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="area"
                        type="number"
                        placeholder="120"
                        className="pl-9"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, its features, and what makes it special..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deposit">Security Deposit (KES)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="e.g., 100000"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Amenities */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Select the amenities available at your property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.amenities.includes(amenity.id)
                          ? 'border-victor-green bg-victor-green/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <amenity.icon className={`h-5 w-5 ${
                        formData.amenities.includes(amenity.id) ? 'text-victor-green' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.amenities.includes(amenity.id) ? 'text-victor-green' : 'text-gray-700'
                      }`}>
                        {amenity.label}
                      </span>
                      {formData.amenities.includes(amenity.id) && (
                        <Check className="h-4 w-4 text-victor-green ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Property Photos</CardTitle>
                <CardDescription>Upload photos of your property (minimum 1, maximum 10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Upload Photos</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop or click to select files
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={handleImageUpload}
                  />
                  <Label htmlFor="photo-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Select Photos
                    </Button>
                  </Label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-3">
                      Uploaded Photos ({uploadedImages.length}/10)
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Listing</CardTitle>
                <CardDescription>Please review your property details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium capitalize">{formData.propertyType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <p className="font-medium">KES {formData.price}/month</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium">{formData.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bedrooms:</span>
                    <p className="font-medium">{formData.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bathrooms:</span>
                    <p className="font-medium">{formData.bathrooms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Area:</span>
                    <p className="font-medium">{formData.area} m²</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Photos:</span>
                    <p className="font-medium">{uploadedImages.length} uploaded</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Amenities:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map(amenityId => {
                      const amenity = amenitiesList.find(a => a.id === amenityId)
                      return amenity ? (
                        <Badge key={amenityId} variant="secondary">
                          {amenity.label}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">What happens next?</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your property will be reviewed by our team within 24-48 hours. 
                        Once approved, it will be listed on Victor Springs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {step < 5 ? (
              <Button
                type="button"
                className="bg-victor-green hover:bg-victor-green-dark"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-victor-green hover:bg-victor-green-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Submit Property
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitProperty
