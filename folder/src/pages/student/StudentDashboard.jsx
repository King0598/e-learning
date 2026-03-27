import React, { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import DashboardHome from "./DashboardHome";
import Materials from "./Materials";
import Videos from "./Videos";
import Results from "./Results";
import Settings from "./Settings";
import "./student.css";
export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Use data from user object, fallback to legacy studentId if needed
  const studentId = user.studentId || user.userId || user.id || "Unknown";

  return (
    <div className="student-dashboard">
      <StudentSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="main-content">
        {activeSection === "dashboard" && <DashboardHome />}
        {activeSection === "materials" && <Materials />}
        {activeSection === "videos" && <Videos />}
        {activeSection === "results" && <Results studentId={studentId} />}
        {activeSection === "settings" && <Settings />}
      </main>
    </div>
  );
}

