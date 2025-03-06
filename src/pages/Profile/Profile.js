import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import profileIcon from "../../assets/settings-icon.svg";
import purchaseIcon from "../../assets/basket-icon.svg";
import historyIcon from "../../assets/history-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import logo from "../../assets/logo_mono.png";
import Cookies from "js-cookie";

/**
 * ProfileCustomer component renders the profile page for the customer.
 * @param {Object} props - The component props.
 * @param {Function} props.onLogout - The function to call when the user logs out.
 */
const ProfileCustomer = ({ onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [activePage, setActivePage] = useState("profile");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const navigate = useNavigate();

  // Sample packages data
  const [packages] = useState([
    {
      name: 'Agha Farid',
      price: 800.85,
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
   * Adds a package to the cart.
   * @param {Object} pkg - The package to add to the cart.
   */
  const addToCart = (pkg) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.name === pkg.name);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...pkg, quantity: 1 }];
    });
    setShowCart(true);
  };

  /**
   * Removes a package from the cart.
   * @param {string} packageName - The name of the package to remove from the cart.
   */
  const removeFromCart = (packageName) => {
    setCart(prev => prev.filter(item => item.name !== packageName));
  };

  /**
   * Renders the cart sidebar.
   * @returns {JSX.Element} The cart sidebar component.
   */
  const renderCart = () => (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
        <button className="close-cart" onClick={() => setShowCart(false)}>&times;</button>
      </div>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.name}>
            <img src={item.image} className="cart-item-image" alt={item.name} />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <div className="quantity-controls">
                <button onClick={() => setCart(prev => prev.map(p => p.name === item.name ? {...p, quantity: Math.max(1, p.quantity - 1)} : p))}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => setCart(prev => prev.map(p => p.name === item.name ? {...p, quantity: p.quantity + 1} : p))}>+</button>
              </div>
              <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button className="remove-item" onClick={() => removeFromCart(item.name)}>&times;</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
        </div>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );

  /**
   * Renders the cart button.
   * @returns {JSX.Element} The cart button component.
   */
  const renderCartButton = () => (
    <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
      <span className="cart-icon">🛒</span>
      <span className="item-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
    </button>
  );

  /**
   * Renders the purchase page.
   * @returns {JSX.Element} The purchase page component.
   */
  const renderPurchasePage = () => (
    <div className="purchase-page-container">
      <h2>Available Packages</h2>
      <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>🛒 View Cart</button>
      <div className="product-grid">
        {packages.map((pkg) => (
          <div className="package-card" key={pkg.name}>
            <img src={pkg.image} className="package-image" alt={pkg.name} />
            <div className="package-info">
              <h3>{pkg.name}</h3>
              <p className="package-description">{pkg.description}</p>
              <div className="package-products">
                {pkg.products.map((product) => (
                  <div className="product-badge" key={product.name}>
                    <img src={product.image} alt={product.name} />
                    <span>{product.quantity}x {product.name}</span>
                  </div>
                ))}
              </div>
              <div className="package-footer">
                <span className="package-price">${pkg.price.toFixed(2)}</span>
                <button className="purchase-btn" onClick={() => addToCart(pkg)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCart && renderCart()}
    </div>
  );

  // Fetch profile data when the user navigates to the "profile" page
  useEffect(() => {
    if (activePage === "profile") {
      fetchUserProfile();
    }
  }, [activePage]);

  /**
   * Fetches the user profile data.
   */
  const fetchUserProfile = async () => {
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
        setProfileData(result);
      } else {
        console.error("Failed to fetch profile:", result);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  /**
   * Renders the profile information.
   * @returns {JSX.Element} The profile information component.
   */
  const renderProfileInfo = () => (
    <div className="profile-info-container">
      <h2>Your Profile Information</h2>
      <div className="profile-info-card">
        <div className="info-group">
          <div className="info-label">Full Name</div>
          <div className="info-value">{profileData?.first_name + ' ' + profileData?.last_name || "N/A"}</div>
        </div>
        <div className="info-group">
          <div className="info-label">Email</div>
          <div className="info-value">{profileData?.email || "N/A"}</div>
        </div>
        <div className="info-group">
          <div className="info-label">Shipping Address</div>
          <div className="info-value">{profileData?.address || "N/A"}</div>
        </div>
        <div className="info-group">
          <div className="info-label">Payment Method</div>
          <div className="info-value">{profileData?.payment_method || "N/A"}</div>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );

  /**
   * Handles user logout.
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

  /**
   * Renders the purchase history.
   * @returns {JSX.Element} The purchase history component.
   */
  const renderPurchaseHistory = () => (
    <div className="purchase-history-container">
      <h2>Purchase History</h2>
      {purchaseHistory.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-date">Order Date: {order.date}</div>
          <div className="order-items"><strong>Items:</strong> {order.items.join(", ")}</div>
          <div className="order-total"><strong>Total:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
        </div>
      ))}
    </div>
  );

  /**
   * Renders content based on the active page.
   * @returns {JSX.Element|null} The content component.
   */
  const renderContent = () => {
    switch (activePage) {
      case "purchase":
        return renderPurchasePage();
      case "profile":
        return renderProfileInfo();
      case "history":
        return renderPurchaseHistory();
      default:
        return null;
    }
  };

  return (
    <div className="profile-customer-container">
      {/* Sidebar */}
      <div className="profile-customer-sidebar">
        <button onClick={() => navigate("/")} className="sidebar-icon logo-button" title="Home">
          <img src={logo} alt="Company Logo" />
        </button>
        <button className={`sidebar-icon ${activePage === "purchase" ? "active" : ""}`} onClick={() => setActivePage("purchase")} title="Purchase Products">
          <img src={purchaseIcon} alt="Purchase Icon" />
        </button>
        <button className={`sidebar-icon ${activePage === "profile" ? "active" : ""}`} onClick={() => setActivePage("profile")} title="Profile Information">
          <img src={profileIcon} alt="Profile Icon" />
        </button>
        <button className={`sidebar-icon ${activePage === "history" ? "active" : ""}`} onClick={() => setActivePage("history")} title="Purchase History">
          <img src={historyIcon} alt="History Icon" />
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-customer-main">
        {/* Header */}
        <div className="profile-customer-header">
          <div>
            <h2>Welcome {profileData?.first_name || ""}</h2>
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

export default ProfileCustomer;