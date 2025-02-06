// src/pages/Admin/AdminPanel.js
import React, { useState } from "react";
import './AdminPanel.css';
import PackageList from "../../components/PackageList"; // Adjust the path as necessary
import AddPackage from "../../components/AddPackage"; // This should be your component for adding packages

// Import your assets here
import basketIcon from "../../assets/basket-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import logo from "../../assets/logo_mono.png";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("packages");

  const renderContent = () => {
    switch (activePage) {
      case "packages":
        return <PackageList />;
      case "add":
        return <AddPackage />;
      // You can add more cases for different sections
      default:
        return <div>Welcome, Admin. Select an option from the menu.</div>;
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="sidebar">
        <button className="sidebar-icon">
          <img src={logo} alt="Logo" />
        </button>
        <button className={`sidebar-icon ${activePage === "search" ? "active" : ""}`} onClick={() => setActivePage("search")}>
          <img src={searchIcon} alt="Search" />
        </button>
        <button className={`sidebar-icon ${activePage === "packages" ? "active" : ""}`} onClick={() => setActivePage("packages")}>
          <img src={basketIcon} alt="Packages" />
        </button>
        <button className={`sidebar-icon ${activePage === "add" ? "active" : ""}`} onClick={() => setActivePage("add")}>
          <img src={plusIcon} alt="Add" />
        </button>
        <button className={`sidebar-icon ${activePage === "settings" ? "active" : ""}`} onClick={() => setActivePage("settings")}>
          <img src={settingsIcon} alt="Settings" />
        </button>
      </div>

      <main className="main-content">
        <div className="header">
          <div>
            <h2>Welcome, Admin</h2>
            <p>Mon, 30 Dec 2024</p>
          </div>
          <div className="notifications">
            <img src={bellIcon} alt="Notifications" />
          </div>
        </div>
        <div className="content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;