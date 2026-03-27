import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function TeacherCourses({ department, role }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null); // For detail view

    useEffect(() => {
        fetchCourses();
    }, [department]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            // Determine endpoint based on role if needed, currently fetching all and filtering by dept
            const response = await API.get("/courses");
            // Filter for this teacher's department
            const deptCourses = response.data.filter(c => c.department === department);
            setCourses(deptCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Render Detail View
    if (selectedCourse) {
        return (
            <div className="course-detail-view p-4">
                <button
                    onClick={() => setSelectedCourse(null)}
                    style={{ marginBottom: "20px", background: "none", border: "none", color: "#007bff", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                    ← Back to Courses
                </button>

                <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <h1 style={{ margin: "0 0 10px 0", color: "#333" }}>{selectedCourse.title}</h1>
                    <div style={{ display: "flex", gap: "15px", color: "#666", marginBottom: "20px", fontSize: "0.95rem" }}>
                        <span><strong>Code:</strong> {selectedCourse.code}</span>
                        <span><strong>Credit:</strong> {selectedCourse.credit}</span>
                        <span><strong>Semester:</strong> {selectedCourse.semester}</span>
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ borderBottom: "2px solid #f0f0f0", paddingBottom: "10px", marginBottom: "15px" }}>Description</h3>
                        <p style={{ lineHeight: "1.6", color: "#444" }}>
                            {selectedCourse.description || "No description provided."}
                        </p>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <h3 style={{ borderBottom: "2px solid #f0f0f0", paddingBottom: "10px", marginBottom: "15px" }}>Material</h3>
                        {selectedCourse.fileUrl ? (
                            <a
                                href={selectedCourse.fileUrl}
                                download
                                style={{ display: "inline-block", background: "#007bff", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}
                            >
                                Download Course Material
                            </a>
                        ) : (
                            <p style={{ color: "#888" }}>No material uploaded for this course.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Render List View
    return (
        <div className="p-4">
            <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>My Courses ({courses.length})</h2>

            {loading ? (
                <p>Loading courses...</p>
            ) : (
                <div className="courses-grid" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {courses.length === 0 ? (
                        <p>No courses found. Upload a new material to create a course.</p>
                    ) : (
                        courses.map((course) => (
                            <div
                                key={course.courseId || course.id}
                                style={{
                                    display: "flex",
                                    background: "white",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    borderLeft: "6px solid #4da6ff" // The blue bar
                                }}
                            >
                                <div style={{ flex: 1, padding: "20px" }}>
                                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#333" }}>{course.title}</h3>
                                    <p style={{ margin: "0 0 15px 0", color: "#888", fontSize: "0.9rem" }}>{course.code}</p>

                                    <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "#555", fontSize: "0.85rem" }}>
                                        <span>📅 Open Enrollment</span>
                                        <span>🕒 {course.credit} Cr. Hr.</span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", paddingRight: "30px" }}>
                                    <button
                                        onClick={() => {
                                            if (course.fileUrl) {
                                                window.open(course.fileUrl, "_blank");
                                            } else {
                                                // Fallback if no file, maybe open details?
                                                setSelectedCourse(course);
                                            }
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            color: "#333"
                                        }}
                                    >
                                        <div style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "1px solid #ccc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            🔗
                                        </div>
                                        Go To Course
                                    </button>
                                </div>
                                {/* Separate Details Button if needed, or just click title? 
                                    I will add a small Details button or ensure title is clickable?
                                    User didn't ask for that, but "Go To Course" taking over the main button means we lose "Details".
                                    I'll add a small "info" icon for details.
                                */}
                                <div style={{ marginRight: "10px" }}>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); }} title="View Details" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>
                                        ℹ️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
