import React from 'react';
import '../css/MyAccount.css';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // points to HomeServicesHomepage.jsx route
  };

  const handleBack = () => {
    navigate('/userhome'); // points to UsersHomepage.jsx route
  };

  return (
    <div className="account-container">
      <header className="account-header">
        <button className="nav-btn" onClick={handleBack}>BACK</button>
        <div className="header-title">HOME SERVICE BOOKING PLATFORM</div>
        <button className="nav-btn logout-btn" onClick={handleLogout}>LOGOUT</button>
      </header>

      <main className="account-main">
        <div className="account-left">
          <div className="profile-img-box">
            <img src="./images/profile-icon.png" alt="profile" />
          </div>
          <ul className="info-list">
            <li>NAME</li>
            <li>USERNAME</li>
            <li>EMAIL</li>
            <li>AGE</li>
            <li>GENDER</li>
            <li>PHONE NUMBER</li>
            <li>CURRENT JOB</li>
            <li>ADDRESS</li>
            <li>CHANGE PASSWORD</li>
          </ul>
          <button className="edit-btn">Edit</button>
        </div>

        <div className="account-right">
          <div className="action-row">
            <div className="icon-circle">🌐</div>
            <div className="action-text">BOOKING CATEGORY HISTORY</div>
            <button className="action-btn">check</button>
          </div>

          <div className="action-row">
            <div className="icon-circle">🔄</div>
            <div className="action-text">PAYMENT HISTORY</div>
            <button className="action-btn">check</button>
          </div>

          <div className="action-row">
            <div className="icon-circle">⭐</div>
            <div className="action-text">Change Address</div>
            <button className="action-btn">Change</button>
          </div>
        </div>
      </main>

      <footer className="account-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default MyAccount;
