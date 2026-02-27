const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: February 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Victor Springs Limited ("Victor Springs", "we", "us", or "our") is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, or use any of our services (collectively, the "Platform").
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              By accessing or using our Platform, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please discontinue use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Personal Identification Information:</strong> Full name, email address, phone number, national ID or passport number (for landlord KYC verification).</li>
              <li><strong>Account Information:</strong> Login credentials, profile information, and user role (tenant, landlord, or administrator).</li>
              <li><strong>Property Information:</strong> Property listings, images, descriptions, pricing, and location data submitted by landlords.</li>
              <li><strong>Transaction Information:</strong> M-Pesa payment details, transaction IDs, agreement fee payments, and payment history.</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, property interactions (views, likes, clicks), browser type, IP address, and device information.</li>
              <li><strong>Documents:</strong> Signed tenant agreements, KYC verification documents, and uploaded identification files.</li>
              <li><strong>Communication Data:</strong> Messages, inquiries, and correspondence exchanged through the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To create and manage your account on the Platform.</li>
              <li>To facilitate property listings, searches, applications, and tenant agreements.</li>
              <li>To process payments via M-Pesa for agreement fees and deposits.</li>
              <li>To verify landlord identity through our KYC process.</li>
              <li>To match tenants with suitable properties and facilitate site visits.</li>
              <li>To send you notifications about your applications, viewings, and account activity.</li>
              <li>To improve our Platform's functionality, user experience, and content.</li>
              <li>To detect and prevent fraud, unauthorized access, and other illegal activities.</li>
              <li>To comply with applicable laws, regulations, and legal obligations in Kenya.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>With Landlords/Tenants:</strong> When you submit a tenant application, your name, contact details, and uploaded documents are shared with the relevant property landlord or administrator for review.</li>
              <li><strong>Payment Processors:</strong> Transaction data is shared with Safaricom (M-Pesa) for payment processing purposes.</li>
              <li><strong>Service Providers:</strong> We use third-party services (e.g., Cloudinary for image hosting, email providers) that may access your data solely to perform services on our behalf.</li>
              <li><strong>Legal Compliance:</strong> We may disclose your information to law enforcement agencies, regulatory authorities, or courts when required by law or to protect our rights and safety.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including encrypted data transmission (SSL/TLS), secure server infrastructure, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide our services. We may also retain data as required by applicable Kenyan laws, to resolve disputes, enforce our agreements, and for legitimate business purposes. When your data is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Under the Kenya Data Protection Act, 2019, you have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or updating of inaccurate personal data.</li>
              <li>Request deletion of your personal data, subject to legal obligations.</li>
              <li>Object to the processing of your personal data.</li>
              <li>Withdraw consent for data processing where consent was the basis.</li>
              <li>Lodge a complaint with the Office of the Data Protection Commissioner.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise any of these rights, contact us at <a href="mailto:victorspringsltd@gmail.com" className="text-victor-green hover:underline">victorspringsltd@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the Platform after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 text-gray-600">
              <p><strong>Victor Springs Limited</strong></p>
              <p>Email: <a href="mailto:victorspringsltd@gmail.com" className="text-victor-green hover:underline">victorspringsltd@gmail.com</a></p>
              <p>Phone: <a href="tel:+254717849484" className="text-victor-green hover:underline">+254 717 849 484</a></p>
              <p>Location: Nairobi, Kenya</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
