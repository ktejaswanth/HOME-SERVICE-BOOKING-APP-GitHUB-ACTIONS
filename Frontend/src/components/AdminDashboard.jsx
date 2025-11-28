import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import UserChart from './UserChart';
import { BASEURL, callApi } from '../api';  // Adjust path if needed
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: "",
    bookings: "",
    feedbacks: "",
    userTrends: [],
  });

  useEffect(() => {
    callApi("GET", `${BASEURL}/api/admin/stats`, null, (responseText) => {
      try {
        const data = JSON.parse(responseText);
        setStats({
          users: data.userCount,
          bookings: data.bookingCount,
          feedbacks: data.feedbackCount,
          userTrends: data.userGrowthTrends.map(item => ({
            date: item.date,
            count: item.userCount
          }))
        });
      } catch (e) {
        console.error("Failed to parse API response:", e);
      }
    });
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="admin-container">
      <header className="admin-header">Admin Dashboard</header>
      <div className="stats-grid">
        <StatsCard title="Total Users" count={stats.users} />
        <StatsCard title="Bookings Made" count={stats.bookings} />
        <StatsCard title="Feedbacks Received" count={stats.feedbacks} />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="chart-section">
        <h3>User Growth Trend</h3>
        <UserChart data={stats.userTrends} />
      </div>
    </div>
  );
};

export default AdminDashboard;