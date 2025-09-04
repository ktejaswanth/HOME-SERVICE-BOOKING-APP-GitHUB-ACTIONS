import React, { useState } from 'react';
import '../css/ContactPage.css';
import { useNavigate } from 'react-router-dom';
import { BASEURL, callApi } from '../api'; // Make sure this points to your api.js

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const apiData = JSON.stringify(formData);
  callApi("POST", `${BASEURL}/api/contact`, apiData, (res) => {
    const [status, msg] = res.split("::");
    alert(msg);
    if (status === "200") {
      setFormData({ name: '', email: '', message: '' });
    }
  });
};


  const handleHomeClick = () => {
    navigate('/userhome');
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <div>HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <div className="top-nav">
        <button className="home-btn" onClick={handleHomeClick}>
          <u>Home</u>
        </button>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Contact us</h2>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <textarea 
          name="message" 
          placeholder="Message" 
          rows="6" 
          value={formData.message} 
          onChange={handleChange} 
          required 
        ></textarea>
        <button type="submit" className="send-btn">Send</button>
      </form>

      <footer className="contact-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default ContactPage;