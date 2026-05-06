import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../Features/Apis/authApi";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingVerificationEmail") || "";

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      setStatus("error");
      setMessage("Please enter the OTP sent to your email.");
      return;
    }
    setStatus("loading");
    try {
      await authApi.verifyOtp({ email, otp });
      setStatus("success");
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Invalid or expired OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendOtp({ email });
      setMessage("A new OTP has been sent to your email.");
      setStatus("idle");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to resend OTP.");
      setStatus("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090d] p-4 font-sans">
      <div className="w-full max-w-md bg-[#0b0e14] border border-white/10 p-10 rounded-3xl shadow-2xl text-center">

        {/* SUCCESS */}
        {status === "success" ? (
          <div>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Verified!</h2>
            <p className="text-slate-400 mb-6">{message}</p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_3s_linear]"></div>
            </div>
            <Link to="/login" className="mt-6 inline-block text-blue-500 hover:text-blue-400 font-semibold">
              Click here to log in manually
            </Link>
          </div>
        ) : (
          /* OTP FORM */
          <div>
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Verify your email</h2>
            <p className="text-slate-400 mb-6 text-sm">
              We sent a code to <span className="text-white font-medium">{email || "your email"}</span>. Enter it below.
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-center text-2xl font-bold tracking-widest outline-none focus:border-blue-500 transition-colors mb-4"
            />

            {/* Error message */}
            {status === "error" && (
              <p className="text-red-400 text-sm mb-4">{message}</p>
            )}
            {status === "idle" && message && (
              <p className="text-green-400 text-sm mb-4">{message}</p>
            )}

            <button
              onClick={handleVerify}
              disabled={status === "loading"}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all mb-4"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : "Verify Email"}
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
            >
              {resending ? "Resending..." : "Didn't receive a code? Resend"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;