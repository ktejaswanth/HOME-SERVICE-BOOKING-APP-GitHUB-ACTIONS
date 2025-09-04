import React, { useState } from 'react';
import '../css/Feedback.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Feedback is required.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/feedback/send', {
        email,
        message: feedback
      });
      setSubmitted(true);
      setFeedback('');
      setEmail('');
      setError('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to send feedback.');
    }
  };

  return (
    <div className="fb-wrapper">
      <header className="fb-header">
        <h2>Home Service Booking Platform</h2>
      </header>
      <nav className="nav-bar">
        <Link to="/userhome">Home</Link>
      </nav>

      <div className="fb-card">
        <h2 className="fb-title">We’d love your feedback</h2>
        <form onSubmit={handleSubmit} className="fb-form">
          <textarea
            placeholder="Type your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="fb-textarea"
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="fb-input"
          />
          <button type="submit" className="fb-button">Send Feedback</button>
          {error && <p className="fb-error">{error}</p>}
          {submitted && <p className="fb-success">Thank you for your feedback!</p>}
        </form>
      </div>

      <footer className="fb-footer">
        <p>© 2025 Home Services - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Feedback;
