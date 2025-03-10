import React from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";
import contactImage from "../../assets/contact-image.png";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <img src={contactImage} alt="Contact Us" className="contact-image" />
      <p>
        We'd love to hear from you! Whether you have a question, feedback, or need assistance, our team is here to help. Reach out to us through our contact form, email, or phone, and we'll get back to you as soon as possible.
      </p>
      <p>
        <strong>Email:</strong> contact@salado.com (we promise to respond faster than a speeding lettuce!)
      </p>
      <p>
        <strong>Phone:</strong> 1-800-SALADO (yes, that's a real number... or is it?)
      </p>
      <p>
        <strong>Address:</strong> 123 Salad Lane, Veggie City, CA 90210 (our headquarters is a giant salad bowl)
      </p>
      <p>
        Or you can send us a message using the form below. We don't read them so don't bother. Just kidding, we'll get back to you! (stupid GPT what are you saying?)
      </p>
      <form className="contact-form">
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Message:
          <textarea name="message"></textarea>
        </label>
        <button type="submit" className="submit-btn">Send Message</button>
      </form>
      <button onClick={() => navigate("/")} className="back-home-btn">Back to Home</button>
    </div>
  );
};

export default Contact;