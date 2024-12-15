import React, { useState } from "react";
import "../../index.css";
import logo from "../../assets/logo.png"; // Add your logo here.
import salad from "../../assets/salad.png"; // Reuse the same background image as Login Page.

const ForgetPassword = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("https://api.salado.mghgm.ir/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Password reset email sent.");
        alert("An email with instructions to reset your password has been sent.");
        onBackToLogin(); // Redirect back to Login Page
      } else if (response.status === 404) {
        setErrorMessage("Email not found. Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Back to Home Button with Logo */}
      <div className="back-to-landing">
        <button onClick={onBackToLogin} className="back-to-landing-btn">
          <img src={logo} alt="Salado Logo" className="logo-button" />
          <span className="salado-name">Salado</span>
        </button>
      </div>

      <div className="login-form">
        <h1>Forgot Your Password?</h1>
        <p>Enter your email, and we'll send you instructions to reset your password.</p>

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

          <button type="submit" className="login-btn">
            Send Reset Instructions
          </button>
        </form>

        <div className="signup-link">
          Remember your password?{" "}
          <button onClick={onBackToLogin}>Login</button>
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

export default ForgetPassword;