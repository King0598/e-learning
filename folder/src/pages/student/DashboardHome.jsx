import React from "react";

export default function DashboardHome() {
  return (
    <div>
      <h1>Welcome Student 👋</h1>
      <p>Access your lessons, videos, results, and manage your account.</p>

      <div className="stats-grid">
        <div className="stat-card">📚 Materials</div>
        <div className="stat-card">🎥 Videos</div>
        <div className="stat-card">📝 Results</div>
      </div>
    </div>
  );
}
