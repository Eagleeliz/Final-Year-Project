import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../Features/Apis/authApi";

const midnightTeal = "#0B3B3F";
const aquaText     = "#7FD1E0";
const aquaLight    = "#E6F7F9";
const warmGray     = "#EEF8F9";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep]               = useState<"email" | "otp" | "newpassword">("email");
  const [email, setEmail]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const handleSendOtp = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP"); return; }
    setStep("newpassword");
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword.trim()) { setError("Please enter a new password"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: warmGray }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
          <h1 className="text-xl font-black" style={{ color: midnightTeal }}>
            {step === "email"       && "Forgot Password"}
            {step === "otp"         && "Enter Reset Code"}
            {step === "newpassword" && "Set New Password"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {step === "email"       && "Enter your email to receive a reset code"}
            {step === "otp"         && `We sent a 6-digit code to ${email}`}
            {step === "newpassword" && "Choose a strong new password"}
          </p>
        </div>

        <div className="p-6 space-y-4">

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-2">
            {["email", "otp", "newpassword"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: step === s ? midnightTeal : (["email","otp","newpassword"].indexOf(step) > i ? aquaLight : "#F3F4F6"),
                    color: step === s ? "#FFFFFF" : (["email","otp","newpassword"].indexOf(step) > i ? midnightTeal : "#9CA3AF"),
                  }}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-0.5" style={{ background: ["email","otp","newpassword"].indexOf(step) > i ? aquaText : "#E5E7EB" }} />}
              </div>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#FEE2E2", color: "#DC2626" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#DCFCE7", color: "#16A34A" }}>
              {success}
            </div>
          )}

          {/* Step: Email */}
          {step === "email" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal }}
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80 disabled:opacity-50"
                style={{ background: midnightTeal, color: aquaText }}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">6-Digit Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none text-center tracking-widest font-bold"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal, fontSize: "20px" }}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                style={{ background: midnightTeal, color: aquaText }}
              >
                Verify Code
              </button>
              <button
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
              >
                ← Use a different email
              </button>
            </>
          )}

          {/* Step: New Password */}
          {step === "newpassword" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal }}
                />
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80 disabled:opacity-50"
                style={{ background: midnightTeal, color: aquaText }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <p className="text-center text-xs text-gray-400 pt-2">
            Remembered your password?{" "}
            <span
              className="font-bold cursor-pointer hover:opacity-70"
              style={{ color: midnightTeal }}
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;