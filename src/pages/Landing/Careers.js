import React from "react";
import { useNavigate } from "react-router-dom";
import "./Careers.css";
import careersImage from "../../assets/careers-image.png";

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className="careers-container">
      <h1>Careers at Salado</h1>
      <img src={careersImage} alt="Careers at Salado" className="careers-image" />
      <p>
        Join our team and help us redefine freshness. At Salado, we are passionate about providing healthy and delicious salads to our customers. We are always looking for talented individuals who share our vision and values. Explore our current job openings and apply today to become a part of our growing family.
      </p>
      <p>
        We offer a dynamic and inclusive work environment where you can grow your career and make a real impact. Whether you are a seasoned professional or just starting out, we have opportunities for you to thrive and succeed.
      </p>
      <p>
        Our team members enjoy competitive salaries, comprehensive benefits, and a supportive culture that values work-life balance. We believe in investing in our employees and providing them with the tools and resources they need to excel.
      </p>
      <p>
        Ready to join us? Check out our open positions below and apply today!
      </p>
      <div className="job-opening">
        <h2>Open Position: Salad Artist</h2>
        <p>
          Are you a creative individual with a passion for healthy food? We are looking for a Salad Artist to join our team. As a Salad Artist, you will be responsible for crafting beautiful and delicious salads that delight our customers. If you have an eye for detail and a love for fresh ingredients, we want to hear from you!
        </p>
        <button className="apply-btn">Apply Now</button>
      </div>
      <button onClick={() => navigate("/")} className="back-home-btn">Back to Home</button>
    </div>
  );
};

export default Careers;