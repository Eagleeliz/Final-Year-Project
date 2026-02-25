import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import './App.css'
import Error from "./pages/Error";
import About from "./pages/About";
import HIWorks from "./pages/HIWorks";
import Contact from "./pages/Contact";
import { Register } from "./pages/Register";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";

// NEW IMPORTS
import UserLayout from "./Dashboards/Dashboardsdesign/UserLayout"; 
import DashboardHome from "./Dashboards/UserDashboard/DashboardHome";
// import ProfilePage from "./pages/dashboard/ProfilePage";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/howitworks" element={<HIWorks />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth Pages */}
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/complete-profile" element={<CompleteProfile/>} />

      {/* MATERNAL CARE DASHBOARD ROUTES */}
      {/* Note: You can wrap this in <ProtectedRoutes> once that component is ready */}
      <Route path="/dashboard" element={<UserLayout />}>
        {/* /dashboard */}
        < Route index element={<DashboardHome />} /> 
        
        {/* /dashboard/health-monitoring */}
        <Route path="health-monitoring" element={<div>Health Monitoring Page</div>} />
        
        {/* /dashboard/journey */}
        <Route path="journey" element={<div>Pregnancy Journey Page</div>} />
        
        {/* /dashboard/reminders */}
        <Route path="reminders" element={<div>Clinic Reminders Page</div>} />
        
        {/* /dashboard/child-development */}
        <Route path="child-development" element={<div>Child Development Page</div>} />
        
        {/* /dashboard/education */}
        <Route path="education" element={<div>Health Education Hub</div>} />
        
        {/* /dashboard/profile */}
        <Route path="profile" element={<div>Health Education Hub</div>} />
      </Route>

      {/* Catch-all Error Page */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;