import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/api";

export default function UploadVideo({ department, onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [department]);

  const fetchCourses = async () => {
    try {
      // Fetch all courses for the department
      // Ideally backend endpoint /courses?department=XYZ
      const response = await API.get("/courses");
      const deptCourses = response.data.filter(c => c.department === department);
      // We might want to filter out 'video' courses if we only want 'base' courses
      // But for now, list all.
      setCourses(deptCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedCourseId) {
      toast.error("Please select a course.");
      return;
    }
    if (!file) {
      toast.error("Please select a video file.");
      return;
    }
    if (!file.type.startsWith("video/")) {
      toast.error("File must be a video.");
      return;
    }

    try {
      // Find the selected course logic to copy metadata
      const selectedCourse = courses.find(c => c.courseId === parseInt(selectedCourseId) || c.id === parseInt(selectedCourseId));

      if (!selectedCourse) {
        toast.error("Invalid course selected");
        return;
      }

      // Create a NEW Course entry as a "Video Resource" for this course
      const videoCoursePayload = {
        // Append distinct suffix to code to avoid Unique Constraint Violation (500 Error)
        code: `${selectedCourse.code}_VID_${Date.now()}`,
        title: `${selectedCourse.title} - Video`,
        description: selectedCourse.description,
        credit: selectedCourse.credit,
        semester: selectedCourse.semester,
        department: selectedCourse.department,
        program: selectedCourse.program
      };

      const formData = new FormData();
      formData.append('course', new Blob([JSON.stringify(videoCoursePayload)], { type: 'application/json' }));
      formData.append('file', file);

      await API.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Video uploaded successfully to course!");

      setFile(null);
      setSelectedCourseId("");

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

    } catch (error) {
      console.error("Operation error:", error);
      toast.error("Failed to upload video.");
    }
  };

  return (
    <div className="video-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <form className="dashboard-form" onSubmit={handleUpload} style={{ maxWidth: "800px", margin: "0 auto", background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>Upload Video for Course</h2>

        <div style={{ display: "grid", gap: "20px" }}>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Select Course *</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}
            >
              <option value="">-- Choose a Course --</option>
              {courses.map(c => (
                <option key={c.courseId || c.id} value={c.courseId || c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Video File (MP4/MKV) *</label>
            <input
              type="file"
              accept="video/*"
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
          Upload Video
        </button>
      </form>
    </div>
  );
}
