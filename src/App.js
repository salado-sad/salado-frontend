import React, { useState } from "react";
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

function App() {
  const [page, setPage] = useState("landing");

  return (
    <div>
      {page === "landing" && (
        <LandingPage 
          onSwitchToLogin={() => setPage("login")}
          onSwitchToSupplierLogin={() => setPage("supplier-login")}
          onSwitchToAdminLogin={() => setPage("admin-login")}
          onExploreSalads={() => setPage("explore-salads")}
        />
      )}
      {page === "explore-salads" && (
        <ExploreSalads
          onBackToLanding={() => setPage("landing")}
        />
      )}
      {page === "login" && (
        <Login
          onSwitch={() => setPage("signup")}
          onBackToLanding={() => setPage("landing")}
          onForgotPassword={() => setPage("forget-password")} // Navigate to Forget Password Page
          onLoginSuccess={() => setPage("profile")}
        />
      )}
      {page === "signup" && (
        <Signup
          onSwitch={() => setPage("login")}
          onBackToLanding={() => setPage("landing")}
        />
      )}
      {page === "supplier-login" && (
        <LoginSupplier
          onSwitch={() => setPage("supplier-signup")}
          onBackToLanding={() => setPage("landing")}
          onForgotPassword={() => setPage("forget-password")}
          onLoginSuccess={() => setPage("supplier-profile")}
        />
      )}
      {page === "supplier-signup" && (
        <SignupSupplier
          onSwitch={() => setPage("supplier-login")}
          onBackToLanding={() => setPage("landing")}
        />
      )}
      {page === "forget-password" && (
        <ForgetPassword onBackToLogin={() => setPage("login")} />
      )}
      {page === "profile" && (
        <Profile onLogout={() => setPage("landing")} />
      )}
      {page === "supplier-profile" && (
        <ProfileSupplier onLogout={() => setPage("landing")} />
      )}
      {page === "admin-login" && (
        <AdminLogin
          onLoginSuccess={() => setPage("admin-panel")} // Admin login success leads to AdminPanel
          onBackToLanding={() => setPage("landing")}
        />
      )}
      {page === "admin-panel" && (
        <AdminPanel onLogout={() => setPage("landing")} />
      )}
    </div>
  );
}

export default App;