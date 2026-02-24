import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../Features/Apis/authApi'; 
import { setCredentials, authStart, authError } from '../Features/Auth/AuthSlice';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  // Brand Guidelines
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  // Local State for inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: any) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Start Redux Loading State
    dispatch(authStart());
    
    try {
      // 2. Execute Axios Login via your authApi helper
      const data = await authApi.login({ email, password });

      // 3. Update Redux (Maps backend names to your Slice structure)
      dispatch(setCredentials({
        user: {
          id: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          county: data.county,
          userType: data.userType,
          isActive: data.isActive,
          isEmailVerified: data.isEmailVerified
        },
        token: data.token,
        requireProfileCompletion: !data.isProfileComplete 
      }));

      // 4. Persistence
      localStorage.setItem('token', data.token);

      // 5. Beautiful Success Notification
      toast.success(`Welcome back, ${data.firstName}!`, {
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

      // 6. Role-Based Navigation Logic
      // Timeout allows the user to actually see the success toast before the screen flips
      setTimeout(() => {
        if (data.userType === 'admin' || data.userType === 'policy_maker') {
          navigate("/AdminDashboard");
        } else if (!data.isProfileComplete) {
          navigate("/complete-profile");
        } else {
          navigate("/Dashboard");
        }
      }, 800);

    } catch (err: any) {
      // Axios error parsing
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
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans antialiased">
      {/* Required for toast notifications to appear */}
      <Toaster position="top-right" />
      
      <Navbar />

      <main className="flex flex-1 pt-16 flex-col md:flex-row">
        
        {/* Left Section: Immersive Brand Visuals */}
        <section className="hidden md:flex md:w-1/2 relative bg-slate-900 items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?q=80&w=1500" 
            alt="Motherhood Journey" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#002e33]/80" />
          
          <div className="relative z-10 p-16 max-w-xl">
            <h1 className="text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-6">
              Safe <br/> 
              <span style={{ color: aquaText }}>Motherhood.</span>
            </h1>
            <p className="text-xl text-slate-100 font-medium leading-relaxed max-w-md opacity-90">
              Your intelligent partner for every milestone. Join 10,000+ mothers receiving 
              AI-driven health insights today.
            </p>
            <div className="mt-12 flex gap-4">
               <div className="h-1 w-20 bg-teal-400 rounded-full" style={{ backgroundColor: aquaText }}></div>
               <div className="h-1 w-8 bg-white/20 rounded-full"></div>
               <div className="h-1 w-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Right Section: Interactive Login Form */}
        <section className="flex-1 flex items-center justify-center p-6 lg:p-24 bg-white">
          <div className="w-full max-w-md">
            <header className="mb-12">
              <h2 className="text-4xl font-black tracking-tight mb-2" style={{ color: midnightTeal }}>
                Sign In
              </h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">
                Secure Access to MamaCare
              </p>
            </header>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-6 py-5 rounded-[22px] border-2 border-slate-50 bg-slate-50 text-slate-900 font-bold transition-all focus:bg-white focus:border-[#002e33] focus:ring-4 focus:ring-[#002e33]/5 outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot" className="text-xs font-bold text-slate-400 hover:text-[#002e33] transition-colors">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-5 rounded-[22px] border-2 border-slate-50 bg-slate-50 text-slate-900 font-bold transition-all focus:bg-white focus:border-[#002e33] focus:ring-4 focus:ring-[#002e33]/5 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-[22px] font-black text-lg tracking-wider uppercase shadow-2xl transition-all transform active:scale-[0.97] disabled:opacity-50 flex justify-center items-center gap-3"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Verifying...
                  </>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>
            </form>

            <footer className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                New to BabyCentre?
              </p>
              <Link 
                to="/register" 
                className="text-sm font-black uppercase tracking-tighter hover:scale-105 transition-transform"
                style={{ color: midnightTeal }}
              >
                Create Account
              </Link>
            </footer>
          </div>
        </section>

      </main>
    </div>
  );
};

export default LoginPage;