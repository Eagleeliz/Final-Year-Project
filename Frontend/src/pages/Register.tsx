import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authStart, authError, registerSuccess } from '../Features/Auth/AuthSlice';
import { authApi } from '../Features/Apis/authApi';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

const midnightTeal = "#002e33";
const aquaText = "#86d9e1";

const API_KEY = "keyPub1569gsvndc123kg9sjhg";
const BASE_URL = "https://kenyaareadata.vercel.app/api/areas";

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
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(4, "Password must be at least 4 characters").max(100),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  phone: z.string().min(5, "Invalid phone").max(20),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  county: z.enum(kenyanCounties, { message: "Select a valid county" }),
  constituency: z.string().min(1, "Select constituency"),
  ward: z.string().min(1, "Select ward"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const inputClass = `
  w-full rounded-2xl p-4 border-2 border-gray-300
  focus:border-gray-800 focus:ring-2 focus:ring-gray-300/50
  outline-none shadow-sm bg-white text-gray-800
  placeholder:text-gray-400 transition-all
`;

const labelClass = "text-sm uppercase font-bold text-black mb-2 block tracking-widest";

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: midnightTeal }} />
    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: midnightTeal }}>
      {children}
    </span>
    <div className="flex-1 h-px" style={{ background: "rgba(0,46,51,0.2)" }} />
  </div>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-xs mt-1 font-bold">{message}</p> : null;

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: any) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [constituencies, setConstituencies] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const selectedCounty = watch('county');
  const selectedConstituency = watch('constituency');

  useEffect(() => {
    if (!selectedCounty) { setConstituencies([]); setWards([]); return; }
    setConstituencies([]);
    setWards([]);
    setApiError("");
    setLoadingConstituencies(true);
    fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(selectedCounty)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setConstituencies(Object.keys(data[selectedCounty] || {})))
      .catch(() => setApiError("Could not load constituencies. Please try again."))
      .finally(() => setLoadingConstituencies(false));
  }, [selectedCounty]);

  useEffect(() => {
    if (!selectedConstituency || !selectedCounty) { setWards([]); return; }
    setWards([]);
    setApiError("");
    setLoadingWards(true);
    fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(selectedCounty)}&constituency=${encodeURIComponent(selectedConstituency)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setWards(data[selectedCounty]?.[selectedConstituency] || []))
      .catch(() => setApiError("Could not load wards. Please try again."))
      .finally(() => setLoadingWards(false));
  }, [selectedConstituency]);

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(authStart());
    try {
      const { confirmPassword, ...submitData } = data;
      await authApi.register({ ...submitData, userType: 'mother' });
      dispatch(registerSuccess());
      toast.success("Registration Successful!", {
        style: { borderRadius: '16px', background: midnightTeal, color: aquaText, fontWeight: 'bold' }
      });
      navigate('/enter-otp', { state: { email: data.email } });
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
      <Navbar />
      <Toaster position="top-right" />

      <div className="min-h-screen flex flex-col md:flex-row">

        {/* ── Left panel ── */}
        <div
  className="hidden md:flex md:w-1/2 items-start justify-center relative overflow-hidden pt-28"
  style={{ backgroundColor: midnightTeal }}
>
  <img
    src="https://imgs.search.brave.com/RhJ5MzGgZD89Wyqkw3yltYQQ7CFaPlgJforCdqDRe9E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE2/NjI3NzE4Ny9waG90/by9jbG9zZS11cC1t/aWRzZWN0aW9uLW9m/LXByZWduYW50LXdv/bWFuLWhvbGRpbmct/aGVyLWJlbGx5LXBy/ZWduYW5jeS1hbmQt/d2VsbGJlaW5nLWNv/bmNlcHRzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1jRFhU/SERMVE5jYVJZTzFU/OFZEWjNNeEswSkVH/TWdXSHZ0b0NVaUdE/Z0RvPQ"
    className="absolute inset-0 w-full h-full object-cover opacity-30"
    alt="Mothercare"
  />

  {/* Overlay */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(135deg, rgba(0,46,51,0.7) 0%, rgba(0,61,69,0.4) 100%)",
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
    <h1
      className="text-5xl font-black mb-4 leading-tight"
      style={{ color: "#fff" }}
    >
      Every mother deserves{" "}
      <span style={{ color: aquaText }}>safe care</span>
    </h1>


    {/* Description */}
   {/* Description */}
    <p
      className="text-lg opacity-80 border-l-4 pl-4 leading-relaxed"
      style={{ borderColor: aquaText }}
    >
      Join a platform built to support, inform, and empower you through every
      stage of motherhood.
    </p>
  

  </div>
</div>

        {/* ── Right form ── */}
        <div
          className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto"
          style={{
            background: "linear-gradient(160deg, #e8f9fb 0%, #f0fdfe 25%, #f7fffe 55%, #e4f8fa 80%, #edfbfc 100%)",
          }}
        >
          <div className="w-full max-w-2xl">

            {/* Mobile brand */}
            <div className="md:hidden text-center mb-8">
              <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>
                Baby<span style={{ color: aquaText }}>Centre</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">Safe motherhood starts here</p>
            </div>

            <div
              className="border border-[#86d9e1]/20 p-8 md:p-10 rounded-[32px] shadow-xl shadow-teal-900/10"
              style={{ background: "linear-gradient(160deg, #ffffff 0%, #f5fdfe 60%, #edfbfc 100%)" }}
            >
              <h2 className="text-3xl font-black mb-1" style={{ color: midnightTeal }}>
                Create your account
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Already have an account?{" "}
                <Link to="/login" className="font-black hover:underline" style={{ color: midnightTeal }}>
                  Log in
                </Link>
              </p>

              {/* Auth error banner */}
              {error && (
                <div className="bg-red-50 border-2 border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold">
                  {typeof error === 'string' ? error : 'Registration failed. Check your details.'}
                </div>
              )}

              {/* API error banner */}
              {apiError && (
                <div className="bg-orange-50 border-2 border-orange-100 text-orange-600 p-4 rounded-2xl mb-6 text-sm font-bold">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Personal Info */}
                <div>
                  <SectionLabel>Personal Information</SectionLabel>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          First Name <span style={{ color: midnightTeal }}>*</span>
                        </label>
                        <input {...register("firstName")} className={inputClass} placeholder="enter first name" />
                        <FieldError message={errors.firstName?.message} />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Last Name <span style={{ color: midnightTeal }}>*</span>
                        </label>
                        <input {...register("lastName")} className={inputClass} placeholder="enter last name" />
                        <FieldError message={errors.lastName?.message} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          Email <span style={{ color: midnightTeal }}>*</span>
                        </label>
                        <input type="email" {...register("email")} className={inputClass} placeholder="e.g jane@example.com" />
                        <FieldError message={errors.email?.message} />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Phone <span style={{ color: midnightTeal }}>*</span>
                        </label>
                        <input {...register("phone")} className={inputClass} placeholder="eg 0700000000" />
                        <FieldError message={errors.phone?.message} />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Date of Birth <span style={{ color: midnightTeal }}>*</span>
                      </label>
                      <input type="date" {...register("dateOfBirth")} className={inputClass} />
                      <FieldError message={errors.dateOfBirth?.message} />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <SectionLabel>Location</SectionLabel>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        County <span style={{ color: midnightTeal }}>*</span>
                      </label>
                      <select {...register("county")} className={inputClass}>
                        <option value="">Select County</option>
                        {kenyanCounties.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <FieldError message={errors.county?.message} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          Constituency <span style={{ color: midnightTeal }}>*</span>
                          {loadingConstituencies && (
                            <span className="ml-2 inline-block w-3 h-3 rounded-full border-2 border-gray-800 border-t-transparent animate-spin" />
                          )}
                        </label>
                        <select
                          {...register("constituency")}
                          className={inputClass}
                          disabled={!selectedCounty || loadingConstituencies}
                          style={{
                            opacity: (!selectedCounty || loadingConstituencies) ? 0.5 : 1,
                            cursor: (!selectedCounty || loadingConstituencies) ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="">
                            {loadingConstituencies ? "Loading..." : !selectedCounty ? "Select county first" : "Select Constituency"}
                          </option>
                          {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <FieldError message={errors.constituency?.message} />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Ward <span style={{ color: midnightTeal }}>*</span>
                          {loadingWards && (
                            <span className="ml-2 inline-block w-3 h-3 rounded-full border-2 border-gray-800 border-t-transparent animate-spin" />
                          )}
                        </label>
                        <select
                          {...register("ward")}
                          className={inputClass}
                          disabled={!selectedConstituency || loadingWards}
                          style={{
                            opacity: (!selectedConstituency || loadingWards) ? 0.5 : 1,
                            cursor: (!selectedConstituency || loadingWards) ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="">
                            {loadingWards ? "Loading..." : !selectedConstituency ? "Select constituency first" : "Select Ward"}
                          </option>
                          {wards.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                        <FieldError message={errors.ward?.message} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <SectionLabel>Security</SectionLabel>
                  <div className="space-y-4">
<div>
  <label className={labelClass}>Password <span style={{ color: midnightTeal }}>*</span></label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      {...register("password")}
      className={inputClass}
      style={{ paddingRight: "3rem" }}
      placeholder="••••••••"
    />
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className="absolute right-4 top-1/2 -translate-y-1/2 p-0 transition-colors"
      style={{ background: "transparent", border: "none", color: showPassword ? midnightTeal : "#9ca3af" }}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  <FieldError message={errors.password?.message} />
</div>

<div>
  <label className={labelClass}>Confirm Password <span style={{ color: midnightTeal }}>*</span></label>
  <div className="relative">
    <input
      type={showConfirm ? "text" : "password"}
      {...register("confirmPassword")}
      className={inputClass}
      style={{ paddingRight: "3rem" }}
      placeholder="••••••••"
    />
    <button
      type="button"
      onClick={() => setShowConfirm(v => !v)}
      className="absolute right-4 top-1/2 -translate-y-1/2 p-0 transition-colors"
      style={{ background: "transparent", border: "none", color: showConfirm ? midnightTeal : "#9ca3af" }}
    >
      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  <FieldError message={errors.confirmPassword?.message} />
</div>
                  </div>
                </div>

                {/* Required note */}
                <p className="text-sm text-gray-600">
                  <span style={{ color: midnightTeal }}>*</span> indicates a required field
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl font-bold text-lg uppercase tracking-wide shadow-xl flex justify-center items-center active:scale-95 transition-all disabled:opacity-50"
                  style={{ backgroundColor: midnightTeal, color: "white" }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Creating account...
                    </span>
                  ) : "Register Now"}
                </button>

              </form>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              By registering, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-gray-600">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
};