"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 py-16 text-white text-center">
          <h1 className="font-serif text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-amber-200">We'd love to hear from you. Get in touch!</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-amber-950 mb-6">Get In Touch</h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, title: "Visit Us", lines: ["123 Chair Market, Furniture Lane", "Lucknow, Uttar Pradesh – 226001"] },
                  { icon: Phone, title: "Call Us", lines: ["1800-XXX-XXXX (Toll Free)", "Mon–Sat: 10AM – 8PM"] },
                  { icon: Mail, title: "Email Us", lines: ["info@srschairs.com", "support@srschairs.com"] },
                  { icon: Clock, title: "Business Hours", lines: ["Monday – Saturday: 10AM – 8PM", "Sunday: 11AM – 6PM"] },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-amber-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800 mb-0.5">{title}</div>
                      {lines.map((l) => <p key={l} className="text-sm text-gray-500">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-xl font-bold text-amber-950 mb-5">Send a Message</h2>
                  <div className="space-y-4">
                    {[
                      { key: "name", label: "Full Name", placeholder: "Rahul Sharma", type: "text" },
                      { key: "email", label: "Email Address", placeholder: "rahul@example.com", type: "email" },
                      { key: "phone", label: "Phone Number", placeholder: "9876543210", type: "tel" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={form[field.key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                      />
                    </div>
                    <button
                      onClick={() => setSubmitted(true)}
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
