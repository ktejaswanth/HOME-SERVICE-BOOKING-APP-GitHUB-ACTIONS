import React from 'react';
import '../css/FAQs.css';
import { useNavigate } from 'react-router-dom';

const FAQs = () => {
  const navigate = useNavigate();
  const goToHome = () => navigate('/');

  return (
    <div className="faq-container">
      <header className="faq-header">
        <div className="platform-title">HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <nav className="nav-bar">
        <button className="nav-item active" onClick={goToHome}>HOME</button>
      </nav>

      <main className="faq-main">
        <h1 className="faq-title">FAQ</h1>
        <hr />

        <div className="faq-grid">
          <div className="faq-item">
            <h3>Which cities are you active in?</h3>
            <p>Currently, our services are limited to Andhra Pradesh only</p>
          </div>
          <div className="faq-item">
            <h3>Can I take helpers for multiple tasks?</h3>
            <p>Yes, indeed. That is one of the big benefits of our service.</p>
          </div>
          <div className="faq-item">
            <h3>Do you provide permanent employees too?</h3>
            <p>No, we do not. At present, we are focusing on fulfilling the ad hoc temporary needs of our customers</p>
          </div>
          <div className="faq-item">
            <h3>Are there some periodic help packages that I can take?</h3>
            <p>Yes, we have made quite a few packages to suit your needs.</p>
          </div>
          <div className="faq-item">
            <h3>Can I tip the partner if I am happy with their work?</h3>
            <p>You are more than welcome to tip your partner for a job well done. This is always appreciated.</p>
          </div>
          <div className="faq-item">
            <h3>What is the verification process that you go through for your partners?</h3>
            <p>
              While we believe in the goodness of our customers and partners, we do realize the importance of verification in this process.
              All our partners submit details of their identity to us and the concerned documents are verified.
            </p>
          </div>
        </div>
      </main>

      <footer className="faq-footer">
        <p>Copyright@Home Services - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default FAQs;
