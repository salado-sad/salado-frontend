import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

/**
 * AdminLogin component renders the login page for the admin.
 * @param {Object} props - The component props.
 * @param {Function} props.onLoginSuccess - The function to call when the admin logs in successfully.
 * @returns {JSX.Element} The admin login page component.
 */
function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      alert("You are already logged into your account.")
      navigate("/");
    }
  }, [navigate]);

  /**
   * Handles the login form submission.
   * @param {Object} event - The event object.
   */
  const handleLogin = (event) => {
    event.preventDefault();

    if (email === "admin" && password === "admin") {
      onLoginSuccess("admin");
      navigate("/admin-panel");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate("/")} className="back-button">Back to Landing</button>
    </div>
  );
}

export default AdminLogin;