import React, { useState } from "react";
import "../../index.css";
import logo from "../../assets/logo.png";
import "./ProfileSupplier.css";


const ProfileSupplier = ({ onLogout }) => {
  const [sidebarOption, setSidebarOption] = useState("profile");

  const renderContent = () => {
    if (sidebarOption === "profile") {
      return (
        <div className="profile-supplier-details">
          <h1>Welcome, Supplier!</h1>
          <p><strong>Full Name:</strong> John Doe</p>
          <p><strong>Email:</strong> supplier@example.com</p>
          <p><strong>Company Name:</strong> Example Supplies Inc.</p>
          <p><strong>Phone:</strong> +1 123 456 7890</p>
        </div>
      );
    } else if (sidebarOption === "supplies") {
      return (
        <div className="supplies-placeholder">
          <h2>Supplies Management</h2>
          <p>Manage your supplies here. Add, edit, delete, or search for supplies.</p>
        </div>
      );
    }
  };

  return (
    <div className="profile-supplier-container">
      {/* Sidebar */}
      <div className="profile-supplier-sidebar">
        <button
          className={`sidebar-option ${sidebarOption === "profile" ? "active" : ""}`}
          onClick={() => setSidebarOption("profile")}
        >
          Profile
        </button>
        <button
          className={`sidebar-option ${sidebarOption === "supplies" ? "active" : ""}`}
          onClick={() => setSidebarOption("supplies")}
        >
          Supplies
        </button>
        <button className="sidebar-option logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-supplier-content">{renderContent()}</div>
    </div>
  );
};

export default ProfileSupplier;
