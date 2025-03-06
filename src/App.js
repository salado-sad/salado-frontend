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

function App() {
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  
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
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/supplier-login" element={<LoginSupplier onLoginSuccess={(u) => setUser(u)} />} />
        <Route path="/supplier-signup" element={<SignupSupplier />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/explore-salads" element={<ExploreSalads />} />
        <Route path="/profile" element={user ? <Profile onLogout={() => setUser(null)} /> : <Navigate to="/login" />} />
        <Route path="/supplier-profile" element={user ? <ProfileSupplier onLogout={() => setUser(null)} /> : <Navigate to="/supplier-login" />} />
        <Route path="/admin-login" element={<AdminLogin onLoginSuccess={(u) => setUser(u)} />} />
        <Route path="/admin-panel" element={user === "admin" ? <AdminPanel onLogout={() => setUser(null)} /> : <Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  );
}

export default App;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Signup from "./pages/Signup/Signup";
// import Login from "./pages/Login/Login";
// import SignupSupplier from "./pages/Signup/SignupSupplier";
// import LoginSupplier from "./pages/Login/LoginSupplier";
// import LandingPage from "./pages/Landing/Landing";
// import ExploreSalads from "./pages/ExploreSalads/ExploreSalads";
// import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
// import Profile from "./pages/Profile/Profile";
// import ProfileSupplier from "./pages/Profile/ProfileSupplier";
// import AdminLogin from "./pages/Admin/AdminLogin";
// import AdminPanel from "./pages/Admin/AdminPanel";

// function App() {
//   const [page, setPage] = useState(localStorage.getItem("currentPage") || "landing");
//   const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");

//   useEffect(() => {
//     localStorage.setItem("currentPage", page);
//     localStorage.setItem("isAuthenticated", isAuthenticated);
//   }, [page, isAuthenticated]);

//   return (
//     <div>
//       {page === "landing" && (
//         <LandingPage 
//           onSwitchToLogin={() => setPage("login")}
//           onSwitchToSupplierLogin={() => setPage("supplier-login")}
//           onSwitchToAdminLogin={() => setPage("admin-login")}
//           onExploreSalads={() => setPage("explore-salads")}
//         />
//       )}
//       {page === "explore-salads" && (
//         <ExploreSalads
//           onBackToLanding={() => setPage("landing")}
//         />
//       )}
//       {page === "login" && (
//         <Login
//           onSwitch={() => setPage("signup")}
//           onBackToLanding={() => setPage("landing")}
//           onForgotPassword={() => setPage("forget-password")} // Navigate to Forget Password Page
//           onLoginSuccess={() => {
//             setIsAuthenticated(true);
//             setPage("profile");
//           }}
//         />
//       )}
//       {page === "signup" && (
//         <Signup
//           onSwitch={() => setPage("login")}
//           onBackToLanding={() => setPage("landing")}
//         />
//       )}
//       {page === "supplier-login" && (
//         <LoginSupplier
//           onSwitch={() => setPage("supplier-signup")}
//           onBackToLanding={() => setPage("landing")}
//           onForgotPassword={() => setPage("forget-password")}
//           onLoginSuccess={() => {
//             setIsAuthenticated(true);
//             setPage("supplier-profile");
//           }}
//         />
//       )}
//       {page === "supplier-signup" && (
//         <SignupSupplier
//           onSwitch={() => setPage("supplier-login")}
//           onBackToLanding={() => setPage("landing")}
//         />
//       )}
//       {page === "forget-password" && (
//         <ForgetPassword onBackToLogin={() => setPage("login")} />
//       )}
//       {isAuthenticated && page === "profile" && (
//         <Profile onLogout={() => {
//           setIsAuthenticated(false);
//           setPage("landing");
//           localStorage.removeItem("isAuthenticated");
//         }} />
//       )}
//       {isAuthenticated && page === "supplier-profile" && (
//         <ProfileSupplier onLogout={() => {
//           setIsAuthenticated(false);
//           setPage("landing");
//           localStorage.removeItem("isAuthenticated");
//         }} />
//       )}
//       {page === "admin-login" && (
//         <AdminLogin
//           onLoginSuccess={() => setPage("admin-panel")} // Admin login success leads to AdminPanel
//           onBackToLanding={() => setPage("landing")}
//         />
//       )}
//       {page === "admin-panel" && (
//         <AdminPanel onLogout={() => setPage("landing")} />
//       )}
//     </div>
//   );
// }

// export default App;