import React, { useEffect, useState } from 'react';
import './PackageList.css';
import defaultImage from '../assets/salad.png';

/**
 * PackageList component to display and manage packages.
 * @returns {JSX.Element} - The rendered component.
 */
const PackageList = () => {
  const [packages, setPackages] = useState([]);

  /**
   * Fetches packages from the server and sets the state.
   */
  useEffect(() => {
    fetch('http://127.0.0.1:8000/management/packages/')
      .then(response => response.json())
      .then(data => {
        // Add isActive property to each package
        const packagesWithStatus = data.map(pkg => ({ ...pkg, isActive: pkg.is_active }));
        setPackages(packagesWithStatus);
      })
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  /**
   * Handles the deletion of a package.
   * @param {number} id - The ID of the package to delete.
   */
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/management/packages/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setPackages(packages.filter(pkg => pkg.id !== id));
      })
      .catch(error => console.error('Error deleting package:', error));
  };

  /**
   * Toggles the active status of a package.
   * @param {number} id - The ID of the package to toggle.
   */
  const toggleActive = (id, isActive) => {
    fetch(`http://127.0.0.1:8000/management/packages/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: !isActive }),
    })
      .then(response => response.json())
      .then(() => {
        setPackages(packages.map(pkg =>
          pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
        ));
      })
      .catch(error => console.error('Error toggling active status:', error));
  };

  
  /*
   * Handles the quantity increase of a package's stock.
   * @param {number} id - The ID of the package to update.
   */
  const handleQuantityIncrease = (id) => {
    const packageToUpdate = packages.find(pkg => pkg.id === id);
    if (!packageToUpdate) return;

    // Calculate new stock
    const newStock = packageToUpdate.stock_quantity + 1;

    fetch(`http://127.0.0.1:8000/management/packages/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock_quantity: newStock }), // Ensure field matches backend
    })
      .then(response => response.json())
      .then(updatedPackage => {
        // Update state with new stock
        setPackages(packages.map(pkg => 
          pkg.id === id ? { ...pkg, stock_quantity: updatedPackage.stock_quantity } : pkg
        ));
      })
      .catch(error => console.error('Error updating stock:', error));
  };

  return (
    <div className="package-list">
      <h1>Your Packages</h1>
      <div className="package-grid">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-image">
                <img src={pkg.image || defaultImage} alt={pkg.name} />
              </div>
              <h2>{pkg.name}</h2>
              <p>{pkg.description}</p>
              <p>Price: {pkg.price}</p>
              <p>Stock: {pkg.stock_quantity}</p>
              <ul className="product-list">
                {pkg.products.map((product, idx) => (
                  <li key={idx} className="product-item">
                    <span>{product.name}: {product.quantity}</span>
                    <button onClick={() => handleQuantityIncrease(pkg.id, product.quantity)}>Increase Quantity</button>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleQuantityIncrease(pkg.id)}
                className="increase-stock-button"
              >
                Increase Package Stock
              </button>
              <button
                className={`toggle-button ${pkg.isActive ? 'active' : 'inactive'}`}
                onClick={() => toggleActive(pkg.id, pkg.isActive)}
              >
                {pkg.isActive ? 'Active' : 'Deactive'}
              </button>
            </div>
          ))
        ) : (
          <p>No packages available.</p>
        )}
      </div>
    </div>
  );
};

export default PackageList;