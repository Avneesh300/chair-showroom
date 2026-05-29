import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Share2, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center text-lg">🪑</div>
              <div>
                <div className="font-serif font-bold text-white text-lg leading-none">SRS Chairs</div>
                <div className="text-xs text-amber-400 tracking-widest">SHOWROOM</div>
              </div>
            </div>
            <p className="text-sm text-amber-300 leading-relaxed mb-4">
              Premium chair showroom offering the best brands — Godrej, Featherlite, Green Soul & more. Quality seating for every space.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Share2 size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Users size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "All Chairs", href: "/products" },
                { label: "Office Chairs", href: "/products?category=office-chairs" },
                { label: "Gaming Chairs", href: "/products?category=gaming-chairs" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-amber-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Policies</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Return Policy", href: "/return-policy" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "My Orders", href: "/account/orders" },
                { label: "My Wishlist", href: "/wishlist" },
                { label: "Track Order", href: "/account/orders" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-amber-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-amber-300">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <span>123 Chair Market, Furniture Lane, Lucknow, UP – 226001</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-amber-300">
                <Phone size={15} className="flex-shrink-0 text-amber-500" />
                <a href="tel:1800XXXXXXX" className="hover:text-white">1800-XXX-XXXX</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-amber-300">
                <Mail size={15} className="flex-shrink-0 text-amber-500" />
                <a href="mailto:info@srschairs.com" className="hover:text-white">info@srschairs.com</a>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-amber-900 rounded-lg">
              <p className="text-xs text-amber-400 mb-1 font-medium">Business Hours</p>
              <p className="text-sm text-amber-200">Mon – Sat: 10AM – 8PM</p>
              <p className="text-sm text-amber-200">Sunday: 11AM – 6PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-500">
          <p>© 2025 SRS Chair Showroom Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>🔒 Secure Payments</span>
            <span>📦 Fast Delivery</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
