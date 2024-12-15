import React, { useState } from "react";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/Landing/Landing";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <div>
      {page === "landing" && (
        <LandingPage onSwitchToLogin={() => setPage("login")} />
      )}
      {page === "login" && (
        <Login
          onSwitch={() => setPage("signup")}
          onBackToLanding={() => setPage("landing")}
        />
      )}
      {page === "signup" && (
        <Signup onSwitch={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;