import React, { useState, useEffect } from "react";
import "./Landing.css";
import logo from "../../assets/logo.png";

const Landing = ({ onSwitchToLogin, onSwitchToSupplierLogin, onSwitchToAdminLogin, onExploreSalads }) => {
  const [salads, setSalads] = useState([]);
  const placeholderImages = [
    "https://images.immediate.co.uk/production/volatile/sites/30/2014/05/Epic-summer-salad-hub-2646e6e.jpg?quality=90&webp=true&resize=600,545",
    "https://images.immediate.co.uk/production/volatile/sites/30/2023/09/Roasted-beetroot-and-feta-salad-ffc7efb.jpg?quality=90&webp=true&resize=600,545",
    "https://images.immediate.co.uk/production/volatile/sites/30/2023/10/Kale-caesar-salad-c519289.jpg?quality=90&webp=true&resize=600,545",
    "https://www.sharifml.ir/wp-content/uploads/2024/09/shayanshabani-Shayan-Shabani.jpeg"
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/management/packages/')
      .then(response => response.json())
      .then(data => setSalads(data))
      .catch(error => console.error('Error fetching salads:', error));
  }, []);

  const getRandomPlaceholder = () => {
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">Salado</div>
        <nav className="menu">
          <a href="#about">About</a>
          <a href="#salads">Our Salads</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="signin-btn" onClick={onSwitchToLogin}>
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Fresh and Healthy Salads <br /> Delivered to Your Doorstep
          </h1>
          <p>
            Customizable salad options crafted to delight your taste buds delivered fresh daily.
          </p>
          <button onClick={onExploreSalads} className="cta-btn">Explore Salads</button>
        </div>
        <img src={logo} alt="Salads" className="hero-image" />
      </section>

      {/* Description Section */}
      <section className="description">
        <p className="description-paragraph">
          At Salado, we believe in the power of healthy food. Our mission is to
          provide fresh, flavorful, and exciting salads that redefine your
          expectations for what fast and healthy meals can be. Whether you’re
          looking for a quick lunch, a satisfying dinner, or meal prep for the
          week, Salado is here to make eating healthy effortless and enjoyable.
        </p>
        <p className="highlighted-motto">"Freshness Redefined."</p>
      </section>

      {/* Our Salads Section */}
      <section id="salads" className="salads-section">
        <h2>Our Salads</h2>
        <div className="salads-grid">
          {salads.map(salad => (
            <div key={salad.id} className="salad-card">
              <img
                src={salad.image || getRandomPlaceholder()}
                alt={salad.name}
                className="salad-image"
                onError={(e) => { e.target.onerror = null; e.target.src = getRandomPlaceholder(); }}
              />
              <h3>{salad.name}</h3>
              <p>{salad.description}</p>
              <p>Price: {salad.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supplier Section */}
      <section className="supplier-section">
        <h2>Are you a supplier?</h2>
        <p>Access your dashboard to manage orders and inventory.</p>
        <button className="supplier-signin-btn" onClick={onSwitchToSupplierLogin}>
          Supplier Sign In
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <ul>
          <li>
            <a href="#careers">Careers</a>
          </li>
          <li>
            <a href="#privacy">Privacy</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a href="#contact">Contact Us</a>
          </li>
          <li>
            <a href="#admin" onClick={() => onSwitchToAdminLogin()}>Admin Login</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Landing;