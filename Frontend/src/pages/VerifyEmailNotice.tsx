import { useLocation, Link } from "react-router-dom";

const VerifyEmailNotice = () => {
  const location = useLocation();
  // We grab the email passed from the Register page state to make it personal
  const email = location.state?.email || "your registered email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090d] p-4 font-sans">
      <div className="w-full max-w-md bg-[#0b0e14] border border-white/10 p-10 rounded-3xl shadow-2xl text-center">
        
        {/* Animated Mail Icon */}
        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Check your inbox</h2>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          We've sent a verification link to <br />
          <span className="text-white font-semibold break-all">{email}</span>. <br />
          Please click the link to activate your account.
        </p>

        <div className="space-y-4">
          <a 
            href="https://mail.google.com" 
            target="_blank" 
            rel="noreferrer"
            className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            Open Email App
          </a>
          
          <Link 
            to="/login" 
            className="block text-sm text-slate-500 hover:text-blue-500 transition-colors"
          >
            I've already verified, take me to Login
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">
            Didn't get the email? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;