"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { registerApi } from "@/services/user.service";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  //const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!form.name) {
        toast.error("Full Name is required");
        return;
      }

      if (!form.email) {
        toast.error("Email is required");
        return;
      }

      if (!form.mobile) {
        toast.error("Mobile Number is required");
        return;
      }

      if (!form.password) {
        toast.error("Password is required");
        return;
      }
      setLoading(true);
      const fd = new FormData();
      fd.append("full_name", form.name);
      fd.append("email", form.email);
      fd.append("mobile", form.mobile);
      fd.append("password", form.password);

      const response: any = await registerApi(fd);

      if (
        response?.success ||
        response?.status === "success"
      ) {
        toast.success(
          response?.message ||
          "Account Created Successfully"
        );

        setStep("success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🪑</div>
            <h1 className="font-serif text-2xl font-bold text-amber-950">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Join SRS Chair Showroom today</p>
          </div>

          {step === "form" && (
            <div className="space-y-4">
              {[
                { key: "name", label: "Full Name", placeholder: "Rahul Sharma", type: "text" },
                { key: "email", label: "Email Address", placeholder: "rahul@example.com", type: "email" },
                { key: "mobile", label: "Mobile Number", placeholder: "9876543210", type: "tel" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              <p className="text-xs text-gray-400">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-amber-700">Terms & Conditions</Link> and{" "}
                <Link href="/privacy-policy" className="text-amber-700">Privacy Policy</Link>.
              </p>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* {step === "otp" && (
            <div className="space-y-5">
              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800 text-center">
                OTP sent to <strong>+91-{form.mobile}</strong> and <strong>{form.email}</strong>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 text-center">Enter 6-digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center tracking-[0.5em] text-xl font-bold outline-none focus:border-amber-400"
                />
                <p className="text-xs text-center text-gray-400 mt-2">
                  Didn't receive?{" "}
                  <button className="text-amber-700 font-medium">Resend OTP</button>
                </p>
              </div>
              <button
                onClick={() => setStep("success")}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Verify & Create Account
              </button>
              <button onClick={() => setStep("form")} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← Go back
              </button>
            </div>
          )} */}

          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Welcome, <strong>{form.name}</strong>! A welcome email has been sent to {form.email}.
              </p>
              <button
               onClick={() => router.push("/login")}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Go to My Account
              </button>
            </div>
          )}

          {step === "form" && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (!credentialResponse.credential)
                      return;

                    const result = await googleLogin(
                      credentialResponse.credential
                    );

                    if (result?.success) {
                      toast.success(
                        "Login Successful"
                      );

                      if (
                        result.role ===
                        "admin"
                      ) {
                        router.push("/admin");
                      } else {
                        router.push("/");
                      }
                    }
                  }}
                  onError={() => {
                    toast.error(
                      "Google Login Failed"
                    );
                  }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-700 font-semibold hover:text-amber-900">Login</Link>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
