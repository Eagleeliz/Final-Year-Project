import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authApi } from "../../Features/Apis/authApi";
import { updateUserData, authStart, authError } from "../../Features/Auth/AuthSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  county: string;
  dateOfBirth?: string;
  subCounty?: string;
  village?: string;
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
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: any) => state.auth);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const profile = await authApi.getProfile();
        reset(profile); // populate form
      } catch (err: any) {
        const errMsg = err.response?.data?.error || "Failed to load profile.";
        toast.error(errMsg);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    dispatch(authStart());
    try {
      const payload = {
        dateOfBirth: data.dateOfBirth || "",
        subCounty: data.subCounty || "",
        village: data.village || "",
      };

      const updated = await authApi.completeProfile(payload);
      dispatch(updateUserData(updated));
      toast.success("Profile updated successfully!", { duration: 4000 });
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Failed to update profile.";
      dispatch(authError(errMsg));
      toast.error(errMsg);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-bold">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-black mb-8 text-[#002e33]">My Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">First Name</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Last Name</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
              disabled
            />
            <p className="text-gray-400 text-xs mt-1">Email cannot be changed.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Phone</label>
            <input
              {...register("phone", { required: "Phone is required" })}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* County */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">County</label>
            <select
              {...register("county", { required: "Select a county" })}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
            >
              <option value="">Select County</option>
              {kenyanCounties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county.message}</p>}
          </div>

          {/* Optional Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Date of Birth</label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Sub-County</label>
              <input
                {...register("subCounty")}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Village / Estate</label>
              <input
                {...register("village")}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-[#002e33] focus:ring-[#002e33]/20 outline-none shadow-sm text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 mt-6 rounded-2xl font-black text-lg uppercase tracking-wide shadow-xl bg-[#002e33] text-[#86d9e1] transition-all disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;