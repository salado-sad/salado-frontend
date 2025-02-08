import React, { useState, useEffect } from "react";
import "./ExploreSalads.css";

const ExploreSalads = ({ onBackToLanding }) => {
    const [packages] = useState([
      {
        name: "Agha Farid",
        price: 800.85,
        description: "Bache khoobie. Aziatesh nakonin. Bayad khordesh",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQHP1k_GASXLmQ/profile-displayphoto-shrink_400_400/0/1720623177822?e=1744243200&v=beta&t=ZMqV6ju4Zd6YfWp99lt40uwCUs9SA_vvCoxp1ldfMNA",
        products: [
          { name: "Strawberry", quantity: 5 },
          { name: "Spinach", quantity: 3 },
        ],
      },
      {
        name: "Classic Caesar",
        price: 15.99,
        description: "Crispy romaine, parmesan cheese, and classic Caesar dressing.",
        image: "https://source.unsplash.com/200x200/?salad",
        products: [
          { name: "Lettuce", quantity: 4 },
          { name: "Parmesan", quantity: 2 },
        ],
      },
      {
        name: "Greek Delight",
        price: 12.50,
        description: "Feta cheese, olives, tomatoes, and cucumbers in a light dressing.",
        image: "https://source.unsplash.com/200x200/?healthy-food",
        products: [
          { name: "Feta Cheese", quantity: 3 },
          { name: "Olives", quantity: 5 },
        ],
      },
    ]);

    const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    });

    const [showCart, setShowCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceFilter, setPriceFilter] = useState("");

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

    // Filter logic: First filter by search, then by price
    const filteredPackages = packages
  .filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) // Search by package name
  )
  .filter((pkg) => {
    if (!priceFilter) return true;
    return pkg.price <= parseFloat(priceFilter);
  });


    return (
      <div className="package-list">
        <h1>Explore Salads</h1>

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
                <img src={pkg.image} alt={pkg.name} className="package-image" />
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

        <button onClick={onBackToLanding} className="back-button">
          Back to Home
        </button>
      </div>
    );
  };

export default ExploreSalads;
