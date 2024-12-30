import React, { useState } from "react";
import "./ProfileSupplier.css";

// Import icons from assets
import basketIcon from "../../assets/basket-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import uploadIcon from "../../assets/upload-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import logo from "../../assets/home.svg";

const ProfileSupplier = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("profile");

  // Renders the main content based on the active page
  const renderContent = () => {
    if (activePage === "profile") {
      return (
        <div className="profile-supplier-banner">
          <div className="gradient-bar"></div>
        </div>
      );
    } else if (activePage === "search") {
      return (
        <div className="profile-supplier-banner">
          <div className="gradient-bar"></div>
        </div>
      );
    } else if (activePage === "addSupply") {
      return (
        <div className="add-supply-container">
          {/* Add Supplies Page Content */}
          <div className="add-supply-header">
            <input type="checkbox" id="change-price" />
            <label htmlFor="change-price">I Want to change the price</label>
          </div>

          <div className="add-supply-categories">
            <select>
              <option>Man's Wear</option>
            </select>
            <select>
              <option>Bottom Wear</option>
            </select>
            <select>
              <option>Sub Category</option>
            </select>
          </div>

          <button className="btn download-btn">Download</button>

          <div className="file-upload">
            <div className="file-upload-icon">
              <img src={uploadIcon} alt="Upload" />
            </div>
            <p>Drag files here or choose browse to select files</p>
          </div>

          <div className="catalogue-name">
            <label htmlFor="catalogue-name">Catalogue Name*</label>
            <input type="text" id="catalogue-name" placeholder="Enter Your Catalogue Name" />
          </div>

          <div className="action-buttons">
            <button className="btn cancel-btn">Cancel</button>
            <button className="btn upload-btn">Upload</button>
          </div>
        </div>
      );
    } else if (activePage === "setting") {
      return (
        // Todo complete this
        <h1>Your information will be shown here</h1>
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    onLogout(); // Callback to redirect to the login or landing page
  };

  return (
    <div className="profile-supplier-container">
      {/* Sidebar */}
      <div className="profile-supplier-sidebar">
        <button onClick={handleLogout} className="sidebar-icon">
          <img src={logo} alt="Salado Logo" className="logo-button" />
        </button>

        <button 
          className={`sidebar-icon ${activePage === "search" ? "active" : ""}`}
          onClick={() => setActivePage("search")}
        >
          <img src={searchIcon} alt="Search" />
        </button>
        <button
          className={`sidebar-icon ${activePage === "profile" ? "active" : ""}`}
          onClick={() => setActivePage("profile")}
        >
          <img src={basketIcon} alt="Basket" />
        </button>
        <button
          className={`sidebar-icon ${activePage === "addSupply" ? "active" : ""}`}
          onClick={() => setActivePage("addSupply")}
        >
          <img src={plusIcon} alt="Add" />
        </button>
        <button 
          className={`sidebar-icon ${activePage === "setting" ? "active" : ""}`}
          onClick={() => setActivePage("setting")}
        >
          <img src={settingsIcon} alt="Settings" />
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-supplier-main">
        {/* Header */}
        <div className="profile-supplier-header">
          <div>
            <h2>Welcome, Danial</h2>
            <p>Mon, 30 Dec 2024</p>
          </div>
          <div className="profile-notification">
            <img src={bellIcon} alt="Notifications" />
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileSupplier;
