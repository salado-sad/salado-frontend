import React, { useState } from "react";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import SignupSupplier from "./pages/Signup/SignupSupplier";
import LoginSupplier from "./pages/Login/LoginSupplier";
import LandingPage from "./pages/Landing/Landing";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <div>
      {page === "landing" && (
        <LandingPage 
          onSwitchToLogin={() => setPage("login")}
          onSwitchToSupplierLogin={() => setPage("supplier-login")} 
        />
      )}
      {page === "login" && (
        <Login
          onSwitch={() => setPage("signup")}
          onBackToLanding={() => setPage("landing")}
          onForgotPassword={() => setPage("forget-password")} // Navigate to Forget Password Page
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
    </div>
  );
}

export default App;