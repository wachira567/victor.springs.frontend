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
              Victor Springs Limited ("Victor Springs", "we", "us", or "our") is committed to protecting the privacy of our users. This Privacy Policy describes how we may collect, use, and manage information when you use our website or services (the "Platform"). By using the Platform, you acknowledge and agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We May Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">When you use the Platform, we may collect information including but not limited to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal information you provide during registration or use of the Platform, such as your name, email address, and phone number.</li>
              <li>Identification documents submitted for verification purposes.</li>
              <li>Information related to property listings, applications, and transactions conducted through the Platform.</li>
              <li>Technical and usage data collected automatically through your interaction with the Platform.</li>
              <li>Any other information you choose to provide to us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We May Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We may use collected information for purposes including but not limited to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Operating, maintaining, and improving the Platform and our services.</li>
              <li>Processing transactions and managing user accounts.</li>
              <li>Facilitating communications between users of the Platform.</li>
              <li>Verifying user identity and preventing fraudulent activity.</li>
              <li>Complying with applicable laws, regulations, and legal processes.</li>
              <li>Any other purpose related to the operation and improvement of our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We may share your information with other users of the Platform as necessary to facilitate the services (for example, sharing applicant details with property owners for application review). We may also share information with service providers who assist in operating the Platform, and with law enforcement or regulatory authorities when required by law or to protect our rights, property, or safety, or those of others.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We take reasonable measures to protect information collected through the Platform. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We may retain your information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. The specific retention period may vary depending on the context and our legal and business requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Choices</h2>
            <p className="text-gray-600 leading-relaxed">
              You may update certain account information through the Platform. If you wish to make inquiries regarding your personal information, you may contact us using the details below. Please note that certain information may need to be retained for legal, regulatory, or legitimate business purposes, and any requests will be assessed on a case-by-case basis in accordance with applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices or content of these external sites and encourage you to review their policies independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Platform after any changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy, you may contact us at:
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
