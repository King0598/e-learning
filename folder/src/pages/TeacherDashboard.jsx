import React, { useState, useEffect } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import UploadMaterial from "./UploadMaterial";
import UploadVideo from "./UploadVideo";
import Marksheet from "./Marksheet";
import Settings from "./Settings";
import TeacherCourses from "./TeacherCourses";
import TeacherVideos from "./TeacherVideos";

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loggedInUser, setLoggedInUser] = useState({ role: "teacher", department: "" });

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "courses", label: "Uploaded Courses", icon: "📚" },
    { id: "uploadMaterial", label: "Upload Material", icon: "➕" },
    { id: "videos", label: "Uploaded Videos", icon: "🎬" },
    { id: "uploadVideo", label: "Upload Video", icon: "🎥" },
    { id: "marksheet", label: "Marksheet", icon: "📝" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // ✅ Read logged-in user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || localStorage.getItem("user") || "{}");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Teacher Panel</h2>
        </div>

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

      {/* Main content */}
      <main className="main-content">

        {/* Dashboard Home */}
        {activeSection === "dashboard" && (
          <div className="dashboard-home">
            <h1>Welcome Back, {loggedInUser.role === "TEACHER" ? "Teacher" : loggedInUser.firstName || "Teacher"} 👋</h1>
            <p>Here is your teaching overview for today.</p>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button onClick={() => setActiveSection("uploadMaterial")}>
                📄 Upload Material
              </button>
              <button onClick={() => setActiveSection("uploadVideo")}>
                🎥 Upload Video
              </button>
              <button onClick={() => setActiveSection("marksheet")}>
                📊 View Student Results
              </button>
            </div>
            {/* Can add more stats here */}
          </div>
        )}

        {/* Upload Material */}
        {activeSection === "uploadMaterial" && (
          <UploadMaterial
            department={loggedInUser.department}
            onSuccess={() => setActiveSection("courses")} // Redirect to courses list
          />
        )}

        {/* Courses List */}
        {activeSection === "courses" && (
          <TeacherCourses
            department={loggedInUser.department}
            role={loggedInUser.role}
          />
        )}

        {/* Upload Video */}
        {activeSection === "uploadVideo" && (
          <UploadVideo
            department={loggedInUser.department}
            onSuccess={() => setActiveSection("videos")} // Redirect to videos list
          />
        )}

        {/* Videos List */}
        {activeSection === "videos" && (
          <TeacherVideos
            department={loggedInUser.department}
          />
        )}

        {/* Other Pages */}
        {activeSection === "marksheet" && <Marksheet />}
        {activeSection === "settings" && <Settings />}
      </main>
    </div>
  );
}
