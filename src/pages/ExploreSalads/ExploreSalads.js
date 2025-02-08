import React, { useState, useEffect } from "react";
import "./ExploreSalads.css";

const ExploreSalads = ({ onBackToLanding }) => {
  const [packages, setPackages] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/management/packages/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Ensure prices are numbers
        const formattedData = data.map(pkg => ({
          ...pkg,
          price: parseFloat(pkg.price) || 0,
        }));
        setPackages(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
        setError('Failed to load packages');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (pkg) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === pkg.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === pkg.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...pkg, quantity: 1 }];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const filteredPackages = packages
    .filter((pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((pkg) => {
      if (!priceFilter) return true;
      return pkg.price <= parseFloat(priceFilter);
    });

  return (
    <div className="package-list">
      <h1>Explore Salads</h1>

      {loading && <p>Loading packages...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {/* Search Bar and Price Filter */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="price-input"
            />
          </div>

          {/* Display Filtered Packages */}
          <div className="package-grid">
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg, index) => (
                <div key={index} className="package-card">
                  <img src={pkg.image || "placeholder-image-url.jpg"} alt={pkg.name} className="package-image" />
                  <h2>{pkg.name}</h2>
                  <p>{pkg.description}</p>
                  <p className="package-price">Price: ${pkg.price.toFixed(2)}</p>
                  <ul className="product-list">
                    {pkg.products.map((product, idx) => (
                      <li key={idx} className="product-item">
                        {product.name}: {product.quantity}
                      </li>
                    ))}
                  </ul>
                  <button className="add-to-cart-btn" onClick={() => addToCart(pkg)}>
                    +
                  </button>
                </div>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>

          {/* Cart Section */}
          <div className="cart-section">
            <button className="toggle-cart-btn" onClick={() => setShowCart(!showCart)}>
              {showCart ? "Hide Cart 🛒" : "View Cart 🛒"}
            </button>
            {showCart && (
              <div className="cart-container">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <ul className="cart-list">
                    {cart.map((item, index) => (
                      <li key={index} className="cart-item">
                        <span>{item.name}</span> - <strong>{item.quantity}</strong> pcs
                      </li>
                    ))}
                  </ul>
                )}
                {cart.length > 0 && <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>}
              </div>
            )}
          </div>
        </>
      )}

      <button onClick={onBackToLanding} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default ExploreSalads;