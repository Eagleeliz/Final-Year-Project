import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../Features/Apis/authApi'; 
import { updateUserData, completeProfile, authStart, authError } from '../Features/Auth/AuthSlice';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

const CompleteProfile = () => {
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    subCounty: '',
    village: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: any) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      await authApi.completeProfile(formData);

      dispatch(updateUserData(formData));
      dispatch(completeProfile());

      toast.success("Profile Finalized!", {
        style: { 
          borderRadius: '16px', 
          background: midnightTeal, 
          color: aquaText, 
          fontWeight: 'bold' 
        },
      });

      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Failed to update profile.";
      dispatch(authError(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />

      <div className="flex flex-1 pt-16 flex-col md:flex-row">
        
        {/* Visual Brand Side */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden" style={{ backgroundColor: midnightTeal }}>
          <img 
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            alt="Onboarding"
          />
          <div className="relative z-10 text-white p-12 max-w-lg">
            <h1 className="text-6xl font-black mb-4 uppercase tracking-tighter" style={{ color: aquaText }}>
              Almost <br/> There.
            </h1>
            <p className="text-xl opacity-80 border-l-4 pl-4" style={{ borderColor: aquaText }}>
              Help us personalize your care, {user?.firstName}.
            </p>
          </div>
        </div>

        {/* Form Side - UPDATED FOR VISIBILITY */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-black mb-8" style={{ color: midnightTeal }}>Complete Your Profile</h2>
            
            <form onSubmit={handleFinish} className="space-y-6">
              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-slate-900 font-bold bg-white focus:border-[#002e33] focus:ring-4 focus:ring-[#002e33]/5 outline-none transition-all shadow-sm"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              {/* Sub-County */}
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">
                  Sub-County
                </label>
                <input
                  type="text"
                  name="subCounty"
                  required
                  placeholder="e.g. Westlands"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-slate-900 font-bold bg-white focus:border-[#002e33] focus:ring-4 focus:ring-[#002e33]/5 outline-none transition-all shadow-sm placeholder:text-gray-400"
                  value={formData.subCounty}
                  onChange={handleChange}
                />
              </div>

              {/* Village / Estate */}
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">
                  Village / Estate
                </label>
                <input
                  type="text"
                  name="village"
                  required
                  placeholder="e.g. Lavender Estate"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-slate-900 font-bold bg-white focus:border-[#002e33] focus:ring-4 focus:ring-[#002e33]/5 outline-none transition-all shadow-sm placeholder:text-gray-400"
                  value={formData.village}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wide shadow-xl active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Finish Onboarding'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;