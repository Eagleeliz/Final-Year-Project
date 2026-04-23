import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const midnightTeal = "#002e33";
const accentTeal = "#00a0b0";
const lightTeal = "#86d9e1";

const getTrimester = (week: number) => {
  if (week <= 13) return { label: "First Trimester", color: "#00a0b0", bg: "#e0f7f9" };
  if (week <= 27) return { label: "Second Trimester", color: "#0f6e56", bg: "#d6f0e6" };
  return { label: "Third Trimester", color: "#ba7517", bg: "#fff1d6" };
};

const DueDateCalculator = () => {
  const navigate = useNavigate();

  const [lmp, setLmp] = useState("");
  const [result, setResult] = useState<null | {
    dueDate: Date;
    weeksPregnant: number;
    daysExtra: number;
    trimester: ReturnType<typeof getTrimester>;
    daysLeft: number;
  }>(null);

  const calculate = () => {
    if (!lmp) return;
    const lmpDate = new Date(lmp);
    const due = new Date(lmpDate);
    due.setDate(due.getDate() + 280);

    const today = new Date();
    const diffMs = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const totalWeeks = Math.floor(diffDays / 7);
    const weeks = totalWeeks + 1;
    const days = diffDays - (totalWeeks * 7);

    const daysLeft = Math.max(0, Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    setResult({
      dueDate: due,
      weeksPregnant: weeks,
      daysExtra: days,
      trimester: getTrimester(weeks),
      daysLeft,
    });
  };

  const progressPercent = result ? Math.min(100, Math.round((result.weeksPregnant / 40) * 100)) : 0;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <Navbar />
      <div
        className="w-full min-h-screen"
        style={{ background: "linear-gradient(160deg, #f0fbfc 0%, #e8f8f9 60%, #f7fdfd 100%)" }}
      >

        {/* HEADER */}
        <div className="text-center px-6 pt-20 pb-10 max-w-[660px] mx-auto">
          <span
            className="inline-block text-[13px] font-bold tracking-[2px] uppercase px-5 py-2 rounded-full mb-5"
            style={{ background: "#e0f7f9", color: "#007a87" }}
          >
            Free Tool
          </span>
          <h1
            className="leading-tight mb-4"
            style={{ color: midnightTeal, fontFamily: "serif", fontSize: "clamp(36px, 5vw, 58px)" }}
          >
            When is your{" "}
            <em className="not-italic" style={{ color: accentTeal }}>baby due?</em>
          </h1>
          <p className="text-[19px] leading-relaxed" style={{ color: "#4a7a7e" }}>
            Enter the first day of your last menstrual period and we'll calculate your due date and current week.
          </p>
        </div>

        {/* CALCULATOR */}
        <div className="max-w-[620px] mx-auto px-6 pb-8">
          <div
            className="rounded-[24px] p-8 relative overflow-hidden"
            style={{ background: "#fff", border: "1.5px solid #c8eef1", boxShadow: "0 4px 24px rgba(0,46,51,0.07)" }}
          >
            <p className="text-[17px] font-semibold mb-2" style={{ color: midnightTeal }}>
              First day of your last period (LMP)
            </p>

            <input
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-5 py-4 rounded-[14px] text-[17px] outline-none mb-5"
              style={{
                border: `1.5px solid ${lmp ? accentTeal : "#c8eef1"}`,
                color: midnightTeal,
                background: "#f7fdfd",
              }}
            />

            <button
              onClick={calculate}
              disabled={!lmp}
              className="w-full py-5 rounded-[14px] text-[18px] font-bold flex items-center justify-center gap-3"
              style={{
                background: lmp
                  ? `linear-gradient(135deg, #00c6b8 0%, #00a0b0 50%, #007a87 100%)`
                  : "#e0f7f9",
                color: lmp ? "#fff" : "#9cc8cc",
              }}
            >
              Calculate My Due Date
            </button>
          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="max-w-[620px] mx-auto px-6 pb-20 flex flex-col gap-5">

            {/* Due date */}
            <div className="rounded-[24px] p-8 text-center" style={{ background: midnightTeal }}>
              <p className="text-[13px]" style={{ color: lightTeal }}>
                Your Estimated Due Date
              </p>
              <p className="text-[32px] font-bold" style={{ color: "#fff", fontFamily: "serif" }}>
                {formatDate(result.dueDate)}
              </p>
            </div>

            {/* Week + trimester */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-[18px] p-6 flex flex-col gap-1"
                style={{ background: "#fff", border: "1.5px solid #c8eef1" }}
              >
                <p className="text-[13px] font-bold tracking-[1px] uppercase" style={{ color: "#007a87" }}>
                  You Are
                </p>
                <p className="text-[38px] font-bold leading-none" style={{ color: midnightTeal, fontFamily: "serif" }}>
                  {result.weeksPregnant}
                  <span className="text-[18px] font-semibold ml-1">wks</span>
                </p>
                <p className="text-[15px]" style={{ color: "#5a8a8e" }}>
                  {result.daysExtra} day{result.daysExtra !== 1 ? "s" : ""} pregnant
                </p>
              </div>

              <div
                className="rounded-[18px] p-6 flex flex-col gap-1"
                style={{
                  background: result.trimester.bg,
                  border: `1.5px solid ${result.trimester.color}30`,
                }}
              >
                <p className="text-[13px] font-bold tracking-[1px] uppercase" style={{ color: result.trimester.color }}>
                  Trimester
                </p>
                <p className="text-[22px] font-bold leading-snug" style={{ color: midnightTeal, fontFamily: "serif" }}>
                  {result.trimester.label}
                </p>
                <p className="text-[15px]" style={{ color: "#5a8a8e" }}>
                  Week {result.weeksPregnant} of 40
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="rounded-[18px] p-6" style={{ background: "#fff", border: "1.5px solid #c8eef1" }}>
              <div className="flex justify-between items-center mb-3">
                <p className="text-[15px] font-semibold" style={{ color: midnightTeal }}>
                  Pregnancy Progress
                </p>
                <p className="text-[15px] font-bold" style={{ color: accentTeal }}>
                  {progressPercent}%
                </p>
              </div>

              <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: "#e0f7f9" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #00e5f5 0%, #00a0b0 60%, #005f6b 100%)",
                    boxShadow: "0 2px 8px rgba(0,160,176,0.4)",
                  }}
                />
              </div>

              <div className="flex justify-between mt-2">
                <p className="text-[12px]" style={{ color: "#5a8a8e" }}>Week 1</p>
                <p className="text-[12px]" style={{ color: "#5a8a8e" }}>Week 40</p>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-[20px] p7 text-center" style={{ background: midnightTeal }}>
              <p className="text-[20px] font-bold mb-2" style={{ color: "#fff" }}>
                Want personalized pregnancy support?
              </p>
              <p className="text-[15px] mb-5" style={{ color: "rgba(134,217,225,0.75)" }}>
                Track symptoms, get AI support, and receive alerts tailored to your journey.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 rounded-[12px] text-[17px] font-bold"
                style={{ background: accentTeal, color: "#fff" }}
              >
                Get Started — It's Free
              </button>
            </div>

          </div>
        )}

      </div>
    </>
  );
};

export default DueDateCalculator;