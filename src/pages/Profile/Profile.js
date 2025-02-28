import React, { useState } from "react";
import "./Profile.css";
import profileIcon from "../../assets/settings-icon.svg";
import purchaseIcon from "../../assets/basket-icon.svg";
import historyIcon from "../../assets/history-icon.svg";
import bellIcon from "../../assets/bell-icon.svg";
import logo from "../../assets/logo_mono.png";
const ProfileCustomer = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("purchase");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]); // Added missing state


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

  const removeFromCart = (packageName) => {
    setCart(prev => prev.filter(item => item.name !== packageName));
  };

  const renderCart = () => (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
        <button className="close-cart" onClick={() => setShowCart(false)}>
          &times;
        </button>
      </div>
      
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.name}>
            <img src={item.image} className="cart-item-image" alt={item.name} />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <div className="quantity-controls">
                <button 
                  onClick={() => setCart(prev => 
                    prev.map(p => 
                      p.name === item.name 
                        ? {...p, quantity: Math.max(1, p.quantity - 1)} 
                        : p
                    )
                  )}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => setCart(prev => 
                    prev.map(p => 
                      p.name === item.name 
                        ? {...p, quantity: p.quantity + 1} 
                        : p
                    )
                  )}
                >
                  +
                </button>
              </div>
              <p className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <button 
              className="remove-item"
              onClick={() => removeFromCart(item.name)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
  
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
        </div>
        <button className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
  const renderCartButton = () => (
    <button 
      className="cart-toggle-btn"
      onClick={() => setShowCart(!showCart)}
    >
      <span className="cart-icon">🛒</span>
      <span className="item-count">
        {cart.reduce((sum, item) => sum + item.quantity, 0)}
      </span>
    </button>
  );

  const renderPurchasePage = () => (
    <div className="purchase-page-container">
      <h2>Available Packages</h2>
      <button 
        className="cart-toggle-btn"
        onClick={() => setShowCart(!showCart)}
      >
        🛒 View Cart
      </button>
      
      <div className="product-grid">
        {packages.map((pkg) => (
          <div className="package-card" key={pkg.name}>
            <img 
              src={pkg.image} 
              className="package-image" 
              alt={pkg.name} 
            />
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
                <span className="package-price">
                  ${pkg.price.toFixed(2)}
                </span>
                <button 
                  className="purchase-btn"
                  onClick={() => addToCart(pkg)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCart && renderCart()}
    </div>
  );

const renderProfileInfo = () => (
<div className="profile-info-container">
<h2>Your Profile Information</h2>
<div className="profile-info-card">
<div className="info-group">
<div className="info-label">Full Name</div>
<div className="info-value">John Customer</div>
</div>
<div className="info-group">
<div className="info-label">Email</div>
<div className="info-value">john.customer@example.com</div>
</div>
<div className="info-group">
<div className="info-label">Shipping Address</div>
<div className="info-value">123 Green Street, Eco City</div>
</div>
<div className="info-group">
<div className="info-label">Payment Method</div>
<div className="info-value">VISA •••• 1234</div>
</div>
</div>
</div>
);

const renderPurchaseHistory = () => (
  <div className="purchase-history-container">
  <h2>Purchase History</h2>
  {purchaseHistory.map((order) => (
  <div className="order-card" key={order.id}>
  <div className="order-date">Order Date: {order.date}</div>
  <div className="order-items">
  <strong>Items:</strong> {order.items.join(", ")}
  </div>
  <div className="order-total">
  <strong>Total:</strong>
  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
  </div>
  </div>
  ))}
  </div>
  );
  
  const renderContent = () => {
    switch (activePage) {
      case "purchase":
        return renderPurchasePage();
      case "profile":
        return renderProfileInfo();
      case "history":
        return renderPurchaseHistory(); // Now properly defined
      default:
        return null;
    }
  };

return (
<div className="profile-customer-container">
{/* Sidebar */}
<div className="profile-customer-sidebar">
<button onClick={onLogout} className="sidebar-icon logo-button" title="Logout" >
<img src={logo} alt="Company Logo" />
</button>
Copy

    <button
      className={`sidebar-icon ${activePage === "purchase" ? "active" : ""}`}
      onClick={() => setActivePage("purchase")}
      title="Purchase Products"
    >
      <img src={purchaseIcon} alt="Purchase Icon" />
    </button>
    <button
      className={`sidebar-icon ${activePage === "profile" ? "active" : ""}`}
      onClick={() => setActivePage("profile")}
      title="Profile Information"
    >
      <img src={profileIcon} alt="Profile Icon" />
    </button>
    <button
      className={`sidebar-icon ${activePage === "history" ? "active" : ""}`}
      onClick={() => setActivePage("history")}
      title="Purchase History"
    >
      <img src={historyIcon} alt="History Icon" />
    </button>
  </div>

  {/* Main Content */}
  <div className="profile-customer-main">
    {/* Header */}
    <div className="profile-customer-header">
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

export default ProfileCustomer;
