import React from "react";
import { useNavigate } from "react-router-dom";
import "./FAQ.css";

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <p>
        Have questions? We have answers! Check out our FAQ section to find information on a variety of topics, including our products, delivery options, and account management. If you can't find what you're looking for, feel free to contact us for further assistance.
      </p>
      <div className="faq-section">
        <div className="faq-item">
          <h3>What is Salado?</h3>
          <p>Salado is a service that delivers fresh and healthy salads to your doorstep. We offer customizable salad options crafted to delight your taste buds.</p>
        </div>
        <div className="faq-item">
          <h3>How do I place an order?</h3>
          <p>You can place an order through our website or mobile app. Simply select your desired salads, customize them to your liking, and proceed to checkout.</p>
        </div>
        <div className="faq-item">
          <h3>What are your delivery options?</h3>
          <p>We offer various delivery options to suit your needs, including same-day delivery and scheduled deliveries. You can choose your preferred delivery time during checkout.</p>
        </div>
      </div>
      <div className="faq-section">
        <div className="faq-item">
          <h3>Do you have a salad that can make me fly?</h3>
          <p>Unfortunately, our salads are not equipped with flying capabilities. However, they might make you feel light as a feather!</p>
        </div>
        <div className="faq-item">
          <h3>Can I get a salad with extra unicorns?</h3>
          <p>Our salads are magical, but we haven't quite figured out how to add unicorns yet. Stay tuned!</p>
        </div>
        <div className="faq-item">
          <h3>Will eating your salads make me a superhero?</h3>
          <p>While we can't guarantee superpowers, our salads are packed with nutrients that might just make you feel invincible!</p>
        </div>
        <div className="faq-item">
          <h3>Will anyone ever read this page?</h3>
          <p>Certainly not, that's why I filled it with nonesense.</p>
        </div>
      </div>
      <button onClick={() => navigate("/")} className="back-home-btn">Back to Home</button>
    </div>
  );
};

export default FAQ;