import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authStart, authError } from '../Features/Auth/AuthSlice';
import { authApi } from '../Features/Apis/authApi'; // Import our new API handler

// 1. Counties from your backend validator
const kenyanCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa",
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
] as const;

// 2. Schema strictly following your createUserValidator
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(4, "Password must be at least 4 characters").max(100),
  phone: z.string().min(5, "Invalid phone number").max(20),
  county: z.enum(kenyanCounties, {
    message: "Please select a valid Kenyan county",
  })
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get loading/error state from Redux
  const { isLoading, error } = useSelector((state: any) => state.auth);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(authStart());
    try {
      // Use the new authApi method
      await authApi.register({
        ...data,
        userType: 'mother' // Public registration defaults to mother
      });

      // Navigate to success notice
      navigate('/verify-email-notice', { state: { email: data.email } });
      
    } catch (err: any) {
      const backendError = err.response?.data?.error || "";

      // Smart handling for duplicate phone numbers
      if (backendError.includes("users_phone_unique")) {
        setError("phone", { 
          type: "manual", 
          message: "Phone number already exists" 
        });
        dispatch(authError("A user with this phone number is already registered."));
      } 
      // Smart handling for duplicate emails
      else if (backendError.includes("users_email_unique")) {
        setError("email", { 
          type: "manual", 
          message: "Email already registered" 
        });
        dispatch(authError("This email is already in use."));
      } 
      else {
        dispatch(authError(backendError || "Registration failed. Please try again."));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090d] p-4 font-sans">
      <div className="w-full max-w-2xl bg-[#0b0e14] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <header className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight">BabyCentre Care</h2>
          <p className="text-slate-400 mt-3">Create your account to start tracking your maternal health.</p>
        </header>

        {/* Global Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm animate-pulse">
            {typeof error === 'string' ? error : 'Something went wrong. Please check your details.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 block">First Name</label>
              <input 
                {...register("firstName")} 
                className={`w-full bg-[#161b22] border ${errors.firstName ? 'border-red-500' : 'border-white/5'} rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all`} 
                placeholder="Jane"
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-2">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 block">Last Name</label>
              <input 
                {...register("lastName")} 
                className={`w-full bg-[#161b22] border ${errors.lastName ? 'border-red-500' : 'border-white/5'} rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all`} 
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-2">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 block">Email Address</label>
              <input 
                type="email" 
                {...register("email")} 
                className={`w-full bg-[#161b22] border ${errors.email ? 'border-red-500' : 'border-white/5'} rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all`} 
                placeholder="name@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-2 font-bold italic">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 block">Phone Number</label>
              <input 
                {...register("phone")} 
                className={`w-full bg-[#161b22] border ${errors.phone ? 'border-red-500 bg-red-500/5' : 'border-white/5'} rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all`} 
                placeholder="0712345678"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-2 font-bold italic">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* County Select */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 block">County</label>
              <div className="relative">
                <select 
                  {...register("county")} 
                  className={`w-full bg-[#161b22] border ${errors.county ? 'border-red-500' : 'border-white/5'} rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none`}
                >
                  <option value="">Choose your county</option>
                  {kenyanCounties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.county && <p className="text-red-400 text-xs mt-2">{errors.county.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2 block">Password</label>
              <input 
                type="password" 
                {...register("password")} 
                className={`w-full bg-[#161b22] border ${errors.password ? 'border-red-500' : 'border-white/5'} rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all`} 
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-600/20 mt-4"
          >
            {isLoading ? "Generating your account..." : "Register Now"}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};