import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./Profile.css";
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
        const accessToken = Cookies.get("access_token"); // Token from localStorage
        const response = await fetch("http://localhost:8000/auth/profile/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
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
        const mockData = {
          name: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          birthdate: "1990-01-01",
          phone: "09912327821",
          nationalcode: "0025058674",
          password: "securepassword",
          role: "customer",
        };
        setProfileData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="profile-page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button onClick={handleLogout} className="logo-button">
          <img src={logo} alt="Salado Logo" />
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="profile-header">
          <h1>Your Profile</h1>
        </div>

        {loading && <p className="loading-message">Loading your profile...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && profileData && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Welcome, {profileData.name}!</h2>
            </div>

            <div className="profile-card-details">
              <p><strong>Full Name:</strong> {profileData.name} {profileData.lastname}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Phone:</strong> {profileData.phone}</p>
              <p><strong>National Code:</strong> {profileData.nationalcode}</p>
              <p>
                <strong>Birthdate:</strong>{" "}
                {new Date(profileData.birthdate).toLocaleDateString()}
              </p>
              <p><strong>Role:</strong> {profileData.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
