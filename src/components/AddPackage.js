import React, { useState } from 'react';
import './AddPackage.css';
import data from '../data/products.json'; // Adjust the path as necessary

const AddPackage = ({ onAddPackage }) => {
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    imageUrl: '', // New field for image URL
    products: []
  });

  const [product, setProduct] = useState({ category: '', subcategory: '', name: '', quantity: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const addProduct = () => {
    if (product.name && product.quantity) {
      setNewPackage((prevState) => ({
        ...prevState,
        products: [...prevState.products, product]
      }));
      setProduct({ category: '', subcategory: '', name: '', quantity: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPackage.name && newPackage.price && newPackage.description) {
      fetch('http://127.0.0.1:8000/management/packages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newPackage.name,
          price: newPackage.price,
          description: newPackage.description,
          image: newPackage.imageUrl || newPackage.image, // Use URL if provided
          products: newPackage.products.map(p => ({ name: p.name, quantity: parseInt(p.quantity, 10) }))
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Package added:', data);
        setNewPackage({ name: '', price: '', description: '', image: '', imageUrl: '', products: [] });
      })
      .catch(error => console.error('Error adding package:', error));
    }
  };

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
          type="text"
          name="price"
          placeholder="Price"
          value={newPackage.price}
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
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={newPackage.imageUrl}
          onChange={handleInputChange}
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
              <option key={prod} value={prod}>{prod}</option>
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
              <li key={index}>{prod.name}: {prod.quantity}</li>
            ))}
          </ul>
        </div>

        <button type="submit">Save Package</button>
      </form>
    </div>
  );
};

export default AddPackage;