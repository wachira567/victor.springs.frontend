const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: February 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small data files placed on your device when you visit a website. They are widely used to enable website functionality, remember preferences, and help website operators understand usage patterns. Similar technologies, such as local storage, may also be used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Victor Springs may use cookies and similar technologies for purposes including but not limited to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Essential Functionality:</strong> To enable core features of the Platform such as user authentication, session management, and security.</li>
              <li><strong>Preferences:</strong> To remember your settings and choices for a more personalised experience.</li>
              <li><strong>Analytics:</strong> To understand how visitors interact with the Platform and to improve performance and user experience.</li>
              <li><strong>Security:</strong> To help detect and prevent unauthorised access and fraudulent activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Third-Party Technologies</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform may utilise third-party services that set their own cookies or use similar technologies. These third-party services operate under their own terms and privacy policies, which we encourage you to review. Victor Springs does not control and is not responsible for cookies set by third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Most web browsers allow you to manage cookie preferences through their settings. You may choose to block or delete cookies; however, doing so may impair certain functionality of the Platform, including the ability to log in or access certain features. Your continued use of the Platform constitutes consent to the use of cookies as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Local Storage</h2>
            <p className="text-gray-600 leading-relaxed">
              In addition to cookies, we may use browser local storage to store certain data necessary for the proper functioning of the Platform, such as authentication tokens. This data is stored on your device and can be cleared through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookie Policy at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Platform following any changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about our use of cookies, contact us at:
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

export default CookiePolicy
