import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import SignupSupplier from "./pages/Signup/SignupSupplier";
import LoginSupplier from "./pages/Login/LoginSupplier";
import LandingPage from "./pages/Landing/Landing";
import ExploreSalads from "./pages/ExploreSalads/ExploreSalads";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import Profile from "./pages/Profile/Profile";
import ProfileSupplier from "./pages/Profile/ProfileSupplier";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminPanel from "./pages/Admin/AdminPanel";

/**
 * App component is the root component of the application.
 * It handles routing and user authentication state.
 */
function App() {
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  // Update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage user={user} />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)} />} />
        
        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Supplier Login Page */}
        <Route path="/supplier-login" element={<LoginSupplier onLoginSuccess={(u) => setUser(u)} />} />
        
        {/* Supplier Signup Page */}
        <Route path="/supplier-signup" element={<SignupSupplier />} />
        
        {/* Forget Password Page */}
        <Route path="/forget-password" element={<ForgetPassword />} />
        
        {/* Explore Salads Page */}
        <Route path="/explore-salads" element={<ExploreSalads />} />
        
        {/* Profile Page */}
        <Route path="/profile" element={user ? <Profile onLogout={() => setUser(null)} /> : <Navigate to="/login" />} />
        
        {/* Supplier Profile Page */}
        <Route path="/supplier-profile" element={user ? <ProfileSupplier onLogout={() => setUser(null)} /> : <Navigate to="/supplier-login" />} />
        
        {/* Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin onLoginSuccess={(u) => setUser(u)} />} />
        
        {/* Admin Panel Page */}
        <Route path="/admin-panel" element={user === "admin" ? <AdminPanel onLogout={() => setUser(null)} /> : <Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  );
}

export default App;