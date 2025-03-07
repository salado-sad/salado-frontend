import React, { useState } from 'react';
import './AddPackage.css';
import data from '../data/products.json'; // Adjust the path as necessary

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

  const [product, setProduct] = useState({ category: '', subcategory: '', name: '', quantity: '' });

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
    if (product.name && product.quantity) {
      const selectedProduct = data[product.category][product.subcategory].find(p => p.name === product.name);
      if (selectedProduct) {
        setNewPackage((prevState) => ({
          ...prevState,
          products: [...prevState.products, { name: selectedProduct.name, quantity: parseInt(product.quantity, 10) },]
        }));
        setProduct({ category: '', subcategory: '', name: '', quantity: '' });
      }
    }
  };

  /**
   * Handles form submission to add a new package.
   * @param {object} e - The event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPackage.name && newPackage.stock_quantity && newPackage.description) {
      fetch('http://127.0.0.1:8000/management/packages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPackage.name,
          stock_quantity: parseInt(newPackage.stock_quantity, 10),
          description: newPackage.description,
          products: newPackage.products
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Package added:', data);
        setNewPackage({ name: '', stock_quantity: '', description: '', products: [] });
        onAddPackage(data);
      })
      .catch(error => console.error('Error adding package:', error));
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
          <select name="name" value={product.name} onChange={handleProductChange} disabled={!product.subcategory}>
            <option value="">Select Product</option>
            {products.map((prod) => (
              <option key={prod.name} value={prod.name}>{prod.name}</option>
            ))}
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
              <li key={index}>{prod.name} : {prod.quantity}</li>
            ))}
          </ul>
        </div>

        <button type="submit">Save Package</button>
      </form>
    </div>
  );
};

export default AddPackage;