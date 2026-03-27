import React, { useState } from "react";
import "./admin.css";

import DashboardHome from "./DashboardHome";
import AddTeacher from "./AddTeacher";
import ManageStudent from "./ManageStudent";
import TeacherMaterials from "./TeacherMaterials";
import Settings from "./Settings";
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "addTeacher", label: "Add Teacher", icon: "➕" },
    { id: "manageStudent", label: "Manage Student", icon: "👤" },

    { id: "teacherMaterials", label: "Teacher Materials", icon: "📄" },
    { id: "teacherVideos", label: "Teacher Videos", icon: "🎥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2 className="sidebar-header">Admin Panel</h2>

        <ul className="sidebar-menu">
          {sections.map((sec) => (
            <li
              key={sec.id}
              className={activeSection === sec.id ? "active" : ""}
              onClick={() => setActiveSection(sec.id)}
            >
              <span className="icon">{sec.icon}</span>
              <span className="label">{sec.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {activeSection === "dashboard" && (
          <DashboardHome onNavigate={setActiveSection} />
        )}
        {activeSection === "addTeacher" && <AddTeacher />}
        {activeSection === "manageStudent" && <ManageStudent />}
        {activeSection === "teacherMaterials" && <TeacherMaterials type="materials" />}
        {activeSection === "teacherVideos" && <TeacherMaterials type="videos" />}
        {activeSection === "settings" && <Settings />}
      </main>
    </div>
  );
}
