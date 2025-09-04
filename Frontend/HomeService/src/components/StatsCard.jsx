// src/components/StatsCard.jsx
import React from 'react';
import '../css/StatsCard.css';

const StatsCard = ({ title, count }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{count}</p>
  </div>
);

export default StatsCard;