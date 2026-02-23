import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css'
import Error from "./pages/Error";
import About from "./pages/About";
import HIWorks from "./pages/HIWorks";
import Contact from "./pages/Contact";
import { Register } from "./pages/Register";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/howitworks" element={<HIWorks />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth Pages */}
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;