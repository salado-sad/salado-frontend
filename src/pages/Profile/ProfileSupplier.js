import React, { useState, useEffect } from "react";
import "./ProfileSupplier.css";

// Import icons from assets
import basketIcon from "../../assets/basket-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import logo from "../../assets/logo_mono.png";
import data from '../../data/products.json';

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
  const [addedItems, setAddedItems] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null); 
  const [deleteIndex, setDeleteIndex] = useState(null); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [originalItem, setOriginalItem] = useState(null); 

  // Fetch products when the component mounts
  useEffect(() => {
    fetch('http://[Host]/vendors/products/')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category) {
      const firstSubCategory = Object.keys(data[category])[0];
      setSelectedSubCategory(firstSubCategory);
      setProducts(data[category][firstSubCategory]);
    } else {
      setSelectedSubCategory("");
      setSelectedProduct("");
      setProducts([]);
    }
  };

  const handleSubCategoryChange = (event) => {
    const subCategory = event.target.value;
    setSelectedSubCategory(subCategory);
    if (subCategory) {
      setSelectedProduct(data[selectedCategory][subCategory][0]);
      setProducts(data[selectedCategory][subCategory]);
    } else {
      setSelectedProduct("");
      setProducts([]);
    }
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

  const handleCancel = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedProduct("");
    setCatalogueName("");
    setProductMeasurement('');
    setProductQuantity(0);
  };

  const validateUploadForm = () => {
    if (!selectedCategory || !selectedSubCategory || !selectedProduct || !catalogueName || !productMeasurement || !productQuantity) {
      alert("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleUpload = () => {
    if (validateUploadForm()) {
      const newItem = {
        name: selectedProduct,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        catalogue_name: catalogueName,
        price: "0",
        stock_quantity: productQuantity,
        product_measurement: productMeasurement,
        measurement_unit: measurementUnit,
      };
  
      fetch('http://[Host]/vendors/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Product added:', data);
        // Refresh products list
        fetch('http://[Host]/vendors/products/')
          .then(response => response.json())
          .then(data => setAddedItems(data))
          .catch(error => console.error('Error fetching products:', error));
      })
      .catch(error => console.error('Error adding product:', error));
  
      handleCancel();
      setUploadedImage(null);
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...addedItems];
    updatedItems.splice(index, 1); 
    setAddedItems(updatedItems);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    onLogout();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => setUploadedImage(null);

  const handleEditChange = (index, field, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index][field] = value;
    setAddedItems(updatedItems);
  };

  const handleSubCategoryEditChange = (index, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index].subCategory = value;
    updatedItems[index].product = ""; 
    setAddedItems(updatedItems);
  };

  const handleSaveEdit = (index) => {
    setEditIndex(null);
  };


  const ConfirmDeleteModal = () => (
    isModalVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="modal-buttons">
            <button
              className="confirm-btn"
              onClick={() => {
                handleDeleteItem(deleteIndex); // Confirm deletion
                setModalVisible(false); // Close the modal
                setDeleteIndex(null); // Clear the delete index
                setEditIndex(null);
              }}
            >
              Confirm
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setModalVisible(false); // Close the modal without deleting
                setDeleteIndex(null); // Clear the delete index
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderProfilePage = () => (
    <div className="profile-page-container">
      <h2>Your Added Supplies</h2>
  
      {addedItems.length === 0 ? (
        <p className="empty-message">
          No items added yet. Go to the "Add Supply" page to upload your products.
        </p>
      ) : (
        <div className="profile-item-cards">
          {addedItems.map((item, index) => (
            <div className="profile-item-card" key={index}>
              {/* Image */}
              {item.image && (
                <div className="card-image">
                  <img src={item.image} alt={`${item.product} preview`} />
                </div>
              )}
  
              {editIndex === index ? (
                // Editable Mode
                <>
                  <div className="card-header">
                    <select
                      value={item.category}
                      onChange={(e) => handleEditChange(index, "category", e.target.value)}
                      className="editable-dropdown"
                    >
                      <option value="">Select Category</option>
                      {Object.keys(data).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
  
                    <select
                      value={item.subCategory}
                      onChange={(e) => handleSubCategoryEditChange(index, e.target.value)}
                      className="editable-dropdown"
                      disabled={!item.category}
                    >
                      <option value="">Select Subcategory</option>
                      {item.category &&
                        Object.keys(data[item.category]).map((subCategory) => (
                          <option key={subCategory} value={subCategory}>
                            {subCategory}
                          </option>
                        ))}
                    </select>
                  </div>
  
                  <div>
                    <select
                      value={item.product}
                      onChange={(e) =>
                        handleEditChange(index, "product", e.target.value)
                      }
                      className="editable-dropdown"
                      disabled={!item.subCategory}
                    >
                      <option value="">Select Product</option>
                      {item.subCategory &&
                        data[item.category][item.subCategory].map((product) => (
                          <option key={product} value={product}>
                            {product}
                          </option>
                        ))}
                    </select>
                  </div>
  
                  <input
                    type="text"
                    value={item.catalogueName}
                    onChange={(e) => handleEditChange(index, "catalogueName", e.target.value)}
                    className="editable-input"
                    placeholder="Enter catalogue name"
                  />
                  <input
                    type="text"
                    value={item.productMeasurement}
                    onChange={(e) =>
                      handleEditChange(index, "productMeasurement", e.target.value)
                    }
                    className="editable-input"
                    placeholder="Enter measurement"
                  />
                  <input
                    type="number"
                    value={item.productQuantity}
                    onChange={(e) =>
                      handleEditChange(index, "productQuantity", e.target.value)
                    }
                    className="editable-input"
                    placeholder="Enter quantity"
                  />
  
                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(index)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        if (originalItem !== null) {
                          const updatedItems = [...addedItems];
                          updatedItems[editIndex] = originalItem; // Revert to original values
                          setAddedItems(updatedItems);
                        }
                        setEditIndex(null); // Exit edit mode
                        setOriginalItem(null); // Clear cached originalItem
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setDeleteIndex(index);
                        setModalVisible(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                // Static View Mode
                <>
                  <div className="card-header">
                    <h3>{item.product}</h3>
                    <span className="category-badge">{item.category}</span>
                  </div>
                  <p><strong>Subcategory:</strong> {item.subCategory}</p>
                  <p><strong>Catalogue Name:</strong> {item.catalogueName}</p>
                  <p><strong>Measurement:</strong> {item.productMeasurement}</p>
                  <p><strong>Quantity:</strong> {item.productQuantity}</p>
  
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditIndex(index); // Enable edit mode
                        setOriginalItem({ ...addedItems[index] }); // Cache the original values
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmDeleteModal />
    </div>
  );

  const renderAddSupplyPage = () => (
    <div className="add-item-container">
      <h2>Add a New Supply</h2>
      <div className="add-item-card">
        {/* Category and Subcategory Selection */}
        <div className="input-group">
          <label htmlFor="category">Category*</label>
          <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {Object.keys(data).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
  
        <div className="input-group">
          <label htmlFor="subcategory">Subcategory*</label>
          <select
            id="subcategory"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            disabled={!selectedCategory}
          >
            <option value="">Select Subcategory</option>
            {selectedCategory &&
              Object.keys(data[selectedCategory]).map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
          </select>
        </div>
  
        <div className="input-group">
          <label htmlFor="product">Product*</label>
          <select
            id="product"
            value={selectedProduct}
            onChange={handleProductChange}
            disabled={!selectedSubCategory}
          >
            <option value="">Select Product</option>
            {selectedSubCategory &&
              products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
          </select>
        </div>
  
        {/* Catalogue Name */}
        <div className="input-group">
          <label htmlFor="catalogue">Catalogue Name*</label>
          <input
            type="text"
            id="catalogue"
            placeholder="Enter your catalogue name"
            value={catalogueName}
            onChange={handleCatalogueNameChange}
          />
        </div>
  
        {/* Measurement */}
        <div className="input-group">
          <label htmlFor="measurement">Product Measurement*</label>
          <div className="measurement-wrapper">
            <input
              type="number"
              id="measurement"
              placeholder="Enter measurement"
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
  
        {/* Quantity */}
        <div className="input-group">
          <label htmlFor="quantity">Product Quantity*</label>
          <input
            type="number"
            id="quantity"
            placeholder="Enter product quantity"
            value={productQuantity}
            onChange={handleProductQuantityChange}
          />
        </div>
        
        {/* Image Upload */}
        <div className="input-group">
          <label htmlFor="image-upload">Upload Item Image</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {uploadedImage && (
            <div className="image-preview">
              <img src={uploadedImage} alt="Preview" />
              <button onClick={clearImagePreview}>&times;</button>
            </div>
          )}
        </div>
  
        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn upload-btn" onClick={handleUpload}>
            Add Supply
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingPage = () => (
    <h1>Your information will be shown here</h1>
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(1000);

  const renderSearchPage = () => {
  
    // Filter products based on search query, category, and quantity range
    const filteredProducts = addedItems.filter((item) => {
      const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesQuantity = item.productQuantity >= minQuantity && item.productQuantity <= maxQuantity;
      return matchesSearch && matchesCategory && matchesQuantity;
    });
  
    return (
      <div className="search-page-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>
  
        {/* Filters */}
        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(addedItems.map((item) => item.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
  
          <div className="quantity-filter">
            <label>Quantity Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={minQuantity}
              onChange={(e) => setMinQuantity(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxQuantity}
              onChange={(e) => setMaxQuantity(Number(e.target.value))}
            />
          </div>
        </div>
  
        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="product-card">
                <div className="card-image">
                  <img src={item.image} alt={item.product} />
                </div>
                <h3>{item.product}</h3>
                <p>Category: {item.category}</p>
                <p>Subcategory: {item.subCategory}</p>
                <p>Quantity: {item.productQuantity}</p>
                <p>Measurement: {item.productMeasurement}</p>
                <p>Catalogue: {item.catalogueName}</p>
              </div>
            ))
          ) : (
            <p className="no-results">No products found.</p>
          )}
        </div>
      </div>
    );
  };

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
        {/* Larger Sidebar Logo */}
        <button
          onClick={handleLogout}
          className="sidebar-icon logo-button"
          title="Logout"
        >
          <img
            src={logo}
            alt="Company Logo"
            className="sidebar-logo"
          />
        </button>
        
        {/* Sidebar Buttons */}
        <div className="sidebar-menu">
          <button
            className={`sidebar-icon ${activePage === "search" ? "active" : ""}`}
            onClick={() => setActivePage("search")}
            title="Search Items"
          >
            <img src={searchIcon} alt="Search Icon" />
          </button>
          <button
            className={`sidebar-icon ${activePage === "profile" ? "active" : ""}`}
            onClick={() => setActivePage("profile")}
            title="Your Profile"
          >
            <img src={basketIcon} alt="Basket Icon" />
          </button>
          <button
            className={`sidebar-icon ${activePage === "addSupply" ? "active" : ""}`}
            onClick={() => setActivePage("addSupply")}
            title="Add Supply"
          >
            <img src={plusIcon} alt="Plus Icon" />
          </button>
          <button
            className={`sidebar-icon ${activePage === "setting" ? "active" : ""}`}
            onClick={() => setActivePage("setting")}
            title="Settings"
          >
            <img src={settingsIcon} alt="Settings Icon" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-supplier-main">
        {/* Header */}
        <div className="profile-supplier-header">
          <div>
            <h2>Welcome, John</h2>
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
