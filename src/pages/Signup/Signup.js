import React, { useState } from "react";
import "../../index.css";
import mohsen from "../../assets/picture.png";

const Signup = ({ onSwitch }) => {
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

    // Check for empty fields
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Lastname is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.birthdate.trim()) newErrors.birthdate = "Birth date is required.";
    if (!formData.nationalcode.trim()) {
      newErrors.nationalcode = "National code is required.";
    } else if (!/^\d{10}$/.test(formData.nationalcode)) {
      newErrors.nationalcode = "National code must be a 10-digit number.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6 || !/\d/.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long and include at least one number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate the form
    if (!validateForm()) {
      return;
    }

    // Proceed with backend request if validation passes
    try {
      const response = await fetch("https://api.salado.mghgm.ir/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        setSuccessMessage(data.message); // "User created successfully"
      } else if (response.status === 400) {
        const data = await response.json();
        setErrorMessage(data.error); // "You fu*ck up x field"
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="signup-container">
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
          {errors.nationalcode && <p className="field-error">{errors.nationalcode}</p>}

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

          {/* <div className="options">
            <label>
              <input type="checkbox" /> I agree to the terms & policy
            </label>
          </div> */}

          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
        <div className="login-link">
          Already have an account? <button onClick={onSwitch}>Login</button>
        </div>
      </div>

      <div className="image-section">
        <img src={mohsen} alt="Background" />
      </div>
    </div>
  );
};

export default Signup;
