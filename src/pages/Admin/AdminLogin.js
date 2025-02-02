import React, { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLoginSuccess, onBackToLanding }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (email === "admin" && password === "admin") {
      onLoginSuccess();
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
      <button onClick={onBackToLanding} className="back-button">Back to Landing</button>
    </div>
  );
}

export default AdminLogin;
