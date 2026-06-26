"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { sendEmailforgetpasswordApi } from "@/services/user.service";
import { useRouter } from "next/navigation";



export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [sending, setSending] = useState(false);

  const handleforgetpassword = async () => {
    try {
      setSending(true);
      if (!email.trim()) {
        toast.error("Please enter your email address");
        return;
      }

      const response = await sendEmailforgetpasswordApi(email);

      if (response?.success) {
        setSending(false);
        toast.success("OTP sent to your email");

        router.push(
          `/reset-password?email=${encodeURIComponent(email)}`
        );
      } else {
        setSending(false);
        toast.error(
          response?.message || "Failed to send OTP"
        );
      }
    } catch (error: any) {
      setSending(false);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Mail size={28} className="text-amber-700" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-amber-950">Forgot Password?</h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your email and we'll send you a reset link
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <button
              onClick={handleforgetpassword}
              disabled={sending}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {sending ? "Sending..." : "Send Otp "}
            </button>
            <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>


        </div>
      </main>
      <Footer />
    </>
  );
}
