import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ExploreSalads.css";
import defaultImage from "../../assets/salad.png";
import Cookies from "js-cookie";

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
  const [quantities, setQuantities] = useState({});

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
    const accessToken = Cookies.get("access_token");
    if (accessToken && user === "customer") {
      fetchCart(accessToken);
    }
  }, [user]);

  const fetchCart = (accessToken) => {
    fetch('http://127.0.0.1:8000/cart/', {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched cart data:", data);
        setCart(data.items || []);
      })
      .catch(error => console.error('Error fetching cart:', error));
  };

  const handleQuantityChange = (pkgId, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [pkgId]: value
    }));
  };

  const addToCart = (pkg) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || user !== "customer") {
      console.error("No tokens found.");
      toast.error("Please log in to your account first.");
      return;
    }
  
    const quantity = quantities[pkg.id] || 0;
  
    if (quantity === 0) {
      toast.error("Quantity cannot be zero.");
      return;
    }
  
    const existingItem = cart.find(item => item.package === pkg.name);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  
    if (newQuantity > pkg.stock_quantity) {
      toast.error("Cannot add more than available stock.");
      return;
    }
  
    console.log("Adding to cart:", pkg);
    console.log("Quantity:", quantity);
  
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
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Response data:", data);
        fetchCart(accessToken); // Fetch the cart from the API after updating
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const removeFromCart = (itemId) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || user !== "customer") {
      console.error("No tokens found.");
      toast.error("Please log in to your account first.");
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
        console.log("Item removed from cart");
        fetchCart(accessToken); // Fetch the cart from the API after updating
      })
      .catch(error => console.error('Error removing item from cart:', error));
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || user !== "customer") {
      console.error("No tokens found.");
      toast.error("Please log in to your account first.");
      return;
    }
  
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
  
    if (newQuantity > packageItem.stock_quantity) {
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
      .then(data => {
        console.log("Updated cart item quantity:", data);
        fetchCart(accessToken); // Fetch the cart from the API after updating
      })
      .catch(error => console.error('Error updating cart item quantity:', error));
  };
  
  const incrementQuantity = (itemId) => {
    const packageItem = packages.find(pkg => pkg.name === cart.find(p => p.id === itemId).package);
    if (!packageItem) {
      console.error("Package not found.");
      return;
    }

    setCart(prev => {
      const updatedCart = prev.map(p => {
        if (p.id === itemId) {
          const newQuantity = p.quantity + 1;
          if (newQuantity > packageItem.stock_quantity) {
            toast.error("Cannot add more than available stock.");
            return p;
          }

          updateCartItemQuantity(itemId, newQuantity);
          return { ...p, quantity: newQuantity };
        }
        return p;
      });
      return updatedCart;
    });
  };
  
  const decrementQuantity = (itemId) => {
    setCart(prev => {
      const updatedCart = prev.map(p => {
        if (p.id === itemId) {
          const newQuantity = Math.max(1, p.quantity - 1);
          updateCartItemQuantity(itemId, newQuantity);
          return { ...p, quantity: newQuantity };
        }
        return p;
      });
      return updatedCart;
    });
  };

  const finalizePurchase = () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken || user !== "customer") {
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

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

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
      <ToastContainer />
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
                    min="0"
                    max={pkg.stock_quantity}
                    value={quantities[pkg.id] || 0}
                    onChange={(e) => handleQuantityChange(pkg.id, parseInt(e.target.value))}
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
                <div className="cart-header">
                  <h3>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                </div>
                <div className="cart-items">
                  {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                  ) : (
                    cart.map((item) => (
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
                    ))
                  )}
                </div>
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${cart.reduce((sum, item) => sum + (item.cost), 0).toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn" onClick={finalizePurchase}>Proceed to Checkout</button>
                </div>
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