import React, { useState, useEffect } from "react";
import "../../index.css";
import logo from "../../assets/logo.png";

const Profile = ({ onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("authToken"); // Token from localStorage
        // const response = await fetch("https://api.salado.mghgm.ir/auth/profile", {
        const response = await fetch("https://localhost:8000/auth/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else if (response.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to fetch profile data. Please try again later.");
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    onLogout(); // Callback to redirect to the login or landing page
  };

  return (
    <div className="profile-container">
      {/* Back to Home Button */}
      <div className="back-to-landing">
        <button onClick={handleLogout} className="back-to-landing-btn">
          <img src={logo} alt="Salado Logo" className="logo-button" />
          <span className="salado-name">Salado</span>
        </button>
      </div>

      <div className="profile-content">
        {loading && <p>Loading your profile...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && profileData && (
          <div className="profile-details">
            <h1>Welcome, {profileData.name}!</h1>
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Phone:</strong> {profileData.phone}</p>
            <p><strong>National Code:</strong> {profileData.nationalcode}</p>
            <p><strong>Birthdate:</strong> {new Date(profileData.birthdate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
