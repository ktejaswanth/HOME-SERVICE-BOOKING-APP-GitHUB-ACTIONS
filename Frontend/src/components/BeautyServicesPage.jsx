import React from 'react';
import '../css/BeautyServicesPage.css';
import { useNavigate } from 'react-router-dom';

const beautyServices = [
  "Women's Salon",
  "Men's Salon",
  "Hair Spa Treatment",
  "Body Massage for Stress Relief",
  "Manicure and Pedicure",
  "Other.."
];

const beautyServiceImages = {
   "Women's Salon": "https://img.icons8.com/fluency/96/hair-dryer.png", // alternative
  "Men's Salon": "https://img.icons8.com/color/96/barbershop.png",
  "Hair Spa Treatment": "https://img.icons8.com/fluency/96/hair-dryer.png", // alternative
  "Body Massage for Stress Relief": "https://img.icons8.com/color/96/massage.png",
  "Manicure and Pedicure": "https://img.icons8.com/fluency/96/nail-polish.png", // alternative
  "Other..": "https://img.icons8.com/color/96/spa.png"
};

const BeautyServicesPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };
  const handleServiceClick = (service) => {
    navigate('/booking', { state: { service } });
  };
  return (
    <div className="beauty-container">
      <header className="beauty-header">
        <div className="banner">HOME SERVICE BOOKING PLATFORM</div>
        <button className="back-btn" onClick={handleBack}>BACK</button>
      </header>

      <div className="beauty-grid">
        {beautyServices.map((service, index) => (
          <div className="beauty-tile" key={index}>
            <div className="img-placeholder">
              <img src={beautyServiceImages[service]} alt={service} />
            </div>
            <button className="beauty-btn" onClick={() => handleServiceClick(service)}>
              <i>{service.toUpperCase()}</i>
            </button></div>
        ))}
      </div>

      <footer className="beauty-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default BeautyServicesPage;
