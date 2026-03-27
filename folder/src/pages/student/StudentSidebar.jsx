import React from "react";

export default function StudentSidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "materials", label: "Materials", icon: "📚" },
    { id: "videos", label: "Videos", icon: "🎥" },
    { id: "results", label: "Results", icon: "📝" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Student Panel</h2>
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
  );
}
