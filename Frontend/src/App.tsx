import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css'
import Error from "./pages/Error";
import About from "./pages/About";
import HIWorks from "./pages/HIWorks";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
          <Route path="/howitworks" element={<HIWorks />} />
          <Route path="/contact" element={<Contact />} />
       <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;