import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Materials() {
  const [activeTab, setActiveTab] = useState("myCourses"); // 'myCourses' or 'openEnrollment'
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // For detail modal

  // Get user info
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || localStorage.getItem("user") || "{}");
  const studentEmail = loggedUser.email;

  useEffect(() => {
    fetchMaterials();
  }, [activeTab]);

  const fetchMaterials = async () => {
    setLoading(true);
    setMaterials([]);
    try {
      let endpoint = "";
      if (activeTab === "myCourses") {
        endpoint = `/courses/student/my-courses?email=${encodeURIComponent(studentEmail)}`;
      } else {
        endpoint = `/courses/student/open-enrollment?email=${encodeURIComponent(studentEmail)}`;
      }

      const response = await API.get(endpoint);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (window.confirm("Are you sure you want to enroll in this course?")) {
      try {
        await API.post(`/courses/${courseId}/enroll?email=${encodeURIComponent(studentEmail)}`);
        toast.success("Enrolled successfully!");
        // Switch to My Courses to show the new course
        setActiveTab("myCourses");
      } catch (error) {
        console.error("Enrollment failed:", error);
        toast.error(error.response?.data || "Failed to enroll.");
      }
    }
  };

  const handleGoToCourse = (course) => {
    if (course.fileUrl) {
      window.open(course.fileUrl, "_blank");
    } else {
      toast.info("No downloadable material available for this course.");
    }
  };

  return (
    <div className="p-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>Courses</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "30px", borderBottom: "1px solid #eee" }}>
        <button
          onClick={() => setActiveTab("myCourses")}
          style={{
            padding: "10px 0",
            background: "none",
            border: "none",
            borderBottom: activeTab === "myCourses" ? "3px solid #007bff" : "3px solid transparent",
            fontWeight: activeTab === "myCourses" ? "600" : "400",
            color: activeTab === "myCourses" ? "#007bff" : "#666",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          My Courses
        </button>
        <button
          onClick={() => setActiveTab("openEnrollment")}
          style={{
            padding: "10px 0",
            background: "none",
            border: "none",
            borderBottom: activeTab === "openEnrollment" ? "3px solid #007bff" : "3px solid transparent",
            fontWeight: activeTab === "openEnrollment" ? "600" : "400",
            color: activeTab === "openEnrollment" ? "#007bff" : "#666",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Open Enrollment Catalog
        </button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {materials.length === 0 ? (
            <p style={{ color: "#666" }}>No courses found in this section.</p>
          ) : (
            materials.map((course) => (
              <div
                key={course.courseId || course.id}
                style={{
                  display: "flex",
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  borderLeft: "6px solid #4da6ff" // Blue accent bar
                }}
              >
                <div style={{ flex: 1, padding: "20px" }}>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: "bold", color: "#333" }}>
                    {course.title}
                  </h3>
                  <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "0.9rem" }}>{course.code}</p>

                  <div style={{ display: "flex", gap: "20px", color: "#555", fontSize: "0.9rem" }}>
                    <span>📅 Open Enrollment</span>
                    <span>🕒 {course.credit ? `${course.credit} Hours` : "N/A"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", paddingRight: "20px", gap: "10px" }}>
                  {/* Actions */}

                  {/* Detail Icon */}
                  <button
                    onClick={() => setSelectedCourse(course)}
                    style={{ background: "none", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="View Details"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </button>

                  {activeTab === "myCourses" ? (
                    <button
                      onClick={() => handleGoToCourse(course)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      Go To Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.courseId || course.id)}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Enroll
                    </button>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedCourse && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "10px", width: "90%", maxWidth: "500px", position: "relative" }}>
            <button
              onClick={() => setSelectedCourse(null)}
              style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>{selectedCourse.title}</h2>
            <p><strong>Code:</strong> {selectedCourse.code}</p>
            <p><strong>Credit:</strong> {selectedCourse.credit}</p>
            <p><strong>Semester:</strong> {selectedCourse.semester}</p>
            <div style={{ marginTop: "15px", background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>
              <strong>Description:</strong>
              <p style={{ marginTop: "5px", lineHeight: "1.5" }}>{selectedCourse.description || "No description available."}</p>
            </div>

            <button
              onClick={() => setSelectedCourse(null)}
              style={{ marginTop: "20px", width: "100%", padding: "10px", background: "#f0f0f0", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
