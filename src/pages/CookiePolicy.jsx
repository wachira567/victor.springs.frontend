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
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to the website owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">Victor Springs Limited uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the Platform to function properly. They enable core features such as user authentication, session management, and security. Without these cookies, the Platform cannot operate as intended.</li>
              <li><strong>Preference Cookies:</strong> These remember your settings and preferences (such as language, search filters, or recently viewed properties) to provide a more personalized experience.</li>
              <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with the Platform by collecting information about pages visited, time spent, and features used. This data is used to improve Platform performance and user experience.</li>
              <li><strong>Authentication Cookies:</strong> These keep you signed in to your account as you navigate between pages, so you don't have to log in on every page.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Types of Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm text-gray-600 mt-3">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900">Cookie Type</th>
                    <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900">Purpose</th>
                    <th className="border border-gray-200 p-3 text-left font-semibold text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-3">Session Cookie</td>
                    <td className="border border-gray-200 p-3">Maintains your login session and security tokens</td>
                    <td className="border border-gray-200 p-3">Until browser is closed</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3">Authentication Token</td>
                    <td className="border border-gray-200 p-3">Keeps you logged into your account (stored in localStorage)</td>
                    <td className="border border-gray-200 p-3">Until logout</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-3">User Preferences</td>
                    <td className="border border-gray-200 p-3">Stores your search preferences and saved property selections</td>
                    <td className="border border-gray-200 p-3">Persistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li><strong>Google (Authentication):</strong> If you sign in using Google, Google may set cookies for authentication and security purposes.</li>
              <li><strong>Cloudinary:</strong> Used for image hosting and delivery; may set performance cookies for image optimization.</li>
              <li><strong>Mapbox:</strong> Used for property location maps; may set cookies for map functionality and performance.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              We do not control third-party cookies. We recommend reviewing their respective privacy and cookie policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              You can manage or delete cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li>View which cookies are stored on your device and delete them individually.</li>
              <li>Block all cookies or only third-party cookies.</li>
              <li>Configure your browser to notify you when a cookie is being set.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Please note that blocking essential cookies may prevent you from using key features of the Platform, such as logging in or submitting applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Local Storage</h2>
            <p className="text-gray-600 leading-relaxed">
              In addition to cookies, we use browser local storage to store your authentication token and user profile data. This data is stored on your device and is only accessible by our Platform. You can clear local storage through your browser's developer tools or settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
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
