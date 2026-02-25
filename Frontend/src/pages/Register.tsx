import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authStart, authError, registerSuccess } from '../Features/Auth/AuthSlice';
import { authApi } from '../Features/Apis/authApi'; 
import Navbar from '../components/Navbar';

const kenyanCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa",
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
] as const;

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(4, "Password must be at least 4 characters").max(100),
  phone: z.string().min(5, "Invalid phone number").max(20),
  county: z.enum(kenyanCounties, { message: "Please select a valid Kenyan county" })
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: any) => state.auth);

  // Brand Colors
  const midnightTeal = "#002e33";
  const aqua = "#86d9e1";

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(authStart());
    try {
      await authApi.register({ ...data, userType: 'mother' });
      
      // FIX: Stops the spinner before navigating
      dispatch(registerSuccess());

      navigate('/verify-email-notice', { state: { email: data.email } });
      
    } catch (err: any) {
      const backendError = err.response?.data?.error || "";
      if (backendError.includes("users_phone_unique")) {
        setError("phone", { type: "manual", message: "Phone number already exists" });
        dispatch(authError("Phone number already registered."));
      } else if (backendError.includes("users_email_unique")) {
        setError("email", { type: "manual", message: "Email already registered" });
        dispatch(authError("This email is already in use."));
      } else {
        dispatch(authError(backendError || "Registration failed."));
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-20 font-sans">
      <div className="w-full max-w-2xl bg-white border-2 border-slate-100 p-10 rounded-[32px] shadow-xl shadow-teal-900/5">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight" style={{ color: midnightTeal }}>Join MamaCare</h2>
          <p className="text-gray-500 mt-2 font-medium text-lg">Your journey to safe motherhood starts here.</p>
        </header>

        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold animate-pulse">
            {typeof error === 'string' ? error : 'Registration failed. Check your details.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 block">First Name</label>
              <input {...register("firstName")} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 font-bold focus:border-[#86d9e1] focus:bg-white outline-none transition-all shadow-sm" placeholder="Jane" />
              {errors.firstName && <p className="text-red-500 text-xs mt-2 font-bold">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 block">Last Name</label>
              <input {...register("lastName")} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 font-bold focus:border-[#86d9e1] focus:bg-white outline-none transition-all shadow-sm" placeholder="Doe" />
              {errors.lastName && <p className="text-red-500 text-xs mt-2 font-bold">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 block">Email</label>
              <input type="email" {...register("email")} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 font-bold focus:border-[#86d9e1] focus:bg-white outline-none transition-all shadow-sm" placeholder="jane@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 block">Phone</label>
              <input {...register("phone")} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 font-bold focus:border-[#86d9e1] focus:bg-white outline-none transition-all shadow-sm" placeholder="0700000000" />
              {errors.phone && <p className="text-red-500 text-xs mt-2 font-bold">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 block">County</label>
              <select {...register("county")} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 font-bold focus:border-[#86d9e1] focus:bg-white outline-none transition-all shadow-sm appearance-none">
                <option value="">Select County</option>
                {kenyanCounties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.county && <p className="text-red-500 text-xs mt-2 font-bold">{errors.county.message}</p>}
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 block">Password</label>
              <input type="password" {...register("password")} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-slate-900 font-bold focus:border-[#86d9e1] focus:bg-white outline-none transition-all shadow-sm" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center mt-6"
            style={{ backgroundColor: midnightTeal, color: aqua }}
          >
            {isLoading ? "Generating account..." : "Register Now"}
          </button>
        </form>

        <footer className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-gray-500 font-medium">
            Already have an account? <Link to="/login" className="font-black hover:underline" style={{ color: midnightTeal }}>Log in</Link>
          </p>
        </footer>
      </div>
    </div>
    </>
  );
};