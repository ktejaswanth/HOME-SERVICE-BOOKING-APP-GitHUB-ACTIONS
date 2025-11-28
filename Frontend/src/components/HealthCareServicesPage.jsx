import React from 'react';
import '../css/HealthCareServicesPage.css';
import { useNavigate } from 'react-router-dom';

const services = [
  "Baby's Sitting",
  "Physiotherapy",
  "Nurses",
  "Neuro Care",
  "Ortho Care",
  "Pulmo Care",
  "Dementia Care",
  "Trauma Care",
  "ICU Care at home..."
];

const serviceImages = {
  "Baby's Sitting": "https://img.icons8.com/color/96/baby.png",
  "Physiotherapy": "https://img.icons8.com/color/96/stethoscope.png",
  "Nurses": "https://img.icons8.com/color/96/nurse-female.png", // updated
  "Neuro Care": "https://img.icons8.com/color/96/brain.png",
  "Ortho Care":"https://img.icons8.com/color/96/hospital-room.png",
  "Pulmo Care": "https://img.icons8.com/color/96/lungs.png",
  "Dementia Care": "https://img.icons8.com/color/96/brain.png", // using brain as substitute
  "Trauma Care": "https://img.icons8.com/color/96/ambulance.png", // updated
  "ICU Care at home...": "https://img.icons8.com/color/96/hospital-room.png"
};


const HealthCareServicesPage = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/userhome');
  };

  const handleServiceClick = (service) => {
    navigate('/booking', { state: { service } });
  };


  return (
    <div className="healthcare-container">
      <header className="healthcare-header">
        <div className="banner">HOME SERVICE BOOKING PLATFORM</div>
        <button className="home-btn" onClick={handleHome}>HOME</button>
      </header>

      <p className="tagline">Making Life Easier, One Service at a Time.</p>

      <div className="healthcare-grid">
        {services.map((service, index) => (
          <div className="service-tile" key={index}>
            <div className="img-placeholder">
            <img src={serviceImages[service]} alt={service} />
            </div>
            <button className="service-btn" onClick={() => handleServiceClick(service)}>
              <i>{service.toUpperCase()}</i>
            </button></div>
        ))}
      </div>

      <footer className="healthcare-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default HealthCareServicesPage;
