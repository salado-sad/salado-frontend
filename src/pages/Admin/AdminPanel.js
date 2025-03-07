import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [activePage, setActivePage] = useState("packages");
  const navigate = useNavigate();
  const [packages, setPackages] = useState([
    {
      name: 'Agha Farid',
      price: '$800.85',
      description: 'Bache khoobie. Aziatesh nakonin. Bayad khordesh',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQHP1k_GASXLmQ/profile-displayphoto-shrink_400_400/0/1720623177822?e=1744243200&v=beta&t=ZMqV6ju4Zd6YfWp99lt40uwCUs9SA_vvCoxp1ldfMNA',
      products: [
        {
          name: 'Strawberry',
          quantity: 5,
          image: 'https://cdn.nyallergy.com/wp-content/uploads/square-1432664914-strawberry-facts1-1200x900.jpeg'
        },
        {
          name: 'Spinach',
          quantity: 3,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFIf1LwpQrKWxz9lSfn976uLBL9n5g18CUQ&s'
        }
      ]
    }
  ]);

  /**
   * Handles adding a new package to the list.
   * 
   * @param {Object} newPackage - The new package to add.
   */
  const handleAddPackage = (newPackage) => {
    setPackages((prevPackages) => [...prevPackages, newPackage]);
  };

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
      default:
        return <div>Welcome, Admin. Select an option from the menu.</div>;
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="sidebar">
        <button className="sidebar-icon" onClick={() => {
          onLogout();
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

      <main className="main-content">
        <div className="header">
          <div>
            <h2>Welcome, Admin</h2>
            <p>{new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</p>
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