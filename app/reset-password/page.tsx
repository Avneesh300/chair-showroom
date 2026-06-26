"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { resetPasswordApi } from "@/services/user.service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      if (!email) {
        toast.error("Email not found");
        return;
      }

      if (!otp.trim()) {
        toast.error("Please enter OTP");
        return;
      }

      if (otp.length !== 6) {
        toast.error("OTP must be 6 digits");
        return;
      }

      if (!password.trim()) {
        toast.error("Please enter new password");
        return;
      }

      if (password.length < 6) {
        toast.error(
          "Password must be at least 6 characters"
        );
        return;
      }

      if (!confirmPassword.trim()) {
        toast.error(
          "Please enter confirm password"
        );
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setLoading(true);

      const response: any =
        await resetPasswordApi({
          email,
          otp,
          password,
          confirmPassword,
        });

      if (response?.success) {
        toast.success(
          "Password reset successfully"
        );

        router.push("/login");
      } else {
        toast.error(
          response?.message ||
            "Failed to reset password"
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
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
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock
                size={28}
                className="text-amber-700"
              />
            </div>

            <h1 className="font-serif text-2xl font-bold text-amber-950">
              Reset Password
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Enter the OTP sent to your email and
              create a new password.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            {/* OTP */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

            {/* Back */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}