import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pregnancyApi } from '../../Features/Apis/PregnancyAPI';
import toast, { Toaster } from 'react-hot-toast';

const DashboardHome = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(true);
  const [pregnancyData, setPregnancyData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [lmpDate, setLmpDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const fetchPregnancy = async () => {
    try {
      const response = await pregnancyApi.getActive(user.id);
      if (response.hasActivePregnancy) {
        setPregnancyData(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPregnancy();
  }, [user?.id]);

  const handleStartJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await pregnancyApi.create({ userId: user.id, lmpDate });
      toast.success("Journey Started! ✨", { 
        style: { background: midnightTeal, color: aquaText } 
      });
      setShowModal(false);
      fetchPregnancy(); // Refresh dashboard data
    } catch (error: any) {
      toast.error("Failed to start journey");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-black" style={{ color: midnightTeal }}>Loading...</div>;

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen relative font-sans">
      <Toaster position="top-center" />

      {pregnancyData ? (
        /* ================= ACTIVE STATE ================= */
        <div className="max-w-6xl mx-auto space-y-8">
           <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: midnightTeal }}>
                Your Progress
           </h1>
           {/* ... (Keep your previous Progress Card and Baby Size Card code here) ... */}
           <div className="p-8 bg-white rounded-3xl border-2" style={{ borderColor: midnightTeal + '10' }}>
              <p style={{ color: midnightTeal }} className="font-bold">Week {pregnancyData.liveWeeks} Summary</p>
           </div>
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="flex flex-col items-center justify-center py-20 min-h-[70vh]">
          <div className="max-w-md w-full p-12 rounded-[4rem] text-center shadow-2xl bg-white border-2" 
               style={{ borderColor: midnightTeal + '10' }}>
            <div className="text-8xl mb-8">🤰</div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter" style={{ color: midnightTeal }}>No Active Journey</h2>
            <p className="text-gray-500 font-medium mb-10">Start your personalized tracking today.</p>
            <button 
              className="w-full py-6 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              style={{ backgroundColor: midnightTeal, color: aquaText }}
              onClick={() => setShowModal(true)}
            >
              Start New Journey
            </button>
          </div>
        </div>
      )}

      {/* ================= SETUP MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center text-white" style={{ backgroundColor: midnightTeal }}>
              <h3 className="text-3xl font-black uppercase tracking-tighter" style={{ color: aquaText }}>Begin Journey</h3>
              <p className="text-xs opacity-70 mt-2 font-bold tracking-widest uppercase">Last Menstrual Period</p>
            </div>
            
            <form onSubmit={handleStartJourney} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Date</label>
                <input 
                  type="date" 
                  required
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 font-bold text-slate-800 outline-none focus:border-[#86d9e1]"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                {submitting ? "Calculating..." : "Confirm & Start"}
              </button>

              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="w-full text-xs font-black text-gray-400 uppercase tracking-widest"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;