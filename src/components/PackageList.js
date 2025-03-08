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

  /**
   * Handles the quantity increase of a package.
   * @param {number} id - The ID of the package to update.
   * @param {number} stock - The current stock of the package.
   */
  const handleQuantityIncrease = (id, stock) => {
    console.log(`Increasing quantity for package ID: ${id}, current stock: ${stock}`);
    fetch(`http://127.0.0.1:8000/management/packages/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock: stock + 1 }),
    })
      .then(response => response.json())
      .then(updatedPackage => {
        console.log('Updated package:', updatedPackage);
        setPackages(packages.map(pkg =>
          pkg.id === id ? { ...pkg, stock_quantity: updatedPackage.stock_quantity + 1 } : pkg
        ));
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  return (
    <div className="package-list">
      <h1>Your Packages</h1>
      <div className="package-grid">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <button
                className="delete-button"
                onClick={() => handleDelete(pkg.id)}
              >
                &times;
              </button>
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