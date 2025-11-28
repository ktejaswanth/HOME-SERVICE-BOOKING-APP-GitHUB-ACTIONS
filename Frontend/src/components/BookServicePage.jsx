import React, { useState } from 'react';
import '../css/BookServicePage.css';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

const BookServicePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: '',
    workers: '',
    price: '',
    appFee: '',
    total: '',
    payment: 'Credit card, Net Banking, UPI...',
  });

  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = async () => {
    const upiId = '8688088449sbi@ibl';
    const name = 'KONDAVETI TEJASWANTH';

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${formData.total}&cu=INR`;

    try {
      const url = await QRCode.toDataURL(upiUrl);
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === 'price' || name === 'appFee') {
      updatedData.total = (
        parseFloat(updatedData.price || 0) + parseFloat(updatedData.appFee || 0)
      ).toFixed(2);
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await generateQRCode();

    try {
      const response = await fetch('http://localhost:8080/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.phone + '@gmail.com', // Adjust this if actual email input is added
          date: formData.date,
          time: formData.time,
          service: formData.service,
          workers: formData.workers,
          price: parseFloat(formData.price),
          appFee: parseFloat(formData.appFee),
          payment: formData.payment,
        }),
      });

      if (response.ok) {
        alert('Booking confirmed! Confirmation email sent.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          service: '',
          workers: '',
          price: '',
          appFee: '',
          total: '',
          payment: 'Credit card, Net Banking, UPI...',
        });
        setQrCodeUrl('');
      } else {
        alert('Failed to book service.');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="book-container">
      <header className="book-header">
        <div className="banner">HOME SERVICE BOOKING PLATFORM</div>
        <button className="home-btn" onClick={() => navigate('/userhome')}>HOME</button>
      </header>

      <h2 className="form-title">BOOK SERVICE</h2>

      <form className="book-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="tel" name="phone" placeholder="Enter Phone no" value={formData.phone} onChange={handleChange} required />

        <label>Service Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Service Time</label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />

        <label>Services</label>
        <input type="text" name="service" placeholder="Type Here.." value={formData.service} onChange={handleChange} required />

        <label>Workers needed</label>
        <input type="text" name="workers" placeholder="Enter number of persons" value={formData.workers} onChange={handleChange} style={{ color: '#555' }} />

        <label>Price</label>
        <input type="number" name="price" placeholder="Enter service price" value={formData.price} onChange={handleChange} style={{ color: '#555' }} />

        <label>Apps fee</label>
        <input type="number" name="appFee" placeholder="Enter app fee" value={formData.appFee} onChange={handleChange} style={{ color: '#555' }} />

        <label>Total price</label>
        <input type="number" name="total" placeholder="Total will be calculated" value={formData.total} readOnly style={{ color: '#555' }} />

        <label>Payment Method</label>
        <select name="payment" value={formData.payment} onChange={handleChange}>
          <option>Credit card, Net Banking, UPI...</option>
          <option>Cash on Delivery</option>
          <option>Wallet</option>
        </select>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="button" onClick={generateQRCode} className="submit-btn">Generate Payment QR</button>
          {qrCodeUrl && (
            <div>
              <h4>Scan to Pay (₹{formData.total})</h4>
              <img src={qrCodeUrl} alt="Payment QR Code" style={{ marginTop: '10px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Book Service</button>
      </form>

      <footer className="book-footer">
        Copyright@Home Services - All Rights Reserved
      </footer>
    </div>
  );
};

export default BookServicePage;
