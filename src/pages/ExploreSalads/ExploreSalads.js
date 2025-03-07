import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreSalads.css";
import defaultImage from "../../assets/salad.png";

/**
 * ExploreSalads component for displaying and managing salad packages.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ExploreSalads = ({ user }) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/management/packages/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const formattedData = data
          .filter(pkg => pkg.is_active) // Filter out inactive packages
          .map(pkg => ({
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
    if (user === "customer") {
      fetch('http://127.0.0.1:8000/cart/', {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then(response => response.json())
        .then(data => setCart(data))
        .catch(error => console.error('Error fetching cart:', error));
        console.log("Cart", cart);
    }
  }, [user]);

  const addToCart = (pkg) => {
    if (user !== "customer") {
      alert("Please log in to your account first.");
      return;
    }

    if (quantity > pkg.stock_quantity) {
      alert("Cannot add more than available stock.");
      return;
    }

    fetch('http://127.0.0.1:8000/cart/items/', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        package_id: pkg.id,
        quantity: quantity
      })
    })
      .then(response => response.json())
      .then(() => {
        fetch('http://127.0.0.1:8000/cart/', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then(response => response.json())
          .then(data => setCart(data))
          .catch(error => console.error('Error fetching cart:', error));
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const clearCart = () => {
    setCart([]);
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearchChange = useCallback(debounce((e) => {
    setSearchQuery(e.target.value);
  }, 300), []);

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
              defaultValue={searchQuery}
              onChange={handleSearchChange}
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
                  <img src={pkg.image || defaultImage} alt={pkg.name} className="package-image" />
                  <h2>{pkg.name}</h2>
                  <p>{pkg.description}</p>
                  <p className="package-price">Price: ${pkg.price.toFixed(2)}</p>
                  <p className="ingredients-title">Ingredients:</p>
                  <ul className="product-list">
                    {pkg.products.map((product, idx) => (
                      <li key={idx} className="product-item">
                        {product.name}: {product.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className="package-stock">Stock: {pkg.stock_quantity}</p>
                  <input
                    type="number"
                    min="1"
                    max={pkg.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="quantity-input"
                  />
                  <button className="add-to-cart-btn" onClick={() => addToCart(pkg)}>
                    Add to Cart
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

      <button onClick={() => navigate("/")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default ExploreSalads;