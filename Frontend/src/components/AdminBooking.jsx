import React, { useEffect, useState } from "react";
import "../css/AdminBooking.css"; // Optional CSS

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/bookings") // Adjust if using a proxy
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Bookings</h2>
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant Fee</th>
                <th>Date</th>
                <th>Email</th>
                <th>Name</th>
                <th>Payment Method</th>
                <th>Phone</th>
                <th>Price</th>
                <th>Service</th>
                <th>Time</th>
                <th>Workers</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.app_fee}</td>
                  <td>{b.date}</td>
                  <td>{b.email}</td>
                  <td>{b.name}</td>
                  <td>{b.payment_method}</td>
                  <td>{b.phone}</td>
                  <td>{b.price}</td>
                  <td>{b.service}</td>
                  <td>{b.time}</td>
                  <td>{b.workers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBooking;
