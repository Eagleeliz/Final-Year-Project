import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authApi } from "../Features/Apis/authApi";

const VerifyEmail = () => {
 const [searchParams] = useSearchParams();
const token = searchParams.get("token");
  const navigate = useNavigate();

  // UI State management
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Authenticating your email address...");

  useEffect(() => {
    const performVerification = async () => {
      // 1️⃣ Check if token exists in URL
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token. Please click the link in your email again.");
        return;
      }

      try {
        // 2️⃣ Call backend to verify email
        await authApi.verifyEmail(token);

        setStatus("success");
        setMessage("Email verified successfully! You are now ready to log in.");

        // 3️⃣ Auto redirect after success
        const timer = setTimeout(() => {
          navigate("/login");
        }, 3500);

        return () => clearTimeout(timer);

      } catch (err: any) {
        setStatus("error");

        const backendError =
          err.response?.data?.error ||
          "Verification failed. The link may have expired.";

        setMessage(backendError);
      }
    };

    performVerification();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090d] p-4 font-sans">
      <div className="w-full max-w-md bg-[#0b0e14] border border-white/10 p-10 rounded-3xl shadow-2xl text-center">

        {/* --- LOADING --- */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse">{message}</p>
          </div>
        )}

        {/* --- SUCCESS --- */}
        {status === "success" && (
          <div className="animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">Success!</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">{message}</p>

            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_3.5s_linear]"></div>
            </div>

            <Link
              to="/login"
              className="mt-6 inline-block text-blue-500 hover:text-blue-400 font-semibold transition-colors"
            >
              Click here to log in manually
            </Link>
          </div>
        )}

        {/* --- ERROR --- */}
        {status === "error" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">Verification Failed</h2>
            <p className="text-red-400/90 mb-8 px-4">{message}</p>

            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
              >
                Go back to Register
              </Link>

              <Link
                to="/contact"
                className="text-sm text-slate-500 hover:text-slate-300"
              >
                Need help? Contact support
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;