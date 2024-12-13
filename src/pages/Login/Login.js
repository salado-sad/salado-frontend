import React from "react";
import "../../index.css";
import mohsen from '../../assets/picture.png';

const Login = ({ onSwitch }) => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Welcome back!</h1>
        <p>Enter your Credentials to access your account</p>
        <form>
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />

          <div className="options">
            <label>
              <input type="checkbox" /> Remember for 30 days
            </label>
            <a href="#" className="forgot-password">
              forgot password
            </a>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="signup-link">
          Don't have an account? <button onClick={onSwitch}>Sign Up</button>
        </div>
      </div>

      <div className="image-section">
        <img src={mohsen} alt="Background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
};

export default Login;
