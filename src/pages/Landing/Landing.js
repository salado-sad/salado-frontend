import React from "react";
import "./Landing.css";
import logo from "../../assets/logo.png";

const Landing = ({ onSwitchToLogin, onSwitchToSupplierLogin }) => {
  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">Salado</div>
        <nav className="menu">
          <a href="#about">About</a>
          <a href="#services">Our Salads</a>
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
          <button className="cta-btn">Explore Salads</button>
        </div>
        <img
          src={logo}
          alt="Salads"
          className="hero-image"
        />
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
        </ul>
      </footer>
    </div>
  );
};

export default Landing;