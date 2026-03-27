import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/api";

export default function UploadMaterial({ department, onSuccess }) {
  // Course Form State
  const [courseForm, setCourseForm] = useState({
    code: "",
    title: "",
    description: "",
    credit: "",
    semester: ""
  });

  const [file, setFile] = useState(null);

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    // ... (rest of validation) ...
    if (!courseForm.code || !courseForm.title || !courseForm.credit || !courseForm.semester) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const coursePayload = {
        code: courseForm.code,
        title: courseForm.title,
        description: courseForm.description,
        credit: parseInt(courseForm.credit),
        semester: parseInt(courseForm.semester),
        department: department,
        program: null
      };

      const formData = new FormData();
      formData.append('course', new Blob([JSON.stringify(coursePayload)], { type: 'application/json' }));
      formData.append('file', file);

      await API.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Course created and file uploaded successfully!");

      // Reset
      setFile(null);
      setCourseForm({ code: "", title: "", description: "", credit: "", semester: "" });

      // Redirect/Switch View
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500); // Small delay to let user see success message
      }

    } catch (error) {
      console.error("Operation error:", error);
      toast.error("Failed to create course. Code might already exist.");
    }
  };

  return (
    <div className="materials-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <form className="dashboard-form" onSubmit={handleUpload} style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Add New Course & Upload Material</h2>

        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Department</label>
            <input
              type="text"
              value={department}
              disabled
              style={{ width: "100%", padding: "10px", background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "5px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Course Code *</label>
            <input
              type="text"
              name="code"
              placeholder="e.g. CE401"
              value={courseForm.code}
              onChange={handleCourseChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Course Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Advanced Networks"
              value={courseForm.title}
              onChange={handleCourseChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Credit Hours *</label>
            <input
              type="number"
              name="credit"
              placeholder="e.g. 3"
              value={courseForm.credit}
              onChange={handleCourseChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Semester *</label>
            <input
              type="number"
              name="semester"
              placeholder="e.g. 1"
              value={courseForm.semester}
              onChange={handleCourseChange}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
            />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description</label>
            <textarea
              name="description"
              placeholder="Course description..."
              value={courseForm.description}
              onChange={handleCourseChange}
              rows="4"
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
            />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Course Material (PDF/PPT/Doc) *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={{ width: "100%", padding: "10px", border: "1px dashed #ccc", borderRadius: "5px" }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Create Course & Upload
        </button>
      </form>
    </div>
  );
}