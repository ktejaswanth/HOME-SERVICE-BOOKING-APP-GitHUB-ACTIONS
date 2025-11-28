import React, { useEffect, useState } from "react";
import "../css/AdminFeedback.css";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch feedback data from backend API
    fetch("http://localhost:8080/feedback/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);  // Check the fetched data in console
        setFeedbacks(data); // Set feedback data into state
        setError(""); // Reset any previous error
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch feedbacks. Please try again later.");
      });
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <div className="feedback-container">
      <h2>User Feedbacks</h2>
      {error && <p className="error">{error}</p>} {/* Show error message if any */}
      {feedbacks.length === 0 ? (
        <p>No feedbacks found.</p> // Display if no feedback is found
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through feedbacks and display each one in a table row */}
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.id}</td>
                <td>{fb.email}</td>
                <td>{fb.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminFeedback;
