import React, { useState, useEffect } from 'react';
import './AddPackage.css';
import data from '../data/products.json'; // Adjust the path as necessary
import Cookies from "js-cookie";

/**
 * AddPackage component to add a new package.
 * @param {object} props - The component props.
 * @param {function} props.onAddPackage - Callback function to handle adding a package.
 * @returns {JSX.Element} - The rendered component.
 */
const AddPackage = ({ onAddPackage }) => {
  const [newPackage, setNewPackage] = useState({
    name: '',
    stock_quantity: '',
    description: '',
    products: []
  });

  const [product, setProduct] = useState({ 
    category: '', 
    subcategory: '', 
    name: '', 
    quantity: 1 
  });

  const [productStocks, setProductStocks] = useState({});
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/vendors/all-products/', {
          headers: {}
        });
        
        if (!response.ok) throw new Error('Failed to fetch product stock');
        
        const products = await response.json();
        const stocks = products.reduce((acc, curr) => {
          acc[curr.name] = curr.stock_quantity;
          return acc;
        }, {});
        setProductStocks(stocks);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFetchError('Failed to load product stock data. Please refresh the page.');
      }
    };
    
    fetchProducts();
  }, []);

  const removeProduct = (index) => {
    setNewPackage(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateQuantity = (index, newQuantity) => {
    const updatedProducts = [...newPackage.products];
    updatedProducts[index].quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
    setNewPackage(prev => ({ ...prev, products: updatedProducts }));
  };


  /**
   * Handles input change events for the package form.
   * @param {object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  /**
   * Adds a product to the package.
   */
  const addProduct = () => {
    if (product.name && product.quantity > 0) {
      setNewPackage(prev => ({
        ...prev,
        products: [...prev.products, {
          name: product.name,
          quantity: product.quantity
        }]
      }));
      setProduct(prev => ({ ...prev, name: '', quantity: 1 }));
    }
  };

  /**
   * Handles form submission to add a new package.
   * @param {object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPackage.name || !newPackage.stock_quantity || !newPackage.description) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/management/packages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify({
          name: newPackage.name,
          stock_quantity: parseInt(newPackage.stock_quantity, 10),
          description: newPackage.description,
          products: newPackage.products
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create package');
      }

      const createdPackage = await response.json();
      onAddPackage(createdPackage);
      setNewPackage({ name: '', stock_quantity: '', description: '', products: [] });
      alert('Package created successfully!');

    } catch (error) {
      console.error('Error creating package:', error);
      alert(error.message || 'Failed to create package');
    }
  };

  /**
   * Handles input change events for the product form.
   * @param {object} e - The event object.
   */
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === 'category' && { subcategory: '', name: '' }), // Reset subcategory and name if category changes
      ...(name === 'subcategory' && { name: '' }) // Reset name if subcategory changes
    }));
  };

  const subcategories = product.category ? Object.keys(data[product.category]) : [];
  const products = product.subcategory ? data[product.category][product.subcategory] : [];

  return (
    <div className="add-package">
      <h1>Add a New Package</h1>

      {fetchError && (
        <div className="error-message">
          ⚠️ {fetchError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Package Name"
          value={newPackage.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={newPackage.stock_quantity}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newPackage.description}
          onChange={handleInputChange}
          required
        />

        <div className="product-details">
          <h3>Add Product</h3>
          <select name="category" value={product.category} onChange={handleProductChange}>
            <option value="">Select Category</option>
            {Object.keys(data).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select name="subcategory" value={product.subcategory} onChange={handleProductChange} disabled={!product.category}>
            <option value="">Select Subcategory</option>
            {subcategories.map((subcat) => (
              <option key={subcat} value={subcat}>{subcat}</option>
            ))}
          </select>
          <select name="name" value={product.name} onChange={handleProductChange}>
            <option value="">Select Product</option>
            {products.map((prod) => {
              const stock = productStocks[prod.name] ?? 'N/A';
              return (
                <option 
                  key={prod.name} 
                  value={prod.name}
                  disabled={stock === 'N/A' || stock < 1}
                >
                  {prod.name} (Stock: {stock})
                </option>
              );
            })}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={product.quantity}
            onChange={handleProductChange}
          />
          <button type="button" onClick={addProduct}>Add Product</button>
        </div>

        <div className="added-products">
        <h4>Added Products</h4>
          <ul>
            {newPackage.products.map((prod, index) => (
              <li key={index}>
                <div className="product-controls">
                  <span>{prod.name}</span>
                  
                  <input
                    type="number"
                    min="1"
                    value={prod.quantity}
                    onChange={(e) => updateQuantity(index, e.target.value)}
                    className="quantity-input"
                  />
                  
                  <button 
                    type="button" 
                    onClick={() => removeProduct(index)}
                    className="delete-product"
                  >
                    ×
                  </button>
                </div>
                
                {productStocks[prod.name] !== undefined && (
                  <span className="stock-status">
                    Available: {productStocks[prod.name]} | 
                    Remaining: {productStocks[prod.name] - prod.quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">Save Package</button>
      </form>
    </div>
  );
};

export default AddPackage;