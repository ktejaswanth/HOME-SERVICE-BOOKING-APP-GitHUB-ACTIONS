import React from 'react';
import '../css/UsersHomepage.css';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate




const UsersHomepage = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
const handleLogout = () => {
    navigate('/'); // points to HomeServicesHomepage.jsx route
  };

  // 3. Define handlers for button navigation
  const goToAccount = () => navigate('/myaccount');
  const goToPricing = () => navigate('/pricing');
  const goToContact = () => navigate('/contact');
  const goToBooking = () => navigate('/booking'); // Replace with your actual route
  const goToRepairs = () => navigate('/repairspage');
  const goToHealth = () => navigate('/healthpage');
  const goToBeauty = () => navigate('/beautypage');
  const goTofeedback = () => navigate('/feedback');
  
 


  return (
    <div className="user-home-container">
      <header className="user-header">
        <div className="header-text">HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <div className="user-main">
        <aside className="sidebar">
          <div className="profile-pic-placeholder">
            <img src="./images/logo.jpg" alt="Profile" />
          </div>
          
          <button className="side-button" onClick={goToPricing}>PRICING</button>
          <button className="side-button" onClick={goToContact}>CONTACT US</button>
          <button className="side-button" onClick={goToBooking}>Book Service</button>
          <button className="side-button" onClick={goTofeedback}>FEEDBACK</button>
           <button className="nav-btn logout-btn" onClick={handleLogout}>LOGOUT</button>
        </aside>

        <section className="user-content">
          <h1>HELP WHEN YOU NEED IT AT YOUR FINGERTIPS</h1>

          <div className="service-block">
            <p><em>Reliable Repairs - Mechanical service , plumbing seervices ,...</em></p>
            <button className="select-button" onClick={goToRepairs}>Select</button>
          </div>
          <div className="service-block">
            <p><em>Elderly Care ,Babys sitting ,Medical Home service,...</em></p>
            <button className="select-button" onClick={goToHealth}>select</button>
          </div>
          <div className="service-block">
            <p><em>Spotless Spaces , Self Care, Salons,...</em></p>
            <button className="select-button" onClick={goToBeauty}>select</button>
          </div>
        </section>
      </div>

      <footer className="user-footer">
        <p>Copyright@Home Services - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default UsersHomepage;
