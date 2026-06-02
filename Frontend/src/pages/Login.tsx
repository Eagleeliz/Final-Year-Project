import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../Features/Apis/authApi';
import { setCredentials, authStart, authError } from '../Features/Auth/AuthSlice';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: any) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const data = await authApi.login({ email, password });

      dispatch(setCredentials({
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          county: data.user.county,
          constituency: data.user.constituency,
          ward: data.user.ward,
          userType: data.user.userType,
          isActive: true,
          isEmailVerified: true
        },
        token: data.token,
      }));

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id.toString());

      toast.success(`Welcome back, ${data.user.firstName}!`, {
        duration: 4000,
        style: {
          borderRadius: '16px',
          background: midnightTeal,
          color: aquaText,
          padding: '16px',
          fontWeight: 'bold',
          border: `1px solid ${aquaText}33`
        },
        iconTheme: {
          primary: aquaText,
          secondary: midnightTeal,
        },
      });

      setTimeout(() => {
        if (data.user.userType === 'admin') {
          navigate("/admin");
        } else if (data.user.userType === 'policy_maker') {
          navigate("/policymaker");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Invalid credentials. Please try again.";
      dispatch(authError(errorMessage));

      toast.error(errorMessage, {
        style: {
          borderRadius: '16px',
          background: '#1e293b',
          color: '#fff',
          padding: '16px',
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex flex-1  flex-col md:flex-row">

        {/* ── Left: Form Panel ── */}
        <div
          className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto"
          style={{
            background: "linear-gradient(160deg, #e8f9fb 0%, #f0fdfe 25%, #f7fffe 55%, #e4f8fa 80%, #edfbfc 100%)",
          }}
        >
          <div className="w-full max-w-md">

            {/* Heading + subtitle - above card */}
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black tracking-tight mb-1" style={{ color: midnightTeal }}>
                Welcome back
              </h2>
              <p className="text-sm text-gray-400">
                New to BabyCentre?{" "}
                <Link to="/register" className="font-black hover:underline" style={{ color: midnightTeal }}>
                  Create account
                </Link>
              </p>
            </div>

            <div
              className="border border-[#86d9e1]/20 p-8 md:p-10 rounded-[32px] shadow-xl shadow-teal-900/10"
              style={{ background: "linear-gradient(160deg, #ffffff 0%, #f5fdfe 60%, #edfbfc 100%)" }}
            >
              {/* Badge only inside card */}
              <div className="mb-8">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                  style={{
                    background: "rgba(0,46,51,0.07)",
                    border: "1px solid rgba(0,46,51,0.15)",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: midnightTeal }}
                  />
                  <span
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: midnightTeal }}
                  >
                    Please fill in your details
                  </span>
                </div>
              </div>
  <div>
    <p> Demo Credentials</p>
    <p> Email: wanjikukiruno@gmail.com</p>
    <p>Password: Wanjiku5</p>
  </div>
  
              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5" name="loginForm">
                <div>
                  <label className="text-sm uppercase font-bold text-black mb-2 block tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full rounded-2xl p-4 border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-300/50 outline-none shadow-sm bg-white text-gray-800 placeholder:text-gray-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm uppercase font-bold text-black mb-2 block tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl p-4 border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-300/50 outline-none shadow-sm bg-white text-gray-800 placeholder:text-gray-400 transition-all"
                      style={{ paddingRight: "3rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-0 transition-colors"
                      style={{ background: "transparent", border: "none", color: showPassword ? aquaText : "#9ca3af" }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <Link
                    to="/forgot"
                    className="text-sm font-bold uppercase tracking-widest hover:underline mt-2 inline-block text-right w-full"
                    style={{ color: midnightTeal }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wide shadow-xl flex justify-center items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                  style={{ backgroundColor: midnightTeal, color: aquaText }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full border-2 border-[#86d9e1] border-t-transparent animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-[#86d9e1]/20">
                <p className="text-center text-xs text-gray-400">
                  By signing in, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-gray-600">Terms</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Image Panel ── */}
        <div
          className="hidden md:flex md:w-1/2 items-start justify-center relative overflow-hidden pt-28"
          style={{ backgroundColor: midnightTeal }}
        >
          <img
            src="https://i.pinimg.com/1200x/75/c1/84/75c184e778eb6887ce20393b30f4e2f4.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            alt="Safe Motherhood"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,46,51,0.5) 0%, rgba(0,61,69,0.3) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-white pt-6 px-12 pb-12 max-w-lg">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{
                background: "rgba(134,217,225,0.15)",
                border: "1px solid rgba(134,217,225,0.3)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: aquaText }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: aquaText }}
              >
                Your Pregnancy Companion 🤍
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-black mb-4 leading-tight" style={{ color: "#fff" }}>
              Every mother deserves{" "}
              <span style={{ color: aquaText }}>safe care</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg opacity-80 border-l-4 pl-4 leading-relaxed"
              style={{ borderColor: aquaText }}
            >
              Join a platform built to support, inform, and empower you through every
              stage of motherhood.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-2xl"
                style={{ background: "rgba(134,217,225,0.1)", border: "1px solid rgba(134,217,225,0.2)" }}
              >
                <p className="text-3xl font-black" style={{ color: aquaText }}>10K+</p>
                <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">Mothers Supported</p>
              </div>
              <div
                className="p-4 rounded-2xl"
                style={{ background: "rgba(134,217,225,0.1)", border: "1px solid rgba(134,217,225,0.2)" }}
              >
                <p className="text-3xl font-black" style={{ color: aquaText }}>47</p>
                <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">Counties Covered</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default LoginPage;