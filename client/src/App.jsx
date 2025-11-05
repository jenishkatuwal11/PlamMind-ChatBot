import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Homepage from "./pages/Home/Homepage";
import LandingPage from "./pages/LandingPage/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
