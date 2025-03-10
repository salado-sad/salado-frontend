import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";
import profileIcon from "../../assets/settings-icon.svg";
import purchaseIcon from "../../assets/basket-icon.svg";
import historyIcon from "../../assets/history-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import logo from "../../assets/logo_mono.png";
import defaultImage from "../../assets/salad.png";
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
  const [packages, setPackages] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (activePage === "profile") {
      fetchUserProfile();
    }
  }, [activePage]);

  useEffect(() => {
    if (activePage === "purchase") {
      fetchPackages();
      fetchCart();
    }
  }, [activePage]);

  const fetchPurchaseHistory = useCallback(async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/cart/purchases/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const filteredData = data.filter(purchase => purchase.user === profileData.id);
      setPurchaseHistory(filteredData);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  }, [profileData]);

  useEffect(() => {
    if (activePage === "history") {
      fetchPurchaseHistory();
    }
  }, [activePage, fetchPurchaseHistory]);

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

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/management/packages/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const formattedData = data
        .filter(pkg => pkg.is_active) // Filter out inactive packages
        .map(pkg => ({
          ...pkg,
          price: parseFloat(pkg.price) || 0,
        }));
      setPackages(formattedData);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      const response = await fetch('http://127.0.0.1:8000/cart/', {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setCart(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = (pkg, quantity) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No tokens found.");
      alert("Please log in to your account first.");
      return;
    }

    const existingItem = cart.find(item => item.package === pkg.name);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQuantity > pkg.stock_quantity) {
      alert("Cannot add more than available stock.");
      return;
    }

    fetch('http://127.0.0.1:8000/cart/items/', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        package_id: pkg.id,
        quantity: quantity
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetchCart();
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const removeFromCart = (itemId) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No tokens found.");
      alert("Please log in to your account first.");
      return;
    }

    fetch(`http://127.0.0.1:8000/cart/items/${itemId}/`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchCart();
      })
      .catch(error => console.error('Error removing item from cart:', error));
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No tokens found.");
      alert("Please log in to your account first.");
      return;
    }

    fetch(`http://127.0.0.1:8000/cart/items/${itemId}/`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: newQuantity
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetchCart();
      })
      .catch(error => console.error('Error updating cart item quantity:', error));
  };

  const incrementQuantity = (itemId) => {
    const item = cart.find(p => p.id === itemId);
    if (!item) {
      console.error("Item not found in cart.");
      return;
    }

    const packageItem = packages.find(pkg => pkg.name === item.package);
    if (!packageItem) {
      console.error("Package not found.");
      return;
    }

    if (item.quantity + 1 > packageItem.stock_quantity) {
      alert("Cannot add more than available stock.");
      return;
    }

    updateCartItemQuantity(itemId, item.quantity + 1);
  };

  const decrementQuantity = (itemId) => {
    const item = cart.find(p => p.id === itemId);
    if (!item) {
      console.error("Item not found in cart.");
      return;
    }

    if (item.quantity - 1 < 1) {
      return;
    }

    updateCartItemQuantity(itemId, item.quantity - 1);
  };

  const finalizePurchase = () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      console.error("No tokens found.");
      toast.error("Please log in to your account first.");
      return;
    }
  
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
  
    const purchasePromises = cart.map(item => {
      return fetch(`http://localhost:8000/cart/items/${item.id}/purchase/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Purchase successful for item:", item.id);
      })
      .catch(error => {
        console.error('Error finalizing purchase for item:', item.id, error);
        toast.error(`Failed to purchase item: ${item.package}`);
      });
    });
  
    Promise.all(purchasePromises)
      .then(() => {
        toast.success("Purchase completed successfully!");
        fetchCart(accessToken); // Refresh the cart after purchase
      })
      .catch(error => {
        console.error('Error finalizing purchase:', error);
        toast.error("Failed to complete purchase.");
      });
  };

  const renderCart = () => (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
        <button className="close-cart" onClick={() => setShowCart(false)}>&times;</button>
      </div>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image || defaultImage} className="cart-item-image" alt={item.package} />
            <div className="cart-item-details">
              <h4>{item.package}</h4>
              <div className="quantity-controls">
                <button onClick={() => decrementQuantity(item.id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => incrementQuantity(item.id)}>+</button>
              </div>
              <p className="item-total">${(item.cost).toFixed(2)}</p>
            </div>
            <button className="remove-item" onClick={() => removeFromCart(item.id)}>&times;</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cart.reduce((sum, item) => sum + (item.cost), 0).toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={finalizePurchase}>Proceed to Checkout</button>
      </div>
    </div>
  );

  const renderCartButton = () => (
    <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
      <span className="cart-icon">🛒</span>
      <span className="item-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
    </button>
  );

  const renderPurchasePage = () => {
    const handleQuantityChange = (pkgId, value) => {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [pkgId]: value
      }));
    };

    return (
      <div className="purchase-page-container">
        <h2>Available Packages</h2>
        {renderCartButton()}
        <div className="product-grid">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <img src={pkg.image || defaultImage} className="package-image" alt={pkg.name} />
              <div className="package-info">
                <h3>{pkg.name}</h3>
                <p className="package-description">{pkg.description}</p>
                <div className="package-products">
                  {pkg.products.map((product) => (
                    <div className="product-badge" key={product.name}>
                      <span>{product.quantity}x {product.name}</span>
                    </div>
                  ))}
                </div>
                <p className="package-price">Price: ${pkg.price.toFixed(2)}</p>
                <p className="package-stock">Stock: {pkg.stock_quantity}</p>
                <input
                  type="number"
                  min="0"
                  max={pkg.stock_quantity}
                  value={quantities[pkg.id] || 0}
                  onChange={(e) => handleQuantityChange(pkg.id, parseInt(e.target.value))}
                  className="quantity-input"
                />
                <button className="purchase-btn" onClick={() => addToCart(pkg, quantities[pkg.id] || 1)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
        {showCart && renderCart()}
      </div>
    );
  };

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

  const renderPurchaseHistory = () => (
    <div className="purchase-history-container">
      <h2>Purchase History</h2>
      {purchaseHistory.length > 0 ? (
        purchaseHistory.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-date">
              Order Date: {new Date(order.purchased_at).toLocaleDateString()} {new Date(order.purchased_at).toLocaleTimeString()}
            </div>
            <div className="order-items"><strong>Package:</strong> {order.package}</div>
            <div className="order-quantity"><strong>Quantity:</strong> {order.quantity}</div>
            <div className="order-status"><strong>Status:</strong> {order.status}</div>
          </div>
        ))
      ) : (
        <p>No purchase history found.</p>
      )}
    </div>
  );

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