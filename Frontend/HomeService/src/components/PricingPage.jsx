import React from 'react';
import '../css/PricingPage.css';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/userhome'); // navigates to HomeServicesHomepage.jsx
  };

  return (
    <div className="pricing-container">
      <header className="pricing-header">
        <div className="pricing-banner">HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <div className="top-nav">
        <button className="home-btn" onClick={handleHomeClick}>HOME</button>
      </div>

      <section className="pricing-content">
        <p className="tagline">Get Things Done, Effortlessly</p>
        <h2 className="pricing-title">Pricing plans</h2>
        <p className="trial-note">Offers a limited time free trial to test the platform's features.</p>

        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Monthly Pro</h3>
            <p className="price">₹15000</p>
            <p className="note">Billed Monthly. Cancel anytime</p>
            <ul>
              <li>Book unlimited services</li>
              <li>Priority service scheduling</li>
              <li>Exclusive discounts and deals</li>
            </ul>
            <button className="get-btn">Get now</button>
          </div>

          <div className="pricing-card">
            <h3>Yearly Pro</h3>
            <p className="price">₹34999</p>
            <p className="note">₹292 / month.</p>
            <ul>
              <li>Unlimited service bookings</li>
              <li>Dedicated customer support</li>
              <li>Early access to new services</li>
            </ul>
            <button className="get-btn">Get Now</button>
          </div>

          <div className="pricing-card">
            <h3>3 years</h3>
            <p className="price">₹69999</p>
            <p className="note">Access for 3 years<br />₹194 / month</p>
            <ul>
              <li>All-inclusive access to all services</li>
              <li>Exclusive VIP status</li>
              <li>Free service upgrades</li>
            </ul>
            <button className="get-btn">Get Now</button>
          </div>
        </div>
      </section>

      <footer className="pricing-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default PricingPage;
