import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authApi } from "../../Features/Apis/authApi";
import { updateUserData, authStart, authError } from "../../Features/Auth/AuthSlice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Camera, User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff } from "lucide-react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  county: string;
  dateOfBirth?: string;
  constituency?: string;
  ward?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const kenyanCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa",
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

const MyProfile: React.FC = () => {
  const midnightTeal = "#0B3B3F";
  const aquaText = "#7FD1E0";
  const aquaLight = "#E6F7F9";

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: any) => state.auth);
  const userId = Number(localStorage.getItem("userId"));

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const hasFetched = useRef(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm<PasswordFormData>();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const profile = await authApi.getProfile();
        reset(profile);
        if (profile.profileImage) setProfileImage(profile.profileImage);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const result = await authApi.uploadProfileImage(userId, file);
      setProfileImage(result.profileImage);
      dispatch(updateUserData({ profileImage: result.profileImage }));
      toast.success("Profile photo updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    dispatch(authStart());
    try {
      const updated = await authApi.completeProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        county: data.county,
        dateOfBirth: data.dateOfBirth || "",
        constituency: data.constituency || "",
        ward: data.ward || "",
      });
      dispatch(updateUserData(updated));
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      dispatch(authError(err.response?.data?.error || "Failed to update profile."));
      toast.error(err.response?.data?.error || "Failed to update profile.");
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (data.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.changePassword({
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      resetPwd();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to change password.";
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const inp = (err?: boolean) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm text-gray-900 font-medium outline-none transition-all focus:ring-2 focus:ring-[#7FD1E0] focus:border-[#0B3B3F] ${
      err ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
    }`;

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin mx-auto mb-3"
            style={{ borderColor: aquaLight, borderTopColor: midnightTeal }}
          />
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>

        {/* ── AVATAR CARD ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center ring-4 ring-[#E6F7F9]"
              style={{ backgroundColor: midnightTeal }}
            >
              {profileImage
                ? <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-white">{initials || <User size={28} />}</span>
              }
            </div>
            <label
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ring-2 ring-white"
              style={{ backgroundColor: midnightTeal }}
            >
              {imageUploading
                ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <Camera size={13} className="text-white" />
              }
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-500">{user?.phone}</p>
            <span
              className="mt-1.5 inline-block px-3 py-0.5 rounded-full text-xs font-bold capitalize"
              style={{ backgroundColor: aquaLight, color: midnightTeal }}
            >
              {user?.userType?.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* ── PROFILE FIELDS CARD ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">First Name</label>
                <input {...register("firstName", { required: "Required" })} className={inp(!!errors.firstName)} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Last Name</label>
                <input {...register("lastName", { required: "Required" })} className={inp(!!errors.lastName)} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Mail size={11} /> Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  disabled
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-400 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Calendar size={11} /> Date of Birth
                </label>
                <input {...register("dateOfBirth")} type="date" className={inp()} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Phone size={11} /> Phone Number
                </label>
                <input {...register("phone", { required: "Required" })} className={inp(!!errors.phone)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                  <MapPin size={11} /> County
                </label>
                <select {...register("county", { required: "Required" })} className={inp(!!errors.county)}>
                  <option value="">Select County</option>
                  {kenyanCounties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Constituency</label>
                <input {...register("constituency")} className={inp()} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Ward</label>
                <input {...register("ward")} className={inp()} />
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                {isLoading ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>

        {/* ── CHANGE PASSWORD CARD ── */}
        <form onSubmit={handlePwd(onChangePassword)}>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Shield size={16} style={{ color: midnightTeal }} />
              <h2 className="font-bold text-sm" style={{ color: midnightTeal }}>Change Password</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "currentPassword" as const, label: "Current Password", key: "current" as const },
                { name: "newPassword"     as const, label: "New Password",     key: "new"     as const },
                { name: "confirmPassword" as const, label: "Confirm Password", key: "confirm" as const },
              ].map(({ name, label, key }) => (
                <div key={name}>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      {...regPwd(name, {
                        required: "Required",
                        ...(name === "newPassword" ? { minLength: { value: 6, message: "Min 6 characters" } } : {})
                      })}
                      type={showPwd[key] ? "text" : "password"}
                      placeholder="••••••••"
                      className={inp(!!pwdErrors[name]) + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0B3B3F]"
                    >
                      {showPwd[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdErrors[name] && <p className="text-red-500 text-xs mt-1">{pwdErrors[name]?.message}</p>}
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default MyProfile;