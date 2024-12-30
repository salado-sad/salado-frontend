import React, { useState } from "react";
import "../../index.css";
import logo from "../../assets/logo.png"; // Add your logo here
import salad from "../../assets/salad.png";

const Login = ({ onSwitch, onBackToLanding, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // const response = await fetch("https://api.salado.mghgm.ir/auth/login", {
      // TODO fix API endpoint
      const response = await fetch("http://localhost:8000/auth/signin_supplier/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 200) {
        setSuccessMessage(result.message); // "Login successful"
        console.log("Login successful:", result.message);
        // Add additional logic like redirecting the user here.
      } else if (response.status === 401) {
        setErrorMessage(result.error); // "Invalid credentials"
      } else if (response.status === 403) {
        setErrorMessage(result.error); // "Invalid credentials"
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      {/* Back to Home Button with Logo */}
      <div className="back-to-landing">
        <button onClick={onBackToLanding} className="back-to-landing-btn">
          <img src={logo} alt="Salado Logo" className="logo-button" />
          <span className="salado-name">Salado</span>
        </button>
      </div>

      <div className="login-form">
        <h1>Welcome back Supplier!</h1>
        <p>Enter your Credentials to access your supplier account</p>

        {/* Display global error or success messages */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <div className="options">
            {/* Link to Forget Password Page */}
            <button
              type="button"
              className="forgot-password"
              onClick={onForgotPassword}
            >
              Forgot Password
            </button>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="signup-link">
          Don't have an account? <button onClick={onSwitch}>Sign Up</button>
        </div>
      </div>

      <div className="image-section">
        <img
          src={salad}
          alt="Background"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default Login;