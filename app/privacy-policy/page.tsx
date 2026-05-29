import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 py-16 text-white text-center">
          <h1 className="font-serif text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-amber-200 text-sm">Last updated: January 2025</p>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm text-gray-600 space-y-8 leading-relaxed">
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you provide directly, such as your name, email address, mobile number, delivery address, and payment information when you create an account or place an order. We also collect usage data including pages visited, products viewed, and search queries to improve our services.",
            },
            {
              title: "2. How We Use Your Information",
              items: [
                "Process and fulfill your orders",
                "Send order confirmation and delivery updates via email and SMS",
                "Provide customer support",
                "Personalize your shopping experience",
                "Send promotional offers (with your consent)",
                "Detect and prevent fraudulent transactions",
                "Comply with legal obligations",
              ],
            },
            {
              title: "3. Data Security",
              content: "We take data security seriously. All sensitive data (passwords, payment info) is encrypted. Our website uses HTTPS/SSL encryption. Payment transactions are processed through PCI-DSS compliant gateways. We never store your full card details on our servers.",
            },
            {
              title: "4. Sharing Your Information",
              content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with: (a) Delivery partners to fulfill your orders; (b) Payment gateways to process payments; (c) Government/legal authorities when required by law.",
            },
            {
              title: "5. Cookies",
              content: "We use cookies to enhance your browsing experience, remember your cart items, and analyze website traffic. You can disable cookies in your browser settings, but some features may not function properly.",
            },
            {
              title: "6. Your Rights",
              items: [
                "Access your personal data we hold",
                "Request correction of inaccurate data",
                "Request deletion of your account and data",
                "Opt-out of marketing communications",
                "Data portability",
              ],
            },
            {
              title: "7. Data Retention",
              content: "We retain your personal data for as long as your account is active. Order history is retained for 7 years as required by Indian tax laws. You can request account deletion at any time from your account settings.",
            },
            {
              title: "8. Contact Us",
              content: "For any privacy-related questions or to exercise your rights, contact our Data Protection Officer at: privacy@srschairs.com or write to us at: SRS Chair Showroom Pvt. Ltd., 123 Chair Market, Lucknow, UP – 226001.",
            },
          ].map((sec) => (
            <div key={sec.title}>
              <h2 className="font-serif text-xl font-bold text-amber-950 mb-3">{sec.title}</h2>
              {sec.content && <p>{sec.content}</p>}
              {sec.items && (
                <ul className="space-y-1.5 mt-2 ml-4">
                  {sec.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
