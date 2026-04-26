import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./Features/store";
import type { ReactNode } from "react";
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
import HealthMonitoring from "./Dashboards/UserDashboard/HealthMonitoring";
import RemindersPage from "./Dashboards/UserDashboard/RemindersPage";
import MyProfile from "./Dashboards/UserDashboard/MyProfile";
import PregnancyJourney from "./Dashboards/UserDashboard/PreganancyJourney";
import BabyCentreAI from "./Dashboards/UserDashboard/babyCentreAI";
import EmergencyPage from "./Dashboards/UserDashboard/EmergencyPage";
import ChildDevelopment from "./Dashboards/UserDashboard/childDevelopment";

// ── Admin Dashboard
import AdminLayout from "./Dashboards/Dashboardsdesign/AdminLayout";
import AdminHome from "./Dashboards/AdminDashboard/AdminHome";
import AllUsers from "./Dashboards/AdminDashboard/AllUsers";
import AllPregnancies from "./Dashboards/AdminDashboard/AllPregnancies";
import EmergencyAlerts from "./Dashboards/AdminDashboard/EmergencyAlerts";
import HealthCheckins from "./Dashboards/AdminDashboard/HealthCheckins";
import ManageGuidance from "./Dashboards/AdminDashboard/ManageGuidance";
import ManageFacilities from "./Dashboards/AdminDashboard/ManageFacilities";

// ── Policy Maker Dashboard
import PolicyMakerLayout from "./Dashboards/Dashboardsdesign/PolicyMakerLayout";
import PolicyMakerHome from "./Dashboards/PolicyMakerDashboard/PolicyMakerHome";
import PolicyMakerNationalSummary from "./Dashboards/PolicyMakerDashboard/PolicyMakerNationalSummary";
import PolicyMakerRiskTrends from "./Dashboards/PolicyMakerDashboard/PolicyMakerRiskTrends";

import DueDateCalculator from "./pages/DueDateCalculator";
import { EnterOtp } from "./pages/EnterOtp";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "./Features/Auth/AuthSlice";
import { jwtDecode } from "jwt-decode";

// ── Protected Route Component
interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  // Not logged in → go to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but wrong role → go to their own dashboard
  if (!allowedRoles.includes(user?.userType ?? "")) {
    const redirectMap: Record<string, string> = {
      admin:         "/admin",
      policy_maker:  "/policymaker",
      mother:        "/dashboard/journey",
      health_worker: "/dashboard/journey",
    };
    const fallback = redirectMap[user?.userType ?? ""] ?? "/";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

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
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* ── User Dashboard — mothers & health workers only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["mother", "health_worker"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="journey" replace />} />
          <Route path="health-monitoring" element={<HealthMonitoring />} />
          <Route path="journey" element={<PregnancyJourney />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="child-dev" element={<ChildDevelopment />} />
          <Route path="babycentre-ai" element={<BabyCentreAI />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="profile" element={<MyProfile />} />
        </Route>

        {/* ── Admin Dashboard — admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="pregnancies" element={<AllPregnancies />} />
          <Route path="emergencies" element={<EmergencyAlerts />} />
          <Route path="checkins" element={<HealthCheckins />} />
          <Route path="guidance" element={<ManageGuidance />} />
          <Route path="facilities" element={<ManageFacilities />} />
        </Route>

        {/* ── Policy Maker Dashboard — policy_maker only */}
        <Route
          path="/policymaker"
          element={
            <ProtectedRoute allowedRoles={["policy_maker"]}>
              <PolicyMakerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PolicyMakerHome />} />
          <Route path="national-summary" element={<PolicyMakerNationalSummary />} />
          <Route path="risk-trends" element={<PolicyMakerRiskTrends />} />
        </Route>

        {/* ── Catch-all */}
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;