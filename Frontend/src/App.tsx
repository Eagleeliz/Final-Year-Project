import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import './App.css';
import Error from "./pages/Error";
import About from "./pages/About";
import HIWorks from "./pages/HIWorks";
import Contact from "./pages/Contact";
import { Register } from "./pages/Register";

import Login from "./pages/Login";


// ── User Dashboard
import UserLayout from "./Dashboards/Dashboardsdesign/UserLayout";
import DashboardHome from "./Dashboards/UserDashboard/DashboardHome";
import HealthMonitoring from "./Dashboards/UserDashboard/HealthMonitoring";
import RemindersPage from "./Dashboards/UserDashboard/RemindersPage";
import MyProfile from "./Dashboards/UserDashboard/MyProfile";
import PregnancyJourney from "./Dashboards/UserDashboard/PreganancyJourney";
import BabyCentreAI from "./Dashboards/UserDashboard/babyCentreAI";
import EmergencyPage from "./Dashboards/UserDashboard/EmergencyPage";

// ── Admin Dashboard
import AdminLayout from "./Dashboards/Dashboardsdesign/AdminLayout";
import AdminHome from "./Dashboards/AdminDashboard/AdminHome";
import AllUsers from "./Dashboards/AdminDashboard/AllUsers";
import AllPregnancies from "./Dashboards/AdminDashboard/AllPregnancies";
import EmergencyAlerts from "./Dashboards/AdminDashboard/EmergencyAlerts";
import HealthCheckins from "./Dashboards/AdminDashboard/HealthCheckins";
import ManageHealthTips from "./Dashboards/AdminDashboard/ManageHealthTips";
import ManageGuidance from "./Dashboards/AdminDashboard/ManageGuidance";
import ManageFacilities from "./Dashboards/AdminDashboard/ManageFacilities";
import Analytics from "./Dashboards/AdminDashboard/Analytics";
import DueDateCalculator from "./pages/DueDateCalculator";
import { EnterOtp } from "./pages/EnterOtp";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "./Features/Auth/AuthSlice";
import { jwtDecode } from "jwt-decode";

function App() {
   const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const msUntilExpiry = exp * 1000 - Date.now();

      if (msUntilExpiry <= 0) {
        localStorage.clear();
        dispatch(logout());
        window.location.href = "/login";
        return;
      }

      const timer = setTimeout(() => {
        localStorage.clear();
        dispatch(logout());
        window.location.href = "/login";
      }, msUntilExpiry);

      return () => clearTimeout(timer);
    } catch {
      localStorage.clear();
      dispatch(logout());
    }
  }, [dispatch]);
  return (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        {/* ── Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/howitworks" element={<HIWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/duedatecalculator" element={<DueDateCalculator />} />

        {/* ── Auth Pages */}
        <Route path="/register" element={<Register />} />
  
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword/>} />


        {/* ── User Dashboard */}
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="health-monitoring" element={<HealthMonitoring />} />
          <Route path="journey" element={<PregnancyJourney />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="child-dev" element={<div>Child Development Page</div>} />
          <Route path="babycentre-ai" element={<BabyCentreAI />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="profile" element={<MyProfile />} />
        </Route>

        {/* ── Admin Dashboard */}
        {/* Login redirects here for admin + policy_maker — see LoginPage.tsx */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="pregnancies" element={<AllPregnancies />} />
          <Route path="emergencies" element={<EmergencyAlerts />} />
          <Route path="checkins" element={<HealthCheckins />} />
         
          <Route path="guidance" element={<ManageGuidance />} />
          <Route path="facilities" element={<ManageFacilities />} />
        
        </Route>

        {/* ── Catch-all */}
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;



