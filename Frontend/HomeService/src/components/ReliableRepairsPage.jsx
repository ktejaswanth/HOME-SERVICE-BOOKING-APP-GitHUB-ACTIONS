import React from 'react';
import '../css/ReliableRepairsPage.css';
import { useNavigate } from 'react-router-dom';

const services = [
  "Furniture Assembly",
  "Help Moving",
  "Yard Work",
  "Home Repairs",
  "Cleaning",
  "Mounting",
  "Lift and Shift Furniture",
  "Shoping",
  "Car Washing"
];

// Map of service names to image URLs
const serviceImages = {
  "Furniture Assembly": "https://img.icons8.com/color/96/000000/furniture.png",
  "Help Moving": "https://img.icons8.com/color/96/move-by-trolley.png", // Updated
  "Yard Work": "https://img.icons8.com/color/96/000000/lawn-care.png",
  "Home Repairs": "https://img.icons8.com/color/96/000000/maintenance.png",
  "Cleaning": "https://img.icons8.com/color/96/000000/broom.png",
  "Mounting": "https://img.icons8.com/color/96/000000/drill.png",
  "Lift and Shift Furniture": "https://img.icons8.com/color/96/box.png",
  "Shoping": "https://img.icons8.com/color/96/000000/shopping-cart.png",
  "Car Washing": "https://img.icons8.com/color/96/car-service.png"
};

const ReliableRepairsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/userhome');
  };

  const handleServiceClick = (service) => {
    navigate('/booking', { state: { service } });
  };

  return (
    <div className="repairs-container">
      <header className="repairs-header">
        <div className="banner">HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <div className="top-bar">
        <button className="back-btn" onClick={handleBack}>BACK</button>
      </div>

      <div className="tiles-grid">
        {services.map((service, index) => (
          <div className="tile" key={index}>
            <div className="img-placeholder">
              <img src={serviceImages[service]} alt={service} />
            </div>
            <button className="tile-btn" onClick={() => handleServiceClick(service)}>
              <i>{service.toUpperCase()}</i>
            </button>
          </div>
        ))}
      </div>

      <footer className="repairs-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default ReliableRepairsPage;
