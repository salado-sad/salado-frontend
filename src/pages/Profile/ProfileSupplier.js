import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
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
  const [productPrice, setProductPrice] = useState(0);
  const [addedItems, setAddedItems] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null); 
  const [deleteIndex, setDeleteIndex] = useState(null); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [originalItem, setOriginalItem] = useState(null); 
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
    const productName = event.target.value;
    if (selectedCategory && selectedSubCategory) {
      const product = data[selectedCategory][selectedSubCategory]
        .find(p => p.name === productName);
      
      if (product) {
        setProductMeasurement(product.measurement);
        setMeasurementUnit(product.unit);
        setProductPrice(product.price);
      }
      setSelectedProduct(productName);
    }
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
    if (!selectedCategory || !selectedSubCategory || 
        !selectedProduct || !catalogueName || !productQuantity) {
      alert("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (validateUploadForm()) {
      const newItem = {
        name: selectedProduct,
        category: selectedCategory,
        subcategory: selectedSubCategory,
        catalogue_name: catalogueName,
        price: Number(productPrice),
        stock_quantity: Number(productQuantity),
        product_measurement: Number(productMeasurement),
        measurement_unit: measurementUnit
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
  
        if (!response.ok) throw new Error('Create failed');
        
        const createdItem = await response.json();
        setAddedItems(prev => [...prev, {
          ...createdItem,
          price: createdItem.price || 0.00 // Ensure price exists
        }]);
      } catch (error) {
        console.error('Error adding product:', error);
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

  const handleLogout = () => {
    onLogout();
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
                      value={item.subcategory}
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
                    value={item.catalogue_name}
                    onChange={(e) => handleEditChange(index, "catalogueName", e.target.value)}
                    className="editable-input"
                    placeholder="Enter catalogue name"
                  />
                  <input
                    type="text"
                    value={item.product_measurement}
                    onChange={(e) =>
                      handleEditChange(index, "productMeasurement", e.target.value)
                    }
                    className="editable-input"
                    placeholder="Enter measurement"
                  />
                  <input
                    type="number"
                    value={item.stock_quantity}
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
        
        {/* Image Upload */}
        <div className="input-group">
          <label htmlFor="image-upload">Upload Item Image</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                // For new items, you'll need to handle this after creation
                // For existing items: handleImageUpload(e, item.id)
              }
            }}
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
