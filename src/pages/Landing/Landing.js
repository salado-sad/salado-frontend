import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import logo from "../../assets/logo.png";
import profileIcon from "../../assets/profile-icon.png";

/**
 * Landing component renders the landing page of the application.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object to check if the user is logged in.
 */
const Landing = ({ user }) => {
  const navigate = useNavigate();

  /**
   * Handles profile button click based on user role.
   */
  const handleProfileClick = () => {
    if (user === "supplier") {
      navigate("/supplier-profile");
    } else if (user === "admin") {
      navigate("/admin-panel");
    } else {
      navigate("/profile");
    }
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
        {user ? (
          <button className="profile-btn" onClick={handleProfileClick}>
            <img src={profileIcon} alt="Profile" />
          </button>
        ) : (
          <button className="signin-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
        )}
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
          <button onClick={() => navigate("/explore-salads")} className="cta-btn">Explore Salads</button>
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

      {/* Supplier Section */}
      <section className="supplier-section">
        <h2>Are you a supplier?</h2>
        <p>Access your dashboard to manage orders and inventory.</p>
        <button className="supplier-signin-btn" onClick={() => navigate("/supplier-login")}>
          Supplier Sign In
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <ul>
          <li><button onClick={() => navigate("/careers")} className="footer-button">Careers</button></li>
          <li><button onClick={() => navigate("/privacy")} className="footer-button">Privacy</button></li>
          <li><button onClick={() => navigate("/faq")} className="footer-button">FAQ</button></li>
          <li><button onClick={() => navigate("/contact")} className="footer-button">Contact Us</button></li>
          <li><button onClick={() => navigate("/admin-login")} className="footer-button">Admin Login</button></li>
        </ul>
      </footer>
    </div>
  );
};

export default Landing;