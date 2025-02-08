import React, { useEffect, useState } from 'react';
import './PackageList.css';

const PackageList = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/management/packages/')
      .then(response => response.json())
      .then(data => {
        // Add isActive property to each package
        const packagesWithStatus = data.map(pkg => ({ ...pkg, isActive: true }));
        setPackages(packagesWithStatus);
      })
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/management/packages/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setPackages(packages.filter(pkg => pkg.id !== id));
      })
      .catch(error => console.error('Error deleting package:', error));
  };

  const toggleActive = (id) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
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
                <img src={pkg.image || 'default-image-path.jpg'} alt={pkg.name} />
              </div>
              <h2>{pkg.name}</h2>
              <p>{pkg.description}</p>
              <p>Price: {pkg.price}</p>
              <ul className="product-list">
                {pkg.products.map((product, idx) => (
                  <li key={idx} className="product-item">
                    <img src={product.image || 'default-product-image.jpg'} alt={product.name} className="product-small-image" />
                    <span>{product.name}: {product.quantity}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`toggle-button ${pkg.isActive ? 'active' : 'inactive'}`}
                onClick={() => toggleActive(pkg.id)}
              >
                {pkg.isActive ? 'Deactivate' : 'Activate'}
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