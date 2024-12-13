import React from "react";
import "../../index.css";
import mohsen from '../../assets/picture.png';

const Signup = ({ onSwitch }) => {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Get Started Now</h1>
        <p>Create an account to enjoy all the features</p>
        <form>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Enter your name" />

          <label htmlFor="lastname">Lastname</label>
          <input type="text" id="lastname" placeholder="Enter your lastname" />

          <label htmlFor="email">Email address</label>
          <input type="email" id="email" placeholder="Enter your email" />

          <label htmlFor="birthdate">Birth Date</label>
          <input type="date" id="birthdate" placeholder="Enter your birth date" />

          <label htmlFor="nationalcode">National Code</label>
          <input type="text" id="nationalcode" placeholder="Enter your national code" />

          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" placeholder="Enter your phone number" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />

          <div className="options">
            <label>
              <input type="checkbox" /> I agree to the terms & policy
            </label>
          </div>

          <button type="submit" className="signup-btn">Signup</button>
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
