import React from "react";
import { useNavigate } from "react-router-dom";
import "./Privacy.css";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. At Salado, we are committed to protecting your personal information and ensuring that your experience with us is safe and secure. Our privacy policy outlines how we collect, use, and safeguard your data. Please take a moment to read through our policy to understand our practices.
      </p>
      <p>
        We collect personal information that you provide to us directly, such as when you create an account, place an order, or contact us for support. This information may include your name, email address, phone number, and payment details.
      </p>
      <p>
        We use your personal information to process your orders, provide customer support, and improve our services. We may also use your information to send you promotional materials and updates about our products and services.
      </p>
      <p>
        We implement a variety of security measures to protect your personal information from unauthorized access, use, or disclosure. These measures include encryption, secure servers, and access controls.
      </p>
      <p>
        We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required by law or to protect our rights.
      </p>
      <p>
        If you have any questions or concerns about our privacy policy, please contact us at privacy@salado.com (please dont).
      </p>
      <button onClick={() => navigate("/")} className="back-home-btn">Back to Home</button>
    </div>
  );
};

export default Privacy;