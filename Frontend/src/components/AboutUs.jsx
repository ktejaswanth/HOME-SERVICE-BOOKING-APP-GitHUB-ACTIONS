import React from 'react';
import '../css/AboutUs.css';

import { useNavigate } from 'react-router-dom';


const AboutUs = () => {

    const navigate = useNavigate();
    const goToHome = () => {
        navigate('/');
      };
  return (
    <div className="main-container">
      <header className="top-header">
        <div className="platform-title">HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <nav className="nav-bar">
  <button className="nav-item active" onClick={goToHome}>HOME</button>
</nav>

      <section className="page-heading">
        <h1>Home Service Booking Platform</h1>
        <p>
          The platform offers a variety of home services, from cleaning and repairs to beauty and wellness,
          catering to diverse needs.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <img src="./images/23.jpg" alt="Easy Booking" className="feature-icon" />
          <h3>Easy and Convenient Booking</h3>
          <p>
            Users can easily book services online or through the mobile app, with a user-friendly interface and
            clear service descriptions.
          </p>
        </div>
        <div className="feature-card">
          <img src="./images/24.jpg" alt="Verified Professionals" className="feature-icon" />
          <h3>Verified Professionals and Real-time Tracking</h3>
          <p>
            All service providers are verified and background-checked, ensuring quality and trust. Users can
            track the progress of their service bookings, providing transparency and peace of mind.
          </p>
        </div>
        <div className="feature-card">
          <img src="./images/3.jpg" alt="Secure Payments" className="feature-icon" />
          <h3>Secure Payment Options and Customer support</h3>
          <p>
            Secure payment gateways are integrated for safe and hassle-free transactions. Dedicated customer
            support is available to assist users with any queries or issues.
          </p>
        </div>
      </section>

      <section className="service-tiles">
        {[
        
          'Identity Verification',
          'Direct and Indirect Service Finder',
          'Secure Communication System',
          'Network Generation based on Geolocation',
        ].map((title, index) => (
          <div key={index} className="tile">
            
            <p className="tile-title">{title}</p>
          </div>
        ))}
      </section>

      <footer className="footer">
        <p>Copyright@Home Services - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default AboutUs;
