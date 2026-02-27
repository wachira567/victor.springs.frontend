import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success('Message sent successfully!')
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+254 717 849 484'],
      action: 'Call us',
      href: 'tel:+254717849484',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['victorspringsltd@gmail.com'],
      action: 'Send email',
      href: 'mailto:victorspringsltd@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Ruaka, Nairobi', 'Kenya'],
      action: null,
      href: null,
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Fri: 8:30AM - 5PM', 'Sat: 9AM - 1PM'],
      action: null,
      href: null,
    },
  ]

  const faqs = [
    {
      question: 'How do I list my property?',
      answer: 'Create a landlord account, complete KYC verification, then click "List Property" and follow the step-by-step process to submit your property details and photos.',
    },
    {
      question: 'How are properties verified?',
      answer: 'Our team reviews each listing to ensure accuracy before it goes live on the platform. We also verify landlord identity through our KYC process.',
    },
    {
      question: 'How do I apply for a property?',
      answer: 'Browse listings, find a property you like, and submit an application online. You can also contact us directly via Call or WhatsApp if you have questions about a unit before applying.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Agreement fees and deposits are processed securely via M-Pesa. You will receive instant confirmation once your payment is received.',
    },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-victor-green to-victor-blue py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm mb-6">
            <MessageSquare className="h-4 w-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have a question or need help? We're here to assist you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-victor-green/10 flex items-center justify-center">
                    <info.icon className="h-6 w-6 text-victor-green" />
                  </div>
                  <h3 className="font-semibold mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                  {info.action && (
                    <a 
                      href={info.href}
                      className="inline-block mt-3 text-victor-green text-sm font-medium hover:underline"
                    >
                      {info.action}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
                Send a Message
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How Can We Help?
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+254 712 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="listing">Property Listing</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-victor-green hover:bg-victor-green-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* FAQ */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-victor-green/10 text-victor-green text-sm font-medium mb-4">
                <HelpCircle className="h-4 w-4 inline mr-1" />
                FAQ
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-victor-green/5 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-victor-green mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Want to list multiple properties?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Contact us for partnership opportunities and dedicated support.
                    </p>
                    <a 
                      href="mailto:victorspringsltd@gmail.com"
                      className="text-victor-green text-sm font-medium hover:underline mt-2 inline-block"
                    >
                      victorspringsltd@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
