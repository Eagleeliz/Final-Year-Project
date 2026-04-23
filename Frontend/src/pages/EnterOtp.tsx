import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authApi } from "../Features/Apis/authApi"; // backend endpoints

export const EnterOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state as { email: string };

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Handle OTP verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.verifyOtp({ email, otp });
      toast.success("OTP verified successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await authApi.resendOtp({ email }); // backend endpoint for resend
      toast.success("New OTP sent to your email!");
      setSecondsLeft(300); // reset 5-minute countdown
      setCanResend(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white p-6">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-black mb-4 text-center text-teal-900">Enter OTP</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          We sent a one-time password (OTP) to your email:{" "}
          <span className="font-bold text-teal-900 break-words">{email}</span>. Enter it below to verify your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-teal-300 text-center text-lg text-black bg-gray-100 placeholder-gray-400"
            placeholder="Enter 6-digit OTP"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-900 text-white font-bold rounded-2xl hover:bg-teal-800 transition"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-teal-900 font-bold underline hover:text-teal-800"
            >
              Resend OTP
            </button>
          ) : (
            <p>
              Resend OTP in:{" "}
              {Math.floor(secondsLeft / 60)
                .toString()
                .padStart(2, "0")}
              :
              {(secondsLeft % 60).toString().padStart(2, "0")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};