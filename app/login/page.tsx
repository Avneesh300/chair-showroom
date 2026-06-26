"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Eye, EyeOff, Mail, Phone, ArrowRight, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { sendEmailOtpApi } from "@/services/user.service";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const { login, otpLogin, googleLogin, } = useAuth();
  const [tab, setTab] = useState<"email" | "otp">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", mobile: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin =
    async () => {
      try {
        setLoading(true);
        setError("");
        const result = await login( form.email, form.password );
        if (result.success) {
          toast.success("Login Successful");
          if (result.role === "admin") {
            router.replace("/admin");
          } else {
            router.replace("/");
          }
        } else { setError( result.error || "Invalid Credentials" );
        }
      } finally {
        setLoading(false);
      }
    };
  const handleSendOtp =
    async () => {
      try {
        const fd = new FormData();
        fd.append( "email", form.email );
        const response: any = await sendEmailOtpApi( fd );
        if ( response?.success || response?.status ==="success" ) { 
          toast.success( "OTP Sent Successfully" );
          setOtpSent(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

  const handleOtpLogin =
    async () => {
      const result =
        await otpLogin( form.email, form.otp );

      if (result.success) {
        toast.success( "Login Successful" );
        if (result.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      } else {
        toast.error( result.error || "Invalid OTP" );
      }
    };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🪑</div>
            <h1 className="font-serif text-2xl font-bold text-amber-950">Welcome Back</h1>
            <p className="text-gray-400 text-sm mt-1">Login to your SRS Chair account</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setTab("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "email" ? "bg-white text-amber-800 shadow-sm" : "text-gray-500"}`}
            >
              <Mail size={14} /> Email
            </button>
            <button
              onClick={() => setTab("otp")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "otp" ? "bg-white text-amber-800 shadow-sm" : "text-gray-500"}`}
            >
              <Phone size={14} /> OTP Login
            </button>
          </div>

          {tab === "email" ? (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle size={15} /> {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="admin@srschairs.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer">
                  <input type="checkbox" className="accent-amber-600 rounded" />
                  Remember me for 30 days
                </label>
                <Link href="/forgot-password" className="text-amber-700 hover:text-amber-900 font-medium">
                  Forgot Password?
                </Link>
              </div>
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                {loading
                  ? "Logging In..."
                  : "Login"} <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
                />
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Enter OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 text-center tracking-widest text-lg font-bold"
                    />
                    <p className="text-xs text-amber-700 mt-1.5 text-center font-medium">
                      Demo: Enter any 6 digits to login as Customer
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 text-center">
                      OTP sent to +91-{form.mobile}.{" "}
                      <button onClick={() => setOtpSent(false)} className="text-amber-700 font-medium">Resend</button>
                    </p>
                  </div>
                  <button
                    onClick={handleOtpLogin}
                    className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    Verify & Login <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (
                credentialResponse
              ) => {
                if ( !credentialResponse.credential )
                  return;
                const result = await googleLogin( credentialResponse.credential );
                if ( result.success ) {
                  toast.success( "Google Login Successful" );
                  if ( result.role === "admin" ) {
                    router.push( "/admin" );
                  } else {
                    router.push( "/account" );
                  }
                }
              }}
              onError={() =>
                toast.error( "Google Login Failed")
              }
            />
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New customer?{" "}
            <Link href="/register" className="text-amber-700 font-semibold hover:text-amber-900">
              Create Account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
