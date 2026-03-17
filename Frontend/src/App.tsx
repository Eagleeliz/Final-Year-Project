import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import './App.css';
import Error from "./pages/Error";
import About from "./pages/About";
import HIWorks from "./pages/HIWorks";
import Contact from "./pages/Contact";
import { Register } from "./pages/Register";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";

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

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        {/* ── Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/howitworks" element={<HIWorks />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

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
          <Route path="health-tips" element={<ManageHealthTips />} />
          <Route path="guidance" element={<ManageGuidance />} />
          <Route path="facilities" element={<ManageFacilities />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* ── Catch-all */}
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;