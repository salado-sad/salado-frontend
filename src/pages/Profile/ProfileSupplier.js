import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSupplier.css";
import basketIcon from "../../assets/basket-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import settingsIcon from "../../assets/settings-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import logo from "../../assets/logo_mono.png";
import data from '../../data/products.json';
import Cookies from "js-cookie";

/**
 * ProfileSupplier component for managing supplier functionalities.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.onLogout - Function to handle logout.
 * @returns {JSX.Element} The rendered component.
 */
const ProfileSupplier = ({ onLogout }) => {
  const UNIT_MAPPING = {
    'gram': 'grams',
    'grams': 'grams',
    'kilogram': 'kilograms', 
    'kilograms': 'kilograms',
    'milliliter': 'milliliters',
    'milliliters': 'milliliters',
    'liter': 'liters',
    'liters': 'liters',
    'piece': 'pieces',
    'pieces': 'pieces'
  };

  const [activePage, setActivePage] = useState("profile");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [catalogueName, setCatalogueName] = useState("");
  const [products, setProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productMeasurement, setProductMeasurement] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('grams');
  const [productPrice, setProductPrice] = useState(0);
  const [addedItems, setAddedItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 
  const [deleteIndex, setDeleteIndex] = useState(null); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [originalItem, setOriginalItem] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const navigate = useNavigate();
  const getAuthHeader = () => ({
    Authorization: `Bearer ${Cookies.get('access_token')}`
  });

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/vendors/products/', {
          headers: getAuthHeader()
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const apiData = await response.json();
        
        // Ensure all items have a price field with default value
        const formattedData = apiData.map(item => ({
          ...item,
          price: Number(item.price) || 0, // Force numeric conversion
          stock_quantity: Number(item.stock_quantity) || 0,
          product_measurement: Number(item.product_measurement) || 0
        }));
        
        setAddedItems(formattedData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAddedItems([]); // Reset to empty array on error
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activePage === "setting") {
      fetchSupplierProfile();
    }
  }, [activePage]);

  /**
   * Fetches the supplier profile data.
   */
  const fetchSupplierProfile = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/auth/profile/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.status === 200) {
        setSupplierData(result);
        console.log("Profile fetched successfully:", result);
      } else {
        console.error("Failed to fetch profile:", result);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  /**
   * Handles category change.
   * 
   * @param {Object} event - The event object.
   */
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

  /**
   * Handles subcategory change.
   * 
   * @param {Object} event - The event object.
   */
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

  /**
   * Handles product change.
   * 
   * @param {Object} event - The event object.
   */
  const handleProductChange = (event) => {
    const productName = event.target.value;
    if (selectedCategory && selectedSubCategory) {
      const product = data[selectedCategory][selectedSubCategory]
        .find(p => p.name === productName);
      
      if (product) {
        setProductMeasurement(product.measurement);
        // Normalize the unit value using mapping
        const rawUnit = product.unit.toLowerCase();
        const normalizedUnit = UNIT_MAPPING[rawUnit] || 'pieces';
        setMeasurementUnit(normalizedUnit);
        setProductPrice(product.price);
      }
      setSelectedProduct(productName);
    }
  };

  const handleCatalogueNameChange = (event) => {
    setCatalogueName(event.target.value);
  };

  /**
   * Handles product measurement change.
   * 
   * @param {Object} e - The event object.
   */
  const handleProductMeasurementChange = (e) => {
    setProductMeasurement(e.target.value);
  };

  /**
   * Handles measurement unit change.
   * 
   * @param {Object} e - The event object.
   */
  const handleMeasurementUnitChange = (e) => {
    setMeasurementUnit(e.target.value);
  };

  /**
   * Handles product quantity change.
   * 
   * @param {Object} event - The event object.
   */
  const handleProductQuantityChange = (event) => {
    setProductQuantity(event.target.value);
  };

  /**
   * Handles cancel action.
   */
  const handleCancel = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedProduct("");
    setCatalogueName("");
    setProductMeasurement('');
    setProductQuantity(0);
  };

  /**
   * Validates the upload form.
   * 
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateUploadForm = () => {
    const requiredFields = [
      selectedCategory,
      selectedSubCategory,
      selectedProduct,
      catalogueName,
      productQuantity,
      productMeasurement,
      productPrice
    ];
  
    if (requiredFields.some(field => !field || field.toString().trim() === '')) {
      alert("Please fill out all required fields.");
      return false;
    }
  
    if (Number(productPrice) <= 0 || Number(productQuantity) <= 0) {
      alert("Price and quantity must be positive numbers");
      return false;
    }
  
    return true;
  };

  const handleUpload = async () => {
    if (validateUploadForm()) {
      const finalUnit = UNIT_MAPPING[measurementUnit.toLowerCase()] || 'pieces';
      
      const newItem = {
        name: selectedProduct,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        catalogue_name: catalogueName,
        price: Number(productPrice),
        stock_quantity: Number(productQuantity),
        product_measurement: Number(productMeasurement),
        measurement_unit: measurementUnit,
      };
  
      try {
        const response = await fetch('http://localhost:8000/vendors/products/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify(newItem)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Server error: ${JSON.stringify(errorData)}`);
        }
        
        const createdItem = await response.json();
        setAddedItems(prev => [...prev, createdItem]);
        handleCancel(); // Reset form after success
        
      } catch (error) {
        console.error('Error adding product:', error);
        alert(`Add failed: ${error.message}`);
      }
    }
  };

  const handleDeleteItem = async (index) => {
    const itemId = addedItems[index].id;
    try {
      const response = await fetch(`http://localhost:8000/vendors/products/${itemId}/`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) throw new Error('Delete failed');
      
      const updatedItems = addedItems.filter((_, i) => i !== index);
      setAddedItems(updatedItems);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  /**
   * Handles logout action.
   */
  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");
      if (!accessToken || !refreshToken) {
        console.error("No tokens found. Logging out.");
        onLogout();
        return;
      }
      const response = await fetch("http://localhost:8000/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (response.status === 200) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      onLogout();
    }
  };

  const handleImageUpload = async (event, itemId) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await fetch(`http://localhost:8000/vendors/products/${itemId}/`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: formData
      });
  
      if (!response.ok) throw new Error('Image upload failed');
      
      const updatedItem = await response.json();
      setAddedItems(prev => prev.map(item => 
        item.id === itemId ? {...item, image: updatedItem.image} : item
      ));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  /**
   * Handles edit change.
   * 
   * @param {number} index - The index of the item to edit.
   * @param {string} field - The field to edit.
   * @param {string} value - The new value.
   */
  const handleEditChange = (index, field, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index][field] = value;
    setAddedItems(updatedItems);
  };

  /**
   * Handles subcategory edit change.
   * 
   * @param {number} index - The index of the item to edit.
   * @param {string} value - The new value.
   */
  const handleSubCategoryEditChange = (index, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index].subCategory = value;
    updatedItems[index].product = ""; 
    setAddedItems(updatedItems);
  };

  const handleSaveEdit = async (index) => {
    const item = addedItems[index];
    try {
      const response = await fetch(`http://localhost:8000/vendors/products/${item.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(item)
      });
  
      if (!response.ok) throw new Error('Update failed');
      
      const updatedItem = await response.json();
      const updatedItems = [...addedItems];
      updatedItems[index] = updatedItem;
      setAddedItems(updatedItems);
      setEditIndex(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
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

  /**
   * Renders the profile page.
   * 
   * @returns {JSX.Element} The profile page component.
   */
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
              {data[item.category]?.[item.subcategory]?.find(p => p.name === item.name)?.image && (
                <div className="card-image">
                  <img 
                    src={data[item.category][item.subcategory].find(p => p.name === item.name).image} 
                    alt={item.name} 
                  />
                </div>
              )}
  
              {editIndex === index ? (
                // Editable Mode
                <div className="edit-form-container">
                  {/* Non-editable Fields */}
                  <div className="non-editable-fields">
                    <div className="field-group">
                      <label>Category:</label>
                      <div className="static-value">{item.category}</div>
                    </div>
                    <div className="field-group">
                      <label>Subcategory:</label>
                      <div className="static-value">{item.subcategory}</div>
                    </div>
                    <div className="field-group">
                      <label>Product:</label>
                      <div className="static-value">{item.name}</div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="editable-fields">
                    <div className="input-group">
                      <label>Catalogue Name:</label>
                      <input
                        type="text"
                        value={item.catalogue_name}
                        onChange={(e) => handleEditChange(index, "catalogue_name", e.target.value)}
                        className="editable-input"
                        placeholder="Catalogue name"
                      />
                    </div>

                    <div className="input-group">
                      <label>Stock Quantity:</label>
                      <input
                        type="number"
                        value={item.stock_quantity}
                        onChange={(e) => handleEditChange(index, "stock_quantity", e.target.value)}
                        className="editable-input"
                        placeholder="Quantity"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="edit-action-buttons">
                    <button className="save-btn" onClick={() => handleSaveEdit(index)}>
                      Save Changes
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        if (originalItem !== null) {
                          const updatedItems = [...addedItems];
                          updatedItems[editIndex] = originalItem;
                          setAddedItems(updatedItems);
                        }
                        setEditIndex(null);
                        setOriginalItem(null);
                      }}
                    >
                      Discard Changes
                    </button>
                  </div>
                </div>
              ) : (
                // Static View Mode
                <>
                  <div className="card-header">
                    <h3>{item.name}</h3>
                    <span className="category-badge">{item.category}</span>
                  </div>
                  <p><strong>Subcategory:</strong> {item.subcategory}</p>
                  <p><strong>Catalogue Name:</strong> {item.catalogue_name}</p>
                  <p><strong>Price:</strong> ${Number(item.price || 0).toFixed(2)}</p>
                  <p><strong>Measurement:</strong> {item.product_measurement || 'N/A'} {item.measurement_unit || ''}</p>
                  <p><strong>Quantity:</strong> {item.stock_quantity}</p>
  
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

  /**
   * Renders the Add Supply page.
   * 
   * @returns {JSX.Element} The Add Supply page component.
   */
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
              products.map((product, index) => (
                <option key={index} value={product.name}>
                  {product.name}
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

        {/* Price */}
        <div className="input-group">
          <label>Price</label>
          <input 
            type="text" 
            value={`$${productPrice.toFixed(2)}`} 
            readOnly 
          />
        </div>
  
        {/* Measurement */}
        <div className="input-group">
          <label>Measurement</label>
          <input
            type="text"
            value={`${productMeasurement} ${measurementUnit}`}
            readOnly
          />
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
        
        {selectedProduct && (
          <div className="image-preview">
            <img 
              src={data[selectedCategory]?.[selectedSubCategory]?.find(p => p.name === selectedProduct)?.image || ''} 
              alt="Product Preview" 
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
  
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

  /**
   * Renders the Setting page with supplier information.
   * 
   * @returns {JSX.Element} The Setting page component.
   */
  const renderSettingPage = () => (
    <div className="setting-page-container">
      <h2>Supplier Information</h2>
      {supplierData ? (
        <div className="supplier-info">
          <p><strong>Name:</strong> {supplierData.first_name + ' ' + supplierData.last_name}</p>
          <p><strong>Email:</strong> {supplierData.email}</p>
          <p><strong>Company:</strong> {supplierData.company}</p>
          <p><strong>Phone:</strong> {supplierData.phone_number}</p>
          <p><strong>Address:</strong> {supplierData.address}</p>
        </div>
      ) : (
        <p>Loading supplier information...</p>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(1000);

  /**
   * Renders the Search page.
   * 
   * @returns {JSX.Element} The Search page component.
   */
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

  /**
   * Renders the content based on the active page.
   * 
   * @returns {JSX.Element} The content component.
   */
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
          onClick={() => navigate("/")}
          className="sidebar-icon logo-button"
          title="Home"
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
            <h2>Welcome {supplierData?.first_name || ""}</h2>
            <p>{new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</p>
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
