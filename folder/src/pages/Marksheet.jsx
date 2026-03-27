import React, { useState, useEffect } from "react";
import "../index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Marksheet() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Load existing students from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/marks")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load marks");
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (id, field, value) => {
    const updated = students.map((student) =>
      student.id === id ? { ...student, [field]: value } : student
    );
    setStudents(updated);

    setErrors({ ...errors, [id]: {} });
  };

  // Add new student row
  const handleAddStudent = () => {
    const newStudent = {
      id: Date.now(),
      studentId: "",
      name: "",
      mid: "",
      final: "",
      assignment: "",
      project: "",
    };
    setStudents([...students, newStudent]);
  };

  // 🔐 VALIDATION FUNCTION (unchanged)
  const validate = () => {
    let newErrors = {};
    let isValid = true;

    students.forEach((s) => {
      let rowErrors = {};

      if (!s.studentId.trim())
        rowErrors.studentId = "Student ID required";

      if (!s.name.trim())
        rowErrors.name = "Name required";

      if (s.mid !== "" && (s.mid < 0 || s.mid > 25))
        rowErrors.mid = "Mid must be 0–25";

      if (s.final !== "" && (s.final < 0 || s.final > 50))
        rowErrors.final = "Final must be 0–50";

      if (s.assignment !== "" && (s.assignment < 0 || s.assignment > 15))
        rowErrors.assignment = "Assignment must be 0–15";

      if (s.project !== "" && (s.project < 0 || s.project > 10))
        rowErrors.project = "Project must be 0–10";

      if (Object.keys(rowErrors).length > 0) {
        newErrors[s.id] = rowErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Save to backend
  const handleSave = () => {
    if (!validate()) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    fetch("http://localhost:5000/api/marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(students),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Marks saved successfully!");
        setStudents(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to save marks");
      });
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="marksheet-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Marksheet</h2>
      <button onClick={handleAddStudent}>➕ Add Student</button>

      <table className="marksheet-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Mid (25%)</th>
            <th>Final (50%)</th>
            <th>Assignment (15%)</th>
            <th>Project (10%)</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <input
                  type="text"
                  value={student.studentId}
                  onChange={(e) =>
                    handleChange(student.id, "studentId", e.target.value)
                  }
                />
                {errors[student.id]?.studentId && (
                  <div className="error">
                    {errors[student.id].studentId}
                  </div>
                )}
              </td>

              <td>
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) =>
                    handleChange(student.id, "name", e.target.value)
                  }
                />
                {errors[student.id]?.name && (
                  <div className="error">{errors[student.id].name}</div>
                )}
              </td>

              <td>
                <input
                  type="number"
                  value={student.mid}
                  onChange={(e) =>
                    handleChange(student.id, "mid", e.target.value)
                  }
                />
                {errors[student.id]?.mid && (
                  <div className="error">{errors[student.id].mid}</div>
                )}
              </td>

              <td>
                <input
                  type="number"
                  value={student.final}
                  onChange={(e) =>
                    handleChange(student.id, "final", e.target.value)
                  }
                />
                {errors[student.id]?.final && (
                  <div className="error">{errors[student.id].final}</div>
                )}
              </td>

              <td>
                <input
                  type="number"
                  value={student.assignment}
                  onChange={(e) =>
                    handleChange(student.id, "assignment", e.target.value)
                  }
                />
                {errors[student.id]?.assignment && (
                  <div className="error">
                    {errors[student.id].assignment}
                  </div>
                )}
              </td>

              <td>
                <input
                  type="number"
                  value={student.project}
                  onChange={(e) =>
                    handleChange(student.id, "project", e.target.value)
                  }
                />
                {errors[student.id]?.project && (
                  <div className="error">
                    {errors[student.id].project}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="save-btn" onClick={handleSave}>
        💾 Save Marks
      </button>
    </div>
  );
}
