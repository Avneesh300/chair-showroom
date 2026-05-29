import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ReturnPolicyPage() {
  const sections = [
    {
      title: "Return Window",
      content: "You can return any product within 7 days of delivery. After 7 days, returns will not be accepted unless the product has a manufacturing defect covered under warranty.",
    },
    {
      title: "Eligibility for Return",
      items: [
        "Product must be unused and in original packaging",
        "All accessories, manuals, and warranty cards must be present",
        "Product should not be assembled (for assembly-required items)",
        "No visible damage or scratches from customer side",
        "Original invoice/bill must be provided",
      ],
    },
    {
      title: "Non-Returnable Items",
      items: [
        "Products damaged due to misuse or negligence",
        "Items without original packaging",
        "Products with missing accessories or parts",
        "Customized or made-to-order chairs",
        "Items purchased during clearance sale (marked as non-returnable)",
      ],
    },
    {
      title: "How to Initiate a Return",
      items: [
        "Go to My Orders in your account",
        "Select the order and click 'Return Item'",
        "Choose the reason for return",
        "Our team will contact you within 24 hours",
        "We will arrange free pickup from your address",
        "Refund will be processed after quality check",
      ],
    },
    {
      title: "Refund Timeline",
      content: "After the returned product reaches our warehouse and passes quality inspection (2–3 days), refund will be processed within 5–7 business days to your original payment method. For COD orders, refund is issued via bank transfer.",
    },
    {
      title: "Damaged / Defective Products",
      content: "If you receive a damaged or defective product, please report it within 48 hours of delivery with photos. We will arrange immediate replacement or full refund at no extra cost.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 py-16 text-white text-center">
          <h1 className="font-serif text-4xl font-bold mb-3">Return & Refund Policy</h1>
          <p className="text-amber-200 text-sm">Last updated: January 2025</p>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 text-sm text-amber-800">
            <strong>Summary:</strong> We offer a 7-day hassle-free return policy. If you're not satisfied, contact us within 7 days of delivery.
          </div>
          <div className="space-y-8">
            {sections.map((sec, i) => (
              <div key={sec.title}>
                <h2 className="font-serif text-xl font-bold text-amber-950 mb-3">
                  {i + 1}. {sec.title}
                </h2>
                {sec.content && <p className="text-gray-600 text-sm leading-relaxed">{sec.content}</p>}
                {sec.items && (
                  <ul className="space-y-2 mt-2">
                    {sec.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-amber-500 mt-0.5">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Need help with a return?</p>
            <p className="font-semibold text-amber-800">📞 1800-XXX-XXXX &nbsp;|&nbsp; ✉️ support@srschairs.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
