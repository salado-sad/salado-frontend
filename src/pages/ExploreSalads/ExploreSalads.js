import React, { useState } from "react";
import "./ExploreSalads.css";

const ExploreSalads = ({ onBackToLanding }) => {
    const [packages] = useState([
      {
        name: "Agha Farid",
        price: "$800.85",
        description: "Bache khoobie. Aziatesh nakonin. Bayad khordesh",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQHP1k_GASXLmQ/profile-displayphoto-shrink_400_400/0/1720623177822?e=1744243200&v=beta&t=ZMqV6ju4Zd6YfWp99lt40uwCUs9SA_vvCoxp1ldfMNA",
        products: [
          { name: "Strawberry", quantity: 5 },
          { name: "Spinach", quantity: 3 },
        ],
      },
    ]);
  
    return (
      <div className="package-list">
        <h1>Available Packages</h1>
        <div className="package-grid">
          {packages.map((pkg, index) => (
            <div key={index} className="package-card">
              <img src={pkg.image} alt={pkg.name} className="package-image" />
              <h2>{pkg.name}</h2>
              <p>{pkg.description}</p>
              <p className="package-price">Price: {pkg.price}</p>
              <ul className="product-list">
                {pkg.products.map((product, idx) => (
                  <li key={idx} className="product-item">
                    {product.name}: {product.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={onBackToLanding} className="back-button">
            Back to Home
        </button>
      </div>
    );
  };
  
  export default ExploreSalads;
