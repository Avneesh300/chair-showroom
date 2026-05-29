import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 py-20 text-white text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">About SRS Chair Showroom</h1>
          <p className="text-amber-200 text-lg max-w-xl mx-auto">
            Your trusted destination for premium quality chairs since 2010
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-14">
            <div>
              <h2 className="font-serif text-2xl font-bold text-amber-950 mb-4">Our Story</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                SRS Chair Showroom was established in 2010 with a simple vision: to provide the finest seating solutions for homes, offices, and commercial spaces across India.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Starting as a small showroom in Lucknow, we have grown into one of the most trusted chair retailers in the region, offering products from leading brands like Godrej Interio, Featherlite, Green Soul, Durian, Nilkamal, and more.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-amber-950 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                We believe that the right chair can transform your space and improve your quality of life. Our mission is to help every customer find their perfect seating solution.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you need an ergonomic office chair for long work hours, a comfortable recliner for relaxation, or stylish dining chairs for your home — we have it all.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 bg-amber-50 rounded-3xl text-center mb-14 px-6">
            {[
              { number: "15+", label: "Years of Experience" },
              { number: "500+", label: "Chair Models" },
              { number: "10,000+", label: "Happy Customers" },
              { number: "10+", label: "Premium Brands" },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="font-serif text-3xl font-bold text-amber-800 mb-1">{number}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <h2 className="font-serif text-2xl font-bold text-amber-950 mb-6 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🏆", title: "Premium Quality", desc: "Only genuine products from authorized brands. No compromises on quality." },
              { icon: "🚚", title: "Fast Delivery", desc: "Pan India delivery within 3-7 working days with careful packaging." },
              { icon: "💬", title: "Expert Guidance", desc: "Our trained staff helps you find the perfect chair for your needs and budget." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-amber-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
