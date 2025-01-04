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
  Vegetables: {
    LeafyGreens: ['Romaine Lettuce', 'Spinach', 'Arugula', 'Kale', 'Swiss Chard', 'Butterhead Lettuce'],
    Cruciferous: ['Broccoli', 'Cauliflower', 'Brussels Sprouts', 'Cabbage'],
    Root: ['Carrot', 'Beetroot', 'Turnip', 'Radish', 'Sweet Potato'],
    Allium: ['Garlic', 'Onion', 'Shallots', 'Leeks'],
    Nightshades: ['Tomato', 'Bell Pepper', 'Eggplant']
  },
  Fruits: {
    Citrus: ['Lemon', 'Lime', 'Orange', 'Grapefruit', 'Mandarin'],
    Tropical: ['Avocado', 'Mango', 'Pineapple', 'Papaya', 'Banana'],
    Berries: ['Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Goji Berry'],
    StoneFruits: ['Peach', 'Plum', 'Cherry', 'Apricot']
  },
  Herbs: {
    LeafyHerbs: ['Basil', 'Mint', 'Parsley', 'Coriander', 'Thyme', 'Oregano'],
    RootHerbs: ['Ginger', 'Turmeric', 'Horseradish']
  },
  Dairy: {
    Milk: ['Cow Milk', 'Goat Milk', 'Almond Milk', 'Oat Milk', 'Soy Milk'],
    Cheese: ['Cheddar', 'Mozzarella', 'Feta', 'Parmesan', 'Brie', 'Cottage Cheese'],
    Yogurt: ['Greek Yogurt', 'Natural Yogurt', 'Flavored Yogurt']
  },
  Grains: {
    Rice: ['White Rice', 'Brown Rice', 'Basmati Rice', 'Jasmine Rice', 'Wild Rice'],
    Pasta: ['Spaghetti', 'Penne', 'Fusilli', 'Macaroni', 'Lasagna Sheets'],
    Quinoa: ['Red Quinoa', 'White Quinoa', 'Black Quinoa'],
    Couscous: ['Moroccan Couscous', 'Israeli Couscous']
  },
  Proteins: {
    Meat: ['Chicken', 'Beef', 'Pork', 'Lamb'],
    Fish: ['Salmon', 'Tuna', 'Cod', 'Mackerel', 'Trout'],
    PlantBased: ['Tofu', 'Tempeh', 'Lentils', 'Chickpeas', 'Black Beans', 'Quorn']
  }
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
  const [addedItems, setAddedItems] = useState([
    {
      category: "Fruits",
      subCategory: "Berries",
      product: "Strawberry",
      catalogueName: "Fresh Organic Strawberries",
      productMeasurement: "1 Kilogram",
      productQuantity: 25,
      image: "https://via.placeholder.com/150/FF7F7F/ffffff?text=Strawberry", // Placeholder image for Strawberry
    },
    {
      category: "Vegetables",
      subCategory: "LeafyGreens",
      product: "Spinach",
      catalogueName: "Fresh Farm Spinach",
      productMeasurement: "500 Grams",
      productQuantity: 50,
      image: "https://via.placeholder.com/150/7FFF7F/ffffff?text=Spinach", // Placeholder image for Spinach
    },
  ]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Tracks the index of the item being edited
  const [deleteIndex, setDeleteIndex] = useState(null); // Tracks the index of the item to delete
  const [isModalVisible, setModalVisible] = useState(false); // Controls modal visibility
  const [originalItem, setOriginalItem] = useState(null); // Stores the original values of the item being edited

  // Handlers
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
        category: selectedCategory,
        subCategory: selectedSubCategory,
        product: selectedProduct,
        catalogueName,
        productMeasurement: `${productMeasurement} ${measurementUnit}`,
        productQuantity,
        image: uploadedImage, // Include uploaded image
      };
  
      setAddedItems((prevItems) => [...prevItems, newItem]);
      handleCancel();
      setUploadedImage(null); // Clear the uploaded image after adding the item
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...addedItems];
    updatedItems.splice(index, 1); // Remove the item at the specified index
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
      reader.onload = () => setUploadedImage(reader.result); // Read image as Base64 string
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
    updatedItems[index].product = ""; // Reset product selection if subcategory changes
    setAddedItems(updatedItems);
  };

  const handleSaveEdit = (index) => {
    setEditIndex(null); // Exit edit mode
  };

  const handleCancelEdit = () => {
    setEditIndex(null); // Exit edit mode without saving
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

  const renderSearchPage = () => (
    <div>
      <h1>Search items here</h1>
    </div>
  );

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
      <button
        onClick={handleLogout}
        className="sidebar-icon logo-button"
        title="Logout"
      >
        <img src={logo} alt="Home Logo" />
      </button>

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