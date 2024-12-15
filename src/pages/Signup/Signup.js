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

const Signup = ({ onSwitch, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    birthdate: "",
    nationalcode: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.lastname.trim()) newErrors.lastname = "Lastname is required.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";

    if (!formData.birthdate.trim()) newErrors.birthdate = "Birth date is required.";

    if (!formData.nationalcode.trim()) {
      newErrors.nationalcode = "National code is required.";
    } else if (!/^\d{10}$/.test(formData.nationalcode)) {
      newErrors.nationalcode = "National code must be a 10-digit number.";
    } else if (!validateNationalCode(formData.nationalcode)) {
      newErrors.nationalcode = "Not a valid national code!";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^09\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number is not valid. It must be an 11-digit number starting with '09'.";
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
      const response = await fetch("http://localhost:8000/auth/signup/", {
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}

          <label htmlFor="lastname">Lastname</label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter your lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <p className="field-error">{errors.lastname}</p>}

          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="birthdate">Birth Date</label>
          <input
            type="date"
            id="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />
          {errors.birthdate && <p className="field-error">{errors.birthdate}</p>}

          <label htmlFor="nationalcode">National Code</label>
          <input
            type="text"
            id="nationalcode"
            placeholder="Enter your national code"
            value={formData.nationalcode}
            onChange={handleChange}
          />
          {errors.nationalcode && (
            <p className="field-error">{errors.nationalcode}</p>
          )}

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your phone number (09XXXXXXXXX)"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}

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
