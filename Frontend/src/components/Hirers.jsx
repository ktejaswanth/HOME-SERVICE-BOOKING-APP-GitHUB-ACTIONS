import React, { useState } from 'react';
import '../css/Hirers.css';
import { useNavigate } from 'react-router-dom';
import { BASEURL, callApi } from '../api'; // assuming your api.js is here

const Hirers = () => {
  const navigate = useNavigate();
  const goToHome = () => navigate('/');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    serviceArea: '',
    location: '',
    experience: '',
    workingHours: '',
    expectations: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    callApi(
      'POST',
      `${BASEURL}/api/hiring/submit`,
      JSON.stringify(formData),
      (res) => {
        const [status, msg] = res.split("::");
        if (status === "200") {
          setMessage("Request sent successfully!");
        } else {
          setMessage("Failed to send: " + msg);
        }
      }
    );
  };

  return (
    <div className="hirer-container">
      <header className="hirer-header">
        <div className="platform-title">HOME SERVICE BOOKING PLATFORM</div>
      </header>

      <nav className="nav-bar">
        <button className="nav-item" onClick={goToHome}>HOME</button>
      </nav>

      <div className="form-section">
        <h2>Join Our Team</h2>

        <form className="hirer-form" onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />

          <label>Select Area To Service:</label>
          <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleChange} required />

          <label>Specify Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />

          <label>Do you have any experience in this? If yes, how many years?</label>
          <input type="text" name="experience" value={formData.experience} onChange={handleChange} />

          <label>Working hours expected:</label>
          <input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange} required />

          <label>Explain your convenient time and other expectations:</label>
          <input type="text" name="expectations" value={formData.expectations} onChange={handleChange} />

          {/* File input is not handled yet */}
          <label>Upload Any valid Govt. Proof</label>
          <input type="file" disabled placeholder="(Optional - Not handled yet)" />

          <button type="submit">Send Request</button>
        </form>

        {message && <p className="response-note">{message}</p>}
      </div>

      <footer className="hirer-footer">
        <p>Copyright@Home Services - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Hirers;