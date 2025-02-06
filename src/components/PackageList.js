// src/components/PackageList.js
import React from 'react';
import './PackageList.css';

const packages = [
  {
    name: 'Agha Farid',
    price: '$800.85',
    description: 'Bache khoobie. Aziatesh nakonin. Bayad khordesh',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQHP1k_GASXLmQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1720623177822?e=1744243200&v=beta&t=ZMqV6ju4Zd6YfWp99lt40uwCUs9SA_vvCoxp1ldfMNA', // Replace with actual image path
    products: [
      {
        name: 'Strawberry',
        quantity: 5,
        image: 'https://cdn.nyallergy.com/wp-content/uploads/square-1432664914-strawberry-facts1-1200x900.jpeg'
      },
      {
        name: 'Spinach',
        quantity: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFIf1LwpQrKWxz9lSfn976uLBL9n5g18CUQ&s'
      }
    ]
  }
];

const PackageList = () => {
  return (
    <div className="package-list">
      <h1>Your Packages</h1>
      <div className="package-grid">
        {packages.map((pkg, index) => (
          <div key={index} className="package-card">
            <div className="package-image">
              <img src={pkg.image} alt={pkg.name} />
            </div>
            <h2>{pkg.name}</h2>
            <p>{pkg.description}</p>
            <p>Price: {pkg.price}</p>
            <ul className="product-list">
              {pkg.products.map((product, idx) => (
                <li key={idx} className="product-item">
                  <img src={product.image} alt={product.name} className="product-small-image" />
                  <span>{product.name}: {product.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageList;