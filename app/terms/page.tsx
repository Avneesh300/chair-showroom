import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 py-16 text-white text-center">
          <h1 className="font-serif text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-amber-200 text-sm">Last updated: January 2025</p>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm text-gray-600 space-y-8 leading-relaxed">
          {[
            { title: "1. Acceptance of Terms", content: "By accessing or using the SRS Chair Showroom website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website." },
            { title: "2. Account Registration", content: "You must be 18 years or older to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
            { title: "3. Product Information", content: "We strive to display accurate product information, images, and prices. However, minor variations in color may occur due to screen settings. Prices are subject to change without prior notice. All prices include applicable GST." },
            { title: "4. Ordering & Payment", content: "Placing an order constitutes an offer to purchase. We reserve the right to accept or cancel orders. Payment must be made in full before dispatch for prepaid orders. For COD orders, payment must be made at the time of delivery." },
            { title: "5. Delivery", content: "Delivery timelines are estimates and not guaranteed. We are not responsible for delays caused by courier partners, natural disasters, or other events beyond our control. Delivery charges may apply for orders below Rs. 5,000." },
            { title: "6. Intellectual Property", content: "All content on this website including text, images, logos, and design is the property of SRS Chair Showroom Pvt. Ltd. and is protected by copyright laws. Unauthorized use is strictly prohibited." },
            { title: "7. Limitation of Liability", content: "To the maximum extent permitted by law, SRS Chair Showroom shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products." },
            { title: "8. Governing Law", content: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Lucknow, Uttar Pradesh." },
            { title: "9. Changes to Terms", content: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the website constitutes acceptance of the revised terms." },
            { title: "10. Contact", content: "For questions about these Terms, contact us at: legal@srschairs.com or +91-1800-XXX-XXXX." },
          ].map((sec) => (
            <div key={sec.title}>
              <h2 className="font-serif text-xl font-bold text-amber-950 mb-2">{sec.title}</h2>
              <p>{sec.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
