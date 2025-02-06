import React, { useState } from "react";
import "../../index.css";
import logo from "../../assets/logo.png"; // Add your logo here
import salad from "../../assets/salad.png";

function validateNationalCode(code) {
  const digits = code.split('').map(Number); 
  const controlDigit = digits[9]; 
  
  let weightedSum = 0;
  for (let i = 0; i < 9; i++) {
    weightedSum += digits[i] * (10 - i);
  }

  const remainder = weightedSum % 11;

  if (remainder < 2) {
    return controlDigit === remainder;
  } else {
    return controlDigit === (11 - remainder);
  }
}

const convertToEnglishDigits = (input) => {
  const persianDigits = /[\u06F0-\u06F9]/g; // Persian digits ۰-۹
  const arabicDigits = /[\u0660-\u0669]/g;  // Arabic digits ٠-٩
  return input
    .replace(persianDigits, (d) => d.charCodeAt(0) - 0x06f0) // Convert Persian to English
    .replace(arabicDigits, (d) => d.charCodeAt(0) - 0x0660); // Convert Arabic to English
};

const Signup = ({ onSwitch, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    national_code: "",
    phone_number: "",
    password: "",
    // role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    const englishPhone = convertToEnglishDigits(formData.phone_number.trim());
    const englishNationalCode = convertToEnglishDigits(formData.national_code.trim());

    if (!formData.username.trim()) newErrors.username = "Username is required.";

    if (!formData.first_name.trim()) newErrors.first_name = "Firstname is required.";

    if (!formData.last_name.trim()) newErrors.last_name = "Lastname is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email is not valid. Please enter a valid email address.";
    }
    

    if (!formData.date_of_birth.trim()) newErrors.date_of_birth = "Birth date is required.";

    if (!formData.national_code.trim()) {
      newErrors.national_code = "National code is required.";
    } else if (!/^\d{10}$/.test(englishNationalCode)) {
      newErrors.national_code = "National code must be a 10-digit number.";
    } else if (!validateNationalCode(englishNationalCode)) {
      newErrors.national_code = "Not a valid national code!";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required.";
    } else if (!/^09\d{9}$/.test(englishPhone)) {
      newErrors.phone_number = "Phone number is not valid. It must be an 11-digit number starting with '09'.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (
      formData.password.length < 6 ||
      !/\d/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 6 characters long and include at least one number.";
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
      // const response = await fetch("https://api.salado.mghgm.ir/auth/signup", {
      const response = await fetch("http://localhost:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        setSuccessMessage(data.message);
      } else if (response.status === 400) {
        const data = await response.json();
        setErrorMessage(data.error);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* Back to Home Button with Logo */}
      <div className="back-to-landing">
        <button onClick={onBackToLanding} className="back-to-landing-btn">
          <img src={logo} alt="Salado Logo" className="logo-button" />
          <span className="salado-name">Salado</span>
        </button>
      </div>

      <div className="signup-form">
        <h1>Get Started Now</h1>
        <p>Create an account to enjoy all the features</p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="field-error">{errors.username}</p>}

          <label htmlFor="first_name">Name</label>
          <input
            type="text"
            id="first_name"
            placeholder="Enter your name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="field-error">{errors.first_name}</p>}

          <label htmlFor="last_name">Lastname</label>
          <input
            type="text"
            id="last_name"
            placeholder="Enter your lastname"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="field-error">{errors.last_name}</p>}

          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="date_of_birth">Birth Date</label>
          <input
            type="date"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
          {errors.date_of_birth && <p className="field-error">{errors.date_of_birth}</p>}

          <label htmlFor="national_code">National Code</label>
          <input
            type="text"
            id="national_code"
            placeholder="Enter your national code"
            value={formData.national_code}
            onChange={handleChange}
          />
          {errors.national_code && (
            <p className="field-error">{errors.national_code}</p>
          )}

          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            placeholder="Enter your phone number (09XXXXXXXXX)"
            value={formData.phone_number}
            onChange={handleChange}
          />
          {errors.phone_number && <p className="field-error">{errors.phone_number}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <button type="submit" className="signup-btn">Signup</button>
        </form>
        <div className="login-link">
          Already have an account? <button onClick={onSwitch}>Login</button>
        </div>
      </div>

      <div className="image-section">
        <img src={salad} alt="Background" />
      </div>
    </div>
  );
};

export default Signup;
