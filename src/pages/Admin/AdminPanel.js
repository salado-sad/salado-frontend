import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './AdminPanel.css';
import PackageList from "../../components/PackageList";
import AddPackage from "../../components/AddPackage";
import basketIcon from "../../assets/basket-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import logo from "../../assets/logo_mono.png";

/**
 * AdminPanel component for managing admin functionalities.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.onLogout - Function to handle logout.
 * @returns {JSX.Element} The rendered component.
 */
const AdminPanel = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("packages"); // State to track the active page
  const [adminData, setAdminData] = useState(null); // State to store admin profile data
  const navigate = useNavigate(); // Hook to navigate between routes
  const [packages, setPackages] = useState([]); // State to store the list of packages

  /**
   * Handles adding a new package to the list.
   * 
   * @param {Object} newPackage - The new package to add.
   */
  const handleAddPackage = (newPackage) => {
    setPackages((prevPackages) => [...prevPackages, newPackage]);
  };

  /**
   * Fetch admin profile data from the API when the active page is "settings".
   */
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/profile/", {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
          }
        });
        const result = await response.json();
        if (response.ok) setAdminData(result);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (activePage === "settings") fetchAdminProfile();
  }, [activePage]);

  /**
   * Renders the settings page with admin information.
   * 
   * @returns {JSX.Element} The rendered settings page.
   */
  const renderSettingsPage = () => (
    <div className="setting-page-container">
      <h2>Admin Information</h2>
      {adminData ? (
        <div className="admin-info">
          <p><strong>Name:</strong> {adminData.first_name} {adminData.last_name}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
          <p><strong>Role:</strong> {adminData.role}</p>
        </div>
      ) : (
        <p>Loading admin information...</p>
      )}
      <button className="logout-button" onClick={() => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        onLogout();
      }}>
        Logout
      </button>
    </div>
  );

  /**
   * Renders the content based on the active page.
   * 
   * @returns {JSX.Element} The content to render.
   */
  const renderContent = () => {
    switch (activePage) {
      case "packages":
        return <PackageList packages={packages} />;
      case "add":
        return <AddPackage onAddPackage={handleAddPackage} />;
      case "settings":
        return renderSettingsPage();
      default:
        return <div>Welcome, Admin. Select an option from the menu.</div>;
    }
  };

  return (
    <div className="admin-panel-container">
      {/* Sidebar for navigation */}
      <div className="sidebar">
        <button className="sidebar-icon" onClick={() => {
          navigate("/");
        }} title="Logout">
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

      {/* Main content area */}
      <main className="main-content">
        {/* Header section */}
        <div className="header">
          <div>
            <h2>Welcome, Admin</h2>
            <p>{new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>
        {/* Dynamic content based on active page */}
        <div className="content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;