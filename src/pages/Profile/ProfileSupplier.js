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

// The data structure for categories, subcategories, and products
const data = {
  // ... (same as your data structure)
};

const ProfileSupplier = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("profile");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [catalogueName, setCatalogueName] = useState("");
  const [products, setProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productMeasurement, setProductMeasurement] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('grams');

  // Handlers
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedSubCategory("");
    setSelectedProduct("");
    setProducts([]);
  };

  const handleSubCategoryChange = (event) => {
    const subCategory = event.target.value;
    setSelectedSubCategory(subCategory);
    setSelectedProduct("");
    setProducts(data[selectedCategory][subCategory]);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleCatalogueNameChange = (event) => {
    setCatalogueName(event.target.value);
  };

  const handleProductMeasurementChange = (e) => {
    setProductMeasurement(e.target.value);
  };

  const handleMeasurementUnitChange = (e) => {
    setMeasurementUnit(e.target.value);
  };

  const handleProductQuantityChange = (event) => {
    setProductQuantity(event.target.value);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files);
  };

  const handleCancel = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedProduct("");
    setCatalogueName("");
  };

  const handleUpload = () => {
    console.log("Uploading:", { selectedCategory, selectedSubCategory, selectedProduct, catalogueName });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    onLogout();
  };

  // Render functions for each subpage
  const renderProfilePage = () => (
    <div className="profile-supplier-banner">
      <div className="gradient-bar"></div>
    </div>
  );

  const renderSearchPage = () => (
    <div className="profile-supplier-banner">
      <div className="gradient-bar"></div>
    </div>
  );

  const renderAddSupplyPage = () => (
    <div className="add-supply-container">
      <div className="add-supply-categories">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {Object.keys(data).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select value={selectedSubCategory} onChange={handleSubCategoryChange} disabled={!selectedCategory}>
          <option value="">Select Sub Category</option>
          {selectedCategory &&
            Object.keys(data[selectedCategory]).map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
        </select>

        <select value={selectedProduct} onChange={handleProductChange} disabled={!selectedSubCategory}>
          <option value="">Select Product</option>
          {selectedSubCategory &&
            products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
        </select>
      </div>

      <div className="file-upload">
        <div className="file-upload-icon">
          <img src={uploadIcon} alt="Upload" />
        </div>
        <p>Drag files here or choose browse to select files</p>
        <input type="file" onChange={handleFileUpload} />
      </div>

      <div className="catalogue-name">
        <label htmlFor="catalogue-name">Catalogue Name*</label>
        <input
          type="text"
          id="catalogue-name"
          placeholder="Enter Your Catalogue Name"
          value={catalogueName}
          onChange={handleCatalogueNameChange}
        />
      </div>

      <div className="product-info">
        <div className="product-measurement">
          <label htmlFor="product-measurement">Product Measurement*</label>
          <div className="measurement-input-group">
            <input
              type="number"
              id="product-measurement"
              placeholder="Enter value"
              value={productMeasurement}
              onChange={handleProductMeasurementChange}
            />
            <select
              id="measurement-unit"
              value={measurementUnit}
              onChange={handleMeasurementUnitChange}
            >
              <option value="grams">Grams (g)</option>
              <option value="kilograms">Kilograms (kg)</option>
              <option value="milliliters">Milliliters (ml)</option>
              <option value="liters">Liters (l)</option>
              <option value="pieces">Pieces</option>
            </select>
          </div>
        </div>

        <div className="product-quantity">
          <label htmlFor="product-quantity">Product Quantity*</label>
          <input
            type="number"
            id="product-quantity"
            placeholder="Enter stock quantity"
            value={productQuantity}
            onChange={handleProductQuantityChange}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="btn upload-btn" onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );

  const renderSettingPage = () => (
    <h1>Your information will be shown here</h1>
  );

  // Main render function
  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return renderProfilePage();
      case "search":
        return renderSearchPage();
      case "addSupply":
        return renderAddSupplyPage();
      case "setting":
        return renderSettingPage();
      default:
        return null;
    }
  };

  return (
    <div className="profile-supplier-container">
      {/* Sidebar */}
      <div className="profile-supplier-sidebar">
        <button onClick={handleLogout} className="sidebar-icon">
          <img src={logo} alt="Salado Logo" className="logo-button" />
        </button>

        <button className={`sidebar-icon ${activePage === "search" ? "active" : ""}`} onClick={() => setActivePage("search")}>
          <img src={searchIcon} alt="Search" />
        </button>
        <button className={`sidebar-icon ${activePage === "profile" ? "active" : ""}`} onClick={() => setActivePage("profile")}>
          <img src={basketIcon} alt="Basket" />
        </button>
        <button className={`sidebar-icon ${activePage === "addSupply" ? "active" : ""}`} onClick={() => setActivePage("addSupply")}>
          <img src={plusIcon} alt="Add" />
        </button>
        <button className={`sidebar-icon ${activePage === "setting" ? "active" : ""}`} onClick={() => setActivePage("setting")}>
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