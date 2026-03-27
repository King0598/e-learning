import React from "react";

export default function DashboardHome({ onNavigate }) {
  return (
    <div>
      <h1>Welcome Admin 👋</h1>
      <p>Manage teachers, students, and system settings.</p>

      <div className="stats-grid">
        <div className="stat-card" >
          <h3>👨‍🏫 Teachers</h3>
        </div>

        <div className="stat-card" >
          <h3>🎓 Students</h3>
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={() => onNavigate("addTeacher")}>➕ Add Teacher</button>
        <button onClick={() => onNavigate("manageStudent")}>👤 Manage Students</button>
      </div>
    </div>
  );
}
